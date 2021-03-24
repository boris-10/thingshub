import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOne(@CurrentUser() user: User) {
    const { id } = user;
    return this.usersService.findById(id);
  }
}
