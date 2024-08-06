<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <vMoney v-model="value" label="Valor" :options="options" dense outlined />
      <pre>
        {{ `config sistem: ${$store.state.configSistem.exibFormAgenda}` }}
      </pre>
    </v-col>
    <v-col cols="12">
      <v-btn @click="$store.commit('configSistem/setExibFormAgenda', true)"
        >TESTE</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "IndexPage",
  data() {
    return {
      value: "1234567.89",
      label: "Value",
      placeholder: " ",
      readonly: false,
      disabled: false,
      outlined: true,
      clearable: true,
      valueWhenIsEmpty: "",
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        length: 11,
        precision: 2,
      },
    };
  },
  methods: {
    async teste(e) {
      this.value = 345.65;
    },
  },
};
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
