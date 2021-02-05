'use strict'

const configProd = require('./config.prod.js')
const configTest = require('./config.test.js')

/**
 * 环境
 * 'prod' => 生产环境
 * 'test' => 测试环境
 */
const env = 'prod'

/** 最终输出的配置 */
const config = {
  env,
}

if (env === 'prod') {
  Object.assign(config, configProd)
} else if (env === 'test') {
  Object.assign(config, configTest)
} else {
  throw new Error('环境变量 env 配置错误')
}

module.exports = config
