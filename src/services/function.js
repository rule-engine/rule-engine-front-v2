import {myfunction} from '@/services/api'
import {request, METHOD} from '@/utils/request'


export async function functionList(param) {
    return request(myfunction.LIST, METHOD.POST, param)
}



export default {
    functionList


}
