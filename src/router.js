import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Signup from  './views/Signup'
import Confirmation from './views/Confirmation'
import Active from './views/Active'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import ForgotPassword from './views/ForgotPassword'
import Announcement from './views/Announcement'
import Credentials from './views/Credentials'
import GeneralTable from './views/GeneralTable'
import ImportExport from './views/ImportExport'
import Players from './views/Players'
import Referees from './views/Referees'
import Registration from './views/Registration'
import Regulation from './views/Regulation'
import Stadiums from './views/Stadiums'
import Teams from './views/Teams'
import RecoverPassword from './views/RecoverPassword'
import Roles from './views/Roles'
import store from './store'
import NotFoundComponent from './views/NotFoundComponent'

Vue.use(Router);


const guestUser = (to, from, next) =>{
  if(store.getters.isAuth){
    return next('/dashboard');
  }
  return next();
};

const authorizedUser =  (to, from, next) =>{
  if(!store.getters.isAuth){
    return next('/login');
  }
  return next();
};


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      beforeEnter: guestUser
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: Confirmation,
      beforeEnter:guestUser
    },
    {
      path: '/account-active',
      name: 'activation',
      component: Active,
      beforeEnter: guestUser
    },
    {
      path: '/login',
      name:'login',
      component: Login,
      beforeEnter: guestUser
    },
    {
      path: '/dashboard',
      name:'dashboard',
      component: Dashboard,
      beforeEnter: authorizedUser
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: ForgotPassword,
      beforeEnter: guestUser
    },
    {
      path: '/recover-password/:token',
      name: 'recoverPassword',
      component: RecoverPassword,
      beforeEnter: guestUser
    },
    {
      path: '/teams',
      name:'teams',
      component: Teams,
      beforeEnter: authorizedUser
    },
    {
      path: '/roles',
      name:'roles',
      component: Roles,
      beforeEnter: authorizedUser
    },
    {
      path: '/players',
      name:'players',
      component: Players,
      beforeEnter: authorizedUser
    },
    {
      path: '/stadiums',
      name:'stadiums',
      component: Stadiums,
      beforeEnter: authorizedUser
    },
    {
      path: '/general-table',
      name:'general-table',
      component: GeneralTable,
      beforeEnter: authorizedUser
    },
    {
      path: '/import-export',
      name:'import-export',
      component: ImportExport,
      beforeEnter: authorizedUser
    },
    {
      path: '/referees',
      name:'referees',
      component: Referees,
      beforeEnter: authorizedUser
    },
    {
      path: '/regulation',
      name:'regulation',
      component: Regulation,
      beforeEnter: authorizedUser
    },
    {
      path: '/announcement',
      name:'announcement',
      component: Announcement,
      beforeEnter: authorizedUser
    },
    {
      path: '/registration',
      name:'registration',
      component: Registration,
      beforeEnter: authorizedUser
    },
    {
      path: '/credentials',
      name:'credentials',
      component: Credentials,
      beforeEnter: authorizedUser
    },
    { path: '*', component: NotFoundComponent }
  ]
})
