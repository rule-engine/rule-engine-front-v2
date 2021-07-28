import {ruleSet} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 验证规则集code
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function verifyRuleCode(query) {
    return request(ruleSet.VERIFY_RULE_CODE, METHOD.POST, query)
}

export async function list(query) {
    return request(ruleSet.LIST, METHOD.POST, query)
}

export async function deleteRuleSet(query) {
    return request(ruleSet.DELETE, METHOD.POST, query)
}
export async function deleteRuleSetRule(query) {
    return request(ruleSet.DELETE_RILE_SET_RULE, METHOD.POST, query)
}

//保存规则集定义
export async function addRuleSet(param) {
    return request(ruleSet.ADD, METHOD.POST, param)
}

//更新规则集定义
export async function updateRuleSetDefinition(param) {
    return request(ruleSet.UPDATE_DEFINITION, METHOD.POST, param)
}


export async function getRuleSetConfig(query) {
    return request(ruleSet.GET_RULE_SET_CONFIG, METHOD.POST, query)
}


export async function getRuleDefinition(query) {
    return request(ruleSet.GET_RULE_SET_DEFINITION, METHOD.POST, query)
}


export async function saveAction(query) {
    return request(ruleSet.SAVE_ACTION, METHOD.POST, query)
}

export async function generationRelease(query) {
    return request(ruleSet.GENERATION_RELEASE, METHOD.POST, query)
}

export async function runTest(query) {
    return request(ruleSet.RUN_TEST, METHOD.POST, query)
}


export async function viewRuleSet(query) {
    return request(ruleSet.VIEW, METHOD.POST, query)
}

export async function saveDefaultRule(query) {
    return request(ruleSet.SAVE_DEFAULT_RULE, METHOD.POST, query)
}

export async function defaultRuleSetSwitch(query) {
    return request(ruleSet.DEFAULT_RULE_SET_SWITCH, METHOD.POST, query)
}

export async function ruleSetPublish(query) {
    return request(ruleSet.PUBLISH, METHOD.POST, query)
}

export async function ruleSetDownloadList(query) {
    return request(ruleSet.DOWNLOAD_LIST, METHOD.POST, query)
}
export async function showHistoryVersionList(query) {
    return request(ruleSet.SHOW_HISTORY_VERSION_LIST, METHOD.POST, query)
}

export async function deleteHistoricalRules(query) {
    return request(ruleSet.DELETE_HISTORICAL_RULES, METHOD.POST, query)
}

export async function goBack(query) {
    return request(ruleSet.GO_BACK, METHOD.POST, query)
}
export async function ruleSetRuleRearrange(param) {
    return request(ruleSet.REARRANGE, METHOD.POST, param)
}

export async function updateStrategyType(query) {
    return request(ruleSet.UPDATE_STRATEGY_TYPE, METHOD.POST, query)
}

export default {
    list,
}
