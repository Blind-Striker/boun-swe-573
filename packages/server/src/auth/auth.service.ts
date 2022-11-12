import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && user.password === pass) {
      //delete user.passport;
      return user;
    }
    return null;
  }

  async verifyPayload(payload: JwtPayload): Promise<any> {
    let user: { password: any };

    try {
      user = await this.userService.findOneByEmail(payload.sub);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.sub}`,
      );
    }
    delete user.password;

    return user;
  }

  async signToken(user: any) {
    const payload = {
      sub: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
