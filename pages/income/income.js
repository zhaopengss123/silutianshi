const app = getApp();
const Http = require('./../../utils/request.js');
import { numSub } from '../../utils/calculation.js'
import { getPhone, getUserStatus } from '../../utils/getUserStatus.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataMoney: {},
    memberList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow() {
    getUserStatus().then(() => {
      getPhone().then(() => {
        this.getData();
      })
    })
  },
  getData() {
    this.setData({
      memberList: []
    })
    let that = this;
    Http.get('/withdraw/getStatistics').then(res => {
      if (res.result == 1000) {
        that.setData({
          dataMoney: res.data
        })
      }
      wx.hideLoading();
    });

    //未结束后的活动
    Http.get('/withdraw/selectRunningAcitivtyBilling').then(res => {
      if (res.result == 1000) {
        const list = that.data.memberList.concat();
        res.data.map(item => {
          item.s = 1;
          item.nowCount = numSub(item.income, item.pay)
        })
        that.setData({
          memberList: list.concat(res.data)
        })
        console.log(this.memberList);
        // 结束后的活动
        Http.get('/withdraw/selectEndAcitivtyBilling').then(res => {
          if (res.result == 1000) {
            const lists = that.data.memberList.concat();
            res.data.map(item => {
              item.s = 0
              item.nowCount = numSub(item.income, item.pay)
            })
            that.setData({
              memberList: lists.concat(res.data)
            })
          }
          wx.hideLoading();
        });

      }
      wx.hideLoading();
    });

  },

  tocash() {
    wx.navigateTo({
      url: `./cash/cash?toWithdrawedMoney=${this.data.dataMoney.toWithdrawedMoney}`,
    })
  },
  todetail(e) {
    const id = e.currentTarget.dataset.id;
    const income = e.currentTarget.dataset.income;
    const s = e.currentTarget.dataset.s;
    wx.navigateTo({
      url: `./activity-deatil/activity-deatil?id=${id}&income=${income}&s=${s}`,
    })
  }
})