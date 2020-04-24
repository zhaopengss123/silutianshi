const QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
const Http = require('../../../../utils/request.js');
const back = wx.getBackgroundAudioManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: {},
    shopDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getData();
    }
    this.setData({
      shopDetail: app.shopDetail
    })
  },

  getData() {
    let that = this;
    Http.get('/activity/getActivityDetail', {
      id: this.data.id || 561
    }).then(res => {
      if (res.result == 1000) {
        res.data.activity.startTime = that.format(res.data.activity.startTime);
        res.data.activity.endTime = that.format(res.data.activity.endTime);
        that.setData({
          activityDetail: res.data.activity
        })
        that.getMusic();

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
  addtime(m) { return m < 10 ? '0' + m : m },
  format(shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.addtime(m) + '-' + this.addtime(d);
  },
  getMusic() {
    let that = this;
    Http.get('/activity/listMusic', {
    }).then(res => {
      if (res.result == 1000) {
        let arr = res.data;
        let arrs = [];
        for (let val in arr) {
          arrs.push(arr[val]);
        }
        let o = [];
        arrs.map(item => {
          o.push(JSON.parse(item));

        })
        o.map(item => {
          if (item.id == that.data.activityDetail.musicId) {
            that.setData({
              musicUrl: item.url
            })
            that.backmusic();
            // wx.playBackgroundAudio({
            //   dataUrl: item.url,
            //   title: item.name,
            //   coverImgUrl: ''
            // })
          }
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
  onUnload(){
    wx.stopBackgroundAudio();
  },

  backmusic: function () {
    let that = this;
    player();
    function player() {
      back.title = "此时此刻";
      back.src = that.data.musicUrl;
      back.onEnded(() => {
        player();
      })
    }
  },
  
})