const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperArray:[],
    actives:'',
    videoList:[],
    ggbanner:{},
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getBanner();
      this.getData(options.id);
      this.setData({
        id : options.id
      })

  },
  onShow(){
    if( this.data.id ){
      this.getData(this.data.id);
    }
    
  },

  /******** 获取banner&&获取最新活动&&获取类别 ********/
  getBanner() {
    let that = this;
    Http.post('/Home/Silu/banner', {
    }).then(res => {
      that.setData({
        swiperArray: res.data
      })
    }, _ => {
    });
    Http.post('/Home/Silu/activity', {
    }).then(res => {
      that.setData({
        actives: res.data
      })
    }, _ => {
    });
    Http.post('/Home/Silu/guanggao', {
    }).then(res => {
      that.setData({
        ggbanner: res.data[0]
      })
    }, _ => {
    });
  },
  tobannerDetail(){
    wx.navigateTo({
      url: 'bannerdetail/bannerdetail?detail=' + JSON.stringify(this.data.ggbanner),
    })
  },
  getData(id) {
    wx.showLoading({
      title: '加载中……',
    })
    Http.post('/Home/Silu/videos', {
      token: app.globalConfig.token,
      area: app.globalConfig.cityid,
      id:id
      }).then(res => {
        wx.hideLoading();
       if(res.code == 200){
        let arr = [];
         res.data.map((item,index) => {
           item.livenum = Number(item.livenum).toFixed(2);
           item.linenum = Number(item.linenum).toFixed(2);
           item.allnum = Number(item.allnum).toFixed(2);

           if ((index)%10!=0 || index==0){
              arr.push(item);
           }else{
             let json = {
               skm:true
             };
             arr.push(json);
             arr.push(item);
           }
         })
          this.setData({
            videoList: arr
          })
        } 
      }, _ => {
        wx.hideLoading();

      });
  },
  onShareAppMessage: function () {
    let arr = [
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502382558ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502395131ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502397059ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502399046ylbaby.jpg"
    ];
    let imgs = arr[Math.floor(Math.random() * 3 + 1)];
    console.log(imgs);
    return {
      title: '丝路天使少儿艺术团，等你来参加～',
      path: `/pages/index/detail/index/index`,
      imageUrl: imgs
    }

  },
})