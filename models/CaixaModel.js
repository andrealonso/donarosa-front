import moment from 'moment'

export function caixaModel(payload) {

    if (payload?.id) {
        return {
            id: payload.id || null,
            descricao: payload.descricao || '',
            valor: payload.valor || null,
            data: moment.utc(payload.data).format('YYYY-MM-DD') || null,
            caixa_operacao_id: payload.caixa_operacao_id || null,
            caixa_form_pag_id: payload.caixa_form_pag_id || null,
            caixa_cate_id: payload.caixa_cate_id || null,
            contrato_id: payload.contrato_id || null,
            vendas_id: payload.vendas_id || null,
            user_id: payload.user_id || null
        }
    } else {
        return {
            id: null,
            descricao: '',
            valor: null,
            data: null,
            caixa_operacao_id: null,
            caixa_form_pag_id: null,
            caixa_cate_id: null,
            contrato_id: null,
            vendas_id: null,
            user_id: null
        }
    }

}
