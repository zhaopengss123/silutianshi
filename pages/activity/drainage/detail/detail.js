const QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://ylbb-business.oss-cn-beijing.aliyuncs.com/2020/1585211527119406.jpg",
    switchColor: '#FFC41F',
    activityDetail: {},
    musicList: [],
    musicName: null,
    listName: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'],
    id: null,
    joinCount : 0,
    purchaseCount: 0,
    joinRecord: [],
    checkId: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        id: options.id
      })
      this.getData();
      //this.getTodayData();
      this.getPurchaseTodayData();
    }
  },

  getData(){
    let that = this;
    Http.get('/activity/getActivityDetail', {
      id: this.data.id
    }).then(res => {
      if (res.result == 1000) {
        res.data.activity.startTime = that.format(res.data.activity.startTime);
        res.data.activity.endTime = that.format(res.data.activity.endTime);
        let otherContent = JSON.parse(res.data.activity.otherContent);
        that.setData({
          isName: otherContent.isName,
          isBirthday: otherContent.isBirthday,
          customList: otherContent.list,
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
  addtime(m){ return m < 10 ? '0' + m : m },
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
          if (item.id == that.data.activityDetail.musicId){
            that.setData({
              musicName: item.name
            })
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
  editActivity(){
     wx.navigateTo({
       url: `../drainage?id=${ this.data.id }`,
     })
  },
  preview(){
    wx.navigateTo({
      url: `../recommend/recommend?id=${this.data.id}`,
    })  
  },
  getTodayData(){
    let that = this;
    let url = '/activityPublic/rebate/getTodayJoinRecord';
    if(this.data.checkId == 2){
      url = '/activityPublic/rebate/getJoinRecord';
    }
    Http.get( url , {
      paramJson: JSON.stringify({ activityId : this.data.id }),
      pageNum: 10
    }).then(res => {
      if (res.result == 1000) {
          that.setData({
            joinCount: res.data.joinCount
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
  getPurchaseTodayData() {
    let that = this;
    let url = '/activityPublic/rebate/getTodayJoinRecord';
    if (this.data.checkId == 2) {
      url = '/activityPublic/rebate/getJoinRecord';
    }
    Http.get(url, {
      paramJson: JSON.stringify({ activityId: this.data.id, payStatus: 1 }),
      pageNum: 10
    }).then(res => {
      if (res.result == 1000) {
        that.setData({
          purchaseCount: res.data.joinCount,
          joinRecord: res.data.joinRecord
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
  checkNav(e){
    let id = e.target.dataset.id;
    this.setData({
      checkId: id
    })
    this.getTodayData();
    this.getPurchaseTodayData();
  },
  toRecord(){
    wx.navigateTo({
      url: `/pages/activity/drainage/record/record?id=${ this.data.id }`,
    })
  },
  toClistindex(){
    let that = this;
    let path = `/pages/drainage/index/index?id=${that.data.id}&openId=${app.userInfo.openId}&nickName=${app.userInfo.nickName}&headImg=${app.userInfo.headImg}`;
    wx.navigateToMiniProgram({
      appId: 'wx1f1e136159cc94b5', // 要跳转的小程序的appid
      path: path, // 跳转的目标页面
      envVersion: "develop",
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功  
      }
    })
  },
  toClistShare() {
    let that = this;
    let path = `/pages/drainage/share/share?id=${that.data.id}&openId=${app.userInfo.openId}&nickName=${app.userInfo.nickName}&headImg=${app.userInfo.headImg}`;
    wx.navigateToMiniProgram({
      appId: 'wx1f1e136159cc94b5', // 要跳转的小程序的appid
      path: path, // 跳转的目标页面
      envVersion: "develop",
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功  
      }
    })
  },
  setOut(){
    let that = this;
    Http.get('/activity/setSoldOut', {
      id: this.data.id
    }).then(res => {
      if (res.result == 1000) {
          wx.redirectTo({
            url: '/pages/index/index',
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
  }
})