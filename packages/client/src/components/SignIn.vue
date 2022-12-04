<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Sign in</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="signin()">
              <v-text-field
                v-model="email"
                name="email"
                label="Email"
                type="text"
                placeholder="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                name="password"
                label="Password"
                type="password"
                placeholder="password"
                required
              ></v-text-field>
              <div class="red--text">{{ errorMessage }}</div>
              <v-btn type="submit" class="mt-4" color="primary" value="sign in"
                >Sign In</v-btn
              >
              <!-- <div
                    class="grey--text mt-4"
                    v-on:click="isRegister = !isRegister"
                  >
                    {{ toggleMessage }}
                  </div> -->
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { vxm } from "../store";

@Component
export default class SignIn extends Vue {
  email = "";
  password = "";
  errorMessage = "";

  async signin() {
    await vxm.auth.signin({ email: this.email, password: this.password });
  }
}
</script>
