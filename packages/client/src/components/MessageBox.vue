<template>
  <div>
    <v-alert
      v-for="(message, index) in messages"
      :key="index"
      :type="message.type"
      :timeout="message.timeout"
      :dismissible="message.dismissible"
      @input="removeMessage(message.id)"
    >
      {{ message.text }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  name: "MessageBox",
  computed: {
    ...mapGetters("message_box", ["messages"]),
  },
  methods: {
    ...mapActions("message_box", ["removeMessage"]),
  },
});
</script>
