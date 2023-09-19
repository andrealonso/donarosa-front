export function produtoModel(payload) {

    if (payload?.id) {
        return {
            id: payload.id || null,
            descricao: payload.descricao || null,
            cod_barras: payload.cod_barras || null,
            vl_custo: payload.vl_custo || null,
            vl_venda: payload.vl_venda || null,
            vl_aluguel: payload.vl_aluguel || null,
            qtd_estoque: payload.qtd_estoque || null,
            prod_imagem: payload.prod_imagem || null,
            ativo_status_id: payload.ativo_status_id || null,
            prod_tamanho_id: payload.prod_tamanho_id || null,
            prod_compri_id: payload.prod_compri_id || null,
            prod_cor_id: payload.prod_cor_id || null,
            prod_fabrica_id: payload.prod_fabrica_id || null,
            prod_categoria_id: payload.prod_categoria_id || null,
        }
    } else {
        return {
            descricao: null,
            cod_barras: null,
            vl_custo: null,
            vl_venda: null,
            vl_aluguel: null,
            qtd_estoque: null,
            prod_imagem: null,
            ativo_status_id: null,
            prod_tamanho_id: null,
            prod_compri_id: null,
            prod_cor_id: null,
            prod_fabrica_id: null,
            prod_categoria_id: null

        }
    }

}