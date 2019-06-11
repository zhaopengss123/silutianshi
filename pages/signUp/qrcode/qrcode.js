const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday: '',
    sexIndex: 0,
    sex: '男',
    sexArray: ['男', '女'],
    provinceList: [],
    provinceIndex: null,
    provinceid: null,
    cityList: [],
    cityIndex: null,
    areaIndex: 0,
    areaList: [],
    areaid: null,
    cityid: null,
    jigouList: [],
    jigouId: null,
    jigouIndex: 1000,
    name: '',
    parents: '',
    pphone: '',
    typeList: [],
    typeInde: 0,
    jigou: null,
    areaid: null,
    childList: [],
    childtype: '',
    childtypeIndex: 1000,
    jgName:null
  },

  onLoad: function (options) {
    let that = this;
    this.getProvince();
    // this.getJigou();
    this.getkind();
    Http.post('/Home/Silu/get_name', {
      id: options.id
    }).then(res => {
      that.setData({
        jgName: res.data,
        jgId: options.id
      })
      wx.hideLoading();
    }, _ => {
      wx.hideLoading();
    });

    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
        that.wxLogin();
      }
    });
    
  },
  //获取省
  getProvince() {
    Http.post('/Home/Silu/sheng', {
    }).then(res => {
      wx.hideLoading();
      this.setData({
        provinceList: res.data
      })
    }, _ => {
      wx.hideLoading();
    });
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },
  parentsInput(e) {
    this.setData({
      parents: e.detail.value
    });
  },
  pphoneInput(e) {
    this.setData({
      pphone: e.detail.value
    });
  },
  getkind() {
    let that = this;
    Http.post('/Home/Silu/kind', {
    }).then(res => {
      wx.hideLoading();
      that.setData({
        typeList: res.data
      })
    }, _ => {
      wx.hideLoading();
    });
  },
  typeChange(e) {
    this.setData({
      typeIndex: e.detail.value,
      type: this.data.typeList[e.detail.value].id,
      childList: [],
      childtype: '',
      childtypeIndex: 1000
    })
    this.getChild();
  },
  childtypeChange(e) {
    this.setData({
      childtypeIndex: e.detail.value,
      childtype: this.data.childList[e.detail.value].id
    })
  },
  getChild() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    Http.post('/Home/Silu/child', {
      id: this.data.type
    }).then(res => {
      wx.hideLoading();
      that.setData({
        childList: res.data
      })
      console.log(that.data.childList);
    }, _ => {
      wx.hideLoading();
    });
  },
  submits() {
    let that = this;
    let isMobile = /^1[3|4|5|6|7|8][0-9]\d{4,8}$/;
    if (isMobile.test(this.data.pphone) && this.data.pphone.length == 11) {
      if (!that.data.name) {
        wx.showToast({
          icon: "none",
          title: '请输入参赛者姓名',
        })
        return false;
      }
      if (!that.data.birthday) {
        wx.showToast({
          icon: "none",
          title: '请输入参赛者年龄',
        })
        return false;
      }
      if (!that.data.parents) {
        wx.showToast({
          icon: "none",
          title: '请输入监护人姓名',
        })
        return false;
      }
      if (!that.data.type) {
        wx.showToast({
          icon: "none",
          title: '请选择报名类目',
        })
        return false;
      }
      if (that.data.childList.length && !that.data.childtype) {
        wx.showToast({
          icon: "none",
          title: '请选择二级类目',
        })
        return false;
      }

      if (!that.data.provinceid) {
        wx.showToast({
          icon: "none",
          title: '请选择省',
        })
        return false;
      }
      if (!that.data.areaid) {
        wx.showToast({
          icon: "none",
          title: '请选择区',
        })
        return false;
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入正确手机号',
      })
      return false;
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    Http.post('/Home/Silu/baoming', {
      name: that.data.name,
      birthday: that.data.birthday,
      sex: that.data.sex,
      parents: that.data.parents,
      pphone: that.data.pphone,
      type: that.data.type,
      childid: that.data.childtype,
      area: that.data.areaid,
      Provinceid: that.data.provinceid,
      jigou: that.data.jgName,
      token: app.globalConfig.token,
      provinceid: that.data.provinceid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        wx.showToast({
          title: '报名成功！',
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/user/user',
          })
        }, 1500);

      } else {
        wx.showToast({
          icon: 'none',
          title: res.message,
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  // 获取机构
  // getJigou() {
  //   let that = this;
  //   Http.post('/Home/Silu/jigou', {
  //   }).then(res => {
  //     wx.hideLoading();
  //     that.setData({
  //       jigouList: res.data
  //     })
  //   }, _ => {
  //     wx.hideLoading();
  //   });
  // },

  provinceChange(e) {
    this.setData({
      provinceIndex: e.detail.value,
      provinceid: this.data.provinceList[e.detail.value].provinceid
    })

    this.getCity();
  },

  cityChange(e) {
    this.setData({
      cityIndex: e.detail.value,
      cityid: this.data.cityList[e.detail.value].cityid
    })
    this.getArea();
  },
  getArea() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/qu', {
      cityid: this.data.cityid
    }).then(res => {
      wx.hideLoading();
      that.setData({
        areaList: res.data,
        areaIndex: null
      })
    }, _ => {
      wx.hideLoading();
    });
  },

  getCity() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/shi', {
      provinceid: this.data.provinceid
    }).then(res => {
      wx.hideLoading();
      that.setData({
        cityList: res.data,
        cityIndex: null
      })
    }, _ => {
      wx.hideLoading();
    });
  },
  areaChange(e) {
    this.setData({
      areaIndex: e.detail.value,
      areaid: this.data.areaList[e.detail.value].id
    })

  },
  jigouChange(e) {
    this.setData({
      jigouIndex: e.detail.value,
      jigou: this.data.jigouList[e.detail.value].id
    })
  },
  //选择生日
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  // 选择性别
  sexChange(e) {
    this.setData({
      sexIndex: Number(e.detail.value),
      sex: this.data.sexArray[this.data.sexIndex]
    })

  },
  onShareAppMessage: function () {
    let arr = [
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502382558ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502395131ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502397059ylbaby.jpg",
      "http://ylbb-business.oss-cn-beijing.aliyuncs.com/1555502399046ylbaby.jpg"
    ];
    let imgs = arr[Math.floor(Math.random() * 3 + 1)];
    return {
      title: '丝路天使少儿艺术团，等你来参加～',
      path: `/pages/index/detail/index/index`,
      imageUrl: imgs
    }

  },
  /******** 用户登录 ********/
  wxLogin() {
    let that = this;
    wx.getSetting({
      success(ress) {
        
        if (ress.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success(res) {
              app.userInfo = res.userInfo;
              that.setData({
                userData: res
              })
              console.log(2222);

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
            },fail(res){
              console.log(res);
            }
          });
        } else {
          console.log(1111);
          that.setData({
            setTingGet: true
          })
        }
      }
    });

  },  
  toIndex(){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  bindGetUserInfo(e) {
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
})