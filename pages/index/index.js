const app = getApp();
const Http = require('./../../utils/request.js');
const getUserInfo = require('./../../utils/getUserInfo.js');
Page({
  data: {
    index: 0,
    shopList: [],
    buttonUserInfo: false,
    storeId: null
  },
  onLoad: function (options) {
    if (options.storeId){
      this.setData({
        storeId: options.storeId,
        buttonUserInfo: true
      })
    }
    wx.login({
      success(res) {
        console.log(res.code);
      }
    })
  },
  onShow: function () {
    let that = this;
    if (wx.getStorageSync("token")) {
      app.token = wx.getStorageSync("token");

      that.getAccountInfo();
    } else {
      getUserInfo().then(login => {
        if (!login.openId || !login.nickName) {
          that.setData({
            buttonUserInfo: true
          })
        } else {
          that.getShop();
          that.getShopList();
          that.getActivityList();
        }
      }).catch(err => {
        console.log(err);
        that.setData({
          buttonUserInfo: true
        })
      })
    }
  },
  getShop(){
    let that = this;
    wx.showLoading({ title: '加载中...', mask: true });
      Http.get('/account/getShop').then(res => {
        that.getPrice();
        if (res.result == 1000) {
          app.shopDetail = res.data;
          wx.hideLoading();
        } else {

          wx.hideLoading();
        }
      });
  },
  getAccountInfo(){
    let that = this;
    Http.get('/account/getAccountInfo').then(res => {
      if (res.result == 1000) {
        app.userInfo = res.data;
        
        if (res.data.nickName){
          that.getShop();
          that.getShopList();
          that.getActivityList();
        }else{
          that.setData({
            buttonUserInfo: true
          })
        }
      } else {
        that.setData({
          buttonUserInfo: true
        })
      }
      wx.hideLoading();
    });
  },
  getShopList(){
    let that = this;
    Http.get('/shop/listShop').then(res => {
      if (res.result == 1000) {
        that.setData({
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
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    this.switchShop(this.data.shopList[e.detail.value].id);
  },
  switchShop(shopId) {
    let that = this;
    wx.showLoading({ title: '加载中...', mask: true });
    Http.get('/shop/switchShop',{
      shopId
    }).then(res => {
        if (res.result == 1000) {
          that.getShop();
          that.getActivityList();
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
  bindGetUserInfo(e){
    let that = this;
    if(!e.detail){ return false; }
    app.userInfo.nickName = e.detail.userInfo.nickName;
    app.userInfo.headImg = e.detail.userInfo.avatarUrl;
    if(e.detail){
      wx.getUserInfo({
        success: function (info) {
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
                //that.getAccountInfo();
                that.setData({
                  buttonUserInfo: false
                })
                getUserInfo().then(login => {})
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
  toRecord(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../activity/drainage/record/record?id=${ id }`,
    })
  },
  toUser(){
    console.log(app.userInfo);
    if(!app.userInfo.phone){
      wx.navigateTo({
          url: '/pages/login/login',
        })
      return false;
    }
    wx.navigateTo({
      url: './user/user',
    })
  },
  tostore(){
    if (!app.userInfo.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    wx.navigateTo({
      url: './store/store',
    })
  },
  getActivityList() {
    let that = this;
    Http.get('/activity/getActivityList', {
    }).then(res => {
      if (res.result == 1000 && res.data){
            that.setData({
               activityList: res.data.list
            })
          }
    });
  },
  toactivity(){
    if (!app.userInfo.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;
    }
    if (!app.shopDetail.id){
        wx.showToast({
          title: '请先创建店铺',
          icon: 'none'
        })
        return false;
    }
    wx.navigateTo({
      url: '/pages/activity/drainage/drainage',
    })
  },
  toactivitydetail(e){
    let id = e.currentTarget.dataset.id;
    if (!app.userInfo.phone) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return false;

    }
    wx.navigateTo({
      url: `/pages/activity/drainage/detail/detail?id=${ id }`,
    })
  },
  errors(e){
    // console.log(e);
  },
  tocode(){
    wx.scanCode({
      success(res) {
        console.log(res)
      },
      fail(err){
        console.log(err);
      }
    })
  },
  getPrice() {

    let that = this;
    Http.get('/withdraw/getStatistics').then(res => {
      if (res.result == 1000) {
        that.setData({
          dataMoney: res.data
        })
      }
      wx.hideLoading();
    });


  },
})