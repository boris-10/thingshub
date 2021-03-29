import { registerAs } from '@nestjs/config';

import { DATABASE_CONFIG } from '@common/constants';

export const databaseConfiguration = registerAs(DATABASE_CONFIG, () => ({
  driver: process.env.DATABASE_DRIVER,
  host: process.env.DATABASE_HOST,
  port: process.env.PORT,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}));
