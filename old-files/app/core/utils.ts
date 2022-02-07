/**
 * 生成路径地址
 *
 * @param path 路径
 * @param params 查询参数
 */
export function makeUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
  if (typeof params !== 'object' || Object.keys(params).length === 0) {
    return path
  }

  const querystring = Object.keys(params!)
    .filter((key: string): boolean => params![key] !== undefined && params![key] !== null)
    .map((key: string): string => `${key}=${params![key]}`)
    .sort()
    .join('&')

  const search = querystring ? '?' + querystring : ''

  return path + search
}
