import moment from "moment"

export default (context, inject) => {
    inject('configFooterTable', () => {
        return {
            itemsPerPageText: "Itens por pág.",
            itemsPerPageOptions: [15, 50, 100, -1],
        }
    })
}