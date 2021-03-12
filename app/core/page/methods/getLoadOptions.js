'use strict'

module.exports = function getLoadOptions() {
  const key = '__page_load_options__'
  return this['data'][key]
}
