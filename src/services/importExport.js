import {METHOD, request} from "@/utils/request";
import {importExport} from "@/services/api";


export function exportData(query) {
    request(importExport.EXPORT, METHOD.POST, query).then(res => {
        const blob = new Blob([JSON.stringify(JSON.parse(res.data.data.data), null, 4)]);
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = decodeURIComponent(res.data.data.name);
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
    })
}
