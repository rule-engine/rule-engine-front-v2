import {METHOD, request} from "@/utils/request";
import {rule, ruleSet} from "@/services/api";


export async function saveRuleAndBindRuleSet(query) {
    return request(rule.SAVE_RULE_AND_BIND_RULE_SET, METHOD.POST, query)
}
export async function ruleSetRuleRearrange(param) {
    return request(ruleSet.REARRANGE, METHOD.POST, param)
}
export async function deleteRuleSetRule(query) {
    return request(ruleSet.DELETE_RILE_SET_RULE, METHOD.POST, query)
}

export async function saveAction(query) {
    return request(rule.SAVE_ACTION, METHOD.POST, query)
}
