<template>
  <v-dialog v-model="open" persistent>
    <v-card>
      <v-card-title> Agendamentos </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row dense>
              <v-col cols="12" sm="3" md="3">
                <v-autocomplete
                  hide-no-data
                  :rules="[]"
                  label="Opções"
                  outlined
                  auto-select-first
                  dense
                  hide-selected
                  :items="listaOpcoes"
                  :item-text="(item) => item.descri"
                  :item-value="(item) => item.campo"
                  v-model="filtro.campo"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-text-field
                  type="date"
                  :rules="[rules.required]"
                  v-model="filtro.dt_ini"
                  label="Data inicial"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="6" sm="3" md="3">
                <v-text-field
                  type="date"
                  :rules="[rules.required]"
                  v-model="filtro.dt_fim"
                  label="Data final"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-btn @click="exibirFiltro" width="100%">Exibir</v-btn>
              </v-col>

              <v-col cols="12">
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
              </v-col>
              <v-col cols="12">
                <v-sheet outlined>
                  <v-data-table
                    :footer-props="tableFooterPros"
                    :headers="headers"
                    :items="listagem"
                    :search="search"
                    dense
                    mobile-breakpoint="400"
                    height="300"
                    no-data-text=""
                  >
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                      <v-icon @click.prevent="exibirItem(item)"
                        >mdi-pencil</v-icon
                      >
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
                    <template v-slot:item.contrato.id="{ item }">
                      {{ item.contrato.id | zeroLeft }}
                    </template>

                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.contrato.dt_evento="{ item }">
                      {{ item.contrato.dt_evento | formatData }}
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.contrato.dt_prova="{ item }">
                      {{ item.contrato.dt_prova | formatData }}
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.contrato.dt_saida="{ item }">
                      {{ item.contrato.dt_saida | formatData }}
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.contrato.dt_devol="{ item }">
                      {{ item.contrato.dt_devol | formatData }}
                    </template>
                  </v-data-table>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="overflow-auto">
        <v-spacer></v-spacer>
        <!-- <v-btn
          color="success"
          elevation="2"
          outlined
          dense
          @click.prevent.stop="salvar"
          >Salvar
        </v-btn>
        <v-btn
          color="success"
          elevation="2"
          outlined
          dense
          @click.prevent.stop="salvarSair"
          >Salvar e sair
        </v-btn> -->
        <v-btn
          color="secondary"
          elevation="2"
          outlined
          dense
          @click.prevent.stop="cancelarRegistro"
        >
          Cancelar</v-btn
        >

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import { eventoModel } from "~/models/EventoModel";
import { itemContratoModel } from "~/models/ItemContratoModel";
import { caixaModel } from "~/models/CaixaModel";
export default {
  props: ["open"],
  data() {
    return {
      search: null,
      tableFooterPros: this.$configFooterTable(),
      headers: [
        {
          text: "Cód. Barras",
          value: "produto.cod_barras",
          align: "left",
          margin: "12px",
        },
        { text: "Produto", value: "produto.descricao", align: "left" },
        { text: "Contrato", value: "contrato.id", align: "left" },
        { text: "Cliente", value: "contrato.cliente.nome", align: "left" },
        { text: "Telefone", value: "contrato.cliente.tel", align: "left" },
        { text: "Data Prova", value: "contrato.dt_prova", align: "left" },
        { text: "Data Saída", value: "contrato.dt_saida", align: "left" },
        { text: "Data Devol.", value: "contrato.dt_devol", align: "left" },
        { text: "Data Evento", value: "contrato.dt_evento", align: "left" },
        // { text: 'Cor', value: 'produto.prod_cor.descricao', align: 'center' },
        // { text: 'Tamanho', value: 'produto.prod_tamanho.descricao', align: 'center' },
        // { text: 'Compri.', value: 'produto.prod_compri.descricao', align: 'center' },
        // { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
      listagem: [],
      filtro: {
        dt_ini: moment("2024-05-01").format("YYYY-MM-DD"),
        dt_fim: moment().format("YYYY-MM-DD"),
        campo: "dt_prova",
      },
      listaOpcoes: [
        { campo: "dt_prova", descri: "Data Prova" },
        { campo: "dt_saida", descri: "Data Saída" },
        { campo: "dt_devol", descri: "Data Devolução" },
      ],
      valid: true,
      rules: {
        required: (value) => !!value || "Requerido!",
      },
    };
  },
  async mounted() {
    await this.exibirFiltro();
  },
  filters: {
    zeroLeft(num) {
      if (num)
        return num.toLocaleString("en-US", {
          minimumIntegerDigits: 6,
          useGrouping: false,
        });
    },
    formatData(data) {
      if (data) return moment.utc(data).format("DD/MM/YYYY");
    },
    formatMoeda(valor) {
      if (!valor) return "0,00";
      return parseFloat(valor).toLocaleString("pt-br", {
        minimumFractionDigits: 2,
      });
    },

    formatDescricaoProd(item) {
      if (item)
        return `${item.produto?.descricao} ${
          item.produto?.prod_cor?.descricao || ""
        } ${item.produto?.prod_tamanho?.descricao || ""} ${
          item.produto?.prod_compri?.descricao || ""
        }`;
    },
  },

  methods: {
    async exibirFiltro() {
      if (!this.$refs.form.validate()) {
        return;
      }
      let { dt_ini, dt_fim, campo } = this.filtro;

      if (!dt_ini || !dt_fim) {
        this.$alertaErro("Informe as datas!");
      }
      if (moment(dt_ini).isAfter(dt_fim)) {
        this.$alertaErro(
          "A data inicial precisar se menor do que a data final!"
        );
      }
      dt_ini = new Date(dt_ini);
      dt_fim = new Date(dt_fim);
      const _filtro = { dt_ini, dt_fim, campo };
      const { dados } = await this.$axios.$post(
        "/contrato-item/exibir-agenda",
        _filtro
      );
      this.listagem = dados || [];
    },
    cancelarRegistro() {
      this.$emit("cancelar");
    },
  },
};
</script>

<style>
th,
td {
  white-space: nowrap !important;
}
</style>