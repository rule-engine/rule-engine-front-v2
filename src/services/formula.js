import {formula} from '@/services/api'
import {METHOD, request} from '@/utils/request'

export async function formulaList(param) {
    return request(formula.LIST, METHOD.POST, param)
}
export async function saveFormula(param) {
    return request(formula.SAVE_FORMULA, METHOD.POST, param)
}
export async function getFormula(param) {
    return request(formula.GET_FORMULA, METHOD.POST, param)
}
export async function updateFormula(param) {
    return request(formula.UPDATE_FORMULA, METHOD.POST, param)
}
export async function deleteFormula(param) {
    return request(formula.DELETE_FORMULA, METHOD.POST, param)
}
export async function validationExpressionName(param) {
    return request(formula.VALIDATION_EXPRESSION_NAME, METHOD.POST, param)
}



