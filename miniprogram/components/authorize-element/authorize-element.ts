// components/authorize-element/authorize-element.ts

import { AuthorizeStatus, getAuthorizeStatus, openSettingAndCheck } from '../../app/services/authorization'
import { AuthSetting, CustomEvent } from '../../app/utils/wx-typings'

interface Detail {
  index: number
}

/**
 * 强制授权组件
 *
 * ## 说明
 * 由于微信的限制（https://developers.weixin.qq.com/community/develop/doc/000cea2305cc5047af5733de751008），实测 `wx.openSetting`
 * 方法在按钮绑定点击事件的函数内中间不能有被 `await` 的异步方法，造成很多逻辑会写的很绕。这个组件利用 weui 的 Dialog 组件，将上面方法的调用绑定
 * 到它的按钮上。
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** 授权项名称 */
    scope: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    /**  弹窗的内容 */
    dialog: {
      title: '系统提示',
      content: '为保证功能正常使用，需要您开启相应权限！',
      buttons: [{ text: '我不想用' }, { text: '去设置' }],
    },

    /**  是否展示弹窗 */
    showDialog: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**  处理主要内容被点击 */
    async viewTap() {
      const { triggerEvent } = this
      const scope = this.data.scope as keyof AuthSetting
      const res = await getAuthorizeStatus(scope)

      if (res === AuthorizeStatus.Authorized) {
        this.triggerEvent('success')
        return
      }

      if (res === AuthorizeStatus.NotApplied) {
        const res2 = await wx.showModal({
          title: '系统提示',
          content: '为保证功能正常使用，需要您开启相应权限！',
          showCancel: true,
          cancelText: '取消',
          confirmText: '去设置',
        })

        // 点了「确定」按钮
        if (res2.confirm) {
          await wx.authorize({
            scope,
            success() {
              getAuthorizeStatus(scope).then((res3) => {
                if (res3 === AuthorizeStatus.Authorized) {
                  triggerEvent('success')
                } else {
                  triggerEvent('fail')
                }
              })
            },
            fail() {
              triggerEvent('fail')
            },
          })
        }
      }

      if (res === AuthorizeStatus.Denied) {
        this.setData({ showDialog: true })
      }
    },

    /**  处理弹窗按钮被点击 */
    async dialogButtonTap(event: CustomEvent<Detail>) {
      this.setData({ showDialog: false })

      // 表示点了「确定」按钮
      if (event.detail.index === 1) {
        const scope = this.data.scope as keyof AuthSetting
        const res = await openSettingAndCheck(scope)
        if (res === AuthorizeStatus.Authorized) {
          this.triggerEvent('success')
          return
        }
      }

      this.triggerEvent('fail')
    },
  },
})
