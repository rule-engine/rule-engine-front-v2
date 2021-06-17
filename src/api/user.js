import {
  post,
  get
} from '@/utils/request';

const BASE = "/user"
// 获取登录用户信息 import {getUserInfo} from "@/api"
export const getUserInfo = () => {
  return post(BASE + "/getUserInfo");
}

export const logout = () => {
  return post(BASE + "/logout");
}

export const login = (param) => {
  return post(BASE + '/login', param)
}
