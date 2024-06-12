<template>
    <v-row justify="center" class="mb-4">
        <v-col cols="12">
            <v-card class="p-3">
                <v-card-title>
                    <h4>Estoque</h4>
                    <v-spacer></v-spacer>
                    <v-text-field dense outlined v-model="search" append-icon="mdi-magnify" label="Pesquisar"
                        single-line hide-details>
                    </v-text-field>
                </v-card-title>
                <v-data-table :footer-props="tableFooterPros" :headers="headers" :items="listagem" :search="search"
                    dense mobile-breakpoint="400">

                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.data="{ item }">
                        {{ item.data | formatData }}
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.operacao="{ item }">
                        <span :class="item.operacao === 'Entrada' ? 'green--text' : 'red--text'">
                            {{ item.operacao }}
                        </span>
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                        <v-icon @click.prevent="confirmeExcItem(item)">mdi-delete</v-icon>
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
                    <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="selectProd('e')">Entrada de
                        produto
                    </v-btn>
                    <v-btn color="error" elevation="2" outlined dense @click.prevent.stop="selectProd('s')">
                        Saída de produto</v-btn>
                </v-container>
            </v-card>
        </v-col>

        <estoqueCadastro v-if="exibCadastro" :open="exibCadastro" @close="exibCadastro = false" @cancelar="cancelar"
            @atualizar="atualizarListagem" @exibSnack="exibSnack" :isEdit="isEdit" :item="payload"
            :produto="prodSelecionado" />

        <EstoqueSelectProd :listagem="listProd" :open="exibSelProd" @close="exibSelProd = false"
            @selecionado="lancEstoque" :isEntrada="isLancEntrada" @lancProd="lancEstoque" />

        <DialogLoading v-if="isLoading" :is-loading="isLoading" :cor="'purple lighten-1'"
            :texto="'Atualizando dados...'" />
        <DialogConfirme v-if="exibDlgConfirmeExc" :dlgConfirme="dlgConfirme" :open="exibDlgConfirmeExc"
            @nao="exibDlgConfirmeExc = false" @sim="excluirItem" />

        <snackbar v-if="snack.active" :snack="snack" @close="snack.active = false" />
    </v-row>
</template>

<script>
    import { estoqueModel } from '~/models/EstoqueModel'
    import moment from 'moment'
    export default {
        async asyncData({ $axios }) {
            let listagem = []
            try {
                const resposta = await $axios.$get('/estoques')
                if (!resposta?.erro) {
                    listagem = resposta.dados.registros
                } else {
                    listagem = []
                }
                return { listagem }
            } catch (error) {
                console.log(error);
                return { listagem }
            }
        },
        name: 'clientes',

        data() {
            return {
                tableFooterPros: {
                    itemsPerPageText: 'Itens por pág.',
                    itemsPerPageOptions: [50, 100, -1]
                },
                itemSelect: null,
                exibCadastro: false,
                exibSelProd: false,
                isLancEntrada: false,
                prodSelecionado: {},
                listProd: [],
                isEdit: false,
                isLoading: false,
                search: '',
                exibDlgConfirmeExc: false,
                headers: [
                    { text: 'Código', value: 'id', align: 'left', margin: '12px' },
                    { text: 'Data', value: 'data', align: 'center' },
                    { text: 'Operação', value: 'operacao', align: 'center' },
                    { text: 'Qtd.', value: 'qtd', align: 'center' },
                    { text: 'Produto', value: 'produto', align: 'left' },
                    { text: 'Descrição', value: 'descricao', align: 'left' },
                    { text: 'Ações', value: 'actions', sortable: false, align: 'right' },
                ],
                exibLista: false,
                payload: estoqueModel(),
                snack: {
                    active: false,
                    text: "teste",
                    timeout: 2000,
                    color: "primary"
                },
                dlgConfirme: {
                    titulo: '',
                    texto: "",
                    cor: ''
                },
            }
        },
        filters: {
            zeroLeft(num) {
                return (num).toLocaleString('en-US', {
                    minimumIntegerDigits: 6,
                    useGrouping: false
                })
            },
            formatData(data) {
                return moment.utc(data).format('DD/MM/YYYY')
            }
        },
        methods: {
            async selectProd(operacao) {
                this.isLancEntrada = operacao === 'e' ? true : false
                await this.getListProd()
                if (this.listProd.length > 0)
                    this.exibSelProd = true
                return
            },
            lancEstoque(produto) {
                let estoque = estoqueModel()
                estoque.produto_id = produto.id
                estoque.estoque_oper_id = this.isLancEntrada ? 1 : 2
                estoque.data = moment.utc().format('YYYY-MM-DD')
                this.prodSelecionado = produto
                this.payload = estoque
                this.exibCadastro = true
            },

            exibSnack(texto, cor) {
                this.snack.color = cor || ''
                this.snack.text = texto || ''
                this.snack.active = true
            },
            confirmeExcItem(item) {
                this.itemSelect = item
                this.dlgConfirme.titulo = 'Excluir registro'
                this.dlgConfirme.texto = 'Tem certeza que deseja excluir este registro?'
                this.dlgConfirme.cor = 'error'
                this.exibDlgConfirmeExc = true
            },
            async excluirItem(id) {
                try {
                    const { id } = this.itemSelect
                    const del = await this.$axios.$delete(`/estoque/${id}`)
                    this.exibSnack('Registro excluído com sucesso!', 'success')
                    this.atualizarListagem()
                    this.exibDlgConfirmeExc = false
                } catch (error) {
                    console.log(error);
                    this.exibDlgConfirmeExc = false
                    this.exibSnack('Não foi possível excluir o registro!', 'error')
                }
            },
            async getListProd() {
                try {
                    this.listProd = []
                    const resposta = await this.$axios.$get('/produtos')
                    const listagem = resposta.dados.registros
                    this.listProd = listagem
                } catch (error) {
                    console.log(error);
                }
            },
            async atualizarListagem() {
                try {
                    this.listagem = []
                    const resposta = await this.$axios.$get('/estoques')
                    if (!resposta?.erro) {
                        this.listagem = resposta.dados.registros
                    } else {
                        this.listagem = []
                    }
                } catch (error) {
                    this.listagem = []
                    console.log({ error });
                }
            },
            cancelar() {
                this.payload = estoqueModel()
                this.exibCadastro = false
            }
        }
    }

</script>
