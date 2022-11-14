import { AutoMap } from '@automapper/classes';
import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserModel {
  @AutoMap()
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @AutoMap()
  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @AutoMap()
  @IsDefined()
  @IsNotEmpty()
  userName: string;

  @AutoMap()
  @IsDefined()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
