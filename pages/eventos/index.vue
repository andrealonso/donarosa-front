<template>
    <v-row justify="center" class="mb-4">
        <v-col cols="12">
            <v-card class="p-3">
                <v-card-title>
                    <h4>Eventos</h4>
                    <v-spacer></v-spacer>
                    <v-text-field type="date" v-model="filtroData" ready-only label="Data" outlined dense single-line
                        hide-details></v-text-field>
                    <v-text-field dense outlined v-model="search" append-icon="mdi-magnify" label="Pesquisar"
                        single-line hide-details>
                    </v-text-field>
                </v-card-title>
                <v-data-table :footer-props="tableFooterPros" :headers="headers" :items="listagem" :search="search"
                    dense mobile-breakpoint="0">

                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.data="{ item }">
                        {{ item.data | formatData }}
                    </template>

                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                        <v-icon @click.prevent="exibirItem(item)">mdi-pencil</v-icon>
                        <!-- <v-icon @click.prevent="confirmeExcItem(item)">mdi-delete</v-icon> -->
                    </template>

                    <!-- eslint-disable-next-line -->
                    <template v-slot:item.id="{ item }">
                        {{ item.id | zeroLeft }}
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
        <eventosCadastro v-if="exibCadastro" :open="exibCadastro" @close="exibCadastro = false" @cancelar="cancelar"
            @atualizarListagem="atualizarListagem" :isEdit="isEdit" :item="payload"
            :listaTipoEvento="listaTipoEvento" />
        <v-col cols="12">
            <v-card class="panel-bottom">
                <v-container>
                    <v-btn color="primary" elevation="2" outlined @click.prevent.stop="novoItem">Novo</v-btn>
                    <v-btn color="primary" elevation="2" outlined @click.prevent.stop="teste">Teste</v-btn>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import moment from 'moment'
    import { eventoModel } from '~/models/EventoModel'
    export default {
        async asyncData({ $axios }) {
            // let listagem = []
            // try {
            //     const resposta = await $axios.$get('/eventos')
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
        name: 'eventos',

        data() {
            return {
                listagem: [],
                filtroData: null,
                tableFooterPros: {
                    itemsPerPageText: 'Itens por pág.',
                    itemsPerPageOptions: [50, 100, -1]
                },
                itemSelect: null,
                exibCadastro: false,
                isEdit: false,
                search: '',
                headers: [
                    { text: 'Código', value: 'id', align: 'left', margin: '12px' },
                    { text: 'Data', value: 'data', align: 'center' },
                    { text: 'Descrição', value: 'descricao', align: 'left' },
                    { text: 'Tipo', value: 'evento_tipo.descricao', align: 'left' },
                    { text: 'Ações', value: 'actions', sortable: false, align: 'right' },
                ],
                exibLista: false,
                payload: eventoModel(),
                listaTipoEvento: []

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
        watch: {
            filtroData() {
                this.filtrar()
            }
        },
        beforeMount() {
            this.atualizarListagem()
        },
        methods: {
            teste() {
                this.filtrar()
            },
            async excluirItem(id) {
                try {
                    const { id } = this.itemSelect
                    const del = await this.$axios.$delete(`/evento/${id}`)
                    this.$alertaSucesso('Registro excluído com sucesso!')
                    this.atualizarListagem()
                } catch (error) {
                    console.log(error);
                    this.$alertaErro('Não foi possível excluir o registro!')
                }
            },
            async atualizarListagem() {
                try {
                    this.listagem = []
                    const resposta = await this.$axios.$get('/eventos')
                    console.log(resposta);
                    if (!resposta?.erro) {
                        this.listagem = resposta.dados
                    } else {
                        this.listagem = []
                    }
                } catch (error) {
                    this.listagem = []
                    console.log({ error });
                }
            },
            async filtrar() {
                if (!this.filtroData) {
                    this.atualizarListagem()
                    return
                }
                try {
                    this.listagem = []
                    const resposta = await this.$axios.$get(`/eventos?busca=${this.filtroData}`)
                    if (!resposta?.erro) {
                        this.listagem = resposta.dados
                    } else {
                        this.listagem = []
                    }
                } catch (error) {
                    this.listagem = []
                    console.log({ error });
                }
            },
            async novoItem() {
                const { dados } = await this.$axios.$get(`/evento/00`)
                this.listaTipoEvento = dados.tipoEvento
                this.payload = eventoModel()
                this.isEdit = false
                this.exibCadastro = true
            },
            async exibirItem(item) {
                const { id } = item
                try {
                    const { dados } = await this.$axios.$get(`/evento/${id}`)
                    this.listaTipoEvento = dados.tipoEvento
                    this.payload = eventoModel(dados.evento)
                    this.payload.data = moment(dados.evento.data).format('YYYY-MM-DD')
                    this.exibCadastro = true
                    this.isEdit = true
                } catch (error) {
                    console.log(error);
                }
            },
            cancelar() {
                this.payload = eventoModel()
                this.exibCadastro = false
            }
        }
    }

</script>
