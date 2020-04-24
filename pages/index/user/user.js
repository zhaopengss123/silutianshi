const app = getApp();
const Http = require('../../../utils/request.js');
const getUserInfo = require('../../../utils/getUserInfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPage: false,
    services:{},
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTechService();
    this.setData({
      userInfo : app.userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showFooter(){
    this.setData({
      showPage: true
    })
  },
  hidePage(){
    this.setData({
      showPage: false
    })
  },
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
  getTechService(){
    let that = this;
    Http.get('/cs/getTechService').then(res => {
      if (res.result == 1000) {
        that.setData({
          services: res.data
        })
      }
    }); 
  },
  tologin(){
    wx.navigateTo({
      url: '/pages/login/login?status=1',
    })
  }
})