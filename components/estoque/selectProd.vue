<template>
    <v-dialog v-model="open" persistent>
        <v-card class="p-3">
            <v-card-title :class="isEntrada ? 'green--text' : 'red--text'">
                <h4>{{ `Selecione um produto dar ${isEntrada ? 'entrada.' : 'saída.'}` }}</h4>
                <v-spacer></v-spacer>
                <v-text-field dense outlined v-model="search" append-icon="mdi-magnify" label="Pesquisar" single-line
                    hide-details>
                </v-text-field>
            </v-card-title>
            <v-data-table @dblclick:row="lancProd" :headers="headers" :items="listagem" :search="search" dense
                mobile-breakpoint="400">
                <!-- eslint-disable-next-line -->
                <template v-slot:item.id="{ item }">
                    {{ item.id | zeroLeft }}
                </template>
            </v-data-table>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" elevation="2" outlined dense @click.prevent.stop="cancelar">
                    Cancelar</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
import moment from 'moment'
export default {

    props: ['open', 'listagem', 'isEntrada'],
    data() {
        return {
            pordSelecionado: {},
            search: '',
            headers: [
                { text: 'Cód. Barras', value: 'cod_barras', align: 'left', margin: '12px' },
                { text: 'Descrição', value: 'descricao', align: 'left' },
                { text: 'Categoria', value: 'prod_categoria.descricao', align: 'center' },
                { text: 'Cor', value: 'prod_cor.descricao', align: 'center' },
                { text: 'Qtd', value: 'qtd_estoque', align: 'center' },
                { text: 'Valor Aluguel', value: 'vl_aluguel', align: 'center' },
                { text: 'Tamanho', value: 'prod_tamanho.descricao', align: 'center' },
                { text: 'Compri.', value: 'prod_compri.descricao', align: 'center' },
                { text: 'Fábrica', value: 'prod_fabrica.descricao', align: 'center' },
                { text: 'Ações', value: 'actions', sortable: false, align: 'right' },
            ],
        }
    },
    methods: {
        cancelar() {
            this.$emit('close')
        },
        lancProd(event, { item }) {
            this.$emit('lancProd', item)
            this.$emit('close')
        }
    }
}
</script>

<style></style>