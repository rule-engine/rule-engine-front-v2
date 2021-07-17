import {formula} from '@/services/api'
import {METHOD, request} from '@/utils/request'

export async function formulaList(param) {
    return request(formula.LIST, METHOD.POST, param)
}
export async function saveFormula(param) {
    return request(formula.SAVE_FORMULA, METHOD.POST, param)
}

