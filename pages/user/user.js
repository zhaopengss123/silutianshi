// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },
  // 收藏页面
  toCollection(){
    wx.navigateTo({
      url: 'collection/collection',
    })
  },
  //去历史记录
  toHistory(){
    wx.navigateTo({
      url: 'history/history',
    })    
  },
  //去关注页面
  toFollow(){
    wx.navigateTo({
      url: 'follow/follow',
    }) 
  },
  // 去比赛页面
  toMatch(){
    wx.navigateTo({
      url: 'match/match',
    })   
  },
  //去报名类目
  toSignup(){
    wx.navigateTo({
      url: '/pages/signUp/enrolled/enrolled',
    })   
  }
})