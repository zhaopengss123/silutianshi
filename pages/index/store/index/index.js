const app = getApp();
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    distance: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      shopDetail: app.shopDetail
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.getDistance(res.latitude, res.longitude);
      },
      fail: function(res) {
        console.log(res);
      }
    })

  },
  getDistance(latitude, longitude) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    Http.get('/shop/distance', {
      shopId: app.shopDetail.id,
      latitude,
      longitude
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          distance: parseInt(res.data)
        })
        wx.hideLoading();
      } else {
        wx.showModal({
          title: '温馨提示',
          showCancel: false,
          content: res.message,
        })
        wx.hideLoading();
      }
    });
  }


})