<template>
  <sign-in />
</template>

<!-- <template>
  <div class="about">
    <h1>This is an login page</h1>
  </div>
</template> -->

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SignIn from "../components/SignIn.vue";

@Component({
  components: {
    SignIn,
  },
})
export default class LoginView extends Vue {}
</script>
