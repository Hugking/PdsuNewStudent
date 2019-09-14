//app.js
App({
  onLaunch: function () {
    // 引入 SDK
    require('./utils/sdk-v1.4.0')
    // 初始化 SDK
    let clientID = '53339c571b7ea19e754c'
    wx.BaaS.init(clientID)

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    //登录openid
    wx.BaaS.login(false).then(res => {
      // 登录成功
    }, res => {
      // 登录失败
      console.log(res)
    })
    //let openid = wx.BaaS.storage.get('openid')
   // let MyUser = new wx.BaaS.User()
    // 查找所有用户
   // MyUser.find()
    // 查询用户
   // let query = new wx.BaaS.Query()
   // query.contains('openid', openid)
   // MyUser.setQuery(query).find().then(res => {
      // success
     // wx.redirectTo({
     //   url: '../index/index',
     // })
    //}, err => {
     // console.log(err)
      // err
   // })



  },
  globalData: {
    userInfo: null,
    locationInfo: null,
    gourmets: [], 
    gourmetsMap: {}
  },
  getLocationInfo: function (cb) {
    var that = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
      // 判断cb是否有被当成参数传过来，有的话则执行cb函数
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          that.globalData.locationInfo = res;
          cb(that.globalData.locationInfo)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
  }
  ,
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
    var that = this
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })
    }
  }
}
)