import {workspaceMember} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取工作空间成员列表
 */
export async function memberList(query) {
    return request(workspaceMember.LIST, METHOD.POST, query)
}


export default {
    memberList
}
