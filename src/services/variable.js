import {request, METHOD} from '@/utils/request'
import {variable} from "@/services/api";


export async function listVariable(query) {
    return request(variable.LIST, METHOD.POST, query)
}