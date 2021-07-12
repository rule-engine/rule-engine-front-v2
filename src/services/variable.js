import {request, METHOD} from '@/utils/request'
import {variable} from "@/services/api";

/**
 * 保存规则变量
 * @param param
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function addInputParameter(param) {
    return request(variable.ADD, METHOD.POST, param)
}

/**
 * 获取变量列表
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function list(query) {
    return request(variable.LIST, METHOD.POST, query)
}

/**
 * 根据id查询
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function get(query) {
    return request(variable.GET, METHOD.POST, query)
}

/**
 * 根据id更新
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export async function update(query) {
    return request(variable.UPDATE, METHOD.POST, query)
}

/**
 * 根据id删除
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export async function deleteById(query) {
    return request(variable.DELETE, METHOD.POST, query)
}
