<template>
    <v-dialog v-model="open" persistent>
        <v-card>
            <v-card-title>
                Cadastro de Eventos
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" sm="12" md="6">
                                <v-text-field type="date" :rules="[rules.required]" v-model="item.data" label="Data"
                                    outlined dense required validate-on-blur> </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-autocomplete :rules="[rules.required]" label="Tipo do evento" outlined
                                    auto-select-first dense :items="listaTipoEvento" :item-text="item => item.descricao"
                                    :item-value="item => item.id" v-model="item.evento_tipo_id">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field :rules="[rules.required, rules.counter]" v-model="item.descricao"
                                    label="Descrição" outlined dense required validate-on-blur></v-text-field>
                            </v-col>

                        </v-row>
                    </v-container>
                </v-form>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="salvarItem('')">Salvar
                </v-btn>

                <v-btn color="secondary" elevation="2" outlined dense @click.prevent.stop="cancelarRegistro">
                    Cancelar</v-btn>
                <v-btn color="error" elevation="2" outlined dense @click.prevent.stop="deleteItem"
                    :disabled="!isEdit">Excluir
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    import moment from 'moment'
    import { estoqueModel } from '~/models/EstoqueModel'
    import { VMoney } from 'v-money'

    export default {
        directives: { money: VMoney },
        props: ['item', 'isEdit', 'open', 'listaTipoEvento', 'dataEvento'],
        data() {
            return {
                itemOld: { ...this.item },
                valid: true,
                rules: {
                    required: value => !!value || 'Requerido!',
                    counter: value => value.length >= 6 || 'Min. de 6 dígitos!',
                },

            }
        },
        beforeMount() {
            if (this.dataEvento)
                this.item.data = this.dataEvento
        },
        methods: {
            async salvarItem(sair) {

                let item = { ...this.item }

                if (!this.$refs.form.validate()) {
                    return
                }
                if (this.foiAlterado()) {
                    if (!this.isEdit) {
                        this.createItem(item)
                    } else {
                        this.updateItem(item)
                    }
                } else {
                    this.$emit('close')
                    this.$alertaSucesso()
                }
            },

            foiAlterado() {
                if (JSON.stringify(this.itemOld) === JSON.stringify(this.item))
                    return false
                return true
            },

            async createItem(item) {
                try {
                    delete item.id
                    const { dados } = await this.$axios.$post(`/evento`, item,)
                    console.log(dados);
                    this.$emit('atualizarListagem', dados)
                    this.$emit('close')
                    this.$alertaSucesso()
                } catch (error) {
                    this.$alertaErro('O evento já existe ou ocorreu um erro no servidor!')
                    console.log(error);
                }
            },
            async updateItem(item) {
                try {
                    await this.$axios.$put(`/evento/${item.id}`, item)
                    this.$emit('atualizarListagem')
                    this.$emit('close')
                    this.$alertaSucesso()
                } catch (error) {
                    this.$alertaErro()
                    console.log(error);
                }
            },
            cancelarRegistro() {
                this.$emit('close')
            },
            async deleteItem() {
                if (await this.$confirmaExclusao()) {
                    try {
                        await this.$axios.$delete(`/evento/${this.item.id}`)
                        this.$emit('atualizarListagem')
                        this.$emit('close')
                        this.$alertaSucesso('Registro excluído com sucesso')
                    } catch (error) {
                        this.$alertaErro()
                        console.log(error);
                    }
                }
            },


        }
    }
</script>
