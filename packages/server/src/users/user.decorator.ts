import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RegisterUserModel } from './models/register-user.model';

export const AuthUser = createParamDecorator(
  (data: keyof RegisterUserModel, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>()
      .user as RegisterUserModel;

    return data ? user && user[data] : user;
  },
);
