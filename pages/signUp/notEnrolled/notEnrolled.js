// pages/signUp/notEnrolled/notEnrolled.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday:'',
    sexIndex:null,
    sexArray:['男','女']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //选择生日
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  // 选择性别
  sexChange(e) {
    this.setData({
      sexIndex: Number(e.detail.value)
    })
  },
})