'use strict'

const configRoot = require('../../config.js')
const configProd = require('./config.prod.js')
const configRele = require('./config.rele.js')
const configTest = require('./config.test.js')
const configLocal = require('./config.local.js')
const keys = require('./keys.js')

const env = configRoot.stage

const configuration = {
  production: configProd,
  release: configRele,
  test: configTest,
  local: configLocal,
}

const config = {
  env,
  keys,
  httpDebug: true,
}
Object.assign(config, configuration[env])

module.exports = config
