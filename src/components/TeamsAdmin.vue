<template>
  <div>
    <!-- NAVIGATION DRAWER FOR EDITION -->
    <v-navigation-drawer
      v-model="drawer"
      v-if="!selectable"
      :width="edition_drawer_width"
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
      <v-img
        v-if="editedItem.name.length > 0"
        :aspect-ratio="30/9"
        :src="editedItem.logo"
        gradient="to bottom left, rgba(100,115,201,.43), rgba(25,32,72,0.8)"
      >
        <v-layout pa-2 column fill-height class="lightbox white--text">
          <v-spacer></v-spacer>
          <v-flex shrink>
            <div class="subheading">{{editedItem.name}}</div>
            <div class="body-1">{{editedItem.alias}}</div>
          </v-flex>
        </v-layout>
      </v-img>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form>
              <v-text-field :counter="50" v-model="editedItem.name" label="Nombre"></v-text-field>
              <v-text-field :counter="15" v-model="editedItem.alias" label="Alias"></v-text-field>
              <v-text-field
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
              >
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <!-- END NAVIGATION DRAWER FOR EDITION-->
    <!-- NAVIGATION DRAWER FOR IMPORT CSV -->
    <v-navigation-drawer
      v-model="drawer"
      v-if="selectable"
      :width="edition_drawer_width"
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
          <span class="headline">Importar equipos</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="parsed_csv.length > 0" icon @click="creaCalendario(parsed_csv)">
          <v-icon>fas fa-random</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container ref="fileform" grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <!-- LOADING FILE DIALOG -->
            <v-dialog v-model="uploading" hide-overlay persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>Por favor, espere...
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- END LOADING FILE DIALOG -->
            <!-- FILE LOADING ERROR DIALOG -->
            <v-dialog v-model="alert_dialog" max-width="290">
              <v-card>
                <v-card-title class="headline">{{errorMessage.title}}</v-card-title>
                <v-card-text>{{errorMessage.message}}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat="flat" @click="alert_dialog = false">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- END FILE LOADING ERROR DIALOG -->
            <div id="file-drag-drop" class="ddform">
              <span class="drop-files" @click="pickCSV">{{loadFileOption}}</span>
              <input
                type="file"
                style="display: none"
                ref="csv"
                accept=".csv"
                @change="loadCSVByInput($event)"
              >
            </div>
            <!-- <pre>{{$data.g}}</pre> -->
            <!-- <div id="visscalendario"></div> -->
            <v-container fluid grid-list-md>
              <v-data-iterator
                :items="rol"
                :rows-per-page-items="rowsPerPageItems"
                :pagination.sync="pagination"
                content-tag="v-layout"
                row
                wrap
              >
                <v-toolbar slot="header" class="mb-2" color="green darken-1" dark flat>
                  <v-toolbar-title>Rol de partidos</v-toolbar-title>
                </v-toolbar>
                <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
                  <v-card>
                    <v-card-title>
                      <h4>Jornada {{ props.item.giornate }}</h4>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-container grid-list-md text-xs-center>
                      <v-layout row wrap>
                        <v-flex v-for="(item, index) in props.item.matches" :key="index" xs6>
                          <v-card dark color="secondary">
                            <v-card-text class="px-0">
                              <v-flex xs12>
                                <v-avatar :tile="false" :size="35" color="grey lighten-4">
                                  <img :src="item.logo" :alt="props.item.alias">
                                </v-avatar>
                              </v-flex>
                              <v-flex xs12>{{item.alias}}</v-flex>
                            </v-card-text>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-data-iterator>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
    <!-- END NAVIGATION DRAWER FOR IMPORT CSV-->
    <v-toolbar flat color="white">
      <v-spacer></v-spacer>
      <v-btn v-if="!selectable" @click="newItem" fab dark small class="success">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-btn
        v-if="selectable"
        :disabled="selected.length == 0"
        @click="creaCalendario(selected)"
        fab
        dark
        small
        class="primary"
      >
        <v-icon dark>fas fa-random</v-icon>
      </v-btn>
      <v-btn v-if="selectable" @click="importCSV" fab dark small class="success">
        <v-icon dark>fas fa-file-upload</v-icon>
      </v-btn>
      <!-- DELETION DIALOG -->
      <v-dialog v-if="!selectable" v-model="alert_dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">
            Eliminar &nbsp;
            <strong>{{ editedItem.name }}</strong>
          </v-card-title>
          <v-card-text>¿Realmente desea eliminar el equipo seleccionado?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="alert_dialog = false">Cancelar</v-btn>

            <v-btn color="green darken-1" flat="flat" @click="confirmDeletion">Si, eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- END DELETION DIALOG -->
    </v-toolbar>
    <v-data-table
      v-model="selected"
      :select-all="selectable"
      dark
      :headers="headers"
      :items="teams"
      item-key="name"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td v-if="selectable">
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center">{{ props.item.alias }}</td>
        <td class="text-xs-center">
          <v-avatar :tile="false" :size="35" color="grey lighten-4">
            <img :src="props.item.logo" :alt="props.item.alias">
          </v-avatar>
        </td>
        <td class="text-xs-center">{{ props.item.players }}</td>
        <td class="text-xs-center">
          <v-icon :color="props.item.status.color">{{ props.item.status.icon }}</v-icon>
        </td>
        <td v-if="!selectable" class="justify-center layout px-0">
          <v-btn title="Editar equipo" @click="editItem(props.item)" flat icon>
            <v-icon small>edit</v-icon>
          </v-btn>
          <v-btn title="Eliminar equipo" @click="deleteItem(props.item)" flat icon>
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">Aún no tienes equipos.
          <br>Crea uno con el botón de arriba.
        </v-alert>
      </template>
    </v-data-table>
    <!-- <pre>{{$data.g}}</pre> -->
  </div>
</template>

<script>
export default {
  name: "TeamsAdmin",
  props: ["selectable"],
  data: () => ({
    edition_drawer_width: Number.parseInt(window.screen.availWidth * 0.7),
    mobile: false,
    drawer: false,
    alert_dialog: false,
    loading: false,
    notifications: false,
    sound: true,
    widgets: false,
    teams: [],
    headers: [],
    selected: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      alias: "",
      logo: "",
      players: "",
      status: { icon: "", color: "" }
    },
    defaultItem: {
      name: "",
      alias: "",
      logo: "",
      players: "",
      status: { icon: "", color: "" }
    },
    imageName: "No image selected...",
    dragAndDropCapable: false,
    parsed_csv: [],
    parse_header: [],
    uploading: false,
    errorMessage: { title: "", message: "" },
    loadFileOption: "",
    giornate: [],
    rowsPerPageItems: [3, 6, 9, 12, 15],
    pagination: {
      rowsPerPage: 3
    },
    rol: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo equipo" : "Editar equipo";
    },

    isMobile() {
      // console.log(window.screen.availWidth);
      return window.screen.availWidth <= 414; //iPhone 6,7,8 plus screen width
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
    if (this.selectable) {
      this.headers.pop(this.headers.length - 1);
    }
  },

  mounted() {
    if (this.selectable == true) {
      if (this.determineDragAndDropCapable() && !this.isMobile) {
        this.loadFileOption = "Arrastre y suelte su archivo aquí";
        [
          "drag",
          "dragstart",
          "dragend",
          "dragover",
          "dragenter",
          "dragleave",
          "drop"
        ].forEach(
          (e => {
            this.$refs.fileform.addEventListener(
              e,
              e => {
                e.preventDefault();
                e.stopPropagation();
              },
              false
            );
          }).bind(this)
        );
        this.$refs.fileform.addEventListener(
          "drop",
          (e => {
            this.uploading = true;
            this.loadCSV(e.dataTransfer.files[0]);
          }).bind(this)
        );
      } else {
        this.loadFileOption = "Presione aquí para subir su archivo";
      }
    }
  },

  methods: {
    initialize() {
      this.teams = [
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
      this.headers = [
        {
          text: "Equipo",
          value: "name",
          sortable: this.teams.length > 0,
          align: "center"
        },
        {
          text: "Apodo",
          value: "alias",
          sortable: this.teams.length > 0,
          align: "center"
        },
        { text: "Escudo", value: "logo", sortable: false, align: "center" },
        {
          text: "Jugadores",
          value: "players",
          sortable: this.teams.length > 0,
          align: "center"
        },
        {
          text: "Estatus",
          value: "status",
          sortable: this.teams.length > 0,
          align: "center"
        },
        {
          text: "Acciones",
          value: "options",
          sortable: false,
          align: "center"
        }
      ];
    },

    newItem() {
      this.editedIndex = -1;
      this.editedItem = {
        name: "",
        alias: "",
        logo: "",
        players: "",
        status: { icon: "", color: "" }
      };
      this.drawer = true;
    },

    importCSV() {
      this.drawer = true;
    },

    csvJSON(csv) {
      var lines = csv.split("\n");
      var result = [];
      this.parse_header = lines[0].split(",");

      for (var i = 0; i < this.parse_header.length; i++) {
        this.parse_header[i] = this.parse_header[i]
          .replace("\r", "")
          .toLowerCase();
      }

      lines.map((line, indexLine) => {
        if (indexLine < 1) return; // Jump header line
        var obj = {};
        var currentline = line.split(",");
        this.parse_header.map(
          (header, indexHeader) =>
            (obj[header] =
              currentline[indexHeader] != undefined &&
              currentline[indexHeader].length > 0
                ? currentline[indexHeader].replace("\r", "")
                : currentline[indexHeader])
        );
        result.push(obj);
      });
      result.pop(); // remove the last item because undefined values
      return result;
    },

    loadCSV(file) {
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(file);
        var file_format = file.name.split(".")[1];
        if (file_format != "csv") {
          this.errorMessage.message = {
            title: "Error al subir el archivo",
            message: "Formato de archivo no compatible."
          };
          this.alert_dialog = true;
          return null;
        }
        reader.onload = (e => {
          var csv = e.target.result;
          // this.parsed_csv = this.csvArray(csv);
          this.parsed_csv = this.csvJSON(csv);
          // this.$refs.fileform.reset();
          setTimeout(() => (this.uploading = false), 1500);
        }).bind(this);
        reader.onerror = (e => {
          if (e.target.error.name == "NotReadableError") {
            this.errorMessage.message = {
              title: "Error al subir el archivo",
              message: "No se pudo leer el archivo CSV"
            };
            this.alert_dialog = true;
          }
        }).bind(this);
      } else {
        this.errorMessage.message = {
          title: "Error al subir el archivo",
          message:
            "Su navegador no permite cargar archivos al sistema desde su ordenador."
        };
        this.alert_dialog = true;
      }
    },

    loadCSVByInput(e) {
      this.uploading = true;
      let file = e.target.files[0];
      if (file !== undefined) {
        this.loadCSV(file);
      } else {
        this.errorMessage.message = {
          title: "Error al subir el archivo",
          message: "El archivo CSV no pudo cargarse correctamente"
        };
      }
    },

    pickCSV() {
      this.$refs.csv.click();
    },

    determineDragAndDropCapable() {
      var div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },

    verifyGiornate(giornate) {
      for (var i = 0; i < this.giornate.length; i++) {
        if (this.giornate[i] == giornate) return false;
      }
      return true;
    },

    verifyMatches(giornate, num) {
      for (var i = 0; i < giornate.length; i++) {
        if (giornate[i] == num) return false;
      }
      return true;
    },

    fillGiornate(n) {
      var cols = [];
      var num = 0;
      for (var c = 0; c <= n; c++) {
        num = Math.floor(Math.random() * (n + 1) + 0);
        while (this.verifyMatches(cols, num) == false) {
          num = Math.floor(Math.random() * (n + 1) + 0);
        }
        cols[c] = num;
      }
      return cols;
    },

    giornates(teams) {
      var n = teams.length - 1; //cantidad de equipos -1 que es el total de jornadas del rol
      var num = 0; //numero aleatorio
      var cols = this.fillGiornate(n); //array de partidos tipo [0,1,2,3] donde 0 vs 1 y 2 vs 3
      for (var r = 0; r < n; r++) {
        while (this.verifyGiornate(cols) == false) {
          cols = this.fillGiornate(n);
        }
        this.giornate[r] = cols;
      }
      // console.log(this.giornate);
    },

    creaCalendario(teams) {
      this.rol = []; //vaciamos el rol para empezar de cero
      if (teams.length % 2 !== 0 && teams.length > 0) {
        console.log(teams.length % 2);
        this.alert_dialog = true;
        this.errorMessage = {
          title: "Error de torneo",
          message:
            "Para hacer un rol debe tener un total par de equipos (2, 4, 6, 8, 10)"
        };
        return;
      }
      this.drawer = true;
      this.giornates(teams);
      var rol = [];

      for (var g = 0; g < this.giornate.length; g++) {
        var matches = [];
        for (var i = 0; i < this.giornate[g].length; i++) {
          matches.push(teams[this.giornate[g][i]]);
        }

        rol.push({
          giornate: g + 1,
          matches: matches
        });
      }
      this.rol = rol;
      // console.log(this.rol);
    },

    editItem(item) {
      this.editedIndex = this.teams.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.drawer = true;
    },

    deleteItem(item) {
      this.editedIndex = this.teams.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.alert_dialog = true;
    },

    confirmDeletion() {
      this.teams.splice(this.editedIndex, 1);
      this.alert_dialog = false;
    },

    close() {
      this.selectable ? this.resetRoles() : null;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
      this.imageName = "No image selected...";
      this.drawer = false;
    },

    resetRoles() {
      this.rol = [];
      this.selected = [];
      this.parsed_csv = [];
      // this.rowsPerPageItems = [3, 6, 9, 12, 15];
      // this.pagination = {rowsPerPage: 3};
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.teams[this.editedIndex], this.editedItem);
      } else {
        this.teams.push(this.editedItem);
      }
      this.close();
      this.drawer = false;
    },

    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    }
  }
};
</script>
<style>
.ddform {
  display: block;
  height: 100px;
  width: 100%;
  /* background: #ccc; */
  margin: auto;
  text-align: center;
  line-height: 100px;
  border-radius: 4px;
  border: #ccc dashed 2.5px;
}
</style>