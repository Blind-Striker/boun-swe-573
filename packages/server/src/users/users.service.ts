import * as bcrypt from 'bcryptjs';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/users/models/user.model';
import { RegisterUserModel } from './models/register-user.model';
import { User, UserDocument } from './schemas/user.schema';
import passport from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectModel(User.name) private userRepo: Model<UserDocument>,
  ) {}

  public async register(
    user: RegisterUserModel,
  ): Promise<UserModel | undefined> {
    let userEntity = await this.userRepo.findOne({ email: user.email }).exec();

    if (userEntity) {
      throw new ConflictException({ email: userEntity.email });
    }

    user.password = await this.hashPassword(user.password);
    const userDoc = new this.userRepo(user);
    userEntity = await userDoc.save();

    return this.mapper.map(userEntity.toObject(), User, UserModel);
  }

  public async findOneByEmail(email: string): Promise<UserModel | undefined> {
    const userEntity = await this.userRepo.findOne({ email: email }).exec();

    return this.mapper.map(userEntity, User, UserModel);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    if (!/^\$2[abxy]?\$\d+\$/.test(password)) {
      return bcrypt.hash(password, salt);
    }
  }
}
