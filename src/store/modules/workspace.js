const storageCurrentWorkSpace = 'storage_currentWorkSpace'
import {currentWorkspace, change} from '@/services/workspace'

export default {
    namespaced: true,
    state: {
        currentWorkSpace: undefined
    },
    getters: {
        currentWorkSpace: state => {
            if (!state.currentWorkSpace) {
                try {
                    const currentWorkSpace = localStorage.getItem(storageCurrentWorkSpace)
                    if (!currentWorkSpace) {
                        state.currentWorkSpace = {
                            id: -1,
                            name: '加载中...',
                            code: undefined
                        }
                    } else {
                        state.currentWorkSpace = JSON.parse(currentWorkSpace)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            return state.currentWorkSpace
        }
    },
    mutations: {
        setWorkSpace: (state, currentWorkSpace) => {
            state.currentWorkSpace = currentWorkSpace
            localStorage.setItem(storageCurrentWorkSpace, JSON.stringify(currentWorkSpace))
        },
        removeWorkSpace: (state) => {
            state.currentWorkSpace = {
                name: undefined
            }
            localStorage.setItem(storageCurrentWorkSpace, undefined)
        }
    },
    actions: {
        //设置工作空间
        SET_CURRENT_WORK_SPACE({commit}, target) {
            let param = target.target;
            let context = target.context
            change({id: param.id}).then(res => {
                if (res.data.code === 200) {
                    commit("setWorkSpace", param)
                    context.loading = false
                    context.$router.go(0)
                }
            })
        },

        GET_CURRENT_WORK_SPACE({commit, getters}) {
            if (!getters.currentWorkSpace.code) {
                currentWorkspace().then(res => {
                    const data = res.data;
                    commit("setWorkSpace", data.data)
                }).catch(res => {
                    console.log(res)
                    commit("setWorkSpace", {name: '加载失败'})
                })
            }

        }


    }
}
