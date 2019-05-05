const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDetail:[],
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  onShow(){
   
  },
  getData() {
    Http.post('/Home/Silu/mytype', {
      token: app.globalConfig.token
    }).then(res => {
      wx.hideLoading();
      this.setData({
        listDetail: res.data,
        loading:true
      })
    
    }, _ => {
      wx.hideLoading();
    });
  },
  todetail(e){
    app.memberDetail = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../detailEnrolled/detailEnrolled',
    })
  },
  tobm(){
    wx.navigateTo({
      url: '../notEnrolled/notEnrolled',
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