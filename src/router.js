import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

// const Register = () => import('./assets/views/register.vue');

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: resolve => require(['./assets/views/home.vue'],resolve)
    },
    {
      path: '/lists',
      component: resolve => require(['./assets/views/lists.vue'],resolve)
    },
    
  ]
})
