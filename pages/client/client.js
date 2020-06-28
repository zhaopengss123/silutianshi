const app = getApp();
const Http = require('../../utils/request.js');
const getUserInfo = require('../../utils/getUserInfo.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "http://ylbb-business.oss-cn-beijing.aliyuncs.com/2020/1585211527119406.jpg",
    activeId: 1,
    phoneNum: null,
    id: null,
    redPackageList: [],
    joinList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getJoinList();

    let that = this;
    if (app.token || wx.getStorageSync("token")) {
      app.token = app.token || wx.getStorageSync("token");
      that.getJoinList();
    } else {
      getUserInfo().then(login => {
        that.getJoinList();
      }).catch(err => {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  selectActive(e) {
    let index = e.target.dataset.id;
    this.setData({
      activeId: index
    })
    if (this.data.activeId == 1) {
      this.getJoinList();
    } else {
      this.getRedPackage();
    }
  },
  bindseach() {
    if (this.data.activeId == 1) {
      this.getJoinList();
    } else {
      this.getRedPackage();
    }
  },
  getRedPackage() {
    let that = this;
    Http.post('/activity/selectSharerAndRedPackage', {
      activityId: this.data.id,
    }).then(res => {
      if (res.result == 1000) {
        res.data.map(item => {
          item.nickName = unescape(item.nickName);
          item.total = item.total;
        })
        that.setData({
          redPackageList: res.data
        })

      } else {
        wx.showModal({
          title: '温馨提示',
          showCancel: false,
          content: res.message,
        })
        wx.hideLoading();
      }
    });
  },
  getJoinList() {
    let that = this;
    let paramJson = {
      activityId: this.data.id,
      payStatus: 1,
      phoneNum: this.data.phoneNum
    }
    if (!paramJson.phoneNum) {
      delete paramJson.phoneNum;
    }
    Http.post('/activity/getJoinData', {
      paramJson: JSON.stringify(paramJson),
      pageNum: 1,
      pageSize: 10000
    }).then(res => {
      if (res.result == 1000 && res.data.list) {
        res.data.list.map(item => {
          item.otherContent = item.otherContent ? JSON.parse(item.otherContent) : []
        })
        that.setData({
          joinList: res.data.list
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          showCancel: false,
          content: res.message,
        })
        wx.hideLoading();
      }
    });
  },
  phoneNumFun(e) {
    let val = e.detail.value;
    this.setData({
      phoneNum: val
    })
  }
})