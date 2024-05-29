export const tableName = '系统字典分类表';
export const tableData = {
    code: {
        name: '字典分类编码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            min: 1,
            max: 50,
            pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
        }
    },
    name: {
        name: '字典分类名称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            min: 1,
            max: 100
        }
    },
    sort: {
        name: '字典分类排序',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    describe: {
        name: '描述',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            min: 0,
            max: 500
        }
    }
};