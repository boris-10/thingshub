import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@CurrentUser() user: User): Promise<TokenDto> {
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }
}
