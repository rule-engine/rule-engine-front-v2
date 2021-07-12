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


export async function getRuleDefinition(query) {
    return request(generalRule.GET_RULE_DEFINITION, METHOD.POST, query)
}


export async function saveAction(query) {
    return request(generalRule.SAVE_ACTION, METHOD.POST, query)
}

export async function generationRelease(query) {
    return request(generalRule.GENERATION_RELEASE, METHOD.POST, query)
}

export async function runTest(query) {
    return request(generalRule.RUN_TEST, METHOD.POST, query)
}


export async function viewGeneralRule(query) {
    return request(generalRule.VIEW, METHOD.POST, query)
}

export default {
    list,
}
