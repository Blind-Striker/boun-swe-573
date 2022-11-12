import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterUserModel {
  @IsDefined()
  @IsNotEmpty()
  readonly firstName: string;

  @IsDefined()
  @IsNotEmpty()
  readonly lastName: string;

  @IsDefined()
  @IsNotEmpty()
  readonly userName: string;

  @IsDefined()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
