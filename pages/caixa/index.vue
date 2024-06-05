<template>
    <v-row justify="center" class="mb-4">
        <v-col cols="12">
            <v-card class="p-3">
                <v-card-title>
                    <v-row>
                        <v-col cols="12" sm="4" md="4">
                            <h4>Caixa - {{ caixaData | formatDataDisplay }}</h4>
                        </v-col>

                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined v-model="search" @change="calcValores" append-icon="mdi-magnify"
                                label="Pesquisar" single-line hide-details>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-row justify="center">
                    <v-col cols="3" class="text-center">
                        <h3>Créditos:</h3>
                        <div class="green--text">{{ totalCred | formatMoedaDisplay }}</div>
                    </v-col>
                    <v-col cols="3" class="text-center">
                        <h3>Débitos:</h3>
                        <div class="red--text">{{ totalDebt | formatMoedaDisplay }}</div>
                    </v-col>
                    <v-col cols="3" class="text-center">
                        <h3>Saldo:</h3>
                        <div :class="totalSaldo >= 0 ? 'green--text' : 'red--text'">{{ totalSaldo | formatMoedaDisplay }}
                        </div>
                    </v-col>
                </v-row>
                <v-data-table :item-class="rowClass" :headers="headers" :items="listagem" :search="search" dense
                    mobile-breakpoint="0" @current-items="calcValores">
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                        <v-icon @click.prevent="exibirItem(item)">mdi-pencil</v-icon>
                        <!-- <span>
                            <v-icon @click.prevent="confirmeExclusao(item)">mdi-delete</v-icon>
                        </span> -->
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
                    <template v-slot:item.data="{ item }">
                        {{ item.data | formatDataDisplay }}
                    </template>
                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.valor="{ item }">
                        {{ item.valor | formatMoedaDisplay }}
                    </template>
                </v-data-table>
            </v-card>
        </v-col>

        <v-col cols="12">
            <v-card class="panel-bottom d-print-none">
                <v-container>
                    <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="novoItem('e')">Entrada +
                    </v-btn>
                    <v-btn color="error" elevation="2" outlined dense @click.prevent.stop="novoItem('s')">
                        Saída -</v-btn>
                </v-container>
            </v-card>
        </v-col>

        <caixaCadastro v-if="exibCadastro" :open="exibCadastro" @close="exibCadastro = false" @cancelar="cancelar"
            @atualizarListagem="atualizarListagem" @exibSnack="exibSnack" :isEdit="isEdit" :item="payload"
            :listaSelecao="listaSelecao" />

        <DialogLoading v-if="isLoading" :is-loading="isLoading" :cor="'purple lighten-1'" :texto="'Atualizando dados...'" />
        <DialogConfirmacao v-if="dlgConfirme" :dlg-confirme="dlgConfirme" @nao="dlgConfirme = false" @sim="excluirItem"
            :cor="'red--text lighten-2'" titulo="Exclusão de registro."
            :texto="'Tem certeza que deseja excluir este registro?'" />

        <snackbar v-if="snack.active" :snack="snack" @close="snack.active = false" />
    </v-row>
</template>

<script>
import { caixaModel } from '~/models/CaixaModel'
import moment from 'moment'
import { VMoney } from 'v-money'

export default {
    directives: { money: VMoney },
    async asyncData({ $axios }) {
        let listagem = []

        try {
            const resposta = await $axios.$get('/caixas')
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
    name: 'caixas',

    data() {
        return {
            caixaData: moment(),
            totalDebt: 0.00,
            totalCred: 0.00,
            totalSaldo: 0.00,
            listaSelecao: {},
            itemSelect: null,
            dlgConfirme: false,
            exibCadastro: false,
            isEdit: false,
            isLoading: false,
            search: '',
            headers: [
                { text: 'Código', value: 'id', align: 'left', margin: '12px' },
                { text: 'Data', value: 'data', align: 'left' },
                { text: 'Categoria', value: 'caixa_cate.descricao', align: 'left' },
                { text: 'Descrição', value: 'descricao', align: 'center' },
                { text: 'Valor', value: 'valor', align: 'center' },
                { text: 'Forma', value: 'caixa_form_pag.descricao', align: 'center' },
                { text: 'Usuario', value: 'usuario.login', align: 'center' },
                { text: 'Ações', value: 'actions', sortable: false, align: 'right' },
            ],
            exibLista: false,
            payload: caixaModel(),
            snack: {
                active: false,
                text: "teste",
                timeout: 2000,
                color: "primary"
            }
        }
    },
    filters: {
        teste(event) {
            console.log(event);
        },
        zeroLeft(num) {
            return (num).toLocaleString('en-US', {
                minimumIntegerDigits: 6,
                useGrouping: false
            })
        },
        formatDataDisplay(data) {
            return moment.utc(data).format('DD/MM/YYYY')
        },
        formatMoedaDisplay(valor) {
            return parseFloat(valor).toLocaleString('pt-br', { minimumFractionDigits: 2 })
        },
    },
    methods: {
        teste(lista) {
            console.log(lista);
        },

        calcValores(lista) {
            if (typeof lista === 'string')
                return
            let cred = 0, debt = 0, sald = 0
            const valores = lista.map((item, idx) => parseFloat(item.valor))
            valores.forEach(item => {
                if (item > 0)
                    cred += item
                if (item < 0)
                    debt += item
            })
            sald = cred + debt
            this.totalCred = cred.toFixed(2)
            this.totalDebt = debt.toFixed(2)
            this.totalSaldo = sald.toFixed(2)
        },
        rowClass(item) {
            return item.valor < 0 ? 'row-saidas' : 'row-entradas'
        },
        corStatus(id) {
            if (id == 1) return 'green--text'
            if (id == 2) return 'red--text'
        },
        async novoItem(operacao) {
            const { categoria, formapag } = await this.$axios.$get('/caixa/0')
            this.listaSelecao = { categoria, formapag }
            this.payload = caixaModel()
            this.payload.caixa_operacao_id = operacao === 'e' ? 1 : 2
            this.payload.data = moment.utc().format('YYYY-MM-DD')
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
                const resposta = await this.$axios.$get('/caixas')
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

        async exibirItem(item) {
            const { id } = item
            try {
                const { categoria, formapag } = await this.$axios.$get('/caixa/0')
                this.listaSelecao = { categoria, formapag }
                const payload = await this.$axios.$get(`/caixa/${id}`)
                this.payload = caixaModel(payload.dados)
                this.payload.valor = parseFloat(this.payload.valor).toFixed(2)
                this.exibCadastro = true
                this.isEdit = true
            } catch (error) {
                console.log(error);
            }
        },
        cancelar() {
            this.payload = caixaModel()
            this.exibCadastro = false
        }
    }
}

</script>
<style>
.row-saidas {
    color: red;
}

.row-entradas {
    color: green;
}
</style>