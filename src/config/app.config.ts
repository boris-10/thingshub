import { registerAs } from '@nestjs/config';

import { Environment } from '../common/constants';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || Environment.Development,
}));
