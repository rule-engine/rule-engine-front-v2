import request from '@/utils/request'
import * as userApi from '@/api/userApi'

export default userApi

// 获取登录用户信息 import {getUserInfo} from "@/api"
export function getUserInfo() {
  return request.post("/user/getUserInfo");
}

export function logout() {
  return request.post("/user/logout");
}

export function login(param) {
  return request.post('/user/login', param)
}
