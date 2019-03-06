const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArray:[],
    actives:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getBanner();
    this.getData(options.id);
  },

  /******** 获取banner&&获取最新活动&&获取类别 ********/
  getBanner() {
    let that = this;
    Http.post('/Home/Silu/banner', {
    }).then(res => {
      that.setData({
        swiperArray: res.data
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
  },
  getData(id) {
    console.log(app.globalConfig);
    Http.post('/Home/Silu/videos', {
      token: app.globalConfig.token,
      area: app.globalConfig.cityid,
      id:id
      }).then(res => {

      }, _ => {
      });
  }
})