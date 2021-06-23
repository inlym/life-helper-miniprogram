'use strict'

/**
 * 图片分类 3 类：
 * 1. 存储于服务器，图片地址由 API 接口返回
 * 2. 存储于服务器，图片地址写死在客户端
 * 3. 存储于客户端，图片地址写死在客户端
 *
 * 当前文件主要用于处理以上第 [2] 种情况对应的图片路径，由当前文件统一管理，避免零散分布在各处不方便维护
 */

const baseURL = 'https://img.lh.inlym.com'

const paths = {
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

module.exports = function getResUrl(name) {
  if (paths[name]) {
    return baseURL + paths[name]
  }

  throw new Error('对应资源不存在')
}
