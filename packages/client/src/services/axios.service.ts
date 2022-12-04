import store from "../store/index";
import axios from "axios";

export default class AxiosService {
  private static UnauthorizedInterceptor: number;

  static init(baseURL: string) {
    axios.defaults.baseURL = baseURL;
  }

  static setAuthHeader(jwtToken: string | null) {
    if (jwtToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
    }
  }

  static removeCommonHeader() {
    axios.defaults.headers.common = {};
  }

  static mountUnauthorizedInterceptor() {
    this.UnauthorizedInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          if (error.config.url.includes("auth/refresh")) {
            // Refresh token has failed. Signing out the user
            await store.dispatch("auth/signout");
            throw error;
          } else if (error.config.url.includes("auth/signin")) {
            // Signin has failed.
            throw error;
          } else {
            // Refresh the access token
            try {
              await store.dispatch("auth/refreshToken");
              // Retry the original request
              const token = `Bearer ${store.getters["auth/accessToken"]}`;
              return await axios.request({
                method: error.config.method,
                url: error.config.url,
                data: error.config.data,
              });
            } catch (e) {
              // Refresh has failed - reject the original request
              throw error;
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  static unmount401Interceptor() {
    // Eject the interceptor
    axios.interceptors.response.eject(this.UnauthorizedInterceptor);
  }
}
