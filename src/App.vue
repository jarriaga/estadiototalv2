<template>
    <v-app class="background-app" v-bind:style="{ 'background-image': background}">
        <!--<v-navigation-drawer v-if="isAuth" permanent="true" :mini-variant-width="280" :mini-variant="true" 
            :clipped="clipped" enable-resize-watcher app>

            <v-list>                
                <v-list-group no-action value="true" v-for="(item, i) in items" :key="i">
                    <v-list-tile slot="activator">
                        <v-list-tile-action><v-icon v-html="item.icon"></v-icon></v-list-tile-action>
                        <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile v-for="(subitem, i) in item.subitems" :key="i" @click="">
                        <a v-bind:href="subitem.url"><v-list-tile-title v-text="subitem.title"></v-list-tile-title></a>
                    </v-list-tile>
                </v-list-group>
            </v-list>

        </v-navigation-drawer>-->

        <v-navigation-drawer v-if="isAuth" :mini-variant.sync="mini" v-model="drawer" disable-resize-watcher hide-overlay stateless app>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar>
                        <v-list-tile-avatar>
                            <v-avatar :size="38" color="teal">
                                <v-icon>account_circle</v-icon>
                            </v-avatar>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ getUser.username }}</v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-btn icon @click.stop="collapse">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-list class="pt-0" dense>
                    <v-divider></v-divider>
                <v-list-group v-model="item.active" no-action :value="false" v-for="(item, i) in items" :key="i">
                    <v-list-tile slot="activator">
                        <v-list-tile-action><v-icon v-html="item.icon"></v-icon></v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title v-text="item.title"></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                    <v-list-tile v-for="(subitem, i) in item.subitems" :key="i" router :to="subitem.url">
                                 <v-list-tile-content>                           
                            <v-list-tile-title v-text="subitem.title"></v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

                </v-list-group>
                <!--<v-list-tile v-for="item in items" :key="item.title" @click="">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>-->
            </v-list>

        </v-navigation-drawer>

        <v-toolbar app :clipped-left="clipped" class="secondary white--text toolbar">
                   <v-toolbar-side-icon v-if="isAuth && isMobile" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <a href="/">
                <img src="https://s3.amazonaws.com/app.estadiototal.com/public/img/estadiototal.png" class="logo">
            </a>
            <!--<v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>-->
            <!--<v-btn icon @click.stop="clipped = !clipped">
                <v-icon>web</v-icon>
            </v-btn>-->

            <v-spacer></v-spacer>

            <v-toolbar-items v-if="isAuth">
                <v-btn flat depressed  class="white--text hidden-xs-only" > {{ getUser.username }} </v-btn>
            </v-toolbar-items>
            <v-menu offset-y v-if="isAuth && !isMobile">
                <v-btn class="user-avatar" slot="activator" dark icon>
                    <v-avatar :size="38" color="teal">
                        <v-icon>account_circle</v-icon>
                    </v-avatar>
                </v-btn>
                <v-list>
                    <v-list-tile>
                        <v-list-tile-title>menu1</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="logoutMethod">
                        <v-list-tile-title >Salir</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>

        <v-content>
            {{alertVisible}}
            <v-alert class="alertMargin" v-model="showAlert" dismissible :type="$store.state.alert.type" transition="fade-transition">{{$store.state.alert.text}}</v-alert>
            <router-view />
        </v-content>

        <v-footer :fixed="true" app>
            <span>&copy; 2017</span>
        </v-footer>
    </v-app>
</template>

<script>

    import {mapGetters} from 'vuex'

            export default {
                name: 'App',
                data() {
                    return {
                        clipped: false,
                        drawer: true,
                        mini: true,
                        right: null,
                        showAlert: false,
                        items: [
                            {icon: 'fas fa-trophy', title: 'Torneos', subitems: [{title: 'Rol de partidos', url: '/roles'},{title: 'Equipos', url: '/teams'}, {title: 'Jugadores', url: '/players'}, {title: 'Estadios/Canchas', url: '/stadiums'}]},
                            {icon: 'fas fa-futbol', title: 'Partidos', subitems: [{title: 'Tabla general', url: '/general-table'}, {title: 'Exportar/Importar', url: '/import-export'}]},
                            {icon: 'fas fa-balance-scale', title: 'Arbitraje', subitems: [{title: 'Árbitros', url: '/referees'}]},
                            {icon: 'fas fa-star', title: 'Contenido', subitems: [{title: 'Reglamento', url: '/regulation'}, {title: 'Convocatoria', url: '/announcement'}]},
                            {icon: 'fas fa-hand-holding-usd', title: 'Pagos e Inscripciones', subitems: [{title: 'Registro', url: '/registration'}, {title: 'Credenciales', url: '/credentials'}]}
                        ],
                        miniVariant: false,
                        //right: true,
                        rightDrawer: false,
                        background: '',
                        // mobile: false
                    };
                },
                computed: {
                    ...mapGetters([
                            'getUser',
                            'isAuth'
                    ]),
                    alertVisible() {
                        if (this.$store.state.alert.visible) {
                            this.showAlert = true;
                        } else {
                            this.showAlert = false;
                        }
                    },
                    isMobile(){
                        return window.screen.availWidth < 720;
                    }
                },
                created: function () {
                    let rand = Math.floor((Math.random() * 6) + 1);
                    this.background = `url(https://s3.amazonaws.com/app.estadiototal.com/public/img/background-${rand}.jpg)!important`;
                },
                methods: {
                    logoutMethod: function () {
                        let vm = this;
                        console.log('salir');
                        this.$store.dispatch('logout').then(function () {
                            vm.$router.push({name: 'home'});
                        });
                    },
                    collapse: function () {
                        var that = this;
                        that.mini = !that.mini;
                        this.items.forEach(item => {
                            if (item.active) {
                                item.active = false;
                                return false;
                            }
                        });
                    }
                },
                watch: {
                    showAlert(val) {
                        if (val) {
                            // Custom action when the alert was shown
                        } else {
                            this.$store.commit('showError', {
                                visible: false,
                                type: 'error',
                                text: ''
                            });
                        }
                    }
                },
                mounted: function () {
                }
            }
</script>


<style scoped>

    .logo {
        width: 100px;
    }

    .background-app {
        background-size: cover!important;
        background-color:#DEDEDE;
    }

    .toolbar i,
    .toolbar {
        color: #fff !important;
    }

    .alertMargin{
        margin-top: 0px;
    }

    /*@media(){
        
    }*/

    v-card-text p{
        color:#777;
    }

 
</style>

