<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="signin" v-if="!signedIn" color="primary"> Sign in </v-btn>
      <v-btn @click="signup" v-if="!signedIn" color="primary"> Sign up </v-btn>
      <v-btn @click="signout" v-if="signedIn" color="primary"> Sign out </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import TokenService from "./services/token.service";
import AxiosService from "./services/axios.service";
import { vxm } from "./store";
import { mapGetters } from "vuex";
import router from "./router";
import VaultRoutes from "./router/routes";

export default Vue.extend({
  name: "App",

  created: () => {
    AxiosService.init(process.env.VUE_APP_VAULT_API_BASE_URL);
    AxiosService.setAuthHeader(TokenService.getToken());
    AxiosService.mountUnauthorizedInterceptor();
  },

  methods: {
    signout: async () => {
      await vxm.auth.signout();
    },
    signin: async () => {
      await router.push(VaultRoutes.SIGNIN.path);
    },
    signup: async () => {
      await router.push(VaultRoutes.SIGNUP.path);
    },
  },

  computed: {
    ...mapGetters("auth", ["signedIn"]),
  },
});
</script>
