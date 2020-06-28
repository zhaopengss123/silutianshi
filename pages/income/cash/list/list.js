const app = getApp();
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData(){
    let that = this;
    Http.get('/withdraw/listRecord', {
      openId: app.userInfo.openId
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          list: res.data
        })
      }
      wx.hideLoading();
    });
  }
  
})