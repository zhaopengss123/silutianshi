const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/store/Friendscirclesharingbydefault.jpg
   */
  data: {
    storeDetail:{
      storeimg:''
    },
    showPage: false,
    services: {}
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
    this.getTechService();
    this.setData({
      "storeDetail.storeimg": (app.shopDetail && app.shopDetail.shopImg) || null,
      "storeDetail.shopShortName": (app.shopDetail && app.shopDetail.shopShortName) || null
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  toStaff(){
    const shopDetail = app.shopDetail;
    if (!shopDetail){
      wx.showToast({
        title: '请先设置店铺资料',
      })
      return;
    }
    wx.navigateTo({
      url: './staff/staff',
    })
  },
  toShopIndex(){
    const shopDetail = app.shopDetail;
    if (!shopDetail) {
      wx.showToast({
        title: '请先设置店铺资料',
      })
      return;
    }
    wx.navigateTo({
      url: './index/index',
    })
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
  showFooter() {
    this.setData({
      showPage: true
    })
  },
  hidePage() {
    this.setData({
      showPage: false
    })
  },
  downloadImg: function (e) {　　　　　　　　　　　　　　　　//触发函数
    console.log(e.currentTarget.dataset.url)
    wx.downloadFile({
      url: e.currentTarget.dataset.url,　　　　　　　//需要下载的图片url
      success: function (res) {　　　　　　　　　　　　//成功后的回调函数
        wx.saveImageToPhotosAlbum({　　　　　　　　　//保存到本地
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    });
  },
  copy: function (e) {
    var code = e.currentTarget.dataset.copy;
    wx.setClipboardData({
      data: code,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      },
      fail: function (res) {
        wx.showToast({
          title: '复制失败',
        });
      }
    })
  },
  getTechService() {
    let that = this;
    Http.get('/cs/getRandomService').then(res => {
      if (res.result == 1000) {
        that.setData({
          services: res.data
        })
      }
    });
  }
})