import { request } from 'src/core/request'
import jshttp from 'jshttp'

Page({
  onLoad() {
    jshttp({
      url: 'https://debug.inlym.com/request',
    }).then((res) => {
      console.log(res)
    })
  },
})
