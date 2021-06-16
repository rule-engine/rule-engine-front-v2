import axios from 'axios'
import router from "../router";
import {Notification, MessageBox, Message} from 'element-ui'
import {getToken, setToken} from '@/utils/auth'

const requestBaseURL = "http://49.234.81.14";

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: requestBaseURL,
  // 超时
  timeout: 10000
})

//设置cookie跨域
service.defaults.withCredentials = true;

// 请求之前
service.interceptors.request.use(config => {
  // 请求时携带此token
  config.headers['token'] = getToken();
  return config;
}, error => {
  // 请求错误
  return Promise.reject(error);
});
//服务器响应
service.interceptors.response.use(response => {
  let token = response.headers.token;
  if (token != null) {
    setToken(token)
  }
  let data = response.data;
  let code = data.code;
  let message = data.message;
  if (code === 200) {
    return data;
  } else if (code === 4009 || code === 10010004 || code === 99990402 || code === 10011039) {
    router.push({path: '/login'});
    Message({
      type: 'warning',
      message: message
    });
  } else {
    Message({
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

export default service
