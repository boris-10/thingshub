import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expirationTime: process.env.JTW_EXPIRATION_TIME,
}));
