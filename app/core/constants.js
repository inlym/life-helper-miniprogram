'use strict'

/**
 * 当前文件存储常量，主要是一些字段的字段名映射关系
 */
module.exports = {
  // ----  第一部分：在 `Storage` 中存储的字段  ----

  /** 登录凭证 `token` */
  STO_TOKEN: '__app_token__',

  /** 对于 `requested` 任务，是否开启调试 */
  STO_DEBUG_REQUESTED: '__debugRequested__',

  // ----  第二部分：在页面的 `data` 中存储的字段  ----

  /** 从 `onLoad` 中获取的 `query` */
  DATA_QUERY: '__query__',

  /** 是否正在执行请求任务 */
  DATA_ON_REQUESTING: '__onRequesting__',

  /** 是否正在展示请求等待框 */
  DATA_ON_SHOWING_LOADING: '__onShowingLoading__',

  // ----  第三部分：作为配置项  ----

  /** 在执行批量请求任务时，若在该时间内未完成所有请求，则弹起等待框（单位：ms） */
  reservedNoLoadingTime: 2000,

  /** 在执行批量请求任务时，若在弹起等待框后，在该时间内仍未结束请求，则自动隐藏等待框（单位：ms） */
  keepLoadingTime: 2000,
}
