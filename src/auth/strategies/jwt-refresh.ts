import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { TokenPayload } from '../interfaces/token-payload.interface';
import { AuthService } from '../auth.service';
import jwtConfiguration from '../../config/jwt.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private authService: AuthService,
    @Inject(jwtConfiguration.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfiguration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshTokenSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, { sub: id }: TokenPayload): Promise<any> {
    const refreshToken = req.body.refresh_token;
    return this.authService.validateRefreshToken(refreshToken, id);
  }
}
