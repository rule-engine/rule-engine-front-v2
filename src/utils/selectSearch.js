import {listInputParameter} from '@/services/inputParameter'
import {listVariable} from '@/services/variable'
// import {selectSearch} from "@/services/selectSearch";

let timeout;
let currentValue;

export function selectSearchVariableOrElement(value, callback, type, valueType) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    function fake() {
        let requestData = {
            "page": {
                "pageSize": 10,
                "pageIndex": 1
            },
            "query": {
                "name": value,
                "valueType": valueType,
            },
            "orders": []
        };
        if (type === 0) {
            listInputParameter(requestData).then(res => {
                if (currentValue === value) {
                    if (res.data.data) {
                        callback(res.data.data.rows);
                    } else {
                        callback([]);
                    }
                }
            });
        } else if (type === 1) {
            listVariable(requestData).then(res => {
                if (currentValue === value) {
                    if (res.data.data) {
                        callback(res.data.data.rows);
                    } else {
                        callback([]);
                    }
                }
            });
        }
    }

    timeout = setTimeout(fake, 300);
}