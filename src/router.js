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
import RecoverPassword from './views/RecoverPassword'
import store from './store'

Vue.use(Router)


const guestUser = (to, from, next) =>{
  if(store.getters.isAuth){
    return next('/dashboard');
  }
  return next();
}

const authorizedUser =  (to, from, next) =>{
  if(!store.getters.isAuth){
    return next('/login');
  }
  return next();
}


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
      beforeEnter: guestUser,
    },
    {
      path: '/login',
      name:'login',
      component: Login,
      beforeEnter: guestUser,
    },
    {
      path: '/dashboard',
      name:'dashboard',
      component: Dashboard,
      beforeEnter: authorizedUser,
    },
    {
      path: '/forgotPassword',
      name: 'forgotPassword',
      component: ForgotPassword
    },
    {
      path: '/recoverPassword/:token',
      name: 'recoverPassword',
      component: RecoverPassword
    }
  ]
})
