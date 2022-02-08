/**
 * 查询字符串工具
 */
export class ParamsUtils {
  public static encode(obj: Record<string, any>): string {
    if (obj === null || obj === undefined) {
      return ''
    }

    const parts: string[] = []
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string') {
        parts.push(`${key}=${String(value)}`)
      } else {
        console.error('出现未支持的查询字符串')
      }
    })

    parts.sort()
    return parts.join('&')
  }
}
