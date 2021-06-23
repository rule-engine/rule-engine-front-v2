import {workspace} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取工作空间列表
 */
export async function list(query) {
    return request(workspace.LIST, METHOD.POST, query)
}

/**
 * 切换工作空间
 */
export async function change(param) {
    return request(workspace.CHANGE, METHOD.POST, param)
}

/**
 * 获取当前工作空间
 */
export async function currentWorkspace(query) {
    return request(workspace.CURRENT_WORKSPACE, METHOD.POST, query)
}


export default {
    list,
    change,
    currentWorkspace
}
