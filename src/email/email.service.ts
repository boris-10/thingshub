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

  async send(options: SendMailOptions) {
    try {
      const { user: from } = this.emailOptions;
      await this.nodemailerTransport.sendMail({ from, ...options });
    } catch (error) {
      throw new Error(error);
    }
  }
}
