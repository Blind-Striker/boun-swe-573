<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Save Content</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="saveContent()">
              <v-text-field
                label="Content URL"
                v-model="url"
                required
              ></v-text-field>
              <v-text-field
                label="Title"
                v-model="title"
                required
              ></v-text-field>
              <v-combobox
                v-model="tags"
                label="Tags"
                multiple
                chips
                clearable
                :items="allTags"
              ></v-combobox>
              <v-radio-group v-model="visibility" column>
                <v-radio label="Public" value="public"></v-radio>
                <v-radio label="Private" value="private"></v-radio>
              </v-radio-group>
              <v-btn type="submit" class="mt-4" color="primary" value="sign in"
                >Save</v-btn
              >
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AddContentView extends Vue {
  url = "";
  title = "";
  tags: string[] = [];
  allTags = ["tag1", "tag2", "tag3"];
  searchTags = "";
  visibility = "public";

  saveContent() {
    // Add code here to save the new content to the Vuex store
  }
}
</script>
