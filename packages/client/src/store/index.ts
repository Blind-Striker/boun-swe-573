import { extractVuexModule, createProxy } from "vuex-class-component";
import Vue from "vue";
import Vuex from "vuex";
import MessageBoxStore from "./message-box.store";
import AuthStore from "./auth.store";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    ...extractVuexModule(AuthStore),
    ...extractVuexModule(MessageBoxStore),
  },
});

// Creating proxies.
export const vxm = {
  auth: createProxy(store, AuthStore),
  messageBox: createProxy(store, MessageBoxStore),
};

export default store;
