const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday:'',
    sexIndex:null,
    sexArray:['男','女'],
    provinceList:[],
    provinceIndex:null
  },

  onLoad: function (options) {
    this.getProvince();
  },
  //获取省
  getProvince() {
    Http.post('/Home/Silu/sheng', {
    }).then(res => {
      wx.hideLoading();
      this.setData({
        provinceList: res.data
      })
    }, _ => {
      wx.hideLoading();
    });
  },
  submits() {
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
  },
  //选择生日
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  // 选择性别
  sexChange(e) {
    this.setData({
      sexIndex: Number(e.detail.value)
    })
  },
})