import { AutoMap } from '@automapper/classes';

export class UserModel {
  @AutoMap()
  userId: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  userName: string;

  @AutoMap()
  password: string;

  @AutoMap()
  email: string;
}
