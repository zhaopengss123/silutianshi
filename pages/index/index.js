const app = getApp();
const Http = require('./../../utils/request.js');
const getUserInfo = require('./../../utils/getUserInfo.js');
import {
  getPhone,
  getUserStatus
} from '../../utils/getUserStatus.js'
Page({
  data: {
    index: 0,
    shopList: [],
    buttonUserInfo: false,
    storeId: null,
    customerNumber: 0,
    monthNumber: 0,
    services: {},
    templateList: [],
    pageSize: 10,
    pageNum: 1,
    pageIndex: 1,
    activityList: []
  },
  onLoad: function(options) {
    // 判断有没有storeId，有的话重新注册成为店员
    if (options.storeId) {
      this.setData({
        storeId: options.storeId,
        buttonUserInfo: true
      })
    }
  },
  onShow: function() {
    /* 判断当前是否有登录信息，没有显示授权登录按钮  */
    getUserInfo().then(login => {
      if (!login.openId || !login.nickName) {
        this.setData({
          buttonUserInfo: true
        })
      } else {
        this.getActiveTemplate();
        this.getShop();
        this.getShopList();
        this.getActivityList();
      }
    }).catch(err => {
      this.setData({
        buttonUserInfo: true
      })
    })
  },
  /* 显示添加二维码弹窗  */
  showFooter() {
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
  /* 获取门店信息  */
  getShop() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    Http.get('/account/getShop').then(res => {
      this.getPrice();
      this.getTechService();
      if (res.result == 1000) {
        app.shopDetail = res.data;
        wx.hideLoading();
      } else {
        wx.hideLoading();
      }
    });
  },
  /* 获取门店到期信息  */
  getStatus(id) {
    return new Promise((resolve, reject) => {
      Http.get(`/shop/${ id }`).then(res => {
        if (res.result == 1000) {
          resolve(res.data);
        }
      });
    })
  },
  /* 登录后获取用户信息  */
  getAccountInfo() {
    Http.get('/account/getAccountInfo').then(res => {
      console.log(res);
      if (res.result == 1000) {
        app.userInfo = res.data;
        if (res.data.nickName) {
          this.getShop();
          this.getShopList();
          this.getActivityList();
        } else {
          this.setData({
            buttonUserInfo: true
          })
        }
      } else {
        this.setData({
          buttonUserInfo: true
        })
      }
      wx.hideLoading();
    });
  },
  /* 获取门店列表  */
  getShopList() {
    Http.get('/shop/listShop').then(res => {
      if (res.result == 1000) {
        this.setData({
          shopList: res.data
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
  /* 切换门店  */
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    this.switchShop(this.data.shopList[e.detail.value].id);
  },
  switchShop(shopId) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    Http.get('/shop/switchShop', {
      shopId
    }).then(res => {
      if (res.result == 1000) {
        this.getShop();
        this.getActivityList();
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
  /* 用户绑定信息 */
  bindGetUserInfo(e) {
    let that = this;
    if (!e.detail) {
      return false;
    }
    app.userInfo.nickName = e.detail.userInfo.nickName;
    app.userInfo.headImg = e.detail.userInfo.avatarUrl;
    if (e.detail) {
      wx.getUserInfo({
        success: function(info) {
          wx.login({
            success(res) {
              let jsons = JSON.stringify({
                code: res.code,
                encryptedData: info.encryptedData,
                iv: info.iv,
                paramJson: JSON.stringify({
                  nickName: app.userInfo.nickName,
                  headImg: app.userInfo.headImg
                })
              });
              Http.post('/account/sign', {
                code: res.code,
                encryptedData: info.encryptedData,
                iv: info.iv,
                paramJson: JSON.stringify({
                  nickName: app.userInfo.nickName,
                  headImg: app.userInfo.headImg,
                  role: that.data.storeId ? 1 : 0,
                  storeId: that.data.storeId
                })
              }).then(res => {
                that.getAccountInfo();
                that.setData({
                  buttonUserInfo: false
                })
                wx.hideLoading();

              })
            }
          })
        },
        fail(err) {
          console.log(err);
        }
      })

    }
  },
  /* 去购买名单 */
  toRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../activity/drainage/record/record?id=${ id }`,
    })
  },
  /* 获取参与过的活动列表 */
  getActivityList() {
    Http.get('/activity/getActivityList', {
      runningStatus: 0
    }).then(res => {
      if (res.result == 1000 && res.data) {
        this.setData({
          activityList: res.data.list
        })
      }
    });
  },
  /* 创建活动 */
  toactivity() {
    getUserStatus(true).then(() => {
      getPhone().then(() => {
        if (!app.shopDetail || !app.shopDetail.id) {
          wx.showToast({
            title: '请先创建店铺',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/index/store/detail/detail',
            }, 1500)
          })
          return false;
        }
        this.getStatus(app.shopDetail.id).then(res => {
          app.shopDetail.expireDate = res.expireDate || null;
          const nowDate = new Date().getTime();
          const expireDate = (res && res.expireDate && new Date(res.expireDate).getTime()) || null;
          if (!expireDate || nowDate > expireDate) {
            this.showFooter();
            return false;
          }
          wx.navigateTo({
            url: '/pages/activity/drainage/drainage',
          })
        });
      })
    })

  },
  /* 去活动详情 */

  toactivitydetail(e) {
    let id = e.currentTarget.dataset.id;
    getPhone().then(() => {
      wx.navigateTo({
        url: `/pages/activity/drainage/detail/detail?id=${ id }`,
      })
    })
  },
  errors(e) {
    // console.log(e);
  },

  getPrice() {
    //获取可提现金额
    Http.get('/withdraw/getStatistics').then(res => {
      if (res.result == 1000) {
        this.setData({
          dataMoney: res.data
        })
      }
      wx.hideLoading();
    });
    //获取总客户数
    Http.get('/activity/getTotalCustomer').then(res => {
      if (res.result == 1000) {
        this.setData({
          customerNumber: res.data
        })
      }
      wx.hideLoading();
    });
    //获取本月销售金额
    Http.get('/activity/getIncomeOfMonth').then(res => {
      if (res.result == 1000) {
        this.setData({
          monthNumber: res.data
        })
      }
      wx.hideLoading();
    });
  },
  /* 获取客服 */
  getTechService() {
    Http.get('/cs/getRandomService').then(res => {
      if (res.result == 1000) {
        this.setData({
          services: res.data
        })
      }
    });
  },
  /* 下载客服二维码 */
  downloadImg: function(e) {　　　　　　　　　　　　　　　　 //触发函数
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      　　　　　　　 //需要下载的图片url
      success: function(res) {　　　　　　　　　　　　 //成功后的回调函数
        wx.saveImageToPhotosAlbum({　　　　　　　　　 //保存到本地
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function(err) {
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
  copy: function(e) {
    var code = e.currentTarget.dataset.copy;
    wx.setClipboardData({
      data: code,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '复制失败',
        });
      }
    })
  },
  //获取模板列表
  getActiveTemplate() {
    Http.post('/activity/queryActivityTemplate', {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }).then(res => {
      if (res.result == 1000) {
        this.setData({
          templateList: [...this.data.templateList, ...res.data.list],
          pageIndex: (res.data && res.data.list && res.data.list.length) ? this.data.pageIndex + 1 : this.data.pageIndex
        })
      }
      wx.hideLoading();
    });
  },
  /*滑动到底部翻页 */
  onReachBottom() {
    if (this.data.pageNum < this.data.pageIndex) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getActiveTemplate();
    }
  }
})