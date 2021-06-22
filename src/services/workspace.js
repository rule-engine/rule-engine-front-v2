import {workspace} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取工作空间列表
 */
export async function list(query) {
    return request(workspace.LIST, METHOD.POST, query)
}

export default {
    list,
}
