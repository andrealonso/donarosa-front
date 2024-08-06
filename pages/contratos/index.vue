<template>
  <v-row justify="center" class="mb-4">
    <v-col cols="12">
      <v-card class="p-3">
        <v-card-title>
          <h4>Contratos</h4>
          <v-spacer></v-spacer>
          <v-text-field
            dense
            outlined
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
          >
          </v-text-field>
        </v-card-title>
        <v-data-table
          :footer-props="tableFooterPros"
          :headers="headers"
          :items="listagem"
          :search="search"
          dense
          mobile-breakpoint="400"
        >
          <!-- eslint-disable-next-line -->
          <template v-slot:item.actions="{ item }">
            <v-icon @click.prevent="exibirItem(item)">mdi-pencil</v-icon>
            <!-- <span>
                            <v-icon @click.prevent="confirmeExclusao(item)">mdi-delete</v-icon>
                        </span> -->
          </template>

          <!-- eslint-disable-next-line -->
          <template v-slot:item.cliente.nome="{ item }">
            <v-sheet min-width="200" color="rgba(255,255,255,0)">
              {{ item.cliente.nome }}
            </v-sheet>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.vl_total="{ item }">
            {{ item.vl_total | formatMoeda }}
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.vl_sinal="{ item }">
            {{ item.vl_sinal | formatMoeda }}
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.vl_rest="{ item }">
            {{ item.vl_rest | formatMoeda }}
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.id="{ item }">
            <a @click.prevent.stop="exibirItem(item)">{{
              item.id | zeroLeft
            }}</a>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.created_at="{ item }">
            {{ item.created_at | formatData }}
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.dt_evento="{ item }">
            {{ item.dt_evento | formatData }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card class="panel-bottom">
        <v-container>
          <v-btn
            color="primary"
            elevation="2"
            outlined
            @click.prevent.stop="novoItem"
            >Novo</v-btn
          >
          <v-btn
            color="primary"
            elevation="2"
            outlined
            @click.prevent.stop="exibAgenda"
            >Agenda</v-btn
          >
        </v-container>
      </v-card>
    </v-col>

    <contratosCadastro
      v-if="exibCadastro"
      :open="exibCadastro"
      @close="exibCadastro = false"
      @cancelar="cancelar"
      @alterarEdit="alterarEdit"
      @atualizarListagem="atualizarListagem"
      :listaStatus="listaStatus"
      :isEdit="isEdit"
      :item="payload"
    />
  </v-row>
</template>

<script>
import { contratoModel } from "~/models/ContratoModel";
import moment from "moment";
export default {
  async asyncData({ $axios }) {},
  name: "contratos",

  data() {
    return {
      listagem: [],
      listaStatus: [],
      tableFooterPros: this.$configFooterTable(),
      itemSelect: null,
      dlgConfirme: false,
      exibCadastro: false,
      isEdit: false,
      isLoading: false,
      search: "",
      headers: [
        { text: "Código", value: "id", align: "left", margin: "12px" },
        { text: "Status", value: "contrato_status.descricao", align: "left" },
        { text: "Data", value: "created_at", align: "left" },
        { text: "Cliente", value: "cliente.nome", align: "center" },
        { text: "Telefone", value: "cliente.tel", align: "center" },
        { text: "Data Evento", value: "dt_evento", align: "left" },
        { text: "Valor locação", value: "vl_total", align: "center" },
        { text: "Sinal", value: "vl_sinal", align: "center" },
        { text: "Restante", value: "vl_rest", align: "center" },
        { text: "Ações", value: "actions", sortable: false, align: "left" },
      ],
      exibLista: false,
      payload: contratoModel(),
      exibFormAgenda: true,
    };
  },
  beforeMount() {
    this.atualizarListagem();
  },
  filters: {
    zeroLeft(num) {
      return num.toLocaleString("en-US", {
        minimumIntegerDigits: 6,
        useGrouping: false,
      });
    },
    formatData(data) {
      if (!data) return;
      return moment(data).format("DD/MM/YYYY");
    },
    formatMoeda(valor) {
      if (!valor) return "0,00";
      return parseFloat(valor).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      });
    },
  },
  methods: {
    exibAgenda() {
      this.$store.commit("configSistem/setExibFormAgenda", true);
    },
    alterarEdit(bool) {
      if (bool) this.isEdit = bool;
    },
    corStatus(id) {
      if (id == 1) return "green--text";
      if (id == 2) return "red--text";
    },
    async novoItem() {
      try {
        const { dados } = await this.$axios.$get(`/contrato/000`);
        this.listaStatus = dados.listaStatus;
        this.payload = contratoModel();
        this.payload.contrato_status_id = 1;
        // console.log(this.payload); return
        this.isEdit = false;
        this.exibCadastro = true;
      } catch (error) {
        this.$alertaErro("Erro ao tentar abrir novo contrato!");
        console.log(error);
      }
    },
    confirmeExclusao(item) {
      this.itemSelect = item;
      this.dlgConfirme = true;
    },
    async atualizarListagem() {
      try {
        const resposta = await this.$axios.$get("/contratos");
        if (!resposta?.erro) {
          this.listagem = [];
          this.listagem = resposta.dados;
        } else {
          this.listagem = [];
        }
      } catch (error) {
        this.listagem = [];
        console.log({ error });
      }
    },
    formatDataToFront(data) {
      if (!data) return null;
      return moment(data).format("YYYY-MM-DD");
    },
    formatHoraToFront(data) {
      if (!data) return null;
      return moment(data).format("HH:MM");
    },
    formatMoedaToFront(valor) {
      if (valor)
        return valor.toLocaleString("pt-br", { minimumFractionDigits: 2 });
      return "0,00";
    },
    async exibirItem(item) {
      const { id } = item;
      try {
        const { dados } = await this.$axios.$get(`/contrato/${id}`);
        this.payload = contratoModel(dados.contrato);
        const {
          dt_prova,
          dt_saida,
          dt_devol,
          dt_evento,
          vl_sinal,
          vl_total,
          vl_rest,
        } = this.payload;
        this.payload.dt_prova = this.formatDataToFront(dt_prova);
        this.payload.hr_prova = this.formatHoraToFront(dt_prova);
        this.payload.dt_saida = this.formatDataToFront(dt_saida);
        this.payload.hr_saida = this.formatHoraToFront(dt_saida);
        this.payload.dt_devol = this.formatDataToFront(dt_devol);
        this.payload.dt_evento = this.formatDataToFront(dt_evento);
        this.listaStatus = dados.listaStatus;
        this.exibCadastro = true;
        this.isEdit = true;
      } catch (error) {
        console.log(error);
      }
    },
    cancelar() {
      this.payload = contratoModel();
      this.exibCadastro = false;
    },
  },
};
</script>
<style>
</style>
