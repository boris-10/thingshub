import { DynamicModule, Global, Module } from '@nestjs/common';

import { EMAIL_OPTIONS } from './constants';
import { EmailService } from './email.service';
import { EmailModuleOptions } from './interfaces/email-module-options.interface';

@Global()
@Module({})
export class EmailModule {
  static register(options: EmailModuleOptions): DynamicModule {
    const imports = [...options.imports];

    const providers = [
      {
        provide: EMAIL_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
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
