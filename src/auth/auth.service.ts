import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

import { jwtConfiguration } from '@config';
import { PostgresErrorCode } from '@common/constants';
import { User, UsersService } from '@users';

import { RegisterDto, TokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}

  /* TODO: send email to confirm registration process */
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

  async login(user: User): Promise<TokenDto> {
    const { id, email } = user;
    const accessToken = await this.createAccessToken(id, email);
    const refreshToken = await this.createRefreshToken(id, email);
    await this.usersService.updateById(id, 'refreshToken', refreshToken);

    return TokenDto.from({ accessToken, refreshToken });
  }

  async refreshToken(user: User): Promise<TokenDto> {
    const { id, email } = user;
    const accessToken = await this.createAccessToken(id, email);
    const refreshToken = await this.createRefreshToken(id, email);
    await this.usersService.updateById(id, 'refreshToken', refreshToken);

    return TokenDto.from({ accessToken, refreshToken });
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordMatching = await compare(password, user.password);
      if (!isPasswordMatching) {
        throw new BadRequestException('Wrong credentials provided');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  async validateRefreshToken(refreshToken: string, id: number): Promise<User> {
    const user = await this.usersService.findById(id);
    if (refreshToken === user.refreshToken) {
      return user;
    }
    throw new UnauthorizedException();
  }

  private async createAccessToken(id: number, email: string): Promise<string> {
    return this.jwtService.signAsync({ sub: id, email });
  }

  private async createRefreshToken(id: number, email: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: id, email },
      {
        secret: this.jwtConfig.refreshTokenSecret,
        expiresIn: this.jwtConfig.refreshTokenExpirationTime,
      },
    );
  }
}
