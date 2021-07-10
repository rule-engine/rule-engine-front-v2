import {generalRule} from '@/services/api'
import {request, METHOD} from '@/utils/request'

export async function list(query) {
    return request(generalRule.LIST, METHOD.POST, query)
}

export async function deleteGeneralRule(query) {
    return request(generalRule.DELETE, METHOD.POST, query)
}

//保存规则定义
export async function addGeneralRule(param) {
    return request(generalRule.ADD, METHOD.POST, param)
}

//更新规则定义
export async function updateGeneralRule(param) {
    return request(generalRule.UPDATE, METHOD.POST, param)
}


export async function getRuleConfig(query) {
    return request(generalRule.GET_RULE_CONFIG, METHOD.POST, query)
}

export default {
    list,
}
