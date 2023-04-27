import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnMD5, fnPureMD5, fnUUID } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `添加${metaConfig.name}`,
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            username: fnSchema(sysConfig.schemaField.username, '用户名'),
            password: fnSchema(sysConfig.schemaField.password, '密码'),
            nickname: fnSchema(sysConfig.schemaField.nickname, '昵称'),
            role_codes: fnSchema(sysConfig.schemaField.role_codes, '角色代码')
        },
        required: ['username', 'password', 'nickname', 'role_codes']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql.table(appConfig.table.sys_admin);
                let adminExistsData = await adminModel.clone().where('username', req.body.username).first();
                if (adminExistsData) {
                    return {
                        ...appConfig.httpCode.FAIL,
                        msg: '管理员账号或昵称已存在'
                    };
                }

                let insertData = {
                    username: req.body.username,
                    password: fnMD5(fnPureMD5(req.body.password)),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                };

                let result = await adminModel.clone().insert(fnClearInsertData(insertData));
                return {
                    ...appConfig.httpCode.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.INSERT_FAIL;
            }
        }
    });
}
