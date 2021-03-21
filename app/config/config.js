'use strict'

const configProd = require('./config.prod.js')
const configTest = require('./config.test.js')
const configLocal = require('./config.local.js')
const keys = require('./keys.js')

/**
 * 环境
 * 'prod'  => 生产环境
 * 'test'  => 测试环境
 * 'local' => 本地开发环境
 */
const env = 'prod'

let secretProd = null
try {
  secretProd = require('./secret.prod.js')
} catch (e) {
  console.warn('未配置 secret.prod.js 文件')
}

if (secretProd) {
  configProd.secret = secretProd
}

let secretTest = null
try {
  secretTest = require('./secret.test.js')
} catch (e) {
  console.warn('未配置 secret.test.js 文件')
}

if (secretTest) {
  configTest.secret = secretTest
}

/** 最终输出的配置 */
const config = {
  env,

  keys,

  httpDebug: true,
}

if (env === 'prod') {
  Object.assign(config, configProd)
} else if (env === 'test') {
  Object.assign(config, configTest)
} else if (env === 'local') {
  Object.assign(config, configLocal)
} else {
  throw new Error('环境变量 env 配置错误')
}

module.exports = config
