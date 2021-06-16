// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './core/lazy-use'

import '@/permission';
import store from '@/store';
Vue.config.productionTip = false;

const Instance = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

export default Instance;
