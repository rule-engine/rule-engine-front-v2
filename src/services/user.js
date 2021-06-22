import {user, ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param username 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(username, password) {
    return request(user.LOGIN, METHOD.POST, {
        username: username,
        password: password
    })
}

/**
 * 获取用户信息
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getUserInfo() {
    return request(user.GET_USER_INFO, METHOD.POST)
}

export async function getRoutesConfig() {
    return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout(router) {
    request(user.LOGOUT, METHOD.POST).finally(() => {
        localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
        localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
        localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
        removeAuthorization()
        router.push('/login')
    })
}

export default {
    login,
    logout,
    getRoutesConfig
}
