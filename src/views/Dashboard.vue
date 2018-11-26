<template>
    <v-container grid-list-md >
        <v-layout row>
            <v-flex xs12 md12>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h1>Tus Torneos</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-btn class="success">Nuevo Torneo</v-btn>
                        <tournament-table></tournament-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>



<script>
    import {mapActions} from 'vuex'
    import TournamentTable from './../components/TournamentTableAdmin'

    export default {
        name: 'Dashboard',
        components:{ TournamentTable },
        data() {
            return {
               
            }
        },
        methods: {
           
        }
    }
</script>