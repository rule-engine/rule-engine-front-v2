export default {
    namespaced: true,
    state: {
        currentWorkSpace: {
            wsId: 0,
            name: '默认工作空间'
        }
    },
    getters: {
        currentWorkSpace: state => {
            return state.currentWorkSpace
        }
    },
    mutations: {
        setWorkSpace: (state, currentWorkSpace) => {
            console.log('currentWorkSpace',currentWorkSpace)
            state.currentWorkSpace = currentWorkSpace
        }
    }
}
