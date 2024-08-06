<template>
  <v-dialog v-model="open" persistent>
    <v-card>
      <v-card-title> Relatório de caixa</v-card-title>
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
                <v-row justify="center">
                  <v-col cols="3" class="text-center">
                    <h3>Créditos:</h3>
                    <div class="green--text">
                      {{ totalCred | formatMoedaDisplay }}
                    </div>
                  </v-col>
                  <v-col cols="3" class="text-center">
                    <h3>Débitos:</h3>
                    <div class="red--text">
                      {{ totalDebt | formatMoedaDisplay }}
                    </div>
                  </v-col>
                  <v-col cols="3" class="text-center">
                    <h3>Saldo:</h3>
                    <div :class="totalSaldo >= 0 ? 'green--text' : 'red--text'">
                      {{ totalSaldo | formatMoedaDisplay }}
                    </div>
                  </v-col>
                </v-row>
                <v-data-table
                  :item-class="rowClass"
                  :headers="headers"
                  :items="listagem"
                  :search="search"
                  dense
                  mobile-breakpoint="0"
                  @current-items="calcValores"
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
                  <template v-slot:item.ativo_status.descricao="{ item }">
                    <div
                      :class="[
                        'justfy-center',
                        corStatus(item.ativo_status_id),
                      ]"
                    >
                      {{ item.ativo_status.descricao }}
                    </div>
                  </template>
                  <!-- eslint-disable-next-line -->
                  <template v-slot:item.id="{ item }">
                    {{ item.id | zeroLeft }}
                  </template>
                  <!-- eslint-disable-next-line -->
                  <template v-slot:item.data="{ item }">
                    {{ item.data | formatDataDisplay }}
                  </template>
                  <!-- eslint-disable-next-line -->
                  <template v-slot:item.valor="{ item }">
                    {{ item.valor | formatMoedaDisplay }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
    <caixaCadastro
      v-if="exibCadastro"
      :open="exibCadastro"
      @close="exibCadastro = false"
      @cancelar="cancelar"
      @atualizarListagem="atualizarListagem"
      :isEdit="isEdit"
      :item="payload"
      :listaSelecao="listaSelecao"
    />
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      totalDebt: 0.0,
      totalCred: 0.0,
      totalSaldo: 0.0,
      listaSelecao: {},
      itemSelect: null,
      exibCadastro: false,
      isEdit: false,
      search: "",
      headers: [
        { text: "Código", value: "id", align: "left", margin: "12px" },
        { text: "Data", value: "data", align: "left" },
        { text: "Categoria", value: "caixa_cate.descricao", align: "left" },
        { text: "Descrição", value: "descricao", align: "center" },
        { text: "Valor", value: "valor", align: "center" },
        { text: "Forma", value: "caixa_form_pag.descricao", align: "center" },
        { text: "Usuario", value: "usuario.login", align: "center" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
    };
  },
  methods: {
    calcValores(lista) {
      if (typeof lista === "string") return;
      let cred = 0,
        debt = 0,
        sald = 0;
      const valores = lista.map((item, idx) => parseFloat(item.valor));
      valores.forEach((item) => {
        if (item > 0) cred += item;
        if (item < 0) debt += item;
      });
      sald = cred + debt;
      this.totalCred = cred.toFixed(2);
      this.totalDebt = debt.toFixed(2);
      this.totalSaldo = sald.toFixed(2);
    },
    rowClass(item) {
      return item.valor < 0 ? "row-saidas" : "row-entradas";
    },
    async atualizarListagem() {
      try {
        const resposta = await this.$axios.$get("/caixas");
        if (!resposta?.erro) {
          this.listagem = resposta.dados.registros;
        } else {
          this.listagem = [];
        }
      } catch (error) {
        this.listagem = [];
        console.log({ error });
      }
    },
    async exibirItem(item) {
      const { id } = item;
      try {
        if (item.contrato_id) {
          this.$alertaErro(
            "Não é possível editar um lançamento de contrato por aqui."
          );
          return;
        }
        const { categoria, formapag } = await this.$axios.$get("/caixa/0");
        this.listaSelecao = { categoria, formapag };
        const payload = await this.$axios.$get(`/caixa/${id}`);
        this.payload = caixaModel(payload.dados);
        this.payload.valor = parseFloat(this.payload.valor).toFixed(2);
        this.exibCadastro = true;
        this.isEdit = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
.row-saidas {
  color: red;
}

.row-entradas {
  color: green;
}
</style>