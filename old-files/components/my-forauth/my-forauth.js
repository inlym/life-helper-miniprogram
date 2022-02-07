'use strict'

const { getAuthStatus, openSettingResult, authorizeResult } = require('./authorize')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scope: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialog: {
      title: '系统提示',
      content: '为保证功能正常使用，需要您开启相应权限！',
      buttons: [{ text: '我不想用' }, { text: '去设置' }],
    },

    showDialog: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async viewTap() {
      const scope = this.data.scope
      if (!scope) {
        throw new Error('未配置 `scope` 参数')
      }

      const authStatus = await getAuthStatus(scope)
      if (authStatus === 0) {
        // 已授权情况
        this.triggerEvent('success')
      } else if (authStatus === 1) {
        // 未请求过授权情况，先弹窗告知，然后请求授权
        const modalResult = await wx.showModal({
          title: '系统提示',
          content: '为保证功能正常使用，需要您开启相应权限！',
          confirmText: '去设置',
          cancelText: '我不想用',
        })

        if (modalResult.confirm) {
          // 点击 “确定” 按钮
          const authRes = await authorizeResult(scope)
          if (authRes) {
            this.triggerEvent('success')
          } else {
            this.triggerEvent('fail')
          }
        } else {
          // 点击 “取消” 按钮
          this.triggerEvent('fail')
        }
      } else if (authStatus === 2) {
        // 请求授权被拒绝情况，先弹窗告知，然后再跳转 “设置页” 去操作
        this.setData({ showDialog: true })
      } else {
        this.triggerEvent('fail')
      }
    },

    async dialogButtonTap(e) {
      this.setData({ showDialog: false })
      const { index } = e.detail
      if (index === 1) {
        const res = await openSettingResult(this.data.scope)
        if (res) {
          this.triggerEvent('success')
        } else {
          this.triggerEvent('fail')
        }
      } else {
        this.triggerEvent('fail')
      }
    },
  },
})
