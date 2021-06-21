'use strict'

const secrets = require('life-helper-miniprogram-secret')

/**
 * 环境名称
 * 1. 对接的服务端环境，发版前务必改为 'production'
 *
 * 取值：
 * - `production`   => 生产环境
 * - `development`  => 开发环境
 * - `local`        => 本地开发环境
 */
const stage = 'development'

/**
 * 基础日志等级
 *
 * 取值：
 * 'ALL', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
 */
const loggerLevel = 'DEBUG'

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
  development: deveConfig,
}

module.exports = Object.assign({}, defaultConfig, secrets[stage], configs[stage])
