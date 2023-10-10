export default (context, inject) => {
    inject('downloadFile', async (file) => {
        const dados = await context.$axios.$get(`documento/download/${file.id}`, {
            responseType: 'blob'
        })
        const fileUrl = window.URL.createObjectURL(new Blob([dados]))
        let fileLink = document.createElement('a');
        fileLink.href = fileUrl;
        fileLink.setAttribute('download', `${file.descricao}${file.ext}`);
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
    }),
        inject('uploadFile', async (produto_id, lado, file) => {
            try {
                let formData = new FormData()
                formData.append("produto_id", produto_id)
                formData.append("lado", lado)
                formData.append("file", file)
                const dados = await context.$axios.$post('/file/img', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                return true
            } catch (error) {
                console.log(error);
                return false
            }
        })
}

