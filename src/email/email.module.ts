import { DynamicModule, Global, Module } from '@nestjs/common';

import { EMAIL_OPTIONS } from './constants';
import { EmailService } from './email.service';
import { EmailModuleOptions } from './interfaces/email-module-options.interface';

@Global()
@Module({})
export class EmailModule {
  static register(emailModuleOptions: EmailModuleOptions): DynamicModule {
    const imports = [...emailModuleOptions.imports];

    const providers = [
      {
        provide: EMAIL_OPTIONS,
        useFactory: emailModuleOptions.useFactory,
        inject: emailModuleOptions.inject,
      },
      EmailService,
    ];

    return {
      module: EmailModule,
      imports: [...imports],
      providers: [...providers],
      exports: [EmailService],
    };
  }
}
