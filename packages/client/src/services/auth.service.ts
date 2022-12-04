import { AuthenticationError } from "@/errors/authentication.error";
import { SignUpModel } from "@/models/signup-model";
import { TokenModel } from "@/models/token.model";
import { UserTokenModel } from "@/models/user-token.model";
import axios from "axios";
import AxiosService from "./axios.service";
import TokenService from "./token.service";

export default class AuthService {
  public async signUp(signUpModel: SignUpModel): Promise<UserTokenModel> {
    try {
      const tokenModel = await axios.post<TokenModel>(
        "auth/signup",
        signUpModel
      );

      TokenService.saveToken(tokenModel.data.accessToken);
      TokenService.saveRefreshToken(tokenModel.data.refreshToken);
      AxiosService.setAuthHeader(TokenService.getToken());
      AxiosService.mountUnauthorizedInterceptor();

      return new UserTokenModel(
        signUpModel.email,
        tokenModel.data.accessToken,
        tokenModel.data.refreshToken
      );
    } catch (error: any) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.detail
      );
    }
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<UserTokenModel> {
    try {
      const tokenModel = await axios.post<TokenModel>("auth/signin", {
        email: email,
        password: password,
      });

      TokenService.saveToken(tokenModel.data.accessToken);
      TokenService.saveRefreshToken(tokenModel.data.refreshToken);
      AxiosService.setAuthHeader(TokenService.getToken());
      AxiosService.mountUnauthorizedInterceptor();

      return new UserTokenModel(
        email,
        tokenModel.data.accessToken,
        tokenModel.data.refreshToken
      );
    } catch (error: any) {
      throw new AuthenticationError(
        error.response.status,
        error.response.data.detail
      );
    }
  }

  public async refreshToken(): Promise<TokenModel> {
    const tokenModel = await axios.get<TokenModel>("auth/refresh", {
      headers: { Authorization: `Bearer ${TokenService.getRefreshToken()}` },
    });

    TokenService.saveToken(tokenModel.data.accessToken);
    TokenService.saveRefreshToken(tokenModel.data.refreshToken);
    AxiosService.setAuthHeader(TokenService.getToken());

    return new TokenModel(
      tokenModel.data.accessToken,
      tokenModel.data.refreshToken
    );
  }

  public async signout(): Promise<void> {
    await axios.get("auth/signout");

    TokenService.removeToken();
    TokenService.removeRefreshToken();
    AxiosService.removeCommonHeader();
    AxiosService.unmount401Interceptor();
  }
}

// todo: export a singleton instance in the global namespace
export const authService: AuthService = new AuthService();
