const app = getApp();
const Http = require('../../../utils/request.js');
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