/**
 * 资源路径
 */
const paths = {
  /**
   * logo 图标
   */
  logo: '/static/project/logo.png',

  /**
   * 主分享图
   */
  'share-main': '/static/project/share.jpeg',

  /**
   * 含义：风向
   * page: `pages/weather/f15d/f15d`
   */
  'f15d-wind': '/image/c1e8a99989a1401d8b8ffae53541c476.svg',

  /**
   * 含义：日出
   * page: `pages/weather/f15d/f15d`
   */
  'f15d-sunrise': '/image/2660de62011349d095e6b48842c91b55.svg',

  /**
   * 含义：月亮
   * page: `pages/weather/f15d/f15d`
   */
  'f15d-moon': '/image/2b31b3d0f024484dabddb1f3b04e41b4.svg',
}

const baseURL = 'https://img.lh.inlym.com'

/**
 * 获取资源地址
 *
 * @param name 资源名称
 */
export function getResUrl(name: string): string {
  if (paths[name]) {
    return baseURL + paths[name]
  }

  throw new Error('对应资源不存在')
}
