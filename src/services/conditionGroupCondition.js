import {conditionGroupCondition} from '@/services/api'
import {METHOD, request} from '@/utils/request'


export async function saveConditionAndBindGroup(param) {
    return request(conditionGroupCondition.SAVE_CONDITION_AND_BIND_GROUP, METHOD.POST, param)
}
