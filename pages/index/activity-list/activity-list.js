const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: [],
    endActivityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivityList()
  },


  /* 获取参与过的活动列表 */
  getActivityList() {
    Http.get('/activity/getActivityList', {
    }).then(res => {
      if (res.result == 1000 && res.data) {
        let activityList = res.data.list.filter(item =>  item.runningStatus == 0 );
        let endActivityList = res.data.list.filter(item => item.runningStatus == 1 );
        console.log(activityList);
        this.setData({
          activityList,
          endActivityList
        })
      }
    });
  },
  /* 去活动详情 */

  toactivitydetail(e) {
    let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/activity/drainage/detail/detail?id=${id}`,
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})