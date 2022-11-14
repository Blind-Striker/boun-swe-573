import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from 'src/users/models/user.model';
import { CreateUserModel } from './models/create-user.model';
import { User, UserDocument } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { UpdateUserModel } from './models/update-user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    @InjectModel(User.name) private userRepo: Model<UserDocument>,
  ) {}

  public async create(createUserModel: CreateUserModel): Promise<UserModel> {
    const userEntity = this.mapper.map(createUserModel, CreateUserModel, User);
    userEntity.refreshToken = null;

    const userDoc = new this.userRepo(userEntity);
    const savedUserEntity = await userDoc.save();

    return this.mapper.map(savedUserEntity.toObject(), User, UserModel);
  }

  async update(
    id: string,
    updateUserModel: UpdateUserModel,
  ): Promise<UserModel> {
    const userEntity = await this.userRepo
      .findByIdAndUpdate(id, updateUserModel, { new: true })
      .exec();

    return this.mapper.map(userEntity?.toObject(), User, UserModel);
  }

  public async findOneByEmail(email: string): Promise<UserModel> {
    const userEntity = await this.userRepo.findOne({ email: email }).exec();

    return this.mapper.map(userEntity, User, UserModel);
  }
}
