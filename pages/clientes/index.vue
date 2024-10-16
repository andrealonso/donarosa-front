<template>
  <v-row justify="center" class="mb-4">
    <v-col cols="12">
      <v-card class="p-3">
        <v-card-title>
          <h4>Cliente</h4>
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
          :items="$store.state.clientes.listagem"
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
          <template v-slot:item.ativo_status.descricao="{ item }">
            <div :class="['justfy-center', corStatus(item.ativo_status_id)]">
              {{ item.ativo_status.descricao }}
            </div>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.id="{ item }">
            {{ item.id | zeroLeft }}
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
        </v-container>
      </v-card>
    </v-col>
    <clientesCadastro
      v-if="exibCadastro"
      :open="exibCadastro"
      @close="exibCadastro = false"
      @cancelar="cancelar"
      @atualizarListagem="atualizarListagem"
      :isEdit="isEdit"
      :item="payload"
    />
  </v-row>
</template>

<script>
import { clienteModel } from "~/models/ClienteModel";
export default {
  async asyncData({ $axios }) {
    // let listagem = []
    // try {
    //     const resposta = await $axios.$get('/clientes')
    //     if (!resposta?.erro) {
    //         listagem = resposta.dados.registros
    //     } else {
    //         listagem = []
    //     }
    //     return { listagem }
    // } catch (error) {
    //     console.log(error);
    //     return { listagem }
    // }
  },
  name: "clientes",

  data() {
    return {
      listagem: [],
      tableFooterPros: {
        itemsPerPageText: "Itens por pág.",
        itemsPerPageOptions: [50, 100, -1],
      },
      itemSelect: null,
      dlgConfirme: false,
      exibCadastro: false,
      isEdit: false,
      isLoading: false,
      search: "",
      headers: [
        { text: "Código", value: "id", align: "left", margin: "12px" },
        { text: "Nome", value: "nome", align: "left" },
        { text: "Telefone", value: "tel", align: "center" },
        { text: "Ações", value: "actions", sortable: false, align: "right",class:'coluna-fixa' },
      ],
      exibLista: false,
      payload: clienteModel(),
    };
  },
  filters: {
    zeroLeft(num) {
      if (!num) return;
      return num.toLocaleString("en-US", {
        minimumIntegerDigits: 6,
        useGrouping: false,
      });
    },
  },
  async beforeMount() {
    this.$store.dispatch("clientes/getListagem");
  },
  methods: {
    alternarModoEdicao(habilitar) {
      this.isEdit = habilitar ? true : false;
    },
    corStatus(id) {
      if (!id) return;
      if (id == 1) return "green--text";
      if (id == 2) return "red--text";
    },
    novoItem() {
      //this.getLocais();
      this.payload = clienteModel();
      this.isEdit = false;
      this.exibCadastro = true;
    },
    async atualizarListagem() {},
    async exibirItem(item) {
      const { id } = item;
      try {
        const result = await this.$axios.$get(`/cliente/${id}`);
        this.payload = clienteModel(result.dados);
        this.exibCadastro = true;
        this.isEdit = true;
      } catch (error) {
        console.log(error);
      }
    },
    cancelar() {
      this.payload = clienteModel();
      this.exibCadastro = false;
    },
    delMock(item) {
      if (item) {
        const index = this.listagem.findIndex((doc) => doc.id == item.id);
        this.listagem.splice(index, 1);
      }
    },
  },
};
</script>
<style>
.panel-bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}

</style>
