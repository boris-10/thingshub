import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';

import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import jwtConfiguration from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {}

  async register({ email, password }: RegisterDto) {
    return { email, password };
  }
}
