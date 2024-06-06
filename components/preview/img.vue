<template>
    <v-dialog v-model="open" persistent fullscreen>
        <v-sheet color="rgba(0, 0, 0, 0.7)">
            <v-img @click="clickImg" contain height="100dvh"
                :src="itemImg.src ? itemImg.src : `http://localhost:3000/img/1058.jpg`"></v-img>
        </v-sheet>
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

<style>
    .bg-card {
        background-color: rgba(0, 0, 0, 0.745);
    }
</style>