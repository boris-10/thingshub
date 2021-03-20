import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { Repository } from 'typeorm';

import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {
    console.log(jwt.secret);
  }

  async register({ email, password }: RegisterDto) {
    return { email, password };
  }
}
