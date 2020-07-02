const app = getApp();
const Http = require('./../../utils/request.js');
const getUserInfo = require('./../../utils/getUserInfo.js');
import { getPhone, getUserStatus } from '../../utils/getUserStatus.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    services: {},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow(){
    getUserStatus().then(() => {
      getPhone().then(() => {
        this.getTechService();
        this.setData({
          userInfo: app.userInfo
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
    /**
   * 去店铺详情
   */
  toStore() {
    wx.navigateTo({
      url: '/pages/index/store/store',
    })
  },
    /**
   * 显示策划师二维码
   */
  showFooter() {
    this.setData({
      showPage: true
    })
  },
      /**
   * 关闭策划师二维码
   */
  hidePage() {
    this.setData({
      showPage: false
    })
  },
   /**
   * 下载二维码
   */
  downloadImg: function (e) {　　　　　　　　　　　　　　　　//触发函数
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
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                      title: '授权成功，请重新点击保存二维码',
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败，请重新设置',
                      icon: 'none'
                    })
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
    Http.get('/cs/getTechService').then(res => {
      if (res.result == 1000) {
        that.setData({
          services: res.data
        })
      }
    });
  },
  tologin() {
    wx.navigateTo({
      url: '/pages/user/bindphone/bindphone?status=1',
    })
  }
})