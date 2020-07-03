const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toWithdrawedMoney: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { toWithdrawedMoney } = options;
    this.setData({
      toWithdrawedMoney: Number(toWithdrawedMoney) || 0
    })
  },
  sureWithdraw(){ 
    let that = this;
    if (this.data.toWithdrawedMoney<1){
      wx.showToast({
        title: '可提现金额大于1元才可以提现哦~',
        icon: 'none'
      })
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '您确定要提现所有金额吗？',
      success(res) {
        if (res.confirm) {
          that.todoWithdraw();
        }
      }
    })
  },
  todoWithdraw(){
    let that = this;
    Http.get('/withdraw/doWithdraw',{
      openId: app.userInfo.openId
    }).then(res => {
      if(res.result == 1000){
        wx.showToast({
          title: res.message || '操作成功',
        })
        setTimeout(()=>{
        wx.switchTab({
          url: '/pages/income/income',
        })
        }, 1500)
      }
      wx.hideLoading();
    });
  },
  
tocashList(){
  wx.navigateTo({
    url: './list/list'
  })
}
})