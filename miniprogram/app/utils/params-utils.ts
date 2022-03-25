/**
 * 查询字符串工具
 */
export class ParamsUtils {
  public static encode(obj?: Record<string, string | number | boolean>): string {
    if (obj === null || obj === undefined) {
      return ''
    }

    const parts: string[] = []
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (typeof value !== 'undefined' && value !== null && value !== '') {
        parts.push(`${key}=${String(value)}`)
      }
    })

    parts.sort()
    return parts.join('&')
  }
}
