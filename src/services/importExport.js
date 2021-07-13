import {METHOD, request} from "@/utils/request";
import {importExport} from "@/services/api";


export function exportData(query) {
    return request(importExport.EXPORT, METHOD.GET, query)
}
