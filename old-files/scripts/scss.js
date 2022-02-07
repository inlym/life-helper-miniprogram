'use strict'

const path = require('path')
const sass = require('sass')
const fs = require('fs')

const { pages } = require('../app.json')

const baseDir = path.resolve(__dirname, '..')
pages.forEach((item) => {
  const file = path.join(baseDir, item) + '.scss'
  const output = path.join(baseDir, item) + '.wxss'
  const result = sass.renderSync({ file })
  fs.writeFileSync(output, result.css)
})
