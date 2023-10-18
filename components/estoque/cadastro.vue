<template>
    <v-dialog v-model="open" persistent>
        <v-card>
            <v-card-title :class="item.estoque_oper_id === 1 ? 'green--text' : 'red--text'">
                {{ item.estoque_oper_id === 1 ? 'Lançar uma entrada' : 'Lançar uma saída' }}
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field :rules="[rules.required]" readonly hide-spin-buttons :value="cptNomeProd"
                                    label="Produto selecionado" outlined dense></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="item.data" type="date" label="Data" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field type="number" :rules="[rules.notZero]" hide-spin-buttons v-model="item.qtd"
                                    label="Qtd" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="7">
                                <v-text-field :rules="[rules.required, rules.counter]" v-model="item.descricao"
                                    label="Descrição" outlined dense required validate-on-blur></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="salvarItem(item)">Salvar
                </v-btn>
                <v-btn color="secondary" elevation="2" outlined dense @click.prevent.stop="cancelarRegistro">
                    Cancelar</v-btn>
                <v-btn color="error" elevation="2" outlined dense @click.prevent.stop="deleteItem(item)"
                    :disabled="!isEdit">Excluir
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
    props: ['item', 'isEdit', 'open', 'produto'],
    data() {
        return {
            menu1: false,
            dataNasc: '1981-09-30',
            valid: true,
            tituloPagina: 'Cadastro de Proprietários',
            itemOld: { ...this.item },
            status: [
                { id: 1, descri: "ATIVO" },
                { id: 2, descri: "INATIVO" }
            ],
            rules: {
                required: value => !!value || 'Requerido!',
                counter: value => value.length >= 6 || 'Min. de 6 dígitos!',
                notZero: value => value !== 0 || 'A quantidade não pode ser zero!'
            },
            listaSelecao: {
                sexo: [
                    { id: 1, descricao: "Masculino" },
                    { id: 2, descricao: "Feminino" }
                ]
            }
        }
    },
    computed: {
        cptNomeProd() {
            const { cod_barras, descricao, prod_cor, prod_compri, prod_tamanho } = this.produto
            // let codbarras, nome, cor, compri, tamanho
            let nomeProd = [cod_barras, descricao, prod_cor?.descricao, prod_compri?.descricao, prod_tamanho?.descricao]
            return nomeProd.join(' ')
        }
    },
    methods: {

        async salvarItem(item) {
            try {
                if (!this.$refs.form.validate()) {
                    return
                } else {
                    if (item.estoque_oper_id === 1 && item.qtd < 0) item.qtd = item.qtd * -1
                    if (item.estoque_oper_id === 2 && item.qtd > 0) item.qtd = item.qtd * -1
                    delete item.id
                    const { dados } = await this.$axios.$post(`/estoque`, item,)

                    this.$emit('atualizar', dados)
                    this.$emit('close')
                    this.exibSnack('Registro salvo com sucesso!', 'success')
                }
            } catch (error) {
                this.exibSnack('Não foi possível salvar o registro! Verifique o nome ou cpf já foram cadastrados', 'red lighten-2')
                console.log(error);
            }
        },
        foiAlterado() {
            if (JSON.stringify(this.itemOld) === JSON.stringify(this.item))
                return false
            return true
        },

        cancelarRegistro() {
            this.$emit('close')
        },
        async deleteItem(item) {
            try {
                await this.$axios.$delete(`/estoque/${item.id}`)
                this.$emit('atualizarListagem')
                this.$emit('close')
                this.exibSnack('Registro exluído com sucesso!', 'success')
            } catch (error) {
                this.exibSnack('Não foi possível excluir o registro!', 'error')
                console.log(error);
            }
        },

        exibSnack(texto, cor) {
            this.$emit('exibSnack', texto, cor)
        }


    }
}
</script>

<style>
.v-card--reveal {
    bottom: 0;
    opacity: 1 !important;
    position: absolute;
    width: 100%;
}
</style>