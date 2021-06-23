
export default {
    namespaced: true,
    state: {
        // currentWorkSpace: undefined
    },
    getters: {
        // currentWorkSpace: state => {
        //     if (!state.currentWorkSpace) {
        //         try {
        //             const currentWorkSpace = Cookie.get(storageCurrentWorkSpace)
        //             if (!currentWorkSpace) {
        //                 state.currentWorkSpace = {
        //                     id: -1,
        //                     name: '加载中...',
        //                     code: undefined
        //                 }
        //             } else {
        //
        //                 state.currentWorkSpace = JSON.parse(currentWorkSpace)
        //             }
        //         } catch (e) {
        //             console.error(e)
        //         }
        //     }
        //     return state.currentWorkSpace
        // }
    },
    mutations: {
        // setWorkSpace: (state, currentWorkSpace) => {
        //     currentWorkSpace.workspaceAdminList = {}
        //     state.currentWorkSpace = currentWorkSpace
        //     Cookie.set(storageCurrentWorkSpace, JSON.stringify(currentWorkSpace), {expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)})
        // },
        // removeWorkSpace: (state) => {
        //     state.currentWorkSpace = undefined
        //     Cookie.set(storageCurrentWorkSpace, '', {expires: 0})
        // }
    },
    actions: {
        //获取工作空间
        // GET_CURRENT_WORK_SPACE({commit, getters}) {
        //     if (!getters.currentWorkSpace || !getters.currentWorkSpace.code) {
        //         currentWorkspace().then(res => {
        //             const data = res.data;
        //             commit("setWorkSpace", data.data)
        //         }).catch(res => {
        //             console.log(res)
        //             commit("setWorkSpace", {name: '加载失败'})
        //         })
        //     }
        //
        // }


    }
}
