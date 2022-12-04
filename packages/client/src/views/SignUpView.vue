<template>
  <sign-up />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SignUp from "../components/SignUp.vue";

@Component({
  components: {
    SignUp,
  },
})
export default class SignUpView extends Vue {}
</script>
