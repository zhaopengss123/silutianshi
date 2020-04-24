const app = getApp();
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switchColor: '#FFC41F',
    allAccount: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getData(){
    let that = this;
    wx.showLoading({ title: '加载中...', mask: true });
    Http.get('/shop/allAccount', {
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          allAccount: res.data
        })
        wx.hideLoading();
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
  statusChange(e){
    let item = e.currentTarget.dataset.item;
    let that = this;
    wx.showLoading({ title: '加载中...', mask: true });
    Http.post('/shop/updateAccountStatus', {
      accountId: item.id,
      status: item.status == 0 ? -1 : 0 
    }).then(res => {
      if (res.result == 1000) {
        wx.showToast({
          title: '操作成功！',
          icon: 'none'
        })
        wx.hideLoading();
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
  onShareAppMessage() {
    let that = this;
    return {
      title: `邀请您加入${app.shopDetail.shopName }`,
      path: `/pages/index/index?storeId=${app.shopDetail.id}`,
      imageUrl: 'https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/branch-store/hbfxtopbg.png'
    }
  },
})