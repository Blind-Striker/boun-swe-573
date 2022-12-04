import {
  createModule,
  mutation,
  action,
  extractVuexModule,
  createProxy,
} from "vuex-class-component";
import Vue from "vue";
import Vuex from "vuex";
import TokenService from "../services/token.service";
import { TokenModel } from "../models/token.model";
import { authService } from "../services/auth.service";
import { AuthenticationError } from "../errors/authentication.error";
import router from "../router";
import VaultRoutes from "../router/routes";
import { SignUpModel } from "@/models/signup-model";
import AxiosService from "@/services/axios.service";

Vue.use(Vuex);

const VuexModule = createModule({
  namespaced: "auth",
  strict: false,
});

interface AuthError {
  errorCode: number;
  errorMessage: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export class AuthStore extends VuexModule.With({ namespaced: "auth" }) {
  private _email = "";
  private _authenticating = false;
  private _accessToken: string | null = TokenService.getToken();
  private _refreshToken: string | null = TokenService.getRefreshToken();
  private _authenticationErrorCode = 0;
  private _authenticationError = "";

  get signedIn() {
    return this._accessToken ? true : false;
  }

  get authenticationErrorCode() {
    return this._authenticationErrorCode;
  }

  get authenticationError() {
    return this._authenticationError;
  }

  get authenticating() {
    return this._authenticating;
  }

  get accessToken() {
    return this._accessToken;
  }

  @mutation signinRequest() {
    this._authenticating = true;
    this._authenticationError = "";
    this._authenticationErrorCode = 0;
  }

  @mutation signinSuccess(userTokenModel: TokenModel) {
    this._accessToken = userTokenModel.accessToken;
    this._refreshToken = userTokenModel.refreshToken;
    this._authenticating = false;
  }

  @mutation signinError(error: AuthError): void {
    this._authenticating = false;
    this._authenticationErrorCode = error.errorCode;
    this._authenticationError = error.errorMessage;
  }

  @mutation setEmail(email: string) {
    this._email = email;
  }

  @mutation signoutSuccess() {
    this._email = "";
    this._accessToken = "";
    this._accessToken = "";
  }

  @action async signUp({
    firstName,
    lastName,
    userName,
    email,
    password,
  }: SignUpModel) {
    this.signinRequest();
    try {
      const token = await authService.signUp({
        email: email,
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        password: password,
      });
      this.signinSuccess(token);
      this.setEmail(email);
      await router.push(VaultRoutes.ABOUT.path);
      return true;
    } catch (e) {
      if (e instanceof AuthenticationError) {
        this.signinError({
          errorCode: Number.parseInt(e.errorCode),
          errorMessage: e.message,
        });
      }
    }

    return false;
  }

  @action async signin({ email, password }: LoginProps) {
    this.signinRequest();

    try {
      const token = await authService.signIn(email, password);
      this.signinSuccess(token);
      this.setEmail(email);

      // Redirect the user to the page he first tried to visit or to the home view

      await router.push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.history.current.query.redirect || VaultRoutes.ABOUT.path
      );

      return true;
    } catch (e) {
      if (e instanceof AuthenticationError) {
        this.signinError({
          errorCode: Number.parseInt(e.errorCode),
          errorMessage: e.message,
        });
      }

      return false;
    }
  }

  @action async refreshToken() {
    const tokenModel = await authService.refreshToken();
    this.signinSuccess(tokenModel);
  }

  @action async signout() {
    try {
      await authService.signout();
      this.signoutSuccess();
    } catch {
      TokenService.removeToken();
      TokenService.removeRefreshToken();
      AxiosService.removeCommonHeader();
      AxiosService.unmount401Interceptor();

      this.signoutSuccess();
    }

    await router.push(VaultRoutes.SIGNIN.path);
  }
}

const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    ...extractVuexModule(AuthStore),
  },
});

// Creating proxies.
export const vxm = {
  auth: createProxy(store, AuthStore),
};

export default store;
