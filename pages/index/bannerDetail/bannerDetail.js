const app = getApp();
const Http = require('../../../utils/request.js');
var wxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsDateil: {},
    details:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    console.log(this.data.id);
    this.getData();
  },

  getData() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
    })
    Http.post('/Home/Silu/banner_info', {
      id: that.data.id
    }).then(res => {
      wx.hideLoading();

      let content = res.data.content;
      wxParse.wxParse('details', 'html', content, this, 0);

      that.setData({
        newsDateil: res.data
      })

    }, _ => {
      wx.hideLoading();
    });
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