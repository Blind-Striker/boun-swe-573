import { AutoMap } from '@automapper/classes';

export class UserViewModel {
  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  userName: string;

  @AutoMap()
  email: string;
}
