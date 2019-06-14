<template>
    <v-container grid-list-md >
        <drawer-add-tournament v-bind:show="show" v-on:close-drawer="closeDrawer"></drawer-add-tournament>
        <v-layout row>
            <v-flex xs12 md12>
                <v-card class="elevation-12">
                    <v-card-title>
                        <h1>Mis Torneos</h1>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" @click="showDrawer">Nuevo Torneo</v-btn>
                    </v-card-title>
                    <v-card-text>
                        <tournament-table-admin></tournament-table-admin>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>



<script>
    import {mapActions} from 'vuex'
    import TournamentTableAdmin from './../components/TournamentTableAdmin'
    import DrawerAddTournament from './../components/DrawerAddTournament'
    export default {
        name: 'Tournaments',
        components:{ TournamentTableAdmin, DrawerAddTournament },
        data() {
            return {
               show:false
            }
        },
        methods: {
           showDrawer:function(){
               this.show=true
           },
           closeDrawer:function(value){
               this.show=value;
           }
        }
    }
</script>