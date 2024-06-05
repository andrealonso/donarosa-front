<template>
    <v-dialog v-model="open" persistent fullscreen>
        <v-card class="d-flex align-center black">
            <v-img @click="clickImg" :src="itemImg.src ? itemImg.src : `http://localhost:3000/img/1058.jpg`"></v-img>
        </v-card>
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