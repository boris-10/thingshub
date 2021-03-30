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

import { jwtConfiguration } from '@config';
import { PostgresErrorCode } from '@common/constants';
import { User, UsersService } from '@users';
import { EmailService } from '@email';

import { RegisterDto, ResetPasswordDto, AuthorizationDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
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

  /* TODO: simplify */
  async resetPassword({ email }: ResetPasswordDto): Promise<void> {
    await this.usersService.findByEmail(email);
    await this.emailService.sendEmail(
      {
        to: email,
        subject: 'Reset password',
      },
      path.join(__dirname, 'templates/password-reset.hbs'),
    );
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
}
