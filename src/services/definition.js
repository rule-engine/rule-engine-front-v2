import {ruleDefinition} from '@/services/api'
import {METHOD, request} from '@/utils/request'


//保存规则定义
export async function saveRuleDefinition(param) {
    return request(ruleDefinition.SAVERULEDEFINITION, METHOD.POST, param)
}



export default {
    saveRuleDefinition


}
