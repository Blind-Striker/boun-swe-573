import axios from "axios";

export default class AxiosService {
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
}
