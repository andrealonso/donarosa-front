export function usuarioModel(payload) {

    if (payload?.id) {
        return {
            id: payload.id,
            login: payload.login || null,
            ativo_status_id: Number(payload.ativo_status_id) || null,
            user_nivel_id: Number(payload.user_nivel_id) || null,
            funcionario_id: Number(payload.funcionario_id) || null
        }
    } else {
        return {
            id: null,
            login: null,
            senha: null,
            ativo_status_id: 1,
            user_nivel_id: null,
            funcionario_id: null,
        }
    }

}