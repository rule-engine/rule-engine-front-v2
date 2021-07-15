import {condition} from '@/services/api'
import {METHOD, request} from '@/utils/request'

export async function updateCondition(param) {
    return request(condition.UPDATE_CONDITION, METHOD.POST, param)
}
