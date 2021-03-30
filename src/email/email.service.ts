import * as fs from 'fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import * as handlebars from 'handlebars';

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

  async sendEmail(options: SendMailOptions, templatePath: string) {
    try {
      const { user: from } = this.emailOptions;
      const html = await this.readHtmlFile(templatePath, {});
      await this.nodemailerTransport.sendMail({ from, html, ...options });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async readHtmlFile<T = any>(filePath: string, context: T): Promise<string> {
    try {
      const htmlContent = await fs.readFile(filePath, { encoding: 'utf-8' });
      const template = handlebars.compile(htmlContent);
      const html = template(context);
      return html;
    } catch (error) {
      throw new Error(error);
    }
  }
}
