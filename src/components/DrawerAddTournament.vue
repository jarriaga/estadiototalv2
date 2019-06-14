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
      <v-spacer></v-spacer>
      <v-btn icon @click="save">
        <v-icon>fas fa-save</v-icon>
      </v-btn>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'DrawerAddTournament',
    props: ['show'],
    data() {
      return {
        edition_drawer_width: Number.parseInt(window.screen.availWidth * 0.7)
      }
    },
    methods: {
      close: function(){
        console.log('cerrando');
        this.$emit('close-drawer',false);
      },
      save: function(){

      }
    }
  }
</script>

<style>

</style>