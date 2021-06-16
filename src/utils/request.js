import axios from 'axios';
import config from '@/config/config'
import {
  getToken,
  setToken,
  removeAll
} from '@/utils/auth';

import ElementUI, {
  Notification
} from 'element-ui';
import router from "../router";

axios.defaults.withCredentials = true;
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: config.api_url,

  // 请求超时时间
  timeout: 20000
});

/**
 * 异常拦截处理器
 *
 * @param {*} error
 */
const errorHandler = (error) => {
  // 判断是否是响应错误信息
  if (error.response) {
    if (error.response.status === 401) {
      removeAll()
      location.reload();
    } else {
      Notification({
        message: '网络异常,请稍后再试...',
        position: 'top-right'
      });
    }
  }

  return Promise.reject(error);
}

// 请求拦截器
request.interceptors.request.use(config => {
  // 请求时携带此token
  config.headers['token'] = getToken();
  return config;
}, errorHandler);


// 响应拦截器
axios.interceptors.response.use(response => {
  let token = response.headers.token;
  if (token != null) {
    setToken(token, 60 * 60 * 24 * 7)
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
/**
 * GET 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const get = (url, data = {}, options = {}) => {
  return request({
    url,
    params: data,
    method: 'get',
    ...options
  });
}

/**
 * POST 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  });
}

/**
 * 上传文件 POST 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const upload = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data: data,
    ...options
  });
}
