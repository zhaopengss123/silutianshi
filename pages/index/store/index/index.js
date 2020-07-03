const app = getApp();
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: null,
    longitude: null,
    distance: 0,
    activityList: [],
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let shopDetail = app.shopDetail;
    shopDetail.shopImgList = shopDetail.shopImg.split(',');
    this.setData({
      shopDetail: shopDetail
    });
    this.getActivityList();
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getDistance(res.latitude, res.longitude);
      },
      fail: function (res) {
        console.log(res);
      }
    })

  },
  //获取距离门店距离
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
  },
  // 查看门店活动列表
  getActivityList() {
    let that = this;
    Http.get('/activity/getActivityList', {
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          activityList: res.data.list
        })
      }
    });
  },
  // 查看我的活动
  toClistindex(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let path = `/pages/drainage/index/index?id=${id}&openId=${app.userInfo.openId}&nickName=${app.userInfo.nickName}&headImg=${app.userInfo.headImg}`;
    wx.navigateToMiniProgram({
      appId: 'wx1f1e136159cc94b5', // 要跳转的小程序的appid
      path: path, // 跳转的目标页面
      envVersion: app.envVersion,
      extarData: {
        open: 'auth'
      },
      success(res) { }
    })
  },
  toTel(){
    wx.makePhoneCall({
      phoneNumber: app.shopDetail.shopPhone,
    })
  },
  /* 显示添加二维码弹窗  */
  showWx() {
    this.setData({
      showPage: true
    })
  },
  /* 隐藏添加二维码弹窗  */
  hidePage() {
    this.setData({
      showPage: false
    })
  },
  downloadImg: function (e) {　　　　　　　　　　　　　　　　 //触发函数
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      //需要下载的图片url
      success: function (res) {　　　　　　　　　　　　 //成功后的回调函数
        wx.saveImageToPhotosAlbum({　　　　　　　　　 //保存到本地
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
  /* 复制客服微信 */
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
})