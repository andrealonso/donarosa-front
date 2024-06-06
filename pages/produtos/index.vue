<template>
    <v-row justify="center" class="mb-4">
        <v-col cols="12">
            <v-card class="p-3">
                <v-card-title>
                    <h4>Produtos</h4>
                    <v-spacer></v-spacer>
                    <v-text-field dense outlined v-model="search" append-icon="mdi-magnify" label="Pesquisar"
                        single-line hide-details>
                    </v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="listagem" :search="search" dense mobile-breakpoint="0"
                    :footer-props="tableFooterPros">
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">

                        <v-icon v-if="item.prod_imagem" @click="zoomImgClick(item)">mdi-eye</v-icon>

                        <v-icon @click.prevent="exibirItem(item)">mdi-pencil</v-icon>
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.ativo_status.descricao="{ item }">
                        <div :class="['justfy-center', corStatus(item.ativo_status_id)]">{{ item.ativo_status.descricao
                            }}</div>
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.id="{ item }">
                        {{ item.id | zeroLeft }}
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.vl_aluguel="{ item }">
                        {{ item.vl_aluguel | formatMoeda }}
                    </template>

                </v-data-table>
            </v-card>
        </v-col>

        <v-col cols="12">
            <v-card class="panel-bottom">
                <v-container>
                    <v-btn color="primary" elevation="2" outlined @click.prevent.stop="novoItem">Novo</v-btn>
                </v-container>
                <PreviewImg :open="openPreviewImg" :itemImg="itemImg" @close="openPreviewImg = false" />
            </v-card>
        </v-col>
        <produtosCadastro v-if="exibCadastro" :open="exibCadastro" @close="exibCadastro = false" @cancelar="cancelar"
            @atualizarListagem="atualizarListagem" @exibSnack="exibSnack" :isEdit="isEdit" :item="payload" />
    </v-row>
</template>

<script>
    import { produtoModel } from '~/models/ProdutoModel'
    export default {
        async asyncData({ $axios }) {
            let listagem = []
            try {
                const resposta = await $axios.$get('/produtos')
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
        name: 'produtos',

        data() {
            return {
                localImgs: 'http://localhost:3000/img/',
                openPreviewImg: false,
                itemImg: {},
                itemSelect: null,
                dlgConfirme: false,
                exibCadastro: false,
                isEdit: false,
                isLoading: false,
                search: '',
                headers: [
                    { text: 'Cód. Barras', value: 'cod_barras', align: 'left', margin: '12px' },
                    { text: 'Qtd', value: 'qtd_estoque', align: 'center' },
                    { text: 'Descrição', value: 'descricao', align: 'left' },
                    { text: 'Categoria', value: 'prod_categoria.descricao', align: 'center' },
                    { text: 'Cor', value: 'prod_cor.descricao', align: 'center' },
                    { text: 'Tamanho', value: 'prod_tamanho.descricao', align: 'center' },
                    { text: 'Compri.', value: 'prod_compri.descricao', align: 'center' },
                    { text: 'Fábrica', value: 'prod_fabrica.descricao', align: 'center' },
                    { text: 'Valor Aluguel', value: 'vl_aluguel', align: 'center' },
                    { text: 'Ações', value: 'actions', sortable: false, align: 'right' },
                ],
                exibLista: false,
                payload: produtoModel(),
                snack: {
                    active: false,
                    text: "teste",
                    timeout: 2000,
                    color: "primary"
                },
                tableFooterPros: {
                    itemsPerPageText: 'Itens por pág.',
                    itemsPerPageOptions: [50, 100, -1]
                }
            }
        },
        filters: {
            zeroLeft(num) {
                if (num)
                    return (num).toLocaleString('en-US', {
                        minimumIntegerDigits: 6,
                        useGrouping: false
                    })
            },
            formatMoeda(valor) {
                if (valor)
                    return valor.toLocaleString('pt-br', { minimumFractionDigits: 2 })
                return '0,00'
            }
        },
        methods: {
            zoomImgClick(item) {
                if (!item.prod_imagem) return
                this.itemImg.src = `${this.localImgs}${item?.prod_imagem}`
                this.openPreviewImg = true
            },
            corStatus(id) {
                if (id == 1) return 'green--text'
                if (id == 2) return 'red--text'
            },
            novoItem() {
                this.payload = produtoModel()
                this.isEdit = false
                this.exibCadastro = true
            },
            exibSnack(texto, cor) {
                this.snack.color = cor || ''
                this.snack.text = texto || ''
                this.snack.active = true
            },
            confirmeExclusao(item) {
                this.itemSelect = item
                this.dlgConfirme = true
            },
            async atualizarListagem() {
                try {
                    const resposta = await this.$axios.$get('/produtos')
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
            numberToFront(valor) {
                if (valor)
                    return valor.toLocaleString('pt-br', { minimumFractionDigits: 2 })
                return Number(0).toLocaleString('pt-br', { minimumFractionDigits: 2 })
            },
            async exibirItem(item) {
                const { id } = item
                try {
                    const payload = await this.$axios.$get(`/produto/${id}`)
                    this.payload = produtoModel(payload.dados.produto)
                    this.payload.vl_custo = this.numberToFront(this.payload.vl_custo)
                    this.payload.vl_aluguel = this.numberToFront(this.payload.vl_aluguel)
                    this.payload.vl_venda = this.numberToFront(this.payload.vl_venda)
                    this.exibCadastro = true
                    this.isEdit = true
                } catch (error) {
                    console.log(error);
                }
            },
            cancelar() {
                this.payload = produtoModel()
                this.exibCadastro = false
            }
        }
    }

</script>
<style>
    tbody tr:nth-of-type(odd) {
        background-color: rgba(192, 189, 189, 0.259);
    }

    tbody tr:hover {
        background-color: rgb(245, 223, 231) !important;
        cursor: default;

    }

</style>