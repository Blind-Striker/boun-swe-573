import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserModel } from './models/create-user.model';
import { UserModel } from './models/user.model';
import { UserViewModel } from './models/user.viewmodel';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
}
