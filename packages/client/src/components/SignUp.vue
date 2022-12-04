<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Sign Up</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <form ref="form" @submit.prevent="signUp()">
                  <v-text-field
                    v-model="firstName"
                    name="firstName"
                    label="First Name"
                    type="text"
                    placeholder="firstName"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="lastName"
                    name="lastName"
                    label="Last Name"
                    type="text"
                    placeholder="lastName"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="userName"
                    name="userName"
                    label="User Name"
                    type="text"
                    placeholder="userName"
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

                  <v-text-field
                    v-model="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="cocnfirm password"
                    required
                  ></v-text-field>
                  <div class="red--text">{{ errorMessage }}</div>
                  <v-btn
                    type="submit"
                    class="mt-4"
                    color="primary"
                    value="sign up"
                    >Sign Up</v-btn
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
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { vxm } from "../store";

@Component
export default class SignIn extends Vue {
  firstName = "";
  lastName = "";
  userName = "";
  email = "";
  password = "";
  confirmPassword = "";
  errorMessage = "";

  async signUp() {
    await vxm.auth.signUp({
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      email: this.email,
      password: this.password,
    });
  }
}
</script>
