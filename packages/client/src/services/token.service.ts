export default class TokenService {
  private static TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";

  public static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public static saveToken(accessToken: string) {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
  }

  public static removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  public static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public static saveRefreshToken(refreshToken: string) {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public static removeRefreshToken() {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
