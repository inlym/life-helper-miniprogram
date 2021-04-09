'use strict'

const configRoot = require('../../config.js')
const configProd = require('./config.prod.js')
const configTest = require('./config.test.js')
const configLocal = require('./config.local.js')
const keys = require('./keys.js')

const env = configRoot.stage

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
