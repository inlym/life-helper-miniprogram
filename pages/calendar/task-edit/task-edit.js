'use strict'

const { CustomPage } = getApp()

/**
 * 注意事项：
 * 1. 当前页面入口不定，因此不要从前一个页面带数据过来，而是进入到页面重新请求
 * 2. 可能带入的参数：
 *   [1] ? `id` - 该参数带入表明为 `编辑`，无该参数表明为 `新增`
 *   [2] ? `projectId` - 项目 ID
 */

CustomPage({
  data: {},

  computed: {},

  requested: {
    page: {
      url: '/calendar/task',
      params(query) {
        if (query.id && parseInt(query.id, 10) > 0) {
          return { id: query.id }
        }
        return false
      },
    },
  },

  onLoad() {},
})
