import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginUserModel } from 'src/users/models/login-user.model';
import { AuthUser } from 'src/users/user.decorator';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @AuthUser() user: LoginUserModel,
  ): Promise<{ access_token: string }> {
    return this.authService.signToken(user);
  }
}
