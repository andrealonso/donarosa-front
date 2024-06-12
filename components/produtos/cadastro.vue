<template>
    <v-dialog v-model="open" persistent>
        <v-card>
            <v-card-title>
                Cadastro de Produtos
            </v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" sm="12" md="8">
                                <v-row>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-text-field v-model="item.cod_barras" label="Cód. Barras" outlined
                                            dense></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <v-text-field :rules="[rules.required, rules.counter]" v-model="item.descricao"
                                            label="Descrição" outlined dense required validate-on-blur></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Categoria" outlined auto-select-first dense
                                            :items="listaAuxiliares.categorias" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_categoria_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Cor" outlined auto-select-first dense
                                            :items="listaAuxiliares.cores" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_cor_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Fábrica" outlined auto-select-first dense
                                            :items="listaAuxiliares.fabricas" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_fabrica_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Tamanho" outlined auto-select-first dense
                                            :items="listaAuxiliares.tamanhos" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_tamanho_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Comprimento" outlined auto-select-first dense
                                            :items="listaAuxiliares.comprimentos" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_compri_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-text-field v-money="money" v-model="item.vl_custo" label="Valor Custo"
                                            outlined dense></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-text-field v-money="money" v-model="item.vl_venda" label="Valor Venda"
                                            outlined dense></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-text-field v-money="money" v-model="item.vl_aluguel" label="Valor Aluguel"
                                            outlined dense></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3" class="d-flex">
                                        <v-text-field readonly type="number" hide-spin-buttons
                                            v-model="item.qtd_estoque" label="Qtd. Estoque" outlined
                                            dense></v-text-field>
                                        <v-btn icon>
                                            <v-icon large @click="selectProd('e')">mdi-plus</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon large @click="selectProd('s')">mdi-minus</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="d-flex justify-center">
                                <v-card class="pa-2" max-height="580">
                                    <v-card @click="zoomImgClick" width="350" height="500" color="#424242">
                                        <v-img class="img-zoom" contain width="349" height="499"
                                            :src="item?.prod_imagem ? `${localImgs}${item?.prod_imagem}` : `${imgPadrao}`"></v-img>
                                    </v-card>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-file-input v-show="false" id="fileinput" v-model="file" accept="image/*"
                                            @change="uploadImg"></v-file-input>

                                        <v-btn icon>
                                            <v-icon large @click="alterarImg">mdi-pencil</v-icon>
                                        </v-btn>

                                        <v-btn icon>
                                            <v-icon large @click="excluirImg">mdi-delete</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>

            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="salvarItem('')">Salvar
                </v-btn>
                <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="salvarItem('sair')">Salvar e
                    sair
                </v-btn>
                <v-btn color="secondary" elevation="2" outlined dense @click.prevent.stop="cancelarRegistro">
                    Cancelar</v-btn>
                <v-btn color="error" elevation="2" outlined dense @click.prevent.stop="deleteItem"
                    :disabled="!isEdit">Excluir
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        <estoqueCadastro v-if="exibCadEstoque" :open="exibCadEstoque" @close="exibCadEstoque = false"
            @atualizar="atualizaQtdEst" @exibSnack="exibSnack" :isEdit="isEdit" :item="payloadEstoque"
            :produto="prodSelecionado" />
        <PreviewImg :open="openPreviewImg" :itemImg="itemImg" @close="openPreviewImg = false" />
    </v-dialog>
</template>

<script>
    import moment from 'moment'
    import { estoqueModel } from '~/models/EstoqueModel'
    import { VMoney } from 'v-money'

    export default {
        directives: { money: VMoney },
        props: ['item', 'isEdit', 'open', 'listaAuxiliares'],
        data() {
            return {
                salvarSair: false,
                imgPadrao: 'http://localhost:3000/img/img-padrao.svg',
                vlAluguel: null,
                vlCusto: null,
                vlVenda: null,
                confirmeExcImg: false,
                confirmeExcItem: false,
                openPreviewImg: false,
                itemImg: {},
                itemOld: { ...this.item },
                valid: true,
                widthImg: '100%',
                imgIndex: 0,
                listImgs: [],
                isLancEntrada: false,
                exibCadEstoque: false,
                payloadEstoque: {},
                prodSelecionado: {},
                previewSRC: "https://placehold.co/600x400",
                localImgs: 'http://localhost:3000/img/',
                money: {
                    decimal: ',',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 2,
                    masked: false /* doesn't work with directive */
                },
                listPadrao: [
                    { id: 0, lado: 'frente', src: null },
                    { id: 0, lado: 'verso', src: null },
                ],
                file: null,
                status: [
                    { id: 1, descri: "ATIVO" },
                    { id: 2, descri: "INATIVO" }
                ],
                rules: {
                    required: value => !!value || 'Requerido!',
                    counter: value => value.length >= 6 || 'Min. de 6 dígitos!',
                },

            }
        },
        methods: {
            async selectProd(operacao) {
                if (!this.item?.id) {
                    this.$alertaErro('Salve o registro antes de presseguir!')
                    return
                }
                this.isLancEntrada = operacao === 'e' ? true : false
                this.lancEstoque(this.item)
                return
            },
            lancEstoque(produto) {
                let estoque = estoqueModel()
                estoque.produto_id = produto.id
                estoque.estoque_oper_id = this.isLancEntrada ? 1 : 2
                estoque.data = moment.utc().format('YYYY-MM-DD')
                this.prodSelecionado = produto
                this.payloadEstoque = estoque
                this.exibCadEstoque = true
            },
            atualizaQtdEst(produto) {
                if (produto)
                    this.item.qtd_estoque = produto.qtd_estoque
                this.$emit('atualizarListagem')
            },


            async uploadImg() {
                // this.previewSRC = URL.createObjectURL(this.file)
                // URL.revokeObjectURL(this.file) //Liberar memoria
                console.log('dados');
                try {
                    const { dados } = await this.$uploadFile(this.item.id, 'frente', this.file)
                    console.log(dados);
                    if (dados) {
                        this.item.prod_imagem = dados.prod_imagem
                        return
                    }
                    this.$alertaErro('Não foi possível salvar a imagem! Verifique o tamanho.')
                    // this.exibSnack('Não foi possível salvar a imagem! Verifique o tamanho.', 'error')
                } catch (error) {
                    console.log(error);
                }
            },
            alterarImg() {
                if (!this.item?.id) {
                    this.$alertaErro('Salve o registro antes de presseguir!')
                    return
                }
                const input = document.getElementById('fileinput')
                input.click()
            },
            async excluirImg(index) {
                if (this.item.prod_imagem) {
                    if (await this.$confirmaExclusao('Tem certeza que deseja excluir a imagem do produto?', 'Exclusão da imagem')) {
                        const del = await this.$axios.$delete(`/file/img/${this.item.id}`)
                        this.item.prod_imagem = null
                    }
                }
            },
            async getListImgs() {
                if (!this.isEdit) {
                    this.listImgs = this.listPadrao
                    return
                }
                const list = await this.$axios.$get(`/files/imgs?produto_id=${this.item.id}`)

            },
            zoomImgClick() {
                if (!this.item.prod_imagem) return
                this.itemImg.src = `${this.localImgs}${this.item?.prod_imagem}`
                this.openPreviewImg = true
            },

            corStatus(id) {
                if (id == 1) return 'green--text'
                if (id == 2) return 'red--text'
            },
            numberToBack(valor) {
                if (valor)
                    return parseFloat(valor.replaceAll('.', '').replace(',', '.'))
                return null
            },


            async salvarItem(sair) {
                console.log(this.isEdit);
                if (sair) {
                    this.salvarSair = true
                } else {
                    this.salvarSair = false
                }
                const { vl_custo, vl_aluguel, vl_venda } = this.item
                let item = { ...this.item }
                item.vl_custo = this.numberToBack(vl_custo)
                item.vl_aluguel = this.numberToBack(vl_aluguel)
                item.vl_venda = this.numberToBack(vl_venda)
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
                    if (sair) {
                        this.$emit('close')
                    }
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
                    console.log('criar');
                    delete item.id
                    const { dados } = await this.$axios.$post(`/produto`, item,)
                    console.log('result', dados);
                    this.item.id = dados.id
                    this.$emit('registroSalvo')
                    this.$emit('atualizarListagem')
                    if (this.salvarSair)
                        this.$emit('close')
                    this.$alertaSucesso()
                } catch (error) {
                    this.$alertaErro()
                    console.log(error);
                }
            },
            async updateItem(item) {
                try {
                    console.log('updt');
                    await this.$axios.$put(`/produto/${item.id}`, item)
                    this.$emit('atualizarListagem')
                    if (this.salvarSair)
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
                        await this.$axios.$delete(`/produto/${this.item.id}`)
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

<style>
    .img-zoom:hover {
        cursor: zoom-in;
    }
</style>