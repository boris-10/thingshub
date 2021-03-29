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

import { RegisterDto, LoginDto, TokenDto } from './dto';
import { LocalAuthGuard, JwtRefreshGuard } from './guards';
import { AuthService } from './auth.service';

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
  @Post('refresh-token')
  async refreshToken(@CurrentUser() user: User): Promise<TokenDto> {
    return this.authService.refreshToken(user);
  }
}
