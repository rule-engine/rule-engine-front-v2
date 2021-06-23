const storageCurrentWorkSpace = 'storage_currentWorkSpace'
import {currentWorkspace} from '@/services/workspace'

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
                name: undefined,
                code: undefined
            }
            localStorage.setItem(storageCurrentWorkSpace, undefined)
        }
    },
    actions: {
        //获取工作空间
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
