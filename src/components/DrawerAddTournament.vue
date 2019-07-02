<template>
  <!-- NAVIGATION DRAWER FOR MATCHES LIST -->
  <v-navigation-drawer v-model="show" :width="edition_drawer_width" touchless temporary right disable-resize-watcher
    app>
    <v-toolbar dark color="blue-grey darken-2">
      <v-btn icon dark @click="close">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>
        <span class="headline"> Crea tu torneo</span>
      </v-toolbar-title>
      <v-spacer>
      </v-spacer>
      <v-btn icon :disabled="!valid" @click="save">
        <v-icon>fas fa-save</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form ref="form" v-model="valid" lazy-validation>
    <v-container>
      <v-layout>
        <v-flex xs12 md4>
          <v-text-field v-model="newTournament.nombre":rules="nameRules"label="Nombre del torneo"required ></v-text-field>
        </v-flex>
      <v-flex xs12 md8>
        <v-textarea v-model="newTournament.descripcion":rules="descripcionRules" label="Descripcion" rows="1"requiredvalue="Descipcion"></v-textarea>
    </v-flex>
 </v-layout>
 <v-layout>
  <v-flex xs12 md3>
          <v-text-field type=Number v-model="newTournament.puntosWin":rules="winRules"label="Puntos por ganador"required></v-text-field>
        </v-flex>
<v-flex xs12 md3>
          <v-text-field type=Number v-model="newTournament.puntosLose":rules="loseRules"label="Puntos de perdedor"required></v-text-field>
        </v-flex>
        <v-flex xs12 md3>
        <v-text-field  type=Number v-model="newTournament.puntosDraw":rules="drawTorneoRules"label="puntos por empate"required></v-text-field>
        </v-flex>
        <v-flex xs12 md3>
        <v-text-field type=Number v-model="newTournament.grupos":rules="guposRules"label="grupos"required></v-text-field>
        </v-flex>
   </v-layout>
  <v-layout>
  <v-flex xs12 md4>
          <v-text-field type=Number v-model="newTournament.costoTorneo":rules="costoRules"label="Costo del torneo"required></v-text-field>
        </v-flex>
<v-flex xs12 md4>
          <v-select v-model="newTournament.estado":items="items" :rules="estadoRules"label="Estado"></v-select>
        </v-flex>
        <v-flex xs12 md4>
          <v-text-field v-model="newTournament.reglamentoTorneo":rules="reglamentoRules"label="URL del reglamento"required></v-text-field>
        </v-flex>
   </v-layout>
    </v-container>
  </v-form>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from 'vuex'
  export default {
    name: 'DrawerAddTournament',
    props: ['show'],
    data() {
      return {
        edition_drawer_width: Number.parseInt(window.screen.availWidth * 0.7),
       items: ['activo','inactivo'],
        valid:true,
                nameRules: [
                    v => !!v || 'Nombre es requerido',
                ],
                descripcionRules: [
                    v => !!v || 'Descripcion requerida',
                ],
                winRules: [
                    v => v>=0 || 'No debe ser menor a 0',
                ],
                loseRules: [
                    v => v>=0 || 'No debe ser menor a 0',
                ],
                drawRules: [
                    v => v>=0 || 'No debe ser menor a 0',
                ],
                gruposRules: [
                    v => v>=0 || 'No debe ser menor a 0',
                ],
                costoRules:[
                   v => v>=0 || 'No debe ser menor a 0',
                ],
                estadoRules:[
                  v=> !!v || 'Estado requerido'
                ],
                reglamentoRules: [
                    v => !!v || 'La URL es requerido',
                ],
                  newTournament: {},
      }
    },
    methods: {
       ...mapActions([
                'registerTournament'
            ]),
      close: function(){
        console.log('cerrando');
        this.$emit('close-drawer',false);
      },
      save: function(){
        if (this.$refs.form.validate()) {
                    let vm = this;
                    this.registerTournament(this.newTournament)
                        .then(function () {
                            vm.$router.push({
                            });
                        }).catch(function (error) {
                            console.log(error);
                            vm.$store.commit('showError', {
                                visible:true,
                                type: 'error',
                                text: error.message,
                            });
                        });
                }
      }
    },
  }
</script>

<style>

</style>