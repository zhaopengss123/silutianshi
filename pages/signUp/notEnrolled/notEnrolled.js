const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday:'',
    sexIndex:0,
    sex:'男',
    sexArray:['男','女'],
    provinceList:[],
    provinceIndex:null,
    provinceid : null,
    cityList:[],
    cityIndex:null,
    areaIndex:0,
    areaList:[],
    areaid:null,
    cityid:null,
    jigouList:[],
    jigouId:null,
    jigouIndex:1000,
    name:'',
    parents:'',
    pphone:'',
    typeList:[],
    typeInde:0,
    jigou:null,
    areaid:null,
    childList:[],
    childtype:'',
    childtypeIndex:1000,
    jigouName: null
  },

  onLoad: function (options) {
    this.getProvince();
    this.getJigou();
    this.getkind();
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
  parentsInput(e){
    this.setData({
      parents: e.detail.value
    });
  },
  pphoneInput(e) {
    this.setData({
      pphone: e.detail.value
    });
  },
  getkind(){
    let that = this;
    Http.post('/Home/Silu/kind', {
    }).then(res => {
      wx.hideLoading();
      that.setData({
        typeList :res.data
      })
    }, _ => {
      wx.hideLoading();
    });
  },
  typeChange(e){
    this.setData({
      typeIndex: e.detail.value,
      type: this.data.typeList[e.detail.value].id,
      childList:[],
      childtype:'',
      childtypeIndex: 1000
    })
    this.getChild();
  },
  childtypeChange(e){
    this.setData({
      childtypeIndex: e.detail.value,
      childtype: this.data.childList[e.detail.value].id
    })
  },
  getChild(){
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
      if (!that.data.name){
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
      if (that.data.childList.length && !that.data.childtype ){
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
      if (!that.data.jigou) {
        wx.showToast({
          icon: "none",
          title: '请选择报名机构',
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
      mask: true
    })
    Http.post('/Home/Silu/baoming', {
      name: that.data.name,
      birthday: that.data.birthday,
      sex: that.data.sex == '男'? 1 : 0,
      parents: that.data.parents,
      pphone: that.data.pphone,
      type: that.data.type,
      childid: that.data.childtype,
      area: that.data.areaid,
      provinceid: that.data.provinceid,
      jigou: that.data.jigou,
      jigouid: that.data.jigou,
      token: app.globalConfig.token,
      zl:0
    }).then(res => {
      wx.hideLoading();
      if(res.code == 200){
       wx.showToast({
         title: '报名成功！',
       })
       setTimeout(function(){
         wx.redirectTo({
           url: '/pages/user/user',
         })
       },1500);

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
// 获取机构
getJigou(){
  let that = this;
  Http.post('/Home/Silu/jigou', {
    areaid: that.data.areaid
  }).then(res => {
    wx.hideLoading();
    that.setData({
      jigouList: res.data
    })
  }, _ => {
    wx.hideLoading();
  });
},

  provinceChange(e){
      this.setData({
        provinceIndex: e.detail.value,
        provinceid: this.data.provinceList[e.detail.value].provinceid
      })
      
      this.getCity();
  },

  cityChange(e){
    this.setData({
      cityIndex: e.detail.value,
      cityid: this.data.cityList[e.detail.value].cityid
    })
    this.getArea();
  },
  getArea(){
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

  getCity(){
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
  areaChange(e){
    this.setData({
      areaIndex: e.detail.value,
      areaid: this.data.areaList[e.detail.value].id
    })
    this.getJigou();
  },
  jigouChange(e) {
    this.setData({
      jigouIndex: e.detail.value,
      jigou: this.data.jigouList[e.detail.value].id
    })
    console.log(this.data.jigouList[e.detail.value].id);
  },
  jigouInput(e){
    this.setData({
      jigouName: e.detail.value
    });
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
    })
    this.setData({
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
    console.log(imgs);
    return {
      title: '丝路天使少儿艺术团，等你来参加～',
      path: `/pages/index/detail/index/index`,
      imageUrl: imgs
    }

  },
})