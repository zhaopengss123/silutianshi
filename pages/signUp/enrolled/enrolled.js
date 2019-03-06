const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProvince();
  },
    //获取省
    getProvince(){
    Http.post('/Home/Silu/sheng', {
    }).then(res => {
      wx.hideLoading();
      this.setData({
        provinceList:res.data
      })
    }, _ => {
      wx.hideLoading();
    }); 
  },
  submits(){
    Http.post('/Home/Silu/myinfo', {
      name: name,
      birthday: birthday,
      sex: sex,
      parents: parents,
      pphone: pphone,
      type: type,
      area: app.area,
      jigou: mechanism,
      token: app.globalConfig.token
    }).then(res => {
      wx.hideLoading();

    }, _ => {
      wx.hideLoading();
    }); 
  }
  
})