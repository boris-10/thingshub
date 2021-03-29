import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';

import { EMAIL_OPTIONS } from './constants';
import { EmailOptions } from './interfaces/email-options.interface';

@Injectable()
export class EmailService {
  private nodemailerTransport: Transporter;

  constructor(
    @Inject(EMAIL_OPTIONS) private readonly emailOptions: EmailOptions,
  ) {
    const { service, user, password: pass } = emailOptions;

    this.nodemailerTransport = createTransport({
      service,
      auth: { user, pass },
    });
  }

  sendEmail(options: SendMailOptions) {
    const { user: from } = this.emailOptions;
    return this.nodemailerTransport.sendMail({ from, ...options });
  }
}
