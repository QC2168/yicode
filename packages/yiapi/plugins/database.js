#!/usr/bin/env node
import fs from 'fs-extra';
import url from 'node:url';
import path from 'node:path';
import fp from 'fastify-plugin';
import Knex from 'knex';
import fg from 'fast-glob';
import { SchemaInspector } from 'knex-schema-inspector';
import logSymbols from 'log-symbols';
import * as color from 'colorette';

import {
    //
    replace as _replace,
    snakeCase as _snakeCase,
    concat as _concat,
    endsWith as _endsWith,
    isInteger as _isInteger,
    forOwn as _forOwn,
    uniq as _uniq,
    keys as _keys,
    isString as _isString,
    isArray as _isArray
} from 'lodash-es';

import { fnImport } from '../utils/index.js';
import { appConfig } from '../config/appConfig.js';
import { sysConfig } from '../config/sysConfig.js';
import { fieldType } from '../config/fieldType.js';

// 是否全部检测通过，未通过则不进行表创建
let isCheckPass = true;

// 名称限制
let nameLimit = /^[a-z][a-z_0-9]*$/;

// 基础数据表字段
let baseFields = {
    unique: false,
    index: false,
    unsigned: false,
    notNullable: true
};

// 可用的选项值
let optionFields = ['unique', 'index', 'unsigned'];

let denyFields = [
    //
    'id',
    'created_at',
    'updated_at',
    'deleted_at',
    'state'
];

// 获取表定义
async function fnGetTableFile(filePattern, fileDir, tablePrefix) {
    try {
        let tableFiles = fg.sync(filePattern, {
            onlyFiles: true,
            dot: false,
            absolute: true,
            cwd: fileDir
        });
        let tableData = [];
        for (let i = 0; i < tableFiles.length; i++) {
            let filePath = tableFiles[i];
            let fileUrl = url.pathToFileURL(filePath);
            // 路径案例：file:///D:/codes/git/chensuiyi/yiapi/tables/sysUser.js
            // 获取表名，如果是数字，则将数字跟前面的字母金挨着，保证表名是下划线风格
            // 这里不需要对表前缀进行判断，因为自定义 sys_ 和 addon_ 前缀的表会对字段进行合并，而不是替换
            let tableName = _replace(_snakeCase(path.basename(filePath, '.json')), /_(\d+)/gi, '$1');
            tableName = tablePrefix ? tablePrefix + tableName : tableName;
            // 获取表数据
            let { default: tableSchema } = await fnImport(fileUrl, 'default', { default: {} }, { assert: { type: 'json' } });

            tableSchema.tableName = tableName;
            tableSchema.tableComment = tableSchema.name;
            tableData.push(tableSchema);
        }
        return tableData;
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js ~ line 92 ~ fnGetTableFile ~ err', err);
        isCheckPass = false;
    }
}

// 检测校验表格数据
async function fnCheckTableField(allTableData, allTableName) {
    try {
        for (let i = 0; i < allTableData.length; i++) {
            let tableDataItem = allTableData[i];

            tableDataItem.tableNewName = null;

            // 如果存在表，则创建新表
            // 如果存在新表，则删除新表
            if (allTableName.includes(tableDataItem.tableName)) {
                tableDataItem.tableNewName = tableDataItem.tableName + '_new';
            }

            // 遍历每个字段
            // 补充该字段缺失的属性
            _forOwn(tableDataItem.fields, (fieldData, fieldName) => {
                // 如果不是默认内置的字段名称，则对其进行校验和补充
                if (denyFields.includes(fieldName) === true) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段名称不能为 ${color.yellowBright(denyFields.join(','))} 其中之一`);
                    isCheckPass = false;
                }

                // 规范字段名称
                if (nameLimit.test(fieldName) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段名称必须以 ${color.yellowBright('小写字母开头 + [小写字母|下划线|数字]')}，请检查`);
                    isCheckPass = false;
                }

                // 必须有字段类型
                if (fieldData.type === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段定义缺少 ${color.yellowBright('type')} 属性，请检查`);
                    isCheckPass = false;
                } else if (fieldType[fieldData.type] === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright(fieldData.type)} 类型不存在`);
                    isCheckPass = false;
                } else if (fieldData.type === 'string' && (_isInteger(fieldData.length) === false || fieldData.length < 0)) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段必须有 ${color.yellowBright('length')} 属性，且其值必须为大于或等于 0 的整数`);
                    isCheckPass = false;
                }

                // 必须有字段注释
                if (fieldData.comment === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段定义缺少 ${color.yellowBright('comment')} 属性，请检查`);
                    isCheckPass = false;
                } else if (_isString(fieldData.comment) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('comment')} 属性必须为字符串，请检查`);
                    isCheckPass = false;
                }

                // length 属性必须为数字
                if (fieldData.length !== undefined) {
                    if (_isInteger(fieldData.length) === false || fieldData.length < 0) {
                        console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('length')} 属性必须为大于或等于 0 的整数，请检查`);
                        isCheckPass = false;
                    }
                }

                // 检测选项
                if (fieldData.options === undefined) {
                    fieldData.options = [];
                } else if (_isArray(fieldData.options) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 的 ${color.yellowBright('options')} 属性必须为数组`);
                    isCheckPass = false;
                } else {
                    fieldData.options.forEach((option) => {
                        if (optionFields.includes(option) === false) {
                            console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 的 ${color.yellowBright('options')} 属性必须符合 ${optionFields.join(',')}`);
                            isCheckPass = false;
                        }
                    });
                }

                tableDataItem.fields[fieldName] = fieldData;
            });
        }
        return allTableData;
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js:279 ~ fnCheckTableField ~ err:', err);
        isCheckPass = false;
    }
}

// 同步数据库
async function syncDatabase() {
    // 定义数据库链接
    let mysql = await new Knex({
        client: 'mysql2',
        connection: {
            host: appConfig.database.host,
            port: appConfig.database.port,
            user: appConfig.database.username,
            password: appConfig.database.password,
            database: appConfig.database.db
        },
        acquireConnectionTimeout: 30000,
        asyncStackTraces: true,
        debug: false,
        pool: {
            min: 3,
            max: 10
        }
    });
    let inspector = SchemaInspector(mysql);
    // 获取所有的表
    let allTableName = await inspector.tables();
    const trx = await mysql.transaction();

    try {
        // 重置校验默认值
        isCheckPass = true;

        // 判断是否有旧表，有则选择是否删除旧表
        let allOldTableNames = allTableName.filter((table) => _endsWith(table, '_old'));

        // 如果选择已升级完成，则删除掉所有旧表
        for (let i = 0; i < allOldTableNames.length; i++) {
            await trx.schema.dropTableIfExists(allOldTableNames[i]);
        }

        let sysTableData = await fnGetTableFile(['./tables/*.json', '!**/_*.json'], sysConfig.yiapiDir, 'sys_');

        // 检测校验表字段是否都正确
        let allTableData = await fnCheckTableField(sysTableData, allTableName);

        // 如果检测没有通过，则不进行表相关操作
        if (isCheckPass === false) {
            console.log(`${logSymbols.warning} ${color.red('请先处理完毕所有的错误提示内容')}`);
            process.exit();
            return;
        }

        // 合并表参数
        for (let i = 0; i < allTableData.length; i++) {
            let tableDataItem = allTableData[i];

            try {
                if (tableDataItem.tableNewName) {
                    await trx.schema.dropTableIfExists(tableDataItem.tableNewName);
                }

                // 如果不存在表，则直接创建
                await trx.schema.createTable(tableDataItem.tableNewName || tableDataItem.tableName, (table) => {
                    // 设置数据表的字符集和编码
                    table.charset('utf8mb4');
                    table.collate('utf8mb4_general_ci');

                    // 默认每个表的ID字段自增
                    table.bigincrements('id', { primaryKey: true });

                    // 设置状态
                    table['tinyint']('state').notNullable().defaultTo(0).comment('状态(0:正常,1:禁用)');

                    // 设置时间
                    table['bigint']('created_at').notNullable().unsigned().defaultTo(0).comment('创建时间');
                    table['bigint']('updated_at').notNullable().unsigned().defaultTo(0).comment('更新时间');

                    // 处理每个字段
                    _forOwn(tableDataItem.fields, (fieldData, fieldName) => {
                        // 获取字段的类型信息
                        let fieldInfo = fieldType[fieldData.type];
                        // 字段链式调用实例
                        let fieldItem = {};

                        // 根据是否有length属性，获得对应的字段定义实例
                        if (fieldInfo.options.includes('length') === true) {
                            fieldItem = table[fieldData.type](fieldName, fieldData.length);
                        } else {
                            fieldItem = table[fieldData.type](fieldName);
                        }

                        fieldItem.collate('utf8mb4_general_ci');
                        fieldItem.comment(fieldData.comment);
                        if (fieldData.default !== undefined) fieldItem.defaultTo(fieldData.default);

                        // 如果是 text 类型，则允许其为 null
                        if (fieldData.type === 'text') fieldItem.nullable();

                        fieldData.options.forEach((option) => {
                            if (fieldInfo.options.includes(option)) {
                                fieldItem[option]();
                            }
                        });
                    });
                });

                // 如果创建的是新表，则把旧表的数据转移进来
                if (tableDataItem.tableNewName) {
                    // 获取当前的新字段
                    let validFields = _uniq(_concat(_keys(tableDataItem.fields), ['id', 'created_at', 'updated_at']));

                    // 获取所有旧字段
                    let allOldFields = await inspector.columns(tableDataItem.tableName);

                    // 提取所有旧字段跟新字段匹配的字段
                    let allOldNames = allOldFields
                        .filter((item) => {
                            return validFields.includes(item.column);
                        })
                        .map((item) => item.column);

                    let validFieldsRow = allOldNames.map((field) => '`' + field + '`').join(',');

                    let moveData = await trx.raw(`INSERT INTO ${tableDataItem.tableNewName} (${validFieldsRow}) SELECT ${validFieldsRow} FROM ${tableDataItem.tableName}`);

                    // 删除旧表，重命名新表
                    await trx.schema.renameTable(tableDataItem.tableName, tableDataItem.tableName + '_old');
                    await trx.schema.renameTable(tableDataItem.tableNewName, tableDataItem.tableName);
                }
            } catch (err) {
                console.log('🚀 ~ file: syncDatabase.js:364 ~ syncDatabase ~ err:', err);
                await trx.rollback();
                await trx.destroy();
                process.exit();
            }
        }
        await trx.commit();
        await trx.destroy();
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js:371 ~ syncDatabase ~ err:', err);
        await trx.rollback();
        await trx.destroy();
        process.exit();
    }
}

async function main(fastify, opts) {
    await fastify.register(syncDatabase);
}
export default fp(main, { name: 'database' });
