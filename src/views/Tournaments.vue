<template>
    <v-container grid-list-md >
        <v-layout row>
            <v-flex xs12 md12>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h1>Mis Torneos</h1>
                    </v-card-title>
                    <v-card-text>
                        <teams-admin :selectable="false"></teams-admin>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>



<script>
    import {mapActions} from 'vuex'
    import TeamsAdmin from './../components/TeamsAdmin';

    export default {
        name: 'Tournaments',
        components:{ TeamsAdmin },
        data() {
            return {
               
            }
        },
        methods: {
           
        }
    }
</script>