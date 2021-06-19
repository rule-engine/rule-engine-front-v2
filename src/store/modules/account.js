export default {
    namespaced: true,
    state: {
        user: {
            // 用户ID
            uid: 0,
            // 用户昵称
            username: 'lq',
            // 性别
            sex: 0,
            // 个性签名
            signature: '',
            // 个性头像
            avatar: require("@/assets/img/avatar.jpg"),
            // 当前登录状态
            loginStatus: false,
            position: '北京市xxx'
        },
        permissions: null,
        roles: null,
        routesConfig: null
    },
    getters: {
        user: state => {
            if (!state.user) {
                try {
                    const user = localStorage.getItem(process.env.VUE_APP_USER_KEY)
                    state.user = JSON.parse(user)
                } catch (e) {
                    console.error(e)
                }
            }
            return state.user
        },
        permissions: state => {
            if (!state.permissions) {
                try {
                    const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY)
                    state.permissions = JSON.parse(permissions)
                    state.permissions = state.permissions ? state.permissions : []
                } catch (e) {
                    console.error(e.message)
                }
            }
            return state.permissions
        },
        roles: state => {
            if (!state.roles) {
                try {
                    const roles = localStorage.getItem(process.env.VUE_APP_ROLES_KEY)
                    state.roles = JSON.parse(roles)
                    state.roles = state.roles ? state.roles : []
                } catch (e) {
                    console.error(e.message)
                }
            }
            return state.roles
        },
        routesConfig: state => {
            if (!state.routesConfig) {
                try {
                    const routesConfig = localStorage.getItem(process.env.VUE_APP_ROUTES_KEY)
                    state.routesConfig = JSON.parse(routesConfig)
                    state.routesConfig = state.routesConfig ? state.routesConfig : []
                } catch (e) {
                    console.error(e.message)
                }
            }
            return state.routesConfig
        }
    },
    mutations: {
        setUser: (state, user) => {
            state.user = user
            localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
        },
        setPermissions(state, permissions) {
            state.permissions = permissions
            localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions))
        },
        setRoles(state, roles) {
            state.roles = roles
            localStorage.setItem(process.env.VUE_APP_ROLES_KEY, JSON.stringify(roles))
        },
        setRoutesConfig(state, routesConfig) {
            state.routesConfig = routesConfig
            localStorage.setItem(process.env.VUE_APP_ROUTES_KEY, JSON.stringify(routesConfig))
        }
    }
}
