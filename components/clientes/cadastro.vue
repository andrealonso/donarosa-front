<template>
    <v-dialog v-model="open" persistent>
        <v-card>
            <v-card-title>
                Cadastro de Clientes
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="5">
                                <v-text-field :rules="[rules.required, rules.counter]" v-model="item.nome" label="Nome"
                                    outlined dense required validate-on-blur></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                                <v-text-field :rules="[rules.required]" validate-on-blur v-model="item.cpf" label="CPF"
                                    outlined dense v-mask="['###.###.###-##']" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="item.dt_nasc" type="date" label="Data de Nasc." outlined
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field :rules="[rules.required]" validate-on-blur v-model="item.tel"
                                    label="Telefone" outlined dense v-mask="['(##)#####-####']"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field type="email" v-model="item.email" label="Email" outlined
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete :rules="[]" label="Sexo" outlined auto-select-first dense
                                    :items="listaSelecao.sexo" :item-text="item => item.descricao"
                                    :item-value="item => item.id" v-model="item.sexo_id">
                                </v-autocomplete>
                            </v-col>

                            <v-col cols="12" sm="6" md="2">
                                <v-text-field v-mask="['#####-###']" v-model="item.cep" label="CEP" outlined dense
                                    @blur="consultaCep"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="8">
                                <v-text-field v-model="item.rua" label="Rua" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field ref="inputNum" v-model="item.num" label="Núm." outlined
                                    dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                                <v-text-field v-model="item.bairro" label="Bairro" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                                <v-text-field v-model="item.cidade" label="Cidade" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-text-field v-model="item.uf" label="UF" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea outlined dense v-model="item.obs" label="Obsevações"></v-textarea>
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
        props: ['item', 'isEdit', 'open'],
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
                    email: value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Email inválido'
                    },
                    cpfValido: value => this.$cpfValido(value) || 'CPF inválido!',
                    senhaDiferente: value => this.comparaSenha(value) || 'Senha não confere! Repita a mesma senha.'
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
            computedDataNasc() {
                moment.locale('pt-br')
                console.log(this.item.dt_nasc);
                return this.item.dt_nasc ? moment.utc(this.item.data_inicio).format('L') : ''

            },
        },
        methods: {
            testeCpfCnpj(num) {
                if (num.length > 14) {
                    return this.$cnpjValido(num)
                } else {
                    return this.$cpfValido(num)
                }
            },
            async consultaCep() {
                const result = await this.$buscaCep(this.item.cep)
                if (result) {
                    this.item.rua = result?.logradouro || null
                    this.item.bairro = result?.bairro || null
                    this.item.cidade = result?.localidade || null
                    this.item.uf = result?.uf || null
                    this.$refs.inputNum.focus()
                } else {
                    this.$alertaErro('CEP inválido ou não encontrado!')
                    this.limparEndereco()
                }
            },

            corStatus(id) {
                if (id == 1) return 'green--text'
                if (id == 2) return 'red--text'
            },

            async salvarItem() {
                if (!this.$refs.form.validate()) {
                    return
                }
                if (this.foiAlterado()) {
                    if (!this.isEdit) {
                        await this.createItem(this.item)
                    } else {
                        await this.updateItem(this.item)
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
                    await this.$store.dispatch('clientes/create', item)
                    await this.$store.dispatch('clientes/getListagem')
                    this.$alertaSucesso()
                    this.$emit('close')
                } catch (error) {
                    this.$alertaErro()
                    console.log(error);
                }
            },
            async updateItem(item) {
                try {
                    await this.$store.dispatch('clientes/update', item)
                    await this.$store.dispatch('clientes/getListagem')
                    this.$alertaSucesso()
                    this.$emit('close')
                } catch (error) {
                    this.$alertaErro()
                }
            },
            cancelarRegistro() {
                this.$emit('close')
            },
            limparEndereco() {
                this.item.rua = null
                this.item.bairro = null
                this.item.cidade = null
                this.item.uf = null
            },
            async deleteItem(item) {
                if (await this.$confirmaExclusao()) {
                    try {
                        await this.$store.dispatch('clientes/delete', item)
                        this.$emit('close')
                        this.$alertaSucesso('Registro excuído com sucesso!')
                    } catch (error) {
                        this.$alertaErro('Não foi possível excluir o registro!')
                        console.log(error);
                    }
                }
            },
        }
    }
</script>

<style></style>