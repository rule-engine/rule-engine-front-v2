import * as userApi from '@/api/userApi'
import {
  post,
  get
} from '@/utils/request';


export default userApi

// 获取登录用户信息 import {getUserInfo} from "@/api"
export const getUserInfo = () => {
  return get("/user/getUserInfo");
}

export const logout = () => {
  return post("/user/logout");
}

export const login = (param) => {
  return post('/user/login', param)
}
