const app = getApp();
const Http = require('./../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  getData(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/Home/Silu/myinfo', {
      token: app.token,
    }).then(res => {
      wx.hideLoading();
      
    }, _ => {
      wx.hideLoading();
    }); 
  },
  

  // 收藏页面
  toCollection(){
    wx.navigateTo({
      url: 'collection/collection',
    })
  },
  //去历史记录
  toHistory(){
    wx.navigateTo({
      url: 'history/history',
    })    
  },
  //去关注页面
  toFollow(){
    wx.navigateTo({
      url: 'follow/follow',
    }) 
  },
  // 去比赛页面
  toMatch(){
    wx.navigateTo({
      url: 'match/match',
    })   
  },
  //去报名类目
  toSignup(){
    wx.navigateTo({
      url: '/pages/signUp/enrolled/enrolled',
    })   
  }
})