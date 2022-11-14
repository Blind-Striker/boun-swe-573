import { AutoMap } from '@automapper/classes';
import { IsEmail } from 'class-validator';

export class UpdateUserModel {
  @AutoMap()
  firstName?: string;

  @AutoMap()
  lastName?: string;

  @AutoMap()
  userName?: string;

  @AutoMap()
  @IsEmail()
  email?: string;

  @AutoMap()
  password?: string;

  @AutoMap()
  refreshToken: string;
}
