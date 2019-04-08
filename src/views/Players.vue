<template>
  <v-container grid-list-md>
    <!-- NEW PLAYER FORM NAVIGATION DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      :width="drawer_width"
      touchless
      temporary
      right
      disable-resize-watcher
      app
    >
      <v-toolbar dark color="blue-grey darken-2">
        <v-btn icon dark @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>
          <span class="headline">{{ formTitle }}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="save">
          <v-icon>fas fa-save</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form>
              <v-text-field :counter="50" v-model="selectedItem.name" label="Nombre"></v-text-field>
              <v-text-field :counter="15" v-model="selectedItem.lastname" label="Apellidos"></v-text-field>
              <v-text-field :counter="2" v-model="selectedItem.age" label="Edad"></v-text-field>
              <v-select
                v-model="selectedItem.position"
                :items="positions"
                label="Posición de juego"
                required
              ></v-select>
              <v-select v-model="selectedItem.nationality" :items="countries" label="País" required></v-select>
              <v-select
                v-model="selectedItem.team"
                item-text="name"
                return-object
                :items="teams"
                label="Equipo"
                required
              ></v-select>
              <!-- <v-text-field
                readonly
                @click="pickFile"
                v-model="imageName"
                prepend-icon="attach_file"
                label="Escudo del equipo"
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              >-->
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <!-- END NEW PLAYER FORM NAVIGATION DRAWER -->
    <v-layout row>
      <v-flex xs12 md12>
        <v-card class="elevation-12">
          <v-card-title>
            <h1>Jugadores</h1>
          </v-card-title>
          <v-card-text>
            <!-- TABLE TOP TOOLBAR -->
            <v-toolbar flat color="white">
              <v-spacer></v-spacer>
              <v-btn fab dark small class="success" @click="addItem">
                <v-icon dark>add</v-icon>
              </v-btn>
            </v-toolbar>
            <!-- TABLE TOP TOOLBAR -->
            <v-data-table
              dark
              :headers="headers"
              :items="players"
              :loading="loading"
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">
                  <v-avatar :tile="false" :size="40" color="grey lighten-4">
                    <img :src="props.item.photo" :alt="props.item.name">
                  </v-avatar>
                </td>
                <td class="text-xs-center">{{ props.item.name }} {{ props.item.lastname }}</td>
                <td class="text-xs-center">{{ props.item.position }}</td>
                <td class="text-xs-center">{{ props.item.age }}</td>
                <td class="text-xs-center">{{ props.item.nationality }}</td>
                <td class="text-xs-center">
                  <v-avatar :tile="false" :size="30" color="grey lighten-4">
                    <img :src="props.item.team.logo" :alt="props.item.team.alias">
                  </v-avatar>
                </td>
                <td class="justify-center layout px-0">
                  <v-btn title="Asignar a equipo" flat icon>
                    <v-icon small>fas fa-sign-in-alt</v-icon>
                  </v-btn>
                  <v-btn title="Editar jugador" @click="editItem(props.item)" flat icon>
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-btn title="Eliminar jugador" @click="deleteItem(props.item)" flat icon>
                    <v-icon small>delete</v-icon>
                  </v-btn>
                </td>
              </template>
              <template slot="no-data">
                <v-alert :value="true" color="error" icon="warning">Aún no tienes jugadores</v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- DELETION DIALOG -->
    <v-dialog v-model="deletion_dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Eliminar</v-card-title>
        <v-card-text>¿Realmente desea eliminar el jugador seleccionado?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="deletion_dialog = false">Cancelar</v-btn>

          <v-btn color="green darken-1" flat="flat" @click="confirmDeletion">Si, eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END DELETION DIALOG -->
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Players",
  data: () => ({
    drawer: false,
    drawer_width: Number.parseInt(window.screen.availWidth * 0.7),
    isMobile: window.screen.availWidth <= 414, //iPhone 6,7,8 plus screen width
    deletion_dialog: false,
    players: [],
    headers: [],
    teams: [],
    positions: [],
    countries: [],
    loading: false,
    rowsPerPageItems: [3, 6, 9, 12, 15],
    pagination: {
      rowsPerPage: 3
    },
    formTitle: "",
    selectedItem: {
      name: "",
      lastname: "",
      age: 0,
      position: "",
      nationality: "",
      photo: "",
      team: {
        name: "",
        alias: "",
        logo: "",
        players: 0,
        status: { icon: "fas fa-circle", color: "" }
      }
    },
    defaultItem: {
      name: "",
      lastname: "",
      age: 0,
      position: "",
      nationality: "",
      photo: "",
      team: {
        name: "",
        alias: "",
        logo: "",
        players: 0,
        status: { icon: "fas fa-circle", color: "" }
      }
    },
    selectedIndex: -1
  }),
  created() {
    this.initialize();
  },
  methods: {
    confirmDeletion() {
      this.players.splice(this.selectedIndex, 1);
      this.deletion_dialog = false;
    },

    close() {
      this.selectedItem = this.defaultItem;
      this.selectedIndex = -1;
      this.drawer = false;
    },

    save() {
      if (this.selectedIndex > -1) {
        Object.assign(this.players[this.selectedIndex], this.selectedItem);
      } else {
        this.players.push(this.selectedItem);
      }
      this.close();
    },

    addItem(){
      if (this.selectedIndex > -1) {
        this.close();
      } 
      this.drawer = true;
    },

    editItem(item) {
      this.selectedIndex = this.players.indexOf(item);
      this.selectedItem = Object.assign({}, item);
      this.drawer = true;
    },

    deleteItem(item) {
      this.selectedIndex = this.players.indexOf(item);
      this.selectedItem = Object.assign({}, item);
      this.deletion_dialog = true;
    },

    initialize() {
      this.players = [
        {
          name: "Cristiano",
          lastname: "Ronaldo",
          age: 30,
          position: "MD",
          nationality: "Portugal",
          photo:
            "https://www.aceshowbiz.com/images/photo/cristiano_ronaldo.jpg",
          team: {
            name: "Real Madrid FC",
            alias: "Real Madrid FC",
            logo:
              "https://vignette.wikia.nocookie.net/inciclopedia/images/4/4d/Real_madrid_logo.png/revision/latest?cb=20081102004028",
            players: 23,
            status: { icon: "fas fa-circle", color: "success" }
          }
        },
        {
          name: "Lionel",
          lastname: "Messi",
          age: 30,
          position: "DC",
          nationality: "Argentina",
          photo:
            "https://i.pinimg.com/originals/f6/f4/b7/f6f4b7430f8abe6ea809c9312525d5ed.png",
          team: {
            name: "Barcelona FC",
            alias: "Barca FC",
            logo: "http://aux.iconspalace.com/uploads/1278105613.png",
            players: 24,
            status: { icon: "fas fa-circle", color: "success" }
          }
        },
        {
          name: "Sergio",
          lastname: "Ramos",
          age: 30,
          position: "MC",
          nationality: "Spain",
          photo:
            "https://marriedwiki.com/uploads/bio/2014/11/30/thumb/xsergio-ramos-260-260.jpeg.pagespeed.ic.7sxgfVzTZD.jpg",
          team: {
            name: "Real Madrid FC",
            alias: "Real Madrid FC",
            logo:
              "https://vignette.wikia.nocookie.net/inciclopedia/images/4/4d/Real_madrid_logo.png/revision/latest?cb=20081102004028",
            players: 23,
            status: { icon: "fas fa-circle", color: "success" }
          }
        },
        {
          name: "Francesc",
          lastname: "Fabregas",
          age: 30,
          position: "MC",
          nationality: "Spain",
          photo:
            "https://marriedbiography.com/wp-content/uploads/2017/04/Cesc-F%C3%A0bregas.jpg",
          team: {
            name: "Chelsea FC",
            alias: "Chelsea FC",
            logo:
              "https://seeklogo.com/images/C/chelsea-fc-logo-2DCAC3BF88-seeklogo.com.png",
            players: 23,
            status: { icon: "fas fa-circle", color: "success" }
          }
        },
        {
          name: "Andres",
          lastname: "Iniesta",
          age: 30,
          position: "DD",
          nationality: "Spain",
          photo:
            "http://4.bp.blogspot.com/-fKy0_B57V-4/Twm2prxETvI/AAAAAAAAAEE/iaI5MCXOwuA/s1600/Andres+Iniesta6.jpg",
          team: {
            name: "Barcelona FC",
            alias: "Barca FC",
            logo: "http://aux.iconspalace.com/uploads/1278105613.png",
            players: 24,
            status: { icon: "fas fa-circle", color: "success" }
          }
        }
      ];
      this.headers = [
        {
          text: "Foto",
          value: "photo",
          sortable: false,
          align: "center"
        },
        {
          text: "Nombre",
          value: "name",
          sortable: this.players.length > 0,
          align: "center"
        },
        {
          text: "Posición",
          value: "position",
          sortable: this.players.length > 0,
          align: "center"
        },
        {
          text: "Edad",
          value: "age",
          sortable: this.players.length > 0,
          align: "center"
        },
        {
          text: "Nacionalidad",
          value: "nationality",
          sortable: this.players.length > 0,
          align: "center"
        },
        {
          text: "Equipo",
          value: "team",
          sortable: false,
          align: "center"
        },
        {
          text: "Acciones",
          value: "options",
          sortable: false,
          align: "center"
        }
      ];
      this.teams = [
        {
          name: "Chelsea FC",
          alias: "Chelsea FC",
          logo:
            "https://seeklogo.com/images/C/chelsea-fc-logo-2DCAC3BF88-seeklogo.com.png",
          players: 23,
          status: { icon: "fas fa-circle", color: "success" }
        },
        {
          name: "Barcelona FC",
          alias: "Barca FC",
          logo: "http://aux.iconspalace.com/uploads/1278105613.png",
          players: 24,
          status: { icon: "fas fa-circle", color: "success" }
        },
        {
          name: "Real Madrid FC",
          alias: "Real Madrid FC",
          logo:
            "https://vignette.wikia.nocookie.net/inciclopedia/images/4/4d/Real_madrid_logo.png/revision/latest?cb=20081102004028",
          players: 23,
          status: { icon: "fas fa-circle", color: "success" }
        },
        {
          name: "Arsenal FC",
          alias: "AFC",
          logo:
            "https://upload.wikimedia.org/wikipedia/hif/8/82/Arsenal_FC.png",
          players: 22,
          status: { icon: "fas fa-circle", color: "error" }
        },
        {
          name: "Boca Juniors FC",
          alias: "Boca FC",
          logo:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors.svg/887px-Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors.svg.png",
          players: 21,
          status: { icon: "fas fa-circle", color: "warning" }
        },
        {
          name: "Deportivo Cruz Azul",
          alias: "Cruz Azul",
          logo:
            "http://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/4204.png",
          players: 20,
          status: { icon: "fas fa-circle", color: "error" }
        }
      ];
      this.positions = ["DI", "DC", "DD", "MI", "MC", "MD", "DI", "DC", "DD"];
      this.countries = [
        "Afghanistan",
        "Albania",
        "Algeria",
        "Andorra",
        "Angola",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "Brunei",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cape Verde",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Colombia",
        "Comoros",
        "Congo (Brazzaville)",
        "Congo",
        "Costa Rica",
        "Cote d'Ivoire",
        "Croatia",
        "Cuba",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "East Timor (Timor Timur)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Fiji",
        "Finland",
        "France",
        "Gabon",
        "Gambia, The",
        "Georgia",
        "Germany",
        "Ghana",
        "Greece",
        "Grenada",
        "Guatemala",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Honduras",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea, North",
        "Korea, South",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Mauritania",
        "Mauritius",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepa",
        "Netherlands",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Vincent",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia and Montenegro",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Swaziland",
        "Sweden",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Togo",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Vatican City",
        "Venezuela",
        "Vietnam",
        "Yemen",
        "Zambia",
        "Zimbabwe"
      ];
    }
  }
};
</script>