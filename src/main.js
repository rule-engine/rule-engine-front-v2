// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import common from '@/common/common';


Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.$common = common;

//默认头像
Vue.prototype.$defaultAvatar = "/static/avatar.jpg";


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
