import {dataPermission} from '@/services/api'
import {request, METHOD} from '@/utils/request'

export async function dataPermissionList(query) {
    return request(dataPermission.LIST, METHOD.POST, query)
}

export default {
    dataPermissionList,
}
