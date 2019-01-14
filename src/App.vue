<template>
  <v-app class="background-app" v-bind:style="{ 'background-image': background}">
    <v-navigation-drawer persistent :mini-variant="miniVariant" :clipped="clipped" v-model="drawer"
      enable-resize-watcher app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="clipped" class="secondary white--text toolbar">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <a href="/">
        <img src="https://s3.amazonaws.com/app.estadiototal.com/public/img/estadiototal.png" class="logo">
      </a>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      
      <v-toolbar-items v-if="isAuth">
        <v-btn flat depressed  class="white--text hidden-xs-only" > {{ getUser.username }} </v-btn>
      </v-toolbar-items>
      <v-menu offset-y v-if="isAuth">
        <v-btn class="user-avatar" slot="activator" dark icon>
          <v-avatar :size="38" color="teal">
            <v-icon>account_circle</v-icon>
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile @click="">
            <v-list-tile-title>menu1</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logoutMethod">
            <v-list-tile-title >Logout</v-list-tile-title>
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
        drawer: false,
        showAlert: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        background:''
      }
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
      }
    },
    created: function(){
        let rand = Math.floor((Math.random() * 6) + 1);
        this.background=`url(https://s3.amazonaws.com/app.estadiototal.com/public/img/background-${rand}.jpg)!important`;
    },
    methods:{
      logoutMethod: function(){
        let vm = this;
        console.log('salir');
        this.$store.dispatch('logout').then(function(){ vm.$router.push({name:'home'});});
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
            text: '',
          });
        }
      }
    },
    mounted:function(){
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

 v-card-text p{
   color:#777;
 }

 
</style>