import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterUserModel {
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @IsDefined()
  @IsNotEmpty()
  userName: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
