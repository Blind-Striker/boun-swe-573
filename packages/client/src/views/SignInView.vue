<template>
  <sign-in />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SignIn from "../components/SignIn.vue";

@Component({
  components: {
    SignIn,
  },
})
export default class SignInView extends Vue {}
</script>
