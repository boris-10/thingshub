import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return loginDto;
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return registerDto;
  }
}
