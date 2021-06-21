const storageCurrentWorkSpace = 'storage_currentWorkSpace'
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
                            wsId: 0,
                            name: '默认工作空间'
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
        }
    }
}
