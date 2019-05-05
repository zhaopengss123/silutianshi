const app = getApp();
const Http = require('./../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidezz: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  showzz() {
    this.setData({
      hidezz: true
    })
  },
  nozz() {
    console.log(1111);
    this.setData({
      hidezz: false
    })
  },
  getData(){
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/Home/Silu/myinfo', {
      token: app.globalConfig.token,
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
  },
  onShareAppMessage: function () {
    let arr = [
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502382558ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502395131ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502397059ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502399046ylbaby.jpg"
    ];
    let imgs = arr[Math.floor(Math.random() * 3 + 1)];
    console.log(imgs);
    return {
      title: '丝路天使少儿艺术团，等你来参加～',
      path: `/pages/index/detail/index/index`,
      imageUrl: imgs
    }

  },
})