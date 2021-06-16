import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'

import Login from '@/components/Login.vue'
import Page500 from '@/components/500.vue'
import Page404 from '@/components/404.vue'

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
