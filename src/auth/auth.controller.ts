import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '@common/decorators';
import { User } from '@users';

import {
  AuthorizationDto,
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto';
import { LocalAuthGuard, JwtRefreshGuard, JwtAuthGuard } from './guards';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  login(@CurrentUser() user: User): Promise<AuthorizationDto> {
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  logout(@CurrentUser() user: User): Promise<void> {
    return this.authService.logout(user);
  }

  @HttpCode(200)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiBody({ type: RefreshTokenDto })
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh-token')
  refreshToken(@CurrentUser() user: User): Promise<AuthorizationDto> {
    return this.authService.refreshToken(user);
  }
}
