import Vue from 'vue'
import Router from 'vue-router'

import TestRouter from './test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "index" */ '@/views/index.vue')
    // },
    // {
    //   path: '/workbench/:id',
    //   name: 'workbench',
    //   component: () => import(/* webpackChunkName: "workbench" */ '@/views/workbench/_id.vue')
    },
    ...TestRouter
  ]
})
