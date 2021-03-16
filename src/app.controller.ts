import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiExcludeEndpoint()
  @Redirect('/api/v1/docs')
  @Get()
  redirect() {
    return;
  }
}
