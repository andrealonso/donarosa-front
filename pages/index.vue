<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <!-- eslint-disable-next-line -->
        <input type="file" id="fileImg" @change="teste">
        <img :src="file" alt="" class="src">
      </v-card>
    </v-col>
    <!-- <PreviewImg :open="true" :itemImg="'http://localhost:3000/img/00001879.jpg'" @close="openPreviewImg = false" /> -->
  </v-row>
</template>

<script>
  export default {
    name: 'IndexPage',
    data() {
      return {
        file: null
      }
    },
    methods: {
      async teste(e) {
        const file = e.target.files[0]
        this.file = URL.createObjectURL(file)
      }
    }
  }
</script>
<style>
  img {
    background-color: black;
    height: 150px;
    /* width: 200px; */
    aspect-ratio: 3/4;
    object-fit: contain;
  }
</style>
