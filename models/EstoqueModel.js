import moment from 'moment'
export function estoqueModel(payload) {

    if (payload?.id) {
        return {
            id: payload.id,
            descricao: payload.descricao || '',
            qtd: payload.qtd || 0,
            data: moment.utc(payload.data).format('YYYY-MM-DD') || null,
            estoque_tipo_id: payload.estoque_tipo_id || null,
            estoque_oper_id: payload.estoque_oper_id || null,
            produto_id: payload.produto_id || null,
        }
    } else {
        return {
            descricao: '',
            qtd: 0,
            data: null,
            estoque_tipo_id: null,
            estoque_oper_id: null,
            produto_id: null,

        }
    }

}