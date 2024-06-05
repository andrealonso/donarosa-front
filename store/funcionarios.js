export const state = () => (
    {
        listagem: [],
        item: {}
    }
)

export const getters = {

}

export const mutations = {
    setListagem(state, payload) {
        state.listagem = payload
    },
    setItem(state, payload) {
        state.item = payload
    },
}

export const actions = {
    async getListagem({ state, commit }) {
        try {
            const axios = $nuxt.$axios
            const res = await axios.$get('/funcionarios')
            commit('setListagem', res.dados.registros)
        } catch (error) {
            throw new Error(error)
        }
    },
    async getItem({ state, commit }, item) {
        try {
            if (!item) return
            const { id } = item
            const axios = $nuxt.$axios
            const res = await axios.$get('/funcionario/' + id)
            commit('setItem', res)
        } catch (error) {
            throw new Error(error)
        }
    },
    async create({ state, commit, dispatch }, payload) {
        if (payload)
            try {
                const axios = $nuxt.$axios
                await axios.$post('/funcionario', payload)
                dispatch('getListagem')
            } catch (error) {
                throw new Error(error)
            }
    },
    async update({ state, commit, dispatch }, payload) {
        if (payload)
            try {
                const { id } = payload
                const axios = $nuxt.$axios
                await axios.$put(`/funcionario/${id}`, payload)
                dispatch('getListagem')
            } catch (error) {
                throw new Error(error)
            }
    },
    async delete({ state, commit, dispatch }, payload) {
        if (payload)
            try {
                const { id } = payload
                const axios = $nuxt.$axios
                await axios.$delete(`/funcionario/${id}`)
                dispatch('getListagem')
            } catch (error) {
                throw new Error(error)
            }
    },

}