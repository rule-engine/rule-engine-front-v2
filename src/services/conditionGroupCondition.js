import {conditionGroupCondition} from '@/services/api'
import {METHOD, request} from '@/utils/request'


export async function saveConditionAndBindGroup(param) {
    return request(conditionGroupCondition.SAVE_CONDITION_AND_BIND_GROUP, METHOD.POST, param)
}

/**
 * 删除条件
 * @param param
 */
export async function deleteCondition(param) {
    return request(conditionGroupCondition.DELETE_CONDITION, METHOD.POST, param)
}
