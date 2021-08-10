'use strict'

/**
 * 【背景介绍】
 * 1. 小程序版本号（`version`）统一在 `package.json` 管理。
 * 2. 部分页面需要显示版本号。
 * 3. 小程序代码无法读取 `*.json` 文件。
 *
 * 【方案】
 * 1. 当前文件执行时（Node.js）读取 `package.json` 获取 `version` 并存入小程序代码文件（以 `module.exports` 方式导出）
 */

const fs = require('fs')
const path = require('path')
const { version } = require('../package.json')
const url = path.resolve(__dirname, '..', 'app/core/version.ts')
const content = `export const version = '${version}'
`

fs.writeFileSync(url, content)
