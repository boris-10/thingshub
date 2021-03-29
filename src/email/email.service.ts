import { Inject, Injectable } from '@nestjs/common';

import { EMAIL_OPTIONS } from './constants';
import { EmailOptions } from './interfaces/email-options.interface';

@Injectable()
export class EmailService {
  constructor(@Inject(EMAIL_OPTIONS) private readonly options: EmailOptions) {
    console.log(options);
  }
}
