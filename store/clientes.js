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
            const res = await axios.$get('/clientes')
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
            const res = await axios.$get('/cliente/' + id)
            commit('setItem', res)
        } catch (error) {
            throw new Error(error)
        }
    },
    async create({ state, commit, dispatch }, payload) {
        if (payload)
            try {
                const axios = $nuxt.$axios
                await axios.$post('/cliente', payload)
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
                await axios.$put(`/cliente/${id}`, payload)
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
                await axios.$delete(`/cliente/${id}`)
                dispatch('getListagem')
            } catch (error) {
                throw new Error(error)
            }
    },

}