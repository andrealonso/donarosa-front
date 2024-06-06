export default function ({ $axios, redirect, store }) {

    $axios.onRequest(config => {

        // if (config.url !== '/login') {
        //     if (!store.state.user.token) {
        //         redirect('/autenticar')
        //     } else {
        //         config.headers.Authorization = store.state.user.token
        //     }
        // }
    })


    $axios.onError(error => {
        $nuxt.$alertaErro('Erro ao acessar o servidor!')
        const code = parseInt(error.response && error.response.status)
        // if (code === 401) {
        //     redirect('/login')
        // }
    })
}