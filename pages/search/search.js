const app = getApp();
const Http = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    sort:false,
    type:false,
    areaselect:false,
    provinceList: [],
    provinceIndex: null,
    provinceid: null,
    cityList: [],
    cityIndex: null,
    areaIndex: 0,
    areaList: [],
    areaid: null,
    cityid: null,
    sureAreaId:null,
    areaName:null,
    navList:[],
    order: 1,
    hidezz: false,
    memberName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProvince();
    this.getkind();
    //this.getData();
  },

  getData() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/tvideos', {
      area: app.globalConfig.cityid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        res.data.map(item => {
          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })
        this.setData({
          videoList: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },


  showarea(){
    this.setData({
      areaselect:true
    })
  },
  nocitys(){
    this.setData({
      areaselect: false
    })
  },
  selectType(){
    if (this.data.type){
      this.setData({
        type:false
      })
    }else{
      this.setData({
        type: true
      }) 
    }
  },
  selectSort(){
    if (this.data.sort) {
      this.setData({
        sort: false
      })
    } else {
      this.setData({
        sort: true
      })
    }    
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
  getArea() {
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask:true
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
  areaChange(e) {
    this.setData({
      areaIndex: e.detail.value,
      areaid: this.data.areaList[e.detail.value].id,
      areaName: this.data.areaList[e.detail.value].name
    })

  },
  yescitys() {
    if (this.data.areaid ){
        this.setData({
          sureAreaId: this.data.areaid,
        })
      this.getVideoArea();
    }
    this.setData({
      areaselect: false
    })
  },
  getVideoArea(){
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/areashow', {
      areaid: this.data.sureAreaId
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {

        res.data.map(item => {
          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })

        this.setData({
          videoList: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });  
  },
  getkind(){
    let that = this;
    Http.post('/Home/Silu/kind', {
    }).then(res => {
      that.setData({
        navList: res.data
      })
    }, _ => {
    });
  },
  // 选择类目
  selectTypes(e){
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })    
    Http.post('/Home/Silu/videos', {
      token: app.globalConfig.token,
      area: app.globalConfig.cityid,
      id: id
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {
        res.data.map(item => {

          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })

        this.setData({
          videoList: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  //获取视频
  getVideos(){
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/show', {
      area: app.globalConfig.cityid,
      order: that.data.order
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {

        res.data.map(item => {
          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })

        this.setData({
          videoList: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });   
  },
  order(e){
    this.setData({
      order : e.currentTarget.dataset.order
    })
    this.getVideos();
  },
  noorder(){
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/show', {
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {

        res.data.map(item => {
          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })

        this.setData({
          videoList: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });     
  },
  showzz() {
    this.setData({
      hidezz: true
    })
  },
  nozz() {
    this.setData({
      hidezz: false
    })
  },
  selectName(){
    let that = this;
    wx.showLoading({
      title: '加载中……',
      mask: true
    })
    Http.post('/Home/Silu/searshow', {
      name: that.data.memberName
    }).then(res => {
      wx.hideLoading();
      if (res.code == 200) {

        res.data.map(item => {
          item.livenum = Number(item.livenum).toFixed(2);
          item.linenum = Number(item.linenum).toFixed(2);
          item.allnum = Number(item.allnum).toFixed(2);
        })

        this.setData({
          videoList: res.data
        })
      }
    }, _ => {
      wx.hideLoading();
    });        
  },
  nameInput(e){
    this.setData({
      memberName: e.detail.value
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