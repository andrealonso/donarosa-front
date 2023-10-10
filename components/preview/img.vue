<template>
    <v-dialog v-model="open" persistent fullscreen>
        <v-img max-height="100vh" @click="clickImg" contain
            :src="itemImg.src ? itemImg.src : `http://localhost:3000/img/1058.jpg`"></v-img>
    </v-dialog>
</template>

<script>
export default {
    props: ['open', 'itemImg'],
    methods: {
        clickImg() {
            this.$emit('close')
        }
    }
}
</script>

<style></style>