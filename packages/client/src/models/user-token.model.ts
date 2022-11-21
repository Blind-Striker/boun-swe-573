export class UserTokenModel {
  constructor(
    public email: string,
    public accessToken: string,
    public refreshToken: string
  ) {}
}
