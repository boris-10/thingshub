import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  driver: process.env.DATABASE_DRIVER,
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.PORT || 5432,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}));
