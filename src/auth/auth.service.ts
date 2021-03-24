import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { PostgresErrorCode } from '../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

  async login({ email }: User): Promise<LoginResponse> {
    const accessToken = await this.createAccessToken(email);
    const refreshToken = await this.createRefreshToken(email);
    const user = await this.usersService.updateByEmail(
      email,
      'refreshToken',
      refreshToken,
    );

    return { user, accessToken, refreshToken };
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

  private async createAccessToken(email: string): Promise<string> {
    return this.jwtService.signAsync({ email });
  }

  private async createRefreshToken(email: string): Promise<string> {
    return this.jwtService.signAsync(
      { email },
      {
        expiresIn: '7d',
      },
    );
  }
}
