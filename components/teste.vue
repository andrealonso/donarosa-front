<template>
  <div>
    <h1>TESTE</h1>
    <img :src="imgSrc" alt="" id="imagem" />
  </div>
</template>

<script>
import Cropper from "cropperjs";
export default {
  data() {
    return {
      imgSrc:
        "https://proximonivel.embratel.com.br/wp-content/uploads/2022/09/cidades-mais-inteligentes-do-Brasil-753x425.jpg",
    };
  },
  mounted() {
    const imagem = document.querySelector("img");
    const cropper = new Cropper(imagem, { aspectRatio: 0, viewMode: 0 });
  },
};
</script>

<style>
@import "../node_modules/cropperjs/dist/cropper.min.css";
</style>