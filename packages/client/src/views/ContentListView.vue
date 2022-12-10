<template>
  <v-container v-if="loading">
    <v-progress-linear indeterminate></v-progress-linear>
  </v-container>
  <v-container v-else>
    <v-layout>
      <v-flex xs12>
        <v-text-field
          v-model="search"
          label="Search"
          @input="updateFilteredContents"
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-select
          v-model="filter"
          label="Filter"
          :items="allFilters"
          @input="updateFilteredContents"
        ></v-select>
      </v-flex>
      <v-flex xs12>
        <v-select
          v-model="sort"
          label="Sort"
          :items="allSorts"
          @input="updateFilteredContents"
        ></v-select>
      </v-flex>
    </v-layout>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          md4
          lg2
          pa-lg-2
          pa-md-2
          pa-sm-2
          ma-xs-2
          v-for="content in paginatedContents"
          :key="content.id"
        >
          <v-card class="mx-auto" max-width="344" outlined>
            <v-img :src="content.thumbnailUrl" height="200px"></v-img>

            <v-card-title>{{ content.title }}</v-card-title>
            <v-card-text>{{ content.body }}</v-card-text>
            <v-card-actions>
              <v-btn @click="deleteContent(content.id)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <!-- <v-card v-for="content in paginatedContents" :key="content.id">
          <v-card-media>
            <v-img
              :src="content.thumbnailUrl"
              max-width="200px"
              max-height="300px"
            ></v-img>
          </v-card-media>
          <v-card-title>{{ content.title }}</v-card-title>
          <v-card-text>{{ content.body }}</v-card-text>
          <v-card-actions>
            <v-btn @click="deleteContent(content.id)">Delete</v-btn>
          </v-card-actions>
        </v-card> -->
      </v-layout>
    </v-container>
    <!-- <v-infinite-scroll @input="nextPage">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </v-infinite-scroll> -->
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ContentListView extends Vue {
  loading = true;
  search = "";
  filter = "";
  allFilters = ["filter1", "filter2", "filter3"];
  sort = "";
  allSorts = ["sort1", "sort2", "sort3"];
  contents: any[] = [];
  filteredContents: any[] = [];
  page = 1;
  perPage = 10;

  async mounted() {
    this.contents = await this.getContents();
    this.updateFilteredContents();
    this.loading = false;
  }

  async getContents() {
    // Get the contents from the back-end

    return [
      {
        id: "1",
        title: "Title 1",
        body: "Body 1",
        thumbnailUrl: "https://picsum.photos/344/200?random=1",
      },
      {
        id: "2",
        title: "Title 2",
        body: "Body 2",
        thumbnailUrl: "https://picsum.photos/344/200?random=2",
      },
      {
        id: "3",
        title: "Title 3",
        body: "Body 3",
        thumbnailUrl: "https://picsum.photos/344/200?random=3",
      },
      {
        id: "4",
        title: "Title 4",
        body: "Body 4",
        thumbnailUrl: "https://picsum.photos/344/200?random=4",
      },
      {
        id: "5",
        title: "Title 5",
        body: "Body 5",
        thumbnailUrl: "https://picsum.photos/300/200?random=5",
      },
      {
        id: "6",
        title: "Title 6",
        body: "Body 6",
        thumbnailUrl: "https://picsum.photos/300/200?random=6",
      },
      {
        id: "7",
        title: "Title 7",
        body: "Body 7",
        thumbnailUrl: "https://picsum.photos/300/200?random=7",
      },
    ];
  }

  async nextPage() {
    // Load the next page of contents from the back-end and append them to the list of contents
    this.updateFilteredContents();
  }

  updateFilteredContents() {
    // Filter and sort the contents based on the search, filter, and sort criteria
    this.page = 1;

    this.filteredContents = this.contents;
  }

  updatePage(page: number) {
    this.page = page;
  }

  deleteContent(id: string) {
    // Delete the content with the given ID
  }

  get paginatedContents() {
    const start = (this.page - 1) * this.perPage;
    return this.filteredContents.slice(start, start + this.perPage);
  }
}
</script>
