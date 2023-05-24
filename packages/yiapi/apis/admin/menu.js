import { fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { httpCodeConfig } from '../../config/httpCodeConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `查询${metaConfig.name}菜单权限`,
    body: {
        title: `查询${metaConfig.name}菜单权限接口`,
        type: 'object',
        properties: {}
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                const userMenus = await fastify.getUserMenus(req.session);
                return {
                    ...httpCodeConfig.SELECT_SUCCESS,
                    data: {
                        rows: userMenus
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpCodeConfig.SELECT_FAIL;
            }
        }
    });
}
