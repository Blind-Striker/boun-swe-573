import * as bcrypt from 'bcryptjs';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserModel } from 'src/users/models/login-user.model';
import { UserModel } from 'src/users/models/user.model';
import { UserViewModel } from 'src/users/models/user.viewmodel';
import { UserService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async login(email: string, pass: string): Promise<UserViewModel> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const userVm = this.mapper.map(user, UserModel, UserViewModel);
      return userVm;
    }

    throw new UnauthorizedException(
      `There isn't any user with email: ${email}`,
    );
  }

  async verifyPayload(payload: JwtPayload): Promise<UserViewModel> {
    const user = await this.userService.findOneByEmail(payload.sub);

    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
    }

    const userVm = this.mapper.map(user, UserModel, UserViewModel);

    return userVm;
  }

  async signToken(user: LoginUserModel) {
    const payload = {
      sub: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
