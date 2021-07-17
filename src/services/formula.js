import {formula} from '@/services/api'
import {METHOD, request} from '@/utils/request'

export async function formulaList(param) {
    return request(formula.LIST, METHOD.POST, param)
}
