'use strict'
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './vuex/mutations'
import {actions, endpoint} from  './vuex/actions'
import getters from  './vuex/getters'

Vue.use(Vuex)



const store = new Vuex.Store({
  strict:true,
  state: {
    alert:{
      visible:false,
      type:'success',
      text:'',
    },
    auth: '',
    endpoint: endpoint,
    user: {
      firstName: '',
      lastName: '',
      username:'',
      email: '',
      bio: '',
      city: '',
      country: '',
      dob_ts: 0,
      email: '',
      state: '',
      profilePicture: null,
    },
    writter: {
      articles: [],

    },
  }, //End state
  getters,
  mutations,
  actions,
});

export default store
