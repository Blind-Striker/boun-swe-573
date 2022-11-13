import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserModel } from './models/register-user.model';
import { UserModel } from './models/user.model';
import { UserViewModel } from './models/user.viewmodel';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerUserModel: RegisterUserModel,
  ): Promise<UserViewModel> {
    const user = await this.userService.register(registerUserModel);
    const userVm = this.mapper.map(user, UserModel, UserViewModel);

    return userVm;
  }
}
