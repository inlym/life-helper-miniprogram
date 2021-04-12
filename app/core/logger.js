'use strict'

const Logger = require('miniprogram-logger-plus')
const config = require('../config/config.js')

module.exports = new Logger({ level: config.loggerLevel })
