import { DynamicModule, Module } from '@nestjs/common';

import { EMAIL_OPTIONS } from './constants';
import { EmailService } from './email.service';
import { EmailModuleOptions } from './interfaces/email-module-options.interface';

@Module({})
export class EmailModule {
  static forRoot(emailModuleOptions: EmailModuleOptions): DynamicModule {
    const { imports, useFactory, inject } = emailModuleOptions;

    return {
      module: EmailModule,
      imports: [...imports],
      providers: [
        {
          provide: EMAIL_OPTIONS,
          useFactory: useFactory,
          inject: [...inject],
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
