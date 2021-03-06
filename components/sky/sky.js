// components/sky/sky.js
Component({
  properties: {
    sky: {
      type: Object,
      value: {
        type: 'night',
        sun: 1,
        moon: 1,
        rain: 50,
        cloud: 2,
      },
    },

  },

  data: {
    sun: 0,
    moon: 1,
    star: [{ x: '10%', y: '20%', length: '30rpx' }],
    rain: 30,
    meteor: 5
  },

  observers: {
    'sky': function (sky) {
      this.setData({
        sum: sky
      })
    }
  },

  methods: {

  }
})
