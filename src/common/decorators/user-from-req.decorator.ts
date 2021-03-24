import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

export const UserFromReq = createParamDecorator(function (
  data: unknown,
  ctx: ExecutionContext,
): User {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
