<template>
    <v-dialog v-model="open" max-width="320" persistent>
        <v-card>
            <v-card-title :class="['text-center', dlgConfirme.cor || 'primary']">
                <span>{{ dlgConfirme.titulo }}</span>
            </v-card-title>

            <v-card-text class="font-weight-black">
                {{ dlgConfirme.texto }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" text @click="fnNao">
                    Não
                </v-btn>

                <v-btn color="green darken-1" text @click="fnSim">
                    Sim
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['open', 'dlgConfirme'],
    methods: {
        fnNao() {
            this.$emit('nao')
        },
        fnSim() {
            this.$emit('sim')
        },

    }
}
</script>

