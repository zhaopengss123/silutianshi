const app = getApp();
const Http = require('./../../utils/request.js');
Page({
  data: {
    code:'',
    userData:{},
    setTingGet:false,
    swiperArray:[],
    actives:{},
    navList:[]
  },
  onLoad: function () {
    let that = this;
      wx.login({
        success(res){
          that.setData({
            code: res.code
          })
        }
      });
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res) {
                app.userInfo = res.userInfo;
                that.setData({
                  userData:res
                })
                that.wxLogin();
              }
            });
        }else{
            that.setData({
              setTingGet: true
            })
        }
      }
    });
    that.getBanner();

  },
  /******** 用户登录 ********/
  wxLogin(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/Home/Index/dologin', {
      code: that.data.code,
      encryptedData: that.data.userData.encryptedData,
      iv: that.data.userData.iv
    }).then(res => {
      wx.hideLoading();
      
    }, _ => {
      wx.hideLoading();
    });
  },
  /******** 获取banner&&获取最新活动&&获取类别 ********/
  getBanner(){
    let that = this;
    Http.post('/Home/Silu/banner', {
    }).then(res => {
      that.setData({
        swiperArray:res.data
      })
    }, _ => {
    });
    Http.post('/Home/Silu/activity', {
    }).then(res => {
        that.setData({
          actives: res.data
        })
    }, _ => {
    });
    Http.post('/Home/Silu/kind', {
    }).then(res => {
      that.setData({
        navList: res.data
      })
    }, _ => {
    });    
  },
  bindGetUserInfo(e){
    let that = this;
    if (e.detail.userInfo) {
        wx.getUserInfo({
          success(res) {
            console.log(res);
            app.userInfo = res.userInfo;
            that.setData({
              userData: res,
              setTingGet: false
            });
            that.wxLogin();
          }
        });
    } else {

    }
  }
 
})