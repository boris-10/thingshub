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

import { CurrentUser } from '@common/decorators';
import { User } from '@users';

import { RegisterDto, LoginDto, TokenDto, ResetPasswordDto } from './dto';
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
  login(@CurrentUser() user: User): Promise<TokenDto> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@CurrentUser() user: User): Promise<void> {
    return this.authService.logout(user);
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiBody({
    schema: {
      properties: {
        refreshToken: {
          type: 'string',
        },
      },
    },
  })
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@CurrentUser() user: User): Promise<TokenDto> {
    return this.authService.refreshToken(user);
  }
}
