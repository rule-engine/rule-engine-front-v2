// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import common from '@/common/common';


Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.$common = common;

//默认头像
Vue.prototype.$defaultAvatar = "/static/avatar.jpg";

//请求后端服务器接口前缀
Vue.prototype.$requestBaseURL = "http://49.234.81.14";

//axios配置
Vue.prototype.$axios = axios;
//设置cookie跨域
axios.defaults.withCredentials = true;
axios.defaults.baseURL = this.$requestBaseURL;

// 请求之前
axios.interceptors.request.use(config => {
  // 请求时携带此token
  config.headers['token'] = localStorage.getItem("token");
  return config;
}, error => {
  // 请求错误
  return Promise.reject(error);
});
//服务器响应
axios.interceptors.response.use(response => {
  let token = response.headers.token;
  if (token != null) {
    localStorage.setItem("token", token)
  }
  let data = response.data;
  let code = data.code;
  let message = data.message;
  if (code === 200) {
    return data;
  } else if (code === 4009 || code === 10010004 || code === 99990402 || code === 10011039) {
    router.push({path: '/login'});
    ElementUI.Message({
      type: 'warning',
      message: message
    });
  } else {
    ElementUI.Message({
      type: 'error',
      message: message
    });
  }
}, error => {
  console.log(error);
  if (error.toString().includes("Error: Request failed with status code 404")) {
    router.push({path: '/404'});
  } else {
    router.push({path: '/500'});
  }
  // 响应出现错误
  return Promise.reject(error);
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
