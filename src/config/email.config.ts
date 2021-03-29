import { registerAs } from '@nestjs/config';

import { EMAIL_CONFIG } from '@common/constants';

export const emailConfiguration = registerAs(EMAIL_CONFIG, () => ({
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
}));
