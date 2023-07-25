// 工具函数
import { fnApiInfo, fnPageOffset, fnSelectFields } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 查询字段
const selectKeys = fnSelectFields('./tables/admin.json', ['password']);
// 传参校验
export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `查询${metaConfig.name}`,
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: metaConfig.schema.page,
            limit: metaConfig.schema.limit
        }
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                const adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where('username', '<>', 'dev')
                    .modify(function (queryBuilder) {
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
                        }
                    });

                const { total } = await adminModel.clone().count('id', { as: 'total' }).first();
                const rows = await adminModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select(selectKeys);

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
