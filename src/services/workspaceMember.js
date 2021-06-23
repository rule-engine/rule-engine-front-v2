import {workspaceMember} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取工作空间成员列表
 */
export async function memberList(query) {
    return request(workspaceMember.LIST, METHOD.POST, query)
}

export async function bindMember(query) {
    return request(workspaceMember.BIND_MEMBER, METHOD.POST, query)
}

export default {
    memberList
}
