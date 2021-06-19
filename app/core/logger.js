'use strict'

const Logger = require('miniprogram-logger-plus')
const config = require('../config')

module.exports = new Logger({ level: config.loggerLevel })
