import { registerAs } from '@nestjs/config';

export default registerAs('JWT_CONFIG', () => ({
  secret: process.env.JWT_SECRET,
  expirationTime: process.env.JTW_EXPIRATION_TIME,
}));
