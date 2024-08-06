<template>
  <v-dialog v-model="open" persistent>
    <v-card>
      <v-card-title> Cadastro de Contratos </v-card-title>
      <v-card-text>
        <v-tabs v-model="tabs" grow>
          <v-tab href="#dados">Dados do Contrato</v-tab>
          <v-tab href="#itens" v-if="isEdit">Itens do Contrato</v-tab>
          <v-tab href="#valores" v-if="isEdit">Valores</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs" touchless>
          <v-tab-item value="dados">
            <v-sheet :min-height="altura">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-container>
                  <v-row dense>
                    <v-col cols="12">
                      <v-row>
                        <v-col cols="4" sm="4" md="2">
                          <v-text-field
                            readonly
                            type="number"
                            hide-spin-buttons
                            v-model="item.id"
                            label="Número do Contrato"
                            outlined
                            dense
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8" sm="4" md="3">
                          <v-autocomplete
                            hide-no-data
                            :rules="[]"
                            label="Status"
                            outlined
                            auto-select-first
                            dense
                            hide-selected
                            :items="listaStatus"
                            :item-text="(item) => item.descricao"
                            :item-value="(item) => item.id"
                            v-model="item.contrato_status_id"
                          >
                          </v-autocomplete>
                        </v-col>
                        <!-- <v-col>
                          <v-menu bottom left>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn dark icon v-bind="attrs" v-on="on">
                                <v-icon color="secondary"
                                  >mdi-dots-vertical</v-icon
                                >
                              </v-btn>
                            </template>

                            <v-list>
                              <v-list-item
                                v-for="(item, i) in listaStatus"
                                :key="i"
                                link
                              >
                                <v-list-item-title
                                  @click="alterarStatus(item.id)"
                                  >{{ item.descricao }}</v-list-item-title
                                >
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-col> -->
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="12" md="5">
                      <v-autocomplete
                        :rules="[rules.required]"
                        label="Cliente"
                        outlined
                        auto-select-first
                        dense
                        :items="listaClientes"
                        :item-text="(item) => item.nome"
                        :item-value="(item) => item.id"
                        v-model="item.cliente_id"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <v-text-field
                        @change="alterarDtEvento"
                        type="date"
                        v-model="item.dt_evento"
                        label="Data do evento"
                        outlined
                        dense
                        validate-on-blur
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="4">
                      <div class="d-flex">
                        <v-autocomplete
                          hide-no-data
                          :rules="[]"
                          label="Evento"
                          outlined
                          dense
                          :items="listaEventos"
                          :item-text="(item) => item.descricao"
                          :item-value="(item) => item.id"
                          v-model="item.evento_id"
                          append-outer-icon="mdi-plus"
                          @click:append-outer="novoEvento"
                          :search-input.sync="search"
                          clearable
                        >
                        </v-autocomplete>
                        <!-- <v-btn icon color="primary">
                                        <v-icon large @click="selectProd('e')">mdi-plus</v-icon>
                                    </v-btn> -->
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        no-resize
                        rows="3"
                        outlined
                        dense
                        v-model="item.obs"
                        label="Obsevações"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-sheet>
          </v-tab-item>
          <v-tab-item value="itens">
            <v-sheet :min-height="altura">
              <v-container>
                <v-row dense>
                  <v-col cols="12" sm="12" md="4" class="d-flex">
                    <v-text-field
                      type="date"
                      :rules="[rules.required]"
                      v-model="item.dt_prova"
                      label="Prova data/hora "
                      outlined
                      dense
                      required
                      validate-on-blur
                    ></v-text-field>
                    <v-text-field
                      type="time"
                      :rules="[rules.required]"
                      v-model="item.hr_prova"
                      label=""
                      outlined
                      dense
                      required
                      validate-on-blur
                      :append-outer-icon="
                        item.contrato_status_id >= 3
                          ? 'mdi-checkbox-marked-outline'
                          : 'mdi-checkbox-blank-outline'
                      "
                      @click:append-outer="alterarStatus(3)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="4" class="d-flex">
                    <v-text-field
                      type="date"
                      :rules="[rules.required]"
                      v-model="item.dt_saida"
                      label="Retirada data/hora "
                      outlined
                      dense
                      required
                      validate-on-blur
                    ></v-text-field>
                    <v-text-field
                      type="time"
                      :rules="[rules.required]"
                      v-model="item.hr_saida"
                      label=""
                      outlined
                      dense
                      required
                      validate-on-blur
                      :append-outer-icon="
                        item.contrato_status_id >= 4
                          ? 'mdi-checkbox-marked-outline'
                          : 'mdi-checkbox-blank-outline'
                      "
                      @click:append-outer="alterarStatus(4)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="3" class="d-flex">
                    <v-text-field
                      type="date"
                      :rules="[rules.required]"
                      v-model="item.dt_devol"
                      label="Devolução data "
                      outlined
                      dense
                      required
                      validate-on-blur
                      :append-outer-icon="
                        item.contrato_status_id >= 5
                          ? 'mdi-checkbox-marked-outline'
                          : 'mdi-checkbox-blank-outline'
                      "
                      @click:append-outer="alterarStatus(5)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Adicionar produtos"
                      outlined
                      auto-select-first
                      dense
                      :items="listaProdutos"
                      :item-text="(prod) => prod.descricao"
                      v-model="produtoSelecionado"
                      :item-value="(prod) => prod"
                      clearable
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="4" md="2">
                    <v-text-field
                      type="number"
                      v-model="itemCont.qtd"
                      label="Qtd"
                      hide-spin-buttons
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8" md="4">
                    <div class="d-flex">
                      <vMoney
                        v-model="itemCont.valor"
                        label="Valor"
                        :options="options"
                        dense
                        outlined
                      />
                      <v-sheet width="10"></v-sheet>
                      <v-btn icon color="primary">
                        <v-icon large @click="addItem">mdi-plus</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined min-height="300">
                      <v-data-table
                        hide-default-footer
                        :headers="headers"
                        :items="item.itens"
                        dense
                        mobile-breakpoint="400"
                      >
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.actions="{ item, index }">
                          <v-icon @click.prevent="delItem(item, index)"
                            >mdi-delete</v-icon
                          >
                          <!-- <v-icon @click.prevent="exibirItem(item)">mdi-pencil</v-icon> -->
                        </template>

                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.id="{ item }">
                          {{ item.id | zeroLeft }}
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.valor="{ item }">
                          {{ item.valor | formatMoeda }}
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.produto.descricao="{ item }">
                          <v-sheet min-width="200" color="rgba(255,255,255,0)">
                            {{ item | formatDescricaoProd }}
                          </v-sheet>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      Qtd: <strong>{{ qtdItens }}</strong>
                    </div>
                    <div>
                      Valor total:
                      <strong>{{ valorItens | formatMoeda }}</strong>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-tab-item>
          <v-tab-item value="valores">
            <v-sheet :min-height="altura">
              <v-container>
                <v-row dense>
                  <v-col cols="12" sm="6" md="2">
                    <v-text-field
                      readonly
                      type="date"
                      v-model="itemPagamento.data"
                      label="Data do pag. "
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-autocomplete
                      label="Forma de pagamento"
                      outlined
                      auto-select-first
                      dense
                      :items="listaFormPag"
                      :item-text="(formpag) => formpag.descricao"
                      v-model="itemPagamento.caixa_form_pag_id"
                      :item-value="(formpag) => formpag.id"
                    >
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="10" sm="6" md="4">
                    <vMoney
                      v-model="itemPagamento.valor"
                      label="Valor"
                      :options="options"
                      dense
                      outlined
                    />
                  </v-col>
                  <v-col cols="2" sm="6" md="2">
                    <v-btn icon color="primary">
                      <v-icon large @click="addPag">mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                  <!-- Tabela Caixa -->
                  <v-col cols="12">
                    <v-card outlined min-height="300">
                      <v-data-table
                        hide-default-footer
                        :headers="headersCaixa"
                        :items="this.item.caixa_lanc"
                        dense
                        mobile-breakpoint="0"
                      >
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.actions="{ item, index }">
                          <v-icon @click.prevent="delPag(item, index)"
                            >mdi-delete</v-icon
                          >
                        </template>

                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.data="{ item }">
                          {{ item.data | formatData }}
                        </template>
                        <!-- eslint-disable-next-line -->
                        <template v-slot:item.valor="{ item }">
                          {{ item.valor | formatMoeda }}
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-col>

                  <v-col cols="4" sm="12" md="3">
                    <vMoney
                      @blur="calcValores"
                      v-model="item.vl_total"
                      label="Valor da total"
                      :options="options"
                      dense
                      outlined
                    />
                  </v-col>
                  <v-col cols="4" sm="12" md="3">
                    <vMoney
                      @blur="calcValores"
                      v-model="item.vl_sinal"
                      label="Valor pago"
                      :options="options"
                      dense
                      readonly
                      outlined
                    />
                  </v-col>
                  <v-col cols="4" sm="12" md="3">
                    <vMoney
                      @blur="calcValores"
                      readonly
                      v-model="item.vl_rest"
                      label="Valor restante"
                      :options="options"
                      dense
                      outlined
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions class="overflow-auto">
        <v-spacer></v-spacer>
        <v-btn
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

    <eventosCadastro
      v-if="exibCadEvento"
      :open="exibCadEvento"
      @close="exibCadEvento = false"
      @cancelar="exibCadEvento = false"
      @atualizarListagem="getListaEventos"
      :isEdit="isEditEvento"
      :item="payloadEvento"
      :listaTipoEvento="listaTipoEvento"
      :dataEvento="item.dt_evento"
    />
  </v-dialog>
</template>

<script>
import moment from "moment";
import { eventoModel } from "~/models/EventoModel";
import { itemContratoModel } from "~/models/ItemContratoModel";
import { caixaModel } from "~/models/CaixaModel";
export default {
  props: ["item", "isEdit", "open", "listaStatus"],
  data() {
    return {
      search: null,
      altura: 550,
      tabs: "dados",
      headers: [
        {
          text: "Cód. Barras",
          value: "produto.cod_barras",
          align: "left",
          margin: "12px",
        },
        { text: "Descrição", value: "produto.descricao", align: "left" },
        // { text: 'Cor', value: 'produto.prod_cor.descricao', align: 'center' },
        // { text: 'Tamanho', value: 'produto.prod_tamanho.descricao', align: 'center' },
        // { text: 'Compri.', value: 'produto.prod_compri.descricao', align: 'center' },
        { text: "Qtd", value: "qtd", align: "center" },
        { text: "Valor Aluguel", value: "valor", align: "center" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
      headersCaixa: [
        { text: "Data", value: "data", align: "left" },
        { text: "Valor", value: "valor", align: "center" },
        { text: "Forma", value: "caixa_form_pag.descricao", align: "center" },
        { text: "Ações", value: "actions", sortable: false, align: "right" },
      ],
      options: {
        locale: "pt-BR",
        prefix: "",
        suffix: "",
        length: 11,
        precision: 2,
      },
      valid: true,
      itemOld: { ...this.item },
      rules: {
        required: (value) => !!value || "Requerido!",
        counter: (value) => value?.length >= 6 || "Min. de 6 dígitos!",
      },
      listaClientes: [],
      listaProdutos: [],
      listaItens: [],
      listaEventos: [],
      listaTipoEvento: [],
      listaFormPag: [],
      payloadEvento: eventoModel(),
      isEditEvento: false,
      exibCadEvento: false,
      msgErrorDataProva: null,
      msgErrorDataSaida: null,
      produtoSelecionado: null,
      itemCont: itemContratoModel(),
      itemPagamento: caixaModel(),
      salvarEsair: false,
    };
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
  beforeMount() {
    this.getListaClientes();
    this.getListaEventos();
    this.getListaProdutos();
    this.getListaFormPag();
    this.novoPag();
  },
  computed: {
    qtdItens() {
      return this.item.itens.length || 0;
    },
    valorItens() {
      const { itens } = this.item;
      if (!itens.length) return;
      const total = itens
        .map((item) => item.valor)
        .reduce((acc, valor) => acc + valor)
        .toFixed(2);
      return total;
    },
  },
  methods: {
    alterarStatus(novoStatus) {
      // 1-Novo, 2-Ag. Prova, 3-Ag. Retirada,4-Ag. Devolucao,
      // 5-Finalizado, 6-Cancelado, 7-Suspenso

      this.item.contrato_status_id = novoStatus;
    },
    novoPag() {
      this.itemPagamento = caixaModel();
      this.itemPagamento.data = moment().format("YYYY-MM-DD");
    },

    async addPag() {
      const contratoID = this.item.id.toLocaleString("en-US", {
        minimumIntegerDigits: 6,
        useGrouping: false,
      });
      if (!this.item.vl_total) {
        this.$alertaErro("Preimeiro informe o valor total.");
        return;
      }
      if (!this.itemPagamento.data) {
        this.$alertaErro("Informe a data do pagamento!");
        return;
      }
      if (!this.itemPagamento.caixa_form_pag_id) {
        this.$alertaErro("Informe a forma de pagamento!");
        return;
      }
      const valorPago = Number(this.itemPagamento.valor);
      const dataPag = new Date(this.itemPagamento.data);
      if (isNaN(valorPago)) {
        this.$alertaErro("Informe o valor do pagamento!");
        return;
      }
      try {
        this.itemPagamento.valor = valorPago;
        this.itemPagamento.descricao = `Valor referente ao contrato ${contratoID}.`;
        this.itemPagamento.caixa_cate_id = 1;
        this.itemPagamento.caixa_operacao_id = 1;

        delete this.itemPagamento.id;
        delete this.itemPagamento.contrato_id;
        const payload = { ...this.itemPagamento, data: dataPag };

        const { dados } = await this.$axios.$put(
          `/contrato-addpag/${this.item?.id}`,
          payload
        );
        this.item.caixa_lanc = dados.caixa_lanc;
        this.item.vl_total = dados.vl_total;
        this.item.vl_sinal = dados.vl_sinal;
        this.item.vl_rest = dados.vl_rest;
        this.itemPagamento = caixaModel();
        this.itemPagamento.data = moment().format("YYYY-MM-DD");
        this.$emit("atualizarListagem");
      } catch (error) {
        console.log(error);
      }
    },
    async delPag(lanc, index) {
      if (
        await this.$confirmaExclusao(
          "Tem certeza que deseja este pagamento?",
          "Exluir Pagamento"
        )
      ) {
        try {
          const { vl_total, vl_sinal, vl_rest } = this.item;
          const payload = {
            vl_total: vl_total,
            vl_sinal: vl_sinal - lanc.valor,
            vl_rest: vl_rest + lanc.valor,
            caixa_lanc: {
              update: {
                where: { id: lanc.id },
                data: { deleted_at: new Date() },
              },
            },
          };
          const { dados } = await this.$axios.$put(
            "/contrato/" + lanc.contrato_id,
            payload
          );
          this.item.caixa_lanc = dados.caixa_lanc;
          this.item.vl_total = dados.vl_total;
          this.item.vl_sinal = dados.vl_sinal;
          this.item.vl_rest = dados.vl_rest;
          this.itemPagamento = caixaModel();
          this.itemPagamento.data = moment().format("YYYY-MM-DD");
          this.$emit("atualizarListagem");
        } catch (error) {
          this.$alertaErro();
          console.log(error);
        }
      }
    },
    valorToBack(valor) {
      if (valor) {
        return Number(valor.replaceAll(".", "").replace(",", "."));
      }
      return null;
    },
    itemJaExiste(prodId) {
      if (this.item.itens.length) {
        return this.item.itens.some((item) => item.produto_id == prodId);
      }
      return;
    },
    async addItem() {
      try {
        const prodId = this.produtoSelecionado?.id || null;
        if (this.itemJaExiste(prodId)) {
          this.$alertaErro("Item já cadastrado!");
          return;
        }
        if (!prodId) {
          this.$alertaErro("Nenhum produto foi selecionado!");
          return;
        }
        const { qtd, valor } = this.itemCont;

        const itemProd = {
          produto_id: prodId,
          qtd: Number(qtd),
          valor: Number(valor),
        };
        delete itemProd.contrato_id;
        const { dados } = await this.$axios.$put(
          `/contrato-addprod/${this.item.id}`,
          itemProd
        );
        this.item.itens = dados.itens;
        this.itemCont = itemContratoModel();
      } catch (error) {
        this.$alertaErro();
        console.log(error);
      }
    },
    async delItem(item, index) {
      if (
        await this.$confirmaExclusao(
          "Tem certeza que deseja excluir este item?",
          "Exluir item do contrato"
        )
      ) {
        try {
          await this.$axios.$delete("/contrato-item/" + item.id);
          this.item.itens.splice(index, 1);
        } catch (error) {
          this.$alertaErro();
          console.log(error);
        }
      }
    },
    async novoEvento() {
      const { dados } = await this.$axios.$get(`/evento/00`);
      this.listaTipoEvento = dados.tipoEvento;
      this.payloadEvento = eventoModel();
      this.isEditEvento = false;
      this.exibCadEvento = true;
    },
    teste() {
      console.log(this.itemPagamento);
    },
    dataHoraToBack(data, hora) {
      if (!data || !hora) return null;
      return new Date(`${data} ${hora}`);
    },
    async getListaFormPag() {
      try {
        const { formapag } = await this.$axios.$get("/caixa/0");
        this.listaFormPag = formapag ? [...formapag] : [];
      } catch (error) {
        console.log(error);
      }
    },
    async getListaProdutos() {
      let list = [];
      const { dados } = await this.$axios.$get("/produtos");
      const { registros } = dados;
      if (registros) {
        this.listaProdutos = registros.map((produto) => {
          return {
            id: produto.id,
            descricao: `${produto?.cod_barras || ""} ${produto?.descricao} ${
              produto?.prod_cor?.descricao || ""
            } ${produto?.prod_tamanho?.descricao || ""} ${
              produto?.prod_compri?.descricao || ""
            }`,
          };
        });
      } else {
        this.listaProdutos = [];
      }
    },
    alterarDtEvento() {
      this.item.evento_id = null;
      this.getListaEventos();
    },
    async getListaEventos(novoEvento) {
      if (novoEvento?.id) {
        this.item.evento_id = novoEvento.id;
        novoEvento.descricao =
          novoEvento.descricao + " - " + novoEvento.evento_tipo?.descricao;
        delete novoEvento.evento_tipo;
        this.listaEventos.push(novoEvento);
        return;
      }
      if (!this.item.dt_evento) {
        this.item.evento_id = null;
        return;
      }
      const dataEvento = moment(this.item.dt_evento).format("YYYY-MM-DD");
      const { dados } = await this.$axios.$get(`/eventos?busca=${dataEvento}`);
      if (dados) {
        const list = dados.map((item) => {
          const { id, descricao, evento_tipo } = item;
          return {
            id,
            descricao: `${descricao} - ${evento_tipo.descricao}`,
          };
        });
        this.listaEventos = [...list];
      } else {
        this.listaEventos = [];
      }
    },
    calcValores() {
      const { caixa_lanc: listaPags } = this.item;
      if (listaPags.length) {
        const totalPago = listaPags
          .map((item) => item.valor)
          .reduce((acc, valor) => acc + valor);
        this.item.vl_sinal = totalPago;
        if (this) if (!this.item.vl_total || !this.item.vl_sinal) return;
        const { vl_total, vl_sinal } = this.item;
        this.item.vl_rest = (Number(vl_total) - Number(vl_sinal)).toFixed(2);
      }
    },
    async getListaClientes() {
      const { dados } = await this.$axios.$get("/clientes");
      if (dados?.registros) {
        this.listaClientes = dados.registros;
      }
    },
    salvar() {
      this.salvarEsair = false;
      this.salvarItem();
    },
    salvarSair() {
      this.salvarEsair = true;
      this.salvarItem();
    },
    async salvarItem() {
      if (this.isEdit && this.item.caixa_lanc.length) {
        this.calcValores();
      }
      if (!this.$refs.form.validate()) {
        return;
      }
      const item = { ...this.item };
      const {
        dt_prova,
        hr_prova,
        dt_saida,
        hr_saida,
        dt_devol,
        dt_evento,
        vl_sinal,
        vl_total,
        vl_rest,
      } = this.item;

      item.dt_prova = this.dataHoraToBack(dt_prova, hr_prova);
      item.dt_saida = this.dataHoraToBack(dt_saida, hr_saida);
      item.dt_devol = this.dataHoraToBack(dt_devol, "00:00");
      item.dt_evento = this.dataHoraToBack(dt_evento, "00:00");
      item.vl_total = vl_total ? Number(vl_total) : null;
      item.vl_sinal = vl_sinal ? Number(vl_sinal) : null;
      item.vl_rest = vl_rest ? Number(vl_rest) : null;
      delete item.hr_prova;
      delete item.hr_saida;
      delete item.itens;
      delete item.caixa_lanc;

      // console.log(item);
      if (this.foiAlterado()) {
        if (!this.isEdit) {
          this.createItem(item);
        } else {
          this.updateItem(item);
        }
      } else {
        if (this.salvarEsair) this.$emit("close");
        this.$alertaSucesso();
        return;
      }
    },
    foiAlterado() {
      if (JSON.stringify(this.itemOld) === JSON.stringify(this.item))
        return false;
      return true;
    },
    async createItem(item) {
      try {
        delete item.id;
        const { dados } = await this.$axios.$post(`/contrato`, item);
        this.item.id = dados.id;
        this.$emit("atualizarListagem");
        this.$emit("alterarEdit", true);
        this.$alertaSucesso();
        if (this.salvarEsair) this.$emit("close");
      } catch (error) {
        this.$alertaErro();
        console.log(error);
      }
    },
    async updateItem(item) {
      try {
        await this.$axios.$put(`/contrato/${item.id}`, item);
        this.$emit("atualizarListagem");
        this.$alertaSucesso();
        if (this.salvarEsair) this.$emit("close");
      } catch (error) {
        this.$alertaErro();
        console.log(error);
      }
    },
    cancelarRegistro() {
      this.$emit("close");
    },
    async deleteItem(item) {
      try {
        await this.$axios.$delete(`/contrato/${item.id}`);
        this.$emit("atualizarListagem");
        this.$emit("close");
        this.$alertaSucesso("Registro exluído com sucesso!");
      } catch (error) {
        this.$alertaErro("Não foi possível excluir o registro!");
        console.log(error);
      }
    },
  },
};
</script>

<style>
td {
  min-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>