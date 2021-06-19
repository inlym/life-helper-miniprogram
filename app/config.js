'use strict'

const getSecret = require('life-helper-miniprogram-secret')

/**
 * 环境名称
 * 1. 对接的服务端环境，发版前务必改为 'production'
 * 2. 不同环境呈现给小程序端的差异主要是请求域名不同以及是否需要对请求内容做摘要签名
 *
 * 取值：
 * - 'production'  => 生产环境，线上正式环境
 * - 'release'     => 预发布环境，和生产环境使用同一套资源，但是入口仅内部可以访问
 * - 'test'        => 测试环境，单独一套资源，和生产环境完全隔离，但是系统架构和生产环境保持一致
 * - 'develop'     => 开发环境，1 台带公网的小机子，可随意销毁和重建资源
 * - 'local'       => 本地开发环境
 */
const stage = 'develop'

/**
 * 基础日志等级
 *
 * 取值：
 * 'ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
 */
const loggerLevel = 'DEBUG'

/**
 * 私密配置文件，包含密钥等信息
 */
const secret = getSecret(stage)

/**
 * 公共配置，不区分环境的配置项
 */
const defaultConfig = { stage, loggerLevel }

/**
 * 开发环境特有配置项
 */
const deveConfig = {
  baseURL: 'http://localhost:3000',
}

/**
 * 生产环境特有配置项
 */
const prodConfig = {
  baseURL: 'https://api.lh.inlym.com',
}

const configs = {
  production: prodConfig,
  develop: deveConfig,
}

module.exports = Object.assign({}, defaultConfig, secret, configs[stage])
