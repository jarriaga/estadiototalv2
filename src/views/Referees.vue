<template>
    <v-container grid-list-md >
        <v-layout row>
            <v-flex xs12 md12>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h1>Árbitros</h1>
                    </v-card-title>
                    <v-card-text>                        
                        <referees-table></referees-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>



<script>
    import {mapActions} from 'vuex'
    import RefereesTable from './../components/RefereesTable'

    export default {
        name: 'Dashboard',
        components:{ RefereesTable },
        data() {
            return {
               
            }
        },
        methods: {
           
        }
    }
</script>