export function eventoModel(payload) {
    return {
        id: payload?.id || null,
        descricao: payload?.descricao || '',
        data: payload?.data || '',
        evento_tipo_id: payload?.evento_tipo_id || ''
    }
}
