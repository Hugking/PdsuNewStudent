// pages/live/food/add_food/add_food.js
var app = getApp() 
var utils = require('../../../../utils/util.js') 
var food_address = "" 
var food_name = "" 
var food_describle = "" 
var imgs = [] 
var cover = "" 
var coverIndex = 0 
var geopoint = null 
var MAX_PIC_LENGTH = 6 
var mDoing = false 

function setLoading(yes) {
  mDoing = yes 
  utils.showLoading(yes) 
}

function clearData() {
  food_address = "" 
  food_name = "" 
  food_describle = "" 
  imgs = [] 
  cover = "" 
  coverIndex = 0 
  geopoint = null 
}

Page({
  data: {
    imgs: [],
    total_pics_number: MAX_PIC_LENGTH
  },

  onLoad: function () {
    //清理数据
    clearData()
  },

  onReady: function () {
    this.chooseLocation()
  },

  chooseLocation: function () {
    var that = this 
    wx.chooseLocation({
      success: function (ret) {
        console.log('chooseLocation', ret)
        food_address = ret.address 
        that.setData({
          food_address: food_address,
        })
        geopoint = {
          latitude: +ret.latitude,//数值 
          longitude: +ret.longitude //数值
        }
      }
      , cancel: function () {
        geopoint = null //退出之后对象清空
      }
    })
  },

  add_food_name: function (e) {
    console.log(e.detail) 
    food_name = e.detail.value
  },

  add_food_address: function (e) {
    console.log(e.detail) 
    food_address = e.detail.value
  },

  add_food_describle: function (e) {
    console.log(e.detail) 
    food_describle = e.detail.value
  },

  add_food_img: function () {
    if (imgs.length == MAX_PIC_LENGTH) {
      utils.showModal('错误', '最多添加' + MAX_PIC_LENGTH + '张图片')
      return 
    }

    var that = this 

    wx.chooseImage({
      count: MAX_PIC_LENGTH - imgs.length, // 最多MAX_PIC_LENGTH张图片
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths 
        console.log('tempFilePaths', tempFilePaths) 
        if (tempFilePaths.length > 0) {
          for (var i = 0 ; i < tempFilePaths.length ; i++) {
            setLoading(true) 
            console.log("uploading...")
            var name = utils.getFileName() + i + ".jpg" //上传的图片的别名

            let MyFile = new wx.BaaS.File()

            let fileParams = { filePath: tempFilePaths[i] }
            let metaData = { categoryName: name }

            MyFile.upload(fileParams, metaData).then(res => {
              let data = res.data  
              if (data.path) {
                imgs.push(data.path) 
              }
              console.log("updata_ok", data.path)
              cover = imgs.length > 0 ? imgs[0] : "" 
              that.setData({
                imgs: imgs,
                cover: cover,
                show_headurl: cover == "" ? false : true
              })

            }, err => {

            })
          }
        }

      }
    })
  },
  checkout: function () {
    coverIndex++ 
    var index = coverIndex % imgs.length 
    cover = imgs[index] 
    this.setData({
      cover: cover
    })
  },
  preview: function () {
    if (imgs.length == 0) return 
    wx.previewImage({
      current: imgs[0], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  add_food: function () {
    if (!geopoint) {
      return utils.showModal('错误', '请选择位置')
    }
    if (imgs.length == 0) {
      return utils.showModal('错误', '至少上传一张图片')
    }
    if (food_name.trim() === "") {
      return utils.showModal('错误', '请输入美食点名称')
    }
    if (food_address.trim() === "") {
      return utils.showModal('错误', '地址不能为空哦')
    }
    setLoading(true)
    app.getUserInfo(userinfo => {
      console.log(userinfo)
      let tableID = 36114
      let Food = new wx.BaaS.TableObject(tableID)
      let food = Food.create()
      food.set("user_nickname", userinfo.nickName) 
      food.set("description", food_describle) 
      food.set("cover", cover) 
      console.log(geopoint.latitude, geopoint.longtitude)
      var location = new wx.BaaS.GeoPoint(geopoint.latitude, geopoint.longtitude)

      food.set("location", location) 
      food.set("openid", userinfo.openid) 
      food.set("imgs", imgs) 
      food.set("name", food_name) 
      food.set("address", food_address) 
      food.set("user_avatar", userinfo.avatarUrl) 
      food.set("create_time", utils.getNowTimestamp()) 
      food.set("create_time_tag", utils.getNowTimeTag()) 

      food.save().then(res => {
        console.log("创建成功")
        clearData() 
        wx.navigateBack()
      },
        err => {
          setLoading(false) 
          console.log('创建失败', err) 
        })
    })

  }
}) 
