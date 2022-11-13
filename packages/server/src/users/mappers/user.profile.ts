import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { RegisterUserModel } from '../models/register-user.model';
import { UserModel } from '../models/user.model';
import { UserViewModel } from '../models/user.viewmodel';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, RegisterUserModel, User);
      createMap(
        mapper,
        User,
        UserModel,
        forMember(
          (d) => d.userId,
          mapFrom((s) => s._id),
        ),
      );
      createMap(mapper, UserModel, UserViewModel);
    };
  }
}
