//跨域代理前缀
const API_PROXY_PREFIX = '/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
    user: {
        LOGIN: `${BASE_URL}/user/login`,
        GET_USER_INFO: `${BASE_URL}/user/getUserInfo`,
        LOGOUT: `${BASE_URL}/user/logout`,
    },
    workspace:{
        LIST:`${BASE_URL}/workspace/list`
    },
    ROUTES: `${BASE_URL}/routes`,
    GOODS: `${BASE_URL}/goods`,
    GOODS_COLUMNS: `${BASE_URL}/columns`,
}
