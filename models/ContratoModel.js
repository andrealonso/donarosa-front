export function contratoModel(payload) {
    return {
        id: payload?.id || null,
        contrato_status_id: payload?.contrato_status_id || null,
        vl_total: payload?.vl_total || null,
        vl_sinal: payload?.vl_sinal || null,
        vl_rest: payload?.vl_rest || null,
        dt_prova: payload?.dt_prova || null,
        hr_prova: payload?.hr_prova || null,
        dt_saida: payload?.dt_saida || null,
        hr_saida: payload?.hr_saida || null,
        dt_devol: payload?.dt_devol || null,
        dt_evento: payload?.dt_evento || null,
        itens: payload?.itens || [],
        caixa_lanc: payload?.caixa_lanc || [],
        cliente_id: payload?.cliente_id || null,
        evento_id: payload?.evento_id || null,
        obs: payload?.obs || null,
    }
}
