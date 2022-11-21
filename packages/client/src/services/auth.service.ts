import { SignUpModel } from "@/models/signup-model";
import { TokenModel } from "@/models/token.model";
import { UserTokenModel } from "@/models/user-token.model";
import axios from "axios";
import AxiosService from "./axios.service";
import TokenService from "./token.service";

export default class AuthService {
  public async signUp(signUpModel: SignUpModel): Promise<UserTokenModel> {
    const tokenModel = await axios.post<TokenModel>("auth/signup", signUpModel);

    TokenService.saveToken(tokenModel.data.accessToken);
    TokenService.saveRefreshToken(tokenModel.data.refreshToken);
    AxiosService.setAuthHeader(TokenService.getToken());

    return new UserTokenModel(
      signUpModel.email,
      tokenModel.data.accessToken,
      tokenModel.data.refreshToken
    );
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<UserTokenModel> {
    const tokenModel = await axios.post<TokenModel>("auth/signin", {
      email: email,
      password: password,
    });

    TokenService.saveToken(tokenModel.data.accessToken);
    TokenService.saveRefreshToken(tokenModel.data.refreshToken);
    AxiosService.setAuthHeader(TokenService.getToken());

    return new UserTokenModel(
      email,
      tokenModel.data.accessToken,
      tokenModel.data.refreshToken
    );
  }
}

// todo: export a singleton instance in the global namespace
export const authService: AuthService = new AuthService();
