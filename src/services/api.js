//跨域代理前缀
const API_PROXY_PREFIX = '/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.WEB_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.WEB_BASE_URL
module.exports = {
    user: {
        LOGIN: `${BASE_URL}/user/login`,
        GET_USER_INFO: `${BASE_URL}/user/getUserInfo`,
        LOGOUT: `${BASE_URL}/user/logout`,
        LIST: `${BASE_URL}/user/list`,
        ADD_USER: `${BASE_URL}/user/add`,
        DELETE_USER: `${BASE_URL}/user/delete`,
        UPDATE_USER_INFO: `${BASE_URL}/user/updateUserInfo`,
        SELECT_USER_BY_ID: `${BASE_URL}/user/selectUserById`,
    },
    workspace: {
        LIST: `${BASE_URL}/workspace/list`,
        CURRENT_WORKSPACE: `${BASE_URL}/workspace/currentWorkspace`,
        CHANGE: `${BASE_URL}/workspace/change`,
        ADD: `${BASE_URL}/workspace/add`,
        EDIT: `${BASE_URL}/workspace/edit`,
        DELETE_WORKSPACE: `${BASE_URL}/workspace/delete`,
        ACCESS_KEY: `${BASE_URL}/workspace/accessKey`,
        UPDATE_ACCESS_KEY: `${BASE_URL}/workspace/updateAccessKey`,
        SELECT_WORKSPACE_BY_ID: `${BASE_URL}/workspace/selectWorkSpaceById`,
    },
    workspaceMember: {
        LIST: `${BASE_URL}/workspaceMember/list`,
        BIND_MEMBER: `${BASE_URL}/workspaceMember/bindMember`,
        OPTIONAL_PERSONNEL: `${BASE_URL}/workspaceMember/optionalPersonnel`,
        DELETE_MEMBER: `${BASE_URL}/workspaceMember/deleteMember`,
        PERMISSION_TRANSFER: `${BASE_URL}/workspaceMember/permissionTransfer`,
    },
    generalRule: {
        LIST: `${BASE_URL}/ruleEngine/generalRule/list`,
        DELETE: `${BASE_URL}/ruleEngine/generalRule/delete`,
    },
    dataPermission: {
        LIST: `${BASE_URL}/ruleEngine/dataPermission/list`,
        UPDATE: `${BASE_URL}/ruleEngine/dataPermission/saveOrUpdateDataPermission`,
    },
    myfunction: {
        LIST: `${BASE_URL}/ruleEngine/function/list`,
        SELECT_FUNCTION_BY_ID: `${BASE_URL}/ruleEngine/function/get`,
        RUN: `http://localhost:8081/ruleEngine/function/run`,
    },
    ROUTES: `${BASE_URL}/routes`,
    GOODS: `${BASE_URL}/goods`,
    GOODS_COLUMNS: `${BASE_URL}/columns`,
}
