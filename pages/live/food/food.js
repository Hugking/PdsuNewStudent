// pages/live/food/food.js
function loadFirstPage(that) {
  if (!app.globalData.locationInfo) {
    app.getLocationInfo(info => {
      console.log('先获取位置,', info)
    })
    setTimeout(function () {
      loadFirstPage(that)
    }, 1500);
    return;
  }

  setLoading(true);
  API.getGourmetByPage(1, PAGE_SIZE, (gourmets) => {
    console.log('loadFirstPage', gourmets);
    setLoading(false);
    mGourmetList = gourmets;
    mPage = 1;
    mIsmore = true;
    that.setData({
      gourmets: mGourmetList
      , ismore: mIsmore
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onTapToDetail(event) {
    var foodId = event.currentTarget.dataset.foodId;
    console.log(postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + foodId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})