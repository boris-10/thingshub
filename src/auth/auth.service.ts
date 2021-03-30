import * as path from 'path';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

import { appConfiguration, jwtConfiguration } from '@config';
import { PostgresErrorCode } from '@common/constants';
import { TemplateAdapter } from '@common/adapters';
import { EmailService } from '@email';
import { User, UsersService } from '@users';

import { RegisterDto, ResetPasswordDto, AuthorizationDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @Inject(appConfiguration.KEY)
    private readonly appConfig: ConfigType<typeof appConfiguration>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}

  async register({ email, password }: RegisterDto): Promise<User> {
    const hashedPassword = await hash(password, 10);
    try {
      const user = await this.usersService.create({
        email,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with that email already exists');
      }
      throw new BadRequestException();
    }
  }

  login({ id, email }: User): Promise<AuthorizationDto> {
    return this.authorize(id, email);
  }

  async logout({ id }: User): Promise<void> {
    await this.usersService.updateById(id, 'refreshToken', null);
  }

  async resetPassword({ email }: ResetPasswordDto): Promise<void> {
    const { id } = await this.usersService.findByEmail(email);
    const resetToken = await this.saveResetToken(id);
    const resetPasswordUrl = this.buildResetPasswordLink(resetToken);
    const templatePath = path.join(__dirname, 'templates/password-reset.hbs');
    const html = await TemplateAdapter.readHtml(templatePath, {
      resetPasswordUrl,
    });
    await this.emailService.send({
      to: email,
      subject: 'Reset password',
      html,
    });
  }

  refreshToken({ id, email }: User): Promise<AuthorizationDto> {
    return this.authorize(id, email);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Wrong credentials provided');
    }
    return user;
  }

  async validateRefreshToken(refreshToken: string, id: number): Promise<User> {
    const user = await this.usersService.findById(id);
    if (refreshToken !== user.refreshToken) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private async authorize(id: number, email: string) {
    const accessToken = await this.createToken(id, email);
    const refreshToken = await this.createToken(id, email, {
      secret: this.jwtConfig.refreshTokenSecret,
      expiresIn: this.jwtConfig.refreshTokenExpirationTime,
    });
    await this.usersService.updateById(id, 'refreshToken', refreshToken);

    return AuthorizationDto.from({ accessToken, refreshToken });
  }

  private async createToken(
    id: number,
    email: string,
    options?: JwtSignOptions,
  ) {
    return this.jwtService.signAsync({ sub: id, email }, options);
  }

  private async saveResetToken(id: number): Promise<string> {
    const resetToken = await this.jwtService.signAsync(
      {},
      {
        expiresIn: '1h',
      },
    );
    await this.usersService.updateById(id, 'resetToken', resetToken);

    return resetToken;
  }

  private buildResetPasswordLink(resetToken: string): string {
    return `http://${this.appConfig.host}:${this.appConfig.port}/api/v1/reset-password/${resetToken}`;
  }
}
