const app = getApp();
const Http = require('./../../utils/request.js');
Page({
  data: {
    code:'',
    userData:{},
    setTingGet:false,
    swiperArray:[],
    actives:{},
    navList:[],
    setTingAddress:false,
    hidezz:false
  },
  onLoad: function () {
    let that = this;
      wx.login({
        success(res){
          console.log(res);
          that.setData({
            code: res.code
          })
        }
      });
    that.wxLogin();
    that.getBanner();

  },

  showzz(){
    this.setData({
      hidezz:true
    })
  },
  nozz(){
    this.setData({
      hidezz: false
    })
  },
  /******** 用户登录 ********/
  wxLogin(){
    let that = this;
    wx.getSetting({
      success(ress) {
        console.log(ress);
        if (ress.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success(res) {
              app.userInfo = res.userInfo;
              that.setData({
                userData: res
              })
                wx.getLocation({
                  type: 'wgs84',
                  success(res) {
                    app.globalConfig.latitude = res.latitude;
                    app.globalConfig.longitude = res.longitude;
                    wx.showLoading({
                      title: '加载中...',
                    })
                    Http.post('/Home/Index/dologin', {
                      code: that.data.code,
                      encryptedData: encodeURI(that.data.userData.encryptedData),
                      iv: encodeURI(that.data.userData.iv),
                      lat: app.globalConfig.latitude,
                      lng: app.globalConfig.longitude

                    }).then(res => {
                      wx.hideLoading();
                      app.globalConfig.token = res.data.token;
                      app.globalConfig.cityid = res.data.cityid;
                    }, _ => {
                      wx.hideLoading();
                    });

                  },
                  fail(err) {
                    that.setData({
                      setTingAddress: true
                    })
                  }
                })
          
              
            }
          });
        } else {
            that.setData({
              setTingGet:true
            })
        }
      }
    });

  },
  /******** 获取banner&&获取最新活动&&获取类别 ********/
  getBanner(){
    let that = this;
    Http.post('/Home/Silu/banner', {
    }).then(res => {
      that.setData({
        swiperArray:res.data
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
    Http.post('/Home/Silu/kind', {
    }).then(res => {
      that.setData({
        navList: res.data
      })
    }, _ => {
    });    
  },
  bindGetUserInfo(e){
    let that = this;
    if (e.detail.userInfo) {
        wx.getUserInfo({
          success(res) {
            console.log(res);
            app.userInfo = res.userInfo;
            that.setData({
              userData: res,
              setTingGet: false
            });
            that.wxLogin();
          }
        });
    } else {

    }
  },
  openSetting(e) {
    let that = this;

    //that.getaddressIndex('0');
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.userLocation']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法获取信息！',
        showCancel: false
      })
    } else {
      that.setData({
        setTingAddress: false
      })
      that.wxLogin();
    }
  },
  onShareAppMessage: function () {
    let arr = [
    "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502382558ylbaby.jpg",
    "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502395131ylbaby.jpg",
    "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502397059ylbaby.jpg",
    "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502399046ylbaby.jpg"
    ];
    let imgs = arr[Math.floor(Math.random() *3 + 1)];
    console.log(imgs);
    return {
      title: '丝路天使少儿艺术团，等你来参加～',
      path: `/pages/index/detail/index/index`,
      imageUrl: imgs
    }

  },
 
})