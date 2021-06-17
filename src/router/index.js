import Vue from 'vue'
import Router from 'vue-router'


import Page500 from '@/components/500.vue'
import Page404 from '@/components/404.vue'

import Index from '@/views/Index'
import Login from '@/views/auth/Login.vue'
import Drag from '@/views/drag/Drag'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [], meta: {
        title: '首页',
        needLogin: true,
      },
    },
    {
      path: '/home',
      name: 'home',
      component: Drag,
      children: [], meta: {
        title: '拖拽布局',
        needLogin: false,
      },
    },
    {
      path: '/500',
      name: 'Page500',
      component: Page500,
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    }
  ]
})
