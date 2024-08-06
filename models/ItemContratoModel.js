export function itemContratoModel(payload) {
    return {
        id: payload?.id || null,
        qtd: payload?.qtd || 1,
        valor: payload?.valor || null,
        produto_id: payload?.produto_id || null,
        contrato_id: payload?.contrato_id || null,
    }
}
