import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserModel } from '../users/models/create-user.model';
import { SigninUserModel } from '../users/models/signin-user.model';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserModel: CreateUserModel) {
    return this.authService.signUp(createUserModel);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinUserModel: SigninUserModel) {
    return this.authService.signIn(signinUserModel);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('signout')
  signout(@Req() req: Request) {
    this.authService.signout(req.user['sub']);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const email = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(email, refreshToken);
  }
}
