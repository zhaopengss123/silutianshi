const app = getApp();
const Http = require('../../../../utils/request.js');
let set;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heart: false,
    shares: false,
    fabulous: false,
    vid: null,
    videoDetail: {},
    likeDetail: [],
    playNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id);
    this.setData({ vid: options.id })
    this.getLike();
  },
  getData(id) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    Http.post('/Home/Silu/detail', {
      vid: id,
      token: app.globalConfig.token
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        that.setData({
          videoDetail: res.data
        })

      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /********收藏************/
  clickHeart() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    Http.post('/Home/Silu/tocollect', {
      vid: that.data.vid,
      token: app.globalConfig.token
    }).then(res => {
      wx.hideLoading();
      let ss = that.data.videoDetail;
      ss.snum = ss.snum ? Number(ss.snum) + 1 : 1;
      that.setData({
        heart: true,
        videoDetail: ss
      })
      console.log(that.data.videoDetail);
      wx.showToast({
        title: '收藏成功！',
      })

    }, _ => {
      wx.hideLoading();
    });
  },
  /********投票************/
  clickFabulous() {
    if (this.data.playNum<20){
        wx.showModal({
          title: '提示',
          content: '观看二十秒才能够点赞哦~',
        })
        return false;
   }

    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    Http.post('/Home/Silu/tozan', {
      vid: that.data.vid,
      token: app.globalConfig.token
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        let ss = that.data.videoDetail;
        ss.znum = ss.znum ? Number(ss.znum) + 1 : 1;
        that.setData({
          fabulous: true,
          videoDetail:ss
        })
        wx.showToast({
          title: '投票成功！',
        })
      }else{
        wx.showToast({
          icon:'none',
          title: res.message,
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  /********获取猜你喜欢***********/
  getLike() {
    let that = this;
    Http.post('/Home/Silu/myfavo', {
      vid: that.data.vid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {

        res.data.map(item => {
          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })

        that.setData({
          likeDetail: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  onShareAppMessage: function () {
    let that = this;
    Http.post('/Home/Silu/zfadd', {
      vid: that.data.vid,
      token: app.globalConfig.token
    }).then(res => {
      wx.hideLoading();
      let ss = that.data.videoDetail;
      ss.zfnum = ss.zfnum ? Number(ss.zfnum) + 1 : 1;
      that.setData({
        videoDetail: ss
      })


    }, _ => {
      wx.hideLoading();
    });
    return {
      title: this.data.videoDetail.name,
      path: `/pages/index/detail/videoPlay/videoPlay?id=${this.data.vid}`,
      imageUrl: this.data.videoDetail.pic
    }

  },
  /********视频播放******** */
  videoplay(){
    let that = this;
    set = setInterval(function(){
      let playNum = that.data.playNum+1;   
      that.setData({
        playNum
      })
    },1000)
  },
  videopause(){
    clearInterval(set);
  }


})