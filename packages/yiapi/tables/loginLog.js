export const tableName = '登录日志表';
export const tableData = {
    username: {
        name: '用户名',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 30
    },
    nickname: {
        name: '昵称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50
    },
    role: {
        name: '角色',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 2000
    },
    ip: {
        name: 'ip',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 30
    },
    ua: {
        name: 'ua',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 500
    }
};
