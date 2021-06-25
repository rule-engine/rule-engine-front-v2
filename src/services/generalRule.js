import {generalRule} from '@/services/api'
import {request, METHOD} from '@/utils/request'

export async function list(query) {
    return request(generalRule.LIST, METHOD.POST, query)
}



export default {
    list,
}
