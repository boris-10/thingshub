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
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
    private readonly emailService: EmailService,
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

  async login(user: User): Promise<AuthorizationDto> {
    const { id, email } = user;
    const accessToken = await this.createToken(id, email);
    const refreshToken = await this.createToken(id, email, {
      secret: this.jwtConfig.refreshTokenSecret,
      expiresIn: this.jwtConfig.refreshTokenExpirationTime,
    });
    await this.usersService.updateById(id, 'refreshToken', refreshToken);

    return AuthorizationDto.from({ accessToken, refreshToken });
  }

  async logout(user: User): Promise<void> {
    const { id } = user;
    await this.usersService.updateById(id, 'refreshToken', null);
  }

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

  async refreshToken(user: User): Promise<AuthorizationDto> {
    const { id, email } = user;
    const accessToken = await this.createToken(id, email);
    const refreshToken = await this.createToken(id, email, {
      secret: this.jwtConfig.refreshTokenSecret,
      expiresIn: this.jwtConfig.refreshTokenExpirationTime,
    });
    await this.usersService.updateById(id, 'refreshToken', refreshToken);

    return AuthorizationDto.from({ accessToken, refreshToken });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordMatching = await compare(password, user.password);
    if (!isPasswordMatching) {
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

  private async createToken(
    id: number,
    email: string,
    options?: JwtSignOptions,
  ) {
    return this.jwtService.signAsync({ sub: id, email }, options);
  }
}
