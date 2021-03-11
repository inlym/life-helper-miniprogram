'use strict'

module.exports = function getLoadOptions() {
  const key = '__page_loadOptions__'
  return this['data'][key]
}
