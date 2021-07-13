function getValueTypeName(valueType) {
    switch (valueType) {
        case 'STRING':
            return '字符串'
        case 'NUMBER':
            return '数值'
        case 'COLLECTION':
            return '集合'
        case 'BOOLEAN':
            return '布尔'
        case 'DATE':
            return '日期'
        case 'FUNCTION':
            return '函数'
    }
}

export {getValueTypeName}
