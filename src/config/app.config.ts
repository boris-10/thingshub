import { registerAs } from '@nestjs/config';

import { APP_CONFIG } from '@common/constants';

export const appConfiguration = registerAs(APP_CONFIG, () => ({
  environment: process.env.APP_ENV,
  host: process.env.APP_HOST,
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
}));
