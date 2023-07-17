import { tableConfig } from './config/table.js';
import { customConfig } from './config/custom.js';
import { cronConfig } from './config/cron.js';

// 默认配置
let appConfig = {
    // 应用名称
    appName: '易接口',
    appNameEn: 'yiapi',
    // 加密盐，请重新设置为一个随机值
    salt: 'c0b256b1-a8ba-5924-87f2-55ac00e98063',
    // 监听端口
    port: 3000,
    // 默认开发管理员密码
    devPassword: '123456',
    // 是否验证参数
    paramsCheck: false,
    // 日志字段过滤，不打印
    logFilter: ['password', 'file'],
    // 是否开启 swagger 文档
    isSwagger: false,
    // 任何情况下可以访问的路由
    freeApis: [
        //
        '/',
        '/favicon.ico',
        '/docs/**',
        '/public/**',
        '/api/admin/login',
        '/api/tool/tokenCheck',
        '/api/upload/local',
        '/api/tool/sendMail'
    ],
    // 黑名单接口，不可访问的接口
    blackApis: [],
    // 白名单接口，登录后访问无限制
    whiteApis: [],
    // 黑名单菜单
    blackMenus: [],
    // 数据库配置
    database: {
        db: process.env.YIAPI_DB_NAME,
        username: process.env.YIAPI_DB_USER,
        password: process.env.YIAPI_DB_PASS,
        host: process.env.YIAPI_DB_HOST,
        port: Number(process.env.YIAPI_DB_PORT)
    },
    // 缓存配置
    redis: {
        host: process.env.YIAPI_REDIS_HOST,
        port: Number(process.env.YIAPI_REDIS_PORT),
        username: process.env.YIAPI_REDIS_USER,
        password: process.env.YIAPI_REDIS_PASS,
        db: Number(process.env.YIAPI_REDIS_DB),
        keyPrefix: process.env.YIAPI_REDIS_PREFIX
    },
    // jwt配置
    jwt: {
        // jwt密钥，第一次使用，请修改此密钥值！！！
        secret: process.env.YIAPI_JWT_SECRET,
        expiresIn: process.env.YIAPI_JWT_EXPIRES_IN
    },
    // 邮件配置
    mail: {
        host: 'smtp.qq.com',
        port: 465,
        pool: true,
        secure: true,
        // qq邮箱
        user: 'demo@qq.com',
        pass: '',
        from_name: '易接口',
        from_email: 'demo@qq.com'
    },
    // 上传目录
    upload: {
        dir: process.env.YIAPI_UPLOAD_DIR
    },
    // 请求速率
    rate: {},
    // 定时器
    cron: cronConfig,
    // 扩展表
    table: tableConfig,
    // 自定义字段
    custom: customConfig
};

export { appConfig };