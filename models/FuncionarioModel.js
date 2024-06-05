export function funcionarioModel(payload) {
    if (payload?.id) {
        return {
            id: payload?.id || null,
            nome: payload?.nome || '',
            identidade: payload?.identidade || '',
            cpf: payload?.cpf || '',
            dt_nasc: payload?.dt_nasc || null,
            tel: payload?.tel || null,
            email: payload?.email || null,
            rua: payload?.rua || null,
            num: payload?.num || null,
            bairro: payload?.bairro || null,
            cep: payload?.cep || null,
            cidade: payload?.cidade || null,
            uf: payload?.uf || null,
            sexo_id: payload?.sexo_id || null,
            ativo_status_id: payload?.ativo_status_id || null,
        }

    }
}

