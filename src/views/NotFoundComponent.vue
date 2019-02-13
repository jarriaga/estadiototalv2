<template>
    <v-container grid-list-md text-xs-center>
    </v-container>
</template>

<script>
    export default {
        name: 'NotFoundComponent',
        data() {
            return {}
        },
        methods: {

        },
        created:function(){
            window.location = '/not-found.html'
        }
    }
</script>

<style scoped="">

</style>