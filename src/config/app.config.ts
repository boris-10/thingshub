import { registerAs } from '@nestjs/config';

export default registerAs('APP_CONFIG', () => ({
  environment: process.env.APP_ENV,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
}));
