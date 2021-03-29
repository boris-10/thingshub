import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new NotFoundException('User does not exists');
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this email does not exists');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async updateById<K extends keyof User, V = User[K]>(
    id: number,
    key: K,
    value: V,
  ): Promise<User> {
    try {
      await this.usersRepository.update({ id }, { [key]: value });
      return this.findById(id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
