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
                                            :items="listaSelecao.prod_categoria" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_categoria_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Cor" outlined auto-select-first dense
                                            :items="listaSelecao.prod_cor" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_cor_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Fábrica" outlined auto-select-first dense
                                            :items="listaSelecao.prod_fabrica" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_fabrica_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Tamanho" outlined auto-select-first dense
                                            :items="listaSelecao.prod_tamanho" :item-text="item => item.descricao"
                                            :item-value="item => item.id" v-model="item.prod_tamanho_id">
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="3">
                                        <v-autocomplete :rules="[]" label="Comprimento" outlined auto-select-first dense
                                            :items="listaSelecao.prod_compri" :item-text="item => item.descricao"
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

                                    <v-col cols="12">
                                        <v-row>
                                            <v-col cols="12" md="3" class="d-flex">
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

                                    <v-col cols="12" sm="12" md="3">
                                        <v-file-input v-show="false" accept=".jpg,.jpeg,.png" hide-input id="fileInput"
                                            @change="uploadImg">
                                        </v-file-input>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="12" md="4" class="d-flex justify-center">
                                <v-card class="pa-2" max-height="580">
                                    <v-carousel hide-delimiters v-model="imgIndex">
                                        <v-carousel-item v-for="(item, i) in listImgs" :key="i" class="text-center">
                                            <v-card @click="zoomImgClick(i)" width="350" height="500"
                                                class="d-flex flex-column" color="#424242">
                                                <v-img class="img-zoom"
                                                    :src="item.src ? item.src : 'http://localhost:3000/img/img-padrao.svg'"></v-img>

                                                <v-sheet class="text-subtitle-2">{{
        item.lado?.toUpperCase()
    }}</v-sheet>
                                            </v-card>
                                        </v-carousel-item>
                                    </v-carousel>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-file-input v-show="false" id="file-input" v-model="file"
                                            @change="uploadImg">convertCamposMoeda</v-file-input>
                                        <v-btn icon>
                                            <v-icon large @click="alterarImg(imgIndex)">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon>
                                            <v-icon large @click="dlgConfImg">mdi-delete</v-icon>
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
                <v-btn color="success" elevation="2" outlined dense @click.prevent.stop="salvarItem(item)">Salvar
                </v-btn>
                <v-btn color="secondary" elevation="2" outlined dense @click.prevent.stop="cancelarRegistro">
                    Cancelar</v-btn>
                <v-btn color="error" elevation="2" outlined dense @click.prevent.stop="dlgConfItem"
                    :disabled="!isEdit">Excluir
                </v-btn>

                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        <estoqueCadastro v-if="exibCadEstoque" :open="exibCadEstoque" @close="exibCadEstoque = false"
            @atualizar="atualizaQtdEst" @exibSnack="exibSnack" :isEdit="isEdit" :item="payloadEstoque"
            :produto="prodSelecionado" />
        <DialogConfirme v-if="confirmeExcImg" :dlgConfirme="dlgConfirme" :open="confirmeExcImg"
            @nao="confirmeExcImg = false" @sim="excluirImg(imgIndex)" />
        <DialogConfirme v-if="confirmeExcItem" :dlgConfirme="dlgConfirme" :open="confirmeExcItem"
            @nao="confirmeExcItem = false" @sim="deleteItem(item)" />
        <PreviewImg :open="openPreviewImg" :itemImg="itemImg" @close="openPreviewImg = false" />
    </v-dialog>
</template>

<script>
    import moment from 'moment'
    import { estoqueModel } from '~/models/EstoqueModel'
    import { VMoney } from 'v-money'

    export default {
        directives: { money: VMoney },
        props: ['item', 'isEdit', 'open'],
        async beforeMount() {
            await this.getListImgs()
        },
        data() {
            return {
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
                dlgConfirme: {
                    titulo: '',
                    texto: "",
                    color: 'red--text lighten-2'
                },

                listaSelecao: {
                    prod_cor: [
                        { id: 1, descricao: "VERMELHO" },
                        { id: 2, descricao: "PRETO" },
                        { id: 3, descricao: "BRANCO" },
                    ],
                    prod_fabrica: [
                        { id: 1, descricao: "Fabrica4" },
                        { id: 2, descricao: "Fabrica2" },
                        { id: 3, descricao: "Fabrica3" },
                    ],
                    prod_categoria: [
                        { id: 1, descricao: "Vestidos" },
                        { id: 2, descricao: "Ternos" },
                        { id: 3, descricao: "Bolças" },
                    ],
                    prod_tamanho: [
                        { id: 1, descricao: "PP" },
                        { id: 2, descricao: "P" },
                        { id: 3, descricao: "M" },
                        { id: 4, descricao: "G" },
                        { id: 5, descricao: "XG" },
                        { id: 6, descricao: "GG" },
                        { id: 7, descricao: "PS" },
                    ],
                    prod_compri: [
                        { id: 1, descricao: "CURTO" },
                        { id: 2, descricao: "LONGO" }
                    ],
                }
            }
        },
        methods: {

            async selectProd(operacao) {
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

            dlgConfImg() {
                const file = this.listImgs[this.imgIndex]
                if (!file.src) return
                this.dlgConfirme.titulo = 'Exclusão de imagem'
                this.dlgConfirme.texto = 'Tem certesa que deseja excluir esta imagem?'
                this.dlgConfirme.cor = 'error'
                this.confirmeExcImg = true
            },
            dlgConfItem() {
                this.dlgConfirme.titulo = 'Exclusão de registro'
                this.dlgConfirme.texto = 'Tem certesa que deseja excluir este registro?'
                this.dlgConfirme.cor = 'error'
                this.confirmeExcItem = true
            },

            async uploadImg() {
                const fileInfo = this.listImgs[this.imgIndex]
                // this.previewSRC = URL.createObjectURL(this.file)
                // URL.revokeObjectURL(this.file) //Liberar memoria
                try {
                    const fileInfo = this.listImgs[this.imgIndex]
                    const success = await this.$uploadFile(this.item.id, fileInfo.lado, this.file)
                    if (success) {
                        this.getListImgs()
                        return
                    }
                    this.$alertaErro('Não foi possível salvar a imagem! Verifique o tamanho.')
                    // this.exibSnack('Não foi possível salvar a imagem! Verifique o tamanho.', 'error')
                } catch (error) {
                    console.log(error);
                }
            },
            alterarImg(index) {
                // console.log('alterar', this.listImgs[index]);
                const input = document.getElementById('file-input')
                input.click()
            },
            async excluirImg(index) {
                this.confirmeExcImg = false
                const file = this.listImgs[index]
                if (file.src) {
                    const del = await this.$axios.$delete(`/file/img/${file.id}`)
                    this.getListImgs()
                }
            },
            async getListImgs() {
                if (!this.isEdit) {
                    this.listImgs = this.listPadrao
                    return
                }
                const list = await this.$axios.$get(`/files/imgs?produto_id=${this.item.id}`)
                if (list) {
                    this.ordenarListImg(list.dados)
                }
            },
            zoomImgClick(index) {
                this.itemImg = this.listImgs[index]
                if (!this.itemImg.src) return
                this.openPreviewImg = true
            },
            ordenarListImg(list) {
                let frente = list.filter(item => item.lado === 'frente')[0]
                let verso = list.filter(item => item.lado === 'verso')[0]

                if (frente) {
                    frente.src = `http://localhost:3000/img/${frente.nome}`
                } else {
                    frente = { id: null, lado: 'frente', scr: null }
                }

                if (verso) {
                    verso.src = `http://localhost:3000/img/${verso.nome}`
                } else {
                    verso = { id: null, lado: 'verso', scr: null }
                }
                this.listImgs = [frente, verso]
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
            convertCamposMoeda() {
                // this.item.vl_custo = Number(this.item.vl_custo).toFixed(2)
                // this.item.vl_aluguel = Number(this.item.vl_aluguel).toFixed(2)
                // this.item.vl_venda = Number(this.item.vl_venda).toFixed(2)
            },

            async salvarItem() {
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
                    await this.$axios.$post(`/produto`, item,)
                    this.$emit('atualizarListagem')
                    this.$emit('close')
                    this.$alertaSucesso()
                } catch (error) {
                    this.$alertaErro()
                    console.log(error);
                }
            },
            async updateItem(item) {
                try {
                    await this.$axios.$put(`/produto/${item.id}`, item)
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
            async deleteItem(item) {
                try {
                    await this.$axios.$delete(`/produto/${item.id}`)
                    this.$emit('atualizarListagem')
                    this.$emit('close')
                    this.$alertaSucesso('Registro excluído com sucesso')
                } catch (error) {
                    this.$alertaErro()
                    console.log(error);
                }
            },


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

    .img-zoom:hover {
        cursor: zoom-in;
    }
</style>