<template>
  <div>
    <!-- ADDED OR DELETED MATCH FROM REFEREE SNACKBAR  -->
    <v-snackbar
      v-model="snackbar"
      :bottom="snackbar_y === 'bottom'"
      :left="snackbar_x === 'left'"
      :multi-line="snackbar_mode === 'multi-line'"
      :right="snackbar_x === 'right'"
      :timeout="3000"
      :top="snackbar_y === 'top'"
      :vertical="snackbar_mode === 'vertical'"
    >
      {{ snackbar_text }}
      <v-btn color="pink" flat @click="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
    <!-- END ADDED OR DELETED MATCH FROM REFEREE SNACKBAR  -->
    <!-- NAVIGATION DRAWER FOR MATCHES LIST -->
    <v-navigation-drawer
      v-model="matchesDrawer"
      :width="edition_drawer_width"
      touchless
      temporary
      right
      disable-resize-watcher
      app
    >
      <v-toolbar dark color="blue-grey darken-2">
        <v-btn icon dark @click="matchesDrawer = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <span class="headline">Asignar a partido</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container fluid grid-list-md>
        <v-data-iterator
          :items="matches"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
        >
          <v-toolbar slot="header" class="mb-2" color="green darken-1" dark flat>
            <v-toolbar-title>Listado de partidos</v-toolbar-title>
          </v-toolbar>
          <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
            <v-card>
              <v-divider></v-divider>
              <v-container grid-list-md text-xs-center>
                <v-layout row wrap>
                  <v-btn @click="asignToMatch(props.item)" flat large block>
                    <v-flex v-for="(item, index) in props.item" :key="index" xs6>
                      <v-avatar :tile="false" :size="35" color="grey lighten-4">
                        <img :src="item.logo" :alt="props.item.alias" :title="props.item.name">
                      </v-avatar>
                    </v-flex>
                  </v-btn>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
      <!-- <pre>{{ referees | json }}</pre> -->
    </v-navigation-drawer>
    <!-- END NAVIGATION DRAWER FOR MATCHES LIST -->
    <!-- NAVIGATION DRAWER FOR NEW REFEREE -->
    <v-navigation-drawer
      v-model="newRefereeDrawer"
      :width="edition_drawer_width"
      touchless
      temporary
      right
      disable-resize-watcher
      app
    >
      <v-toolbar dark color="blue-grey darken-2">
        <v-btn icon dark @click="newRefereeDrawer = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <span class="headline">Nuevo árbitro</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="saveReferee">
          <v-icon>fas fa-save</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="newRefereeName" :counter="100" label="Nombre"></v-text-field>
              <v-select v-model="selectedRefereeType" :items="refereeTypes" label="Tipo"></v-select>
              <!-- <pre>{{selectedRefereeType}}</pre> -->
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <!-- END NAVIGATION DRAWER FOR NEW REFEREE -->
    <!-- TABLE TOP TOOLBAR -->
    <v-toolbar flat color="white">
      <v-spacer></v-spacer>
      <v-btn @click="newReferee" fab dark small class="success">
        <v-icon dark>add</v-icon>
      </v-btn>
      <!-- DELETION DIALOG -->
      <v-dialog v-model="deletion_dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Eliminar</v-card-title>
          <v-card-text>¿Realmente desea eliminar el árbitro seleccionado?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="deletion_dialog = false">Cancelar</v-btn>

            <v-btn color="green darken-1" flat="flat" @click="confirmDeletion">Si, eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- END DELETION DIALOG -->
    </v-toolbar>
    <!-- TABLE TOP TOOLBAR -->
    <v-data-table dark :headers="headers" :items="referees" :loading="loading" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.type }}</td>
        <td class="text-xs-center">{{ props.item.matches.length }}</td>
        <td class="justify-center layout px-0">
          <v-btn title="Asignar a partido" @click="openMatchesListDrawer(props.item)" flat icon>
            <v-icon small>fas fa-sign-in-alt</v-icon>
          </v-btn>
          <v-btn @click="deleteItem(props.item)" flat icon>
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">Aún no tienes árbitros</v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "RefereesTable",
  data: () => ({
    edition_drawer_width: Number.parseInt(window.screen.availWidth * 0.7),
    isMobile: window.screen.availWidth <= 414, //iPhone 6,7,8 plus screen width
    matchesDrawer: false,
    newRefereeDrawer: false,
    deletion_dialog: false,
    loading: false,
    notifications: false,
    sound: true,
    widgets: false,
    referees: [],
    headers: [],
    refereeTypes: [],
    rowsPerPageItems: [3, 6, 9, 12, 15],
    pagination: {
      rowsPerPage: 3
    },
    matches: [],
    snackbar: false,
    snackbar_y: "bottom",
    snackbar_x: null,
    snackbar_mode: "",
    snackbar_text: "",
    valid: true,
    newRefereeName: null,
    selectedRefereeType: null
  }),

  computed: {},

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.referees = [
        {
          name: "Venustiano Carranza",
          type: "Central",
          matches: []
        },
        {
          name: "Francisco I. Madero",
          type: "Auxiliar",
          matches: []
        },
        {
          name: "Miguel Hidalgo",
          type: "Abanderado",
          matches: []
        },
        {
          name: "Francisco Villa",
          type: "Abanderado",
          matches: []
        },
        {
          name: "Emiliano Zapata",
          type: "Auxiliar",
          matches: []
        }
      ];

      this.headers = [
        {
          text: "Nombre",
          value: "name",
          sortable: this.referees.length > 0,
          align: "center"
        },
        {
          text: "Tipo",
          value: "type",
          sortable: this.referees.length > 0,
          align: "center"
        },
        {
          text: "Partidos",
          value: "matches",
          sortable: this.referees.length > 0,
          align: "center"
        },
        { text: "Acciones", value: "options", sortable: false, align: "center" }
      ];

      this.matches = [
        {
          team1: {
            name: "Barcelona FC",
            alias: "Barca FC",
            logo: "http://aux.iconspalace.com/uploads/1278105613.png",
            players: 24,
            status: { icon: "fas fa-circle", color: "success" }
          },
          team2: {
            name: "Real Madrid FC",
            alias: "Real Madrid FC",
            logo:
              "https://vignette.wikia.nocookie.net/inciclopedia/images/4/4d/Real_madrid_logo.png/revision/latest?cb=20081102004028",
            players: 23,
            status: { icon: "fas fa-circle", color: "success" }
          }
        },
        {
          team1: {
            name: "Arsenal FC",
            alias: "AFC",
            logo:
              "https://upload.wikimedia.org/wikipedia/hif/8/82/Arsenal_FC.png",
            players: 22,
            status: { icon: "fas fa-circle", color: "error" }
          },
          team2: {
            name: "Boca Juniors FC",
            alias: "Boca FC",
            logo:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors.svg/887px-Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors.svg.png",
            players: 21,
            status: { icon: "fas fa-circle", color: "warning" }
          }
        }
      ];

      this.refereeTypes = ["Abanderado", "Central", "Auxiliar"];
    },

    saveReferee() {
      this.referees.push(
        {
          name: this.newRefereeName,
          type: this.selectedRefereeType,
          matches: []
        }
      );
      this.$refs.form.reset();
    },

    newReferee() {
      this.selectedRefereeIndex = -1;
      this.newRefereeDrawer = true;
    },

    asignToMatch(item) {
      let exists = this.referees[this.selectedRefereeIndex].matches.indexOf(
        item
      );
      if (exists >= 0) {
        this.referees[this.selectedRefereeIndex].matches.splice(exists, 1);
        this.snackbar_text = "Árbitro removido del partido";
      } else {
        let index = this.matches.indexOf(item);
        this.referees[this.selectedRefereeIndex].matches.push(item);
        this.snackbar_text = "Árbitro asignado al partido";
      }
      this.snackbar = true;
    },

    openMatchesListDrawer(item) {
      this.selectedRefereeIndex = this.referees.indexOf(item);
      this.matchesDrawer = true;
    },

    deleteItem(item) {
      this.selectedRefereeIndex = this.referees.indexOf(item);
      this.deletion_dialog = true;
    },

    confirmDeletion() {
      this.referees.splice(this.selectedRefereeIndex, 1);
      this.deletion_dialog = false;
    }
  }
};
</script>
<style scoped>
</style>