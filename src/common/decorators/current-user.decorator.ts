import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@users';

export const CurrentUser = createParamDecorator(function (
  data: unknown,
  ctx: ExecutionContext,
): User {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
