import { registerAs } from '@nestjs/config';

export default registerAs('JWT_CONFIG', () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpirationTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpirationTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
}));
