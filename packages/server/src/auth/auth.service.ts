import * as bcrypt from 'bcryptjs';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninUserModel } from '../users/models/signin-user.model';
import { UserModel } from '../users/models/user.model';
import { UserViewModel } from '../users/models/user.viewmodel';
import { UserService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserModel } from '../users/models/create-user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async signUp(createUserModel: CreateUserModel): Promise<any> {
    const user = await this.userService.findOneByEmail(createUserModel.email);

    if (user) {
      throw new ConflictException({ email: user.email }, 'User already exists');
    }

    const hash = await this.hashData(createUserModel.password);
    const newUser = await this.userService.create({
      ...createUserModel,
      password: hash,
    });
    const tokens = await this.signTokens(newUser.email); // depend on ConfigService
    await this.updateRefreshToken(newUser.userId, tokens.refreshToken);
    return tokens;
  }

  async signIn(signinUserModel: SigninUserModel) {
    const user = await this.userService.findOneByEmail(signinUserModel.email);
    if (!user) {
      throw new UnauthorizedException(
        'Your authentication information is incorrect. Please try again',
      );
    }

    const passwordMatches = await bcrypt.compare(
      signinUserModel.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Your authentication information is incorrect. Please try again',
      );
    }

    const tokens = await this.signTokens(user.email);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }

  async signout(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${email}`,
      );
    }

    this.userService.update(user.userId, { refreshToken: null });
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

  async refreshTokens(email: string, refreshToken: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.signTokens(user.email);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2[abxy]?\$\d+\$/.test(data)) {
      return bcrypt.hash(data, salt);
    }
  }

  private async signTokens(userEmail: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userEmail,
        },
        {
          secret: this.configService.get<string>('APP_SECRET'),
          expiresIn: '1m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userEmail,
        },
        {
          secret: this.configService.get<string>('APP_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, { refreshToken: hashedRefreshToken });
  }
}
