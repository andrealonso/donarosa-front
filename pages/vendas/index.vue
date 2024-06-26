<template>
    <v-row justify="center" class="mb-4">
        <v-col cols="12">
            <v-card class="p-3">
                <v-card-title>
                    <h4>Vendas</h4>
                    <v-spacer></v-spacer>
                    <v-text-field dense outlined v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line
                        hide-details>
                    </v-text-field>
                </v-card-title>
                <v-data-table :headers="headers" :items="listagem" :search="search" dense mobile-breakpoint="400">
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
                </v-data-table>
            </v-card>
        </v-col>

        <v-col cols="12">
            <v-card class="panel-bottom">
                <v-container>
                    <v-btn color="primary" elevation="2" outlined @click.prevent.stop="novoItem">Novo</v-btn>
                </v-container>
            </v-card>
        </v-col>

        <vendaCadastro v-if="exibCadastro" :open="exibCadastro" @close="exibCadastro = false" @cancelar="cancelar"
            @atualizarListagem="atualizarListagem" @exibSnack="exibSnack" :isEdit="isEdit" :item="payload" />


        <DialogLoading v-if="isLoading" :is-loading="isLoading" :cor="'purple lighten-1'" :texto="'Atualizando dados...'" />
        <DialogConfirmacao v-if="dlgConfirme" :dlg-confirme="dlgConfirme" @nao="dlgConfirme = false" @sim="excluirItem"
            :cor="'red--text lighten-2'" titulo="Exclusão de registro."
            :texto="'Tem certeza que deseja excluir este registro?'" />

        <snackbar v-if="snack.active" :snack="snack" @close="snack.active = false" />

    </v-row>
</template>

<script>
import { clienteModel } from '~/models/ClienteModel'
export default {
    async asyncData({ $axios }) {
        let listagem = []
        try {
            const resposta = await $axios.$get('/clientes')
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
            itemSelect: null,
            dlgConfirme: false,
            exibCadastro: false,
            isEdit: false,
            isLoading: false,
            search: '',
            headers: [
                { text: 'Código', value: 'id', align: 'left', margin: '12px' },
                { text: 'Nome', value: 'nome', align: 'left' },
                { text: 'Telefone', value: 'tel', align: 'center' },
                { text: 'Email', value: 'email', align: 'center' },
                { text: 'Ações', value: 'actions', sortable: false, align: 'right' },
            ],
            exibLista: false,
            payload: clienteModel(),
            snack: {
                active: false,
                text: "teste",
                timeout: 2000,
                color: "primary"
            }
        }
    },
    filters: {
        zeroLeft(num) {
            return (num).toLocaleString('en-US', {
                minimumIntegerDigits: 6,
                useGrouping: false
            })
        }
    },
    methods: {
        corStatus(id) {
            if (id == 1) return 'green--text'
            if (id == 2) return 'red--text'
        },
        novoItem() {
            this.payload = clienteModel()
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
                const resposta = await this.$axios.$get('/clientes')
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
                const payload = await this.$axios.$get(`/cliente/${id}`)
                this.payload = clienteModel(payload.dados)
                this.exibCadastro = true
                this.isEdit = true
            } catch (error) {
                console.log(error);
            }
        },
        cancelar() {
            this.payload = clienteModel()
            this.exibCadastro = false
        }
    }
}

</script>
