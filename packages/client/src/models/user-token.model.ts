export class TokenModel {
  constructor(public accessToken: string, public refreshToken: string) {}
}

export class UserTokenModel extends TokenModel {
  constructor(
    public email: string,
    public accessToken: string,
    public refreshToken: string
  ) {
    super(accessToken, refreshToken);
  }
}
