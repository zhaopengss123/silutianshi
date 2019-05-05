const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[]
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
      title: '加载中',
    })
    Http.post('/Home/Silu/mycollect', {
      token: app.globalConfig.token,
    }).then(res => {
      wx.hideLoading();

      res.data.map(item => {
        item.livenum = Number(item.livenum).toFixed(2);
        item.linenum = Number(item.linenum).toFixed(2);
        item.allnum = Number(item.allnum).toFixed(2);
      })

      that.setData({
        videoList: res.data
      })
    }, _ => {
      wx.hideLoading();
    });
  },
  toIndex() {
    wx.redirectTo({
      url: '/pages/index/index',
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