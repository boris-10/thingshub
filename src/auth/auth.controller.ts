import { Body, Controller, Post } from '@nestjs/common';

import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return loginDto;
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return registerDto;
  }
}
