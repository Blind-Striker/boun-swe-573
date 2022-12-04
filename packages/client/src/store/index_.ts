// import Vue from "vue";
// import Vuex from "vuex";

// import TokenService from "../services/token.service";
// import { authService } from "../services/auth.service";
// import router from "../router";
// import { TokenModel } from "../models/user-token.model";

// Vue.use(Vuex);

// export default new Vuex.Store({
//   state: {},
//   getters: {},
//   mutations: {},
//   actions: {},
//   modules: {
//     auth: {
//       namespaced: true,
//       state: {
//         authenticating: false,
//         accessToken: TokenService.getToken(),
//         refreshToken: TokenService.getRefreshToken(),
//         authenticationErrorCode: 0,
//         authenticationError: "",
//         refreshTokenPromise: null, // Holds the promise of the refresh token call
//       },
//       getters: {
//         loggedIn: (state) => {
//           return state.accessToken ? true : false;
//         },

//         authenticationErrorCode: (state) => {
//           return state.authenticationErrorCode;
//         },

//         authenticationError: (state) => {
//           return state.authenticationError;
//         },

//         authenticating: (state) => {
//           return state.authenticating;
//         },
//       },
//       mutations: {
//         signinRequest(state) {
//           state.authenticating = true;
//           state.authenticationError = "";
//           state.authenticationErrorCode = 0;
//         },
//         signinSuccess(state, userTokenModel: TokenModel) {
//           state.accessToken = userTokenModel.accessToken;
//           state.refreshToken = userTokenModel.refreshToken;
//           state.authenticating = false;
//         },
//         signinError(state, { errorCode, errorMessage }) {
//           state.authenticating = false;
//           state.authenticationErrorCode = errorCode;
//           state.authenticationError = errorMessage;
//         },
//         signoutSuccess(state) {
//           state.accessToken = "";
//         },
//         refreshTokenPromise(state, promise) {
//           state.refreshTokenPromise = promise;
//         },
//       },
//       actions: {
//         async signin({ commit }, { email, password }) {
//           commit("signinRequest");

//           try {
//             const token = await authService.signIn(email, password);
//             commit("signinSuccess", token);

//             // Redirect the user to the page he first tried to visit or to the home view
//             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//             // @ts-ignore
//             router.push(router.history.current.query.redirect || "/");

//             return true;
//           } catch (e) {
//             if (e instanceof AuthenticationError) {
//               commit("signinError", {
//                 errorCode: e.errorCode,
//                 errorMessage: e.message,
//               });
//             }

//             return false;
//           }
//         },

//         refreshToken({ commit, state }) {
//           // If this is the first time the refreshToken has been called, make a request
//           // otherwise return the same promise to the caller
//           if (!state.refreshTokenPromise) {
//             const tokenModelPromise = authService.refreshToken();
//             commit("refreshTokenPromise", tokenModelPromise);

//             // Wait for the UserService.refreshToken() to resolve. On success set the token and clear promise
//             // Clear the promise on error as well.
//             tokenModelPromise.then(
//               (response) => {
//                 commit("refreshTokenPromise", null);
//                 commit("signinSuccess", response);
//               },
//               () => {
//                 commit("refreshTokenPromise", null);
//               }
//             );
//           }

//           return state.refreshTokenPromise;
//         },

//         signout({ commit }) {
//           authService.signout();
//           commit("signoutSuccess");
//           router.push("/signin");
//         },
//       },
//     },
//   },
// });
