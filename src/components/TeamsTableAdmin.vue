<template>
    <div>
        <!-- NAVIGATION DRAWER FOR EDITION -->
        <v-navigation-drawer v-model="drawer" width="1000" touchless temporary right disable-resize-watcher app>
            <v-toolbar dark color="blue-grey darken-2">
                <v-btn icon dark @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title><span class="headline">{{ formTitle }}</span></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="save">
                    <v-icon>fas fa-save</v-icon>
                </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-img v-if="editedItem.name.length > 0" :aspect-ratio="30/9" :src="editedItem.logo" gradient="to bottom left, rgba(100,115,201,.43), rgba(25,32,72,0.8)">
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
                            <v-text-field readonly @click='pickFile' v-model="imageName" prepend-icon='attach_file' label="Escudo del equipo"></v-text-field>
                            <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked">                            
                        </v-form>
                    </v-flex>
                </v-layout>
            </v-container>                      
        </v-navigation-drawer>
        <!-- END NAVIGATION DRAWER FOR EDITION-->        
        <v-toolbar flat color="white">                        
            <v-spacer></v-spacer>
            <v-btn @click="newItem" fab dark small class="success"><v-icon dark>add</v-icon></v-btn>            
            <!-- DELETION DIALOG -->
            <v-dialog v-model="deletion_dialog" max-width="290">
                <v-card>
                    <v-card-title class="headline">Eliminar &nbsp; <strong>{{ editedItem.name }}</strong></v-card-title>
                    <v-card-text>¿Realmente desea eliminar el equipo seleccionado?</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat="flat" @click="deletion_dialog = false">
                            Cancelar
                        </v-btn>

                        <v-btn color="green darken-1" flat="flat" @click="confirmDeletion">
                            Si, eliminar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- END DELETION DIALOG -->
        </v-toolbar>
        <v-data-table dark :headers="headers" :items="teams" :loading="loading" class="elevation-1">
                      <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.alias }}</td>
                <td class="text-xs-center">
                <v-avatar :tile="false" :size="35" color="grey lighten-4">
                    <img :src="props.item.logo" :alt="props.item.alias">
                </v-avatar>
                </td>
                <td class="text-xs-center">{{ props.item.players }}</td>
                <td class="text-xs-center">
                <v-icon :color="props.item.status.color">
                    {{ props.item.status.icon }}
                </v-icon>
                </td>
                <td class="justify-center layout px-0">
                <v-btn @click="editItem(props.item)" flat icon><v-icon small>edit</v-icon></v-btn>
                <v-btn @click="deleteItem(props.item)" flat icon><v-icon small>delete</v-icon></v-btn>
                </td>
            </template>
            <template slot="no-data">
                <v-alert :value="true" color="error" icon="warning">
                    Aún no tienes equipos.<br>
                    Crea uno con el botón de arriba.
                </v-alert>
            </template>
        </v-data-table>        
    </div>    
</template>

<script>
    export default {
        name: 'TeamsTable',
        data: () => ({
                edition_drawer_width: Number.parseInt(window.screen.availWidth * .70),
                isMobile: window.screen.availWidth <= 414, //iPhone 6,7,8 plus screen width 
                drawer: false,
                deletion_dialog: false,
                loading: false,
                notifications: false,
                sound: true,
                widgets: false,
                teams: [],
                headers: [],
                editedIndex: -1,
                editedItem: {
                    name: '',
                    alias: '',
                    logo: '',
                    players: '',
                    status: {icon: '', color: ''}
                },
                defaultItem: {
                    name: '',
                    alias: '',
                    logo: '',
                    players: '',
                    status: {icon: '', color: ''}
                },
                imageName: 'No image selected...'
            }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Nuevo equipo' : 'Editar equipo';
            }
        },

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
                this.teams = [
                    {
                        name: 'Barcelona FC',
                        alias: 'Barca FC',
                        logo: 'http://aux.iconspalace.com/uploads/1278105613.png',
                        players: 24,
                        status: {icon: 'fas fa-circle', color: 'success'}
                    },
                    {
                        name: 'Real Madrid FC',
                        alias: 'Real Madrid FC',
                        logo: 'https://vignette.wikia.nocookie.net/inciclopedia/images/4/4d/Real_madrid_logo.png/revision/latest?cb=20081102004028',
                        players: 23,
                        status: {icon: 'fas fa-circle', color: 'success'}
                    },
                    {
                        name: 'Arsenal FC',
                        alias: 'AFC',
                        logo: 'https://upload.wikimedia.org/wikipedia/hif/8/82/Arsenal_FC.png',
                        players: 22,
                        status: {icon: 'fas fa-circle', color: 'error'}
                    },
                    {
                        name: 'Boca Juniors FC',
                        alias: 'Boca FC',
                        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors.svg/887px-Escudo_del_Club_Atl%C3%A9tico_Boca_Juniors.svg.png',
                        players: 21,
                        status: {icon: 'fas fa-circle', color: 'warning'}
                    },
                    {
                        name: 'Deportivo Cruz Azul',
                        alias: 'Cruz Azul',
                        logo: 'http://as00.epimg.net/img/comunes/fotos/fichas/equipos/large/4204.png',
                        players: 20,
                        status: {icon: 'fas fa-circle', color: 'error'}
                    }
                ];
                //this.teams = [];
                this.headers = [
                    {text: 'Equipo', value: 'name', sortable: this.teams.length > 0, align: 'center'},
                    {text: 'Apodo', value: 'alias', sortable: this.teams.length > 0, align: 'center'},
                    {text: 'Escudo', value: 'logo', sortable: false, align: 'center'},
                    {text: 'Jugadores', value: 'players', sortable: this.teams.length > 0, align: 'center'},
                    {text: 'Estatus', value: 'status', sortable: this.teams.length > 0, align: 'center'},
                    {text: 'Acciones', value: 'options', sortable: false, align: 'center'}
                ];
            },

            newItem() {
                this.editedIndex = -1;
                this.editedItem = {
                    name: '',
                    alias: '',
                    logo: '',
                    players: '',
                    status: {icon: '', color: ''}
                };
                this.drawer = true;
            },

            editItem(item) {
                this.editedIndex = this.teams.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.drawer = true;
            },

            deleteItem(item) {
                this.editedIndex = this.teams.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.deletion_dialog = true;
            },

            confirmDeletion() {
                this.teams.splice(this.editedIndex, 1);
                this.deletion_dialog = false;
            },

            close() {
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300);
                this.imageName = 'No image selected...';
                this.drawer = false;
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
                    if (this.imageName.lastIndexOf('.') <= 0) {
                        return;
                    }
                    const fr = new FileReader();
                    fr.readAsDataURL(files[0]);
                    fr.addEventListener('load', () => {
                        this.imageUrl = fr.result;
                        this.imageFile = files[0]; // this is an image file that can be sent to server...
                    });
                } else {
                    this.imageName = '';
                    this.imageFile = '';
                    this.imageUrl = '';
                }
            }
        }
    }
</script>
<style scoped>    
</style>