import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne() {
    return 'Get user info';
  }
}
