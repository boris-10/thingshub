import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this email does not exists');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
