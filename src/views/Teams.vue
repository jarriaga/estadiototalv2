<template>
    <v-container grid-list-md >
        <v-layout row>
            <v-flex xs12 md12>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h1>Mis equipos</h1>
                    </v-card-title>
                    <v-card-text>
                        <teams-table></teams-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>



<script>
    import {mapActions} from 'vuex'
    import TeamsTable from './../components/TeamsTableAdmin';

    export default {
        name: 'Dashboard',
        components:{ TeamsTable },
        data() {
            return {
               
            }
        },
        methods: {
           
        }
    }
</script>