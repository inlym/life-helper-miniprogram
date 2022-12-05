/**
 * 检查小程序版本更新
 *
 * @since 1.6.0
 */
import {logger} from './logger'
import {version} from './version'

export function checkUpdate() {
  const updateManager = wx.getUpdateManager()

  updateManager.onUpdateReady(() => {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      showCancel: false,
      confirmText: '立即重启',
    }).then((res) => {
      if (res.confirm) {
        updateManager.applyUpdate()
      }
    })
  })

  updateManager.onUpdateFailed(() => {
    logger.debug('版本更新失败')
  })
}

/**
 * 获取当前的小程序版本号
 */
export function getVersion() {
  return version
}
