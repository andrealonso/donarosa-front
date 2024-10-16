<template>
  <v-dialog v-model="open" persistent>
    <v-card>
      <v-card-title>
        <span
          :class="item.caixa_operacao_id === 1 ? 'green--text' : 'red--text'"
          >{{
            `Lançar
                    ${
                      item.caixa_operacao_id === 1 ? "entrada no" : "saída no"
                    } caixa`
          }}</span
        >
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="item.data"
                  type="date"
                  label="Data"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field
                  v-model="valor"
                  label="Valor"
                  v-money="money"
                  outlined
                  dense
                ></v-text-field>
                <!-- <v-text-field type="number" v-model="item.valor" label="Valor" outlined hide-spin-buttons
                                    dense></v-text-field> -->
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-autocomplete
                  :rules="[rules.required]"
                  label="Categoria"
                  outlined
                  auto-select-first
                  dense
                  :items="listaSelecao.categoria"
                  :item-text="(item) => item.descricao"
                  :item-value="(item) => item.id"
                  v-model="item.caixa_cate_id"
                  append-outer-icon="mdi-pencil"
                  @click:append-outer="editCategoria"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-autocomplete
                  :rules="[rules.required]"
                  label="Forma de pag."
                  outlined
                  auto-select-first
                  dense
                  :items="listaSelecao.formapag"
                  :item-text="(item) => item.descricao"
                  :item-value="(item) => item.id"
                  v-model="item.caixa_form_pag_id"
                  append-outer-icon="mdi-pencil"
                  @click:append-outer="editForma"
                >
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" md="9">
                <v-text-field
                  :rules="[rules.required, rules.counter]"
                  v-model="item.descricao"
                  label="Descrição"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          elevation="2"
          outlined
          dense
          @click.prevent.stop="salvarItem(item)"
          >Salvar
        </v-btn>
        <v-btn
          color="secondary"
          elevation="2"
          outlined
          dense
          @click.prevent.stop="cancelarRegistro"
        >
          Cancelar</v-btn
        >
        <v-btn
          color="error"
          elevation="2"
          outlined
          dense
          @click.prevent.stop="deleteItem(item)"
          :disabled="!isEdit"
          >Excluir
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { VMoney } from "v-money";

export default {
  directives: { money: VMoney },
  props: ["item", "isEdit", "open", "listaSelecao"],
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */,
      },
      valor: this.item.valor,
      valid: true,
      itemOld: { ...this.item },
      status: [
        { id: 1, descri: "ATIVO" },
        { id: 2, descri: "INATIVO" },
      ],
      rules: {
        required: (value) => !!value || "Requerido!",
        counter: (value) => value.length >= 6 || "Min. de 6 dígitos!",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Email inválido";
        },
        cpfValido: (value) => this.$cpfValido(value) || "CPF inválido!",
        senhaDiferente: (value) =>
          this.comparaSenha(value) ||
          "Senha não confere! Repita a mesma senha.",
      },
    };
  },
  methods: {
    editCategoria() {
      console.log("editCategoria");
    },
    editForma() {
      console.log("editForma");
    },
    async salvarItem() {
      let item = { ...this.item };
      let vl = Number(this.valor.replaceAll(".", "").replace(",", "."));

      item.valor = vl;
      if (item.caixa_operacao_id === 1 && vl < 0) item.valor = vl * -1;
      if (item.caixa_operacao_id === 2 && vl > 0) item.valor = vl * -1;

      if (!this.$refs.form.validate()) {
        return;
      }

      if (!this.isEdit) {
        this.createItem(item);
      } else {
        this.updateItem(item);
      }
    },
    foiAlterado() {
      if (JSON.stringify(this.itemOld) === JSON.stringify(this.item))
        return false;
      return true;
    },
    async createItem(item) {
      try {
        console.log("create", item);
        // return;
        delete item.id;
        await this.$axios.$post(`/caixa`, item);
        this.$emit("atualizarListagem");
        this.$emit("close");
        this.$alertaSucesso("Registro salvo com sucesso!");
      } catch (error) {
        this.$alertaErro(
          "Não foi possível salvar o registro! Verifique o nome ou cpf já foram cadastrados"
        );
        console.log(error);
      }
    },
    async updateItem(item) {
      try {
        console.log("update", item);
        // return;
        await this.$axios.$put(`/caixa/${item.id}`, item);
        this.$emit("atualizarListagem");
        this.$emit("close");
        this.$alertaSucesso("Registro salvo com sucesso!");
      } catch (error) {
        this.$alertaErro(
          "Não foi possível salvar o registro! Verifique os dados e tente novamente"
        );
        console.log(error);
      }
    },
    cancelarRegistro() {
      this.$emit("close");
    },
    async deleteItem(item) {
      try {
        await this.$axios.$delete(`/caixa/${item.id}`);
        this.$emit("atualizarListagem");
        this.$emit("close");
        this.$alertaSucesso("Registro exluído com sucesso!", "success");
      } catch (error) {
        this.$alertaErro("Não foi possível excluir o registro!", "error");
        console.log(error);
      }
    },
  },
};
</script>

<style></style>