import { ModuleMetadata } from '@nestjs/common';

import { EmailOptions } from './email-options.interface';

export interface EmailModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<EmailOptions> | EmailOptions;
  inject: any[];
}
