const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toggleIndex: 0,
    payList: [],
    listIncome: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, income, s } = options;
    this.setData({ id, income, s });
    this.getPay();
    this.getIncome();
    this.getData();
  },

  getPay(){
    let that = this;
    Http.get('/withdraw/listPay', {
      activityId: this.data.id
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          payList: res.data.list
        })
      }
      wx.hideLoading();
    });
  },
  getIncome() {
    let that = this;
    Http.get('/withdraw/listIncome', {
      activityId: this.data.id
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          listIncome: res.data.list
        })
        
      }
      wx.hideLoading();
    });
  },
  getData() {
    let that = this;
    Http.get('/activity/getActivityDetail', {
      id: this.data.id
    }).then(res => {
      if(res.result == 1000){
        that.setData({
          detail: res.data.activity
        })
      }
    });
  },
  toggle(e){
    const index = e.currentTarget.dataset.index;
    this.setData({
      toggleIndex: index
    })
  }
})