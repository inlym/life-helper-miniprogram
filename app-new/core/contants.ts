// ─────  第一部分：在 `Storage` 中存储的字段  ─────

/** 登录凭证 `token` */
export const STO_TOKEN = '__appToken__'

/** 上一次获取的 `code` 信息 */
export const STO_CODE = '__code__'

// ─────  第二部分：在页面的 `data` 中存储的字段  ─────

/** 从 `onLoad` 中获取的 `query` */
export const DATA_QUERY = '__query__'

/** 是否正在执行请求任务 */
export const DATA_ON_REQUESTING = '__onRequesting__'

/** 是否正在展示请求等待框 */
export const DATA_ON_SHOWING_LOADING = '__onShowingLoading__'

/** 记录哪些字段值是从上个页面传值过来的 */
export const DATA_TRANSFERRED_FIELDS = '__transferredFileds__'
