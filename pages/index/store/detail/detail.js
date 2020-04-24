const QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
const Http = require('../../../../utils/request.js');
let qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['', '', ''],
    array: [],
    codeImg: null,
    shopDetail: {},
    typeIndex: null,
    typeList: [
      { id: 1, name: '线下零售' },
      { id: 2, name: '餐饮' },
      { id: 3, name: '居民生活/商业服务' },
      { id: 4, name: '休闲娱乐' },
      { id: 5, name: '教育/医疗' },
      { id: 6, name: '其它' }
    ],
    location: {
      lat: null,
      lng: null
    },
    percentage: 0,
    selectmune: false,
    showAddress: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      // key: 'VYHBZ-BEEC4-XW3UX-XW77L-RDSUK-ROF55' //这里自己的secret秘钥进行填充
      key: 'LU4BZ-LAVLW-KLYRB-OASEY-CBH42-DRB4H'
    });
    this.setData({
      shopDetail: JSON.parse(JSON.stringify(app.shopDetail)),
    });
    if (app.shopDetail.province && app.shopDetail.city && app.shopDetail.district) {
      this.setData({
        region: [app.shopDetail.province, app.shopDetail.city, app.shopDetail.district]
      });
    }
    this.data.typeList.map((item,index) =>{
      if (app.shopDetail.shopType == item.id){
        this.setData({
          typeIndex: index
        })
      }
    })
    this.getPercentage();
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    this.getPercentage();
  },
  focusaddress(){
    this.setData({
      selectmune: true
    })
  },
  getPercentage(){
    let datas = this.data.shopDetail;
    let percentage = 0;
    if (!this.data.location.lat){
      this.setData({
        location: {
          lat: datas.latitude,
          lng: datas.longitude
        }
      })
    }
    percentage = datas.shopImg ? percentage + 10 : percentage;
    percentage = datas.shopName ? percentage + 10 : percentage;
    percentage = datas.shopShortName ? percentage + 10 : percentage;
    percentage = this.data.region[0] ? percentage + 10 : percentage;
    percentage = datas.address ? percentage + 10 : percentage;
    percentage = this.data.typeIndex || this.data.typeIndex == 0 ? percentage + 10 : percentage;
    percentage = datas.shopPhone ? percentage + 10 : percentage;
    percentage = datas.wxNumber ? percentage + 10 : percentage;
    percentage = datas.wxQr ? percentage + 10 : percentage;
    percentage = this.data.location.lat ? percentage + 10 : percentage;
    this.setData({
      percentage
    })
  },
  selectHeaderImg(e) {
    let that = this
    let id = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        if (id == 1) {
          that.setData({
            storeimg: tempFilePaths
          })
        } else {
          that.setData({
            codeImg: tempFilePaths
          })
        }
        let myDate = new Date()
        // let ossPath = 'seekings/' + myDate.getFullYear()
        let ossPath = myDate.getFullYear()

        for (let i = 0; i < tempFilePaths.length; i++) {
          // 获取文件后缀
          let pathArr = tempFilePaths[i].split('.');
          pathArr[3] = pathArr[3] || 'png';
          //  随机生成文件名称
          let fileRandName = Date.now() + "" + parseInt(Math.random() * 1000)
          let fileName = fileRandName + '.' + pathArr[3]
          // 要提交的key
          let fileKey = ossPath + '/' + fileName
          let url = 'https://ylbb-business.oss-cn-beijing.aliyuncs.com';
          wx.showLoading({
            title: '加载中……',
            mask: true
          })
          wx.uploadFile({
            url: url,
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {
              name: tempFilePaths[i],
              key: fileKey,
              policy: 'eyJleHBpcmF0aW9uIjoiMjEyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==',
              OSSAccessKeyId: 'LTAI4FxMmT8LFEdzkoefE9Za',
              signature: 'IHEwp+GTKrirS+VRhWJ1EQrnFDU=',
              success_action_status: "200"
            },
            success: function (res) {
              let data = res.data;
              let shopDetail = JSON.parse(JSON.stringify(that.data.shopDetail));
              if (id == 1) {
                shopDetail.shopImg = url + '/' + fileKey;
              } else {
                shopDetail.wxQr = url + '/' + fileKey;
              }
              that.setData({ shopDetail });
              that.getPercentage();
              wx.hideLoading();
            }, fail(err) {
              console.log(err);
              wx.hideLoading();
            }
          })
        }
        that.setData({
          upliadImages: res.tempFilePaths
        })
      }, fail(err) {
        console.log(err);
        wx.hideLoading();
      }
    })
  },
  //通过地理位置获取经纬度
  autoGetLocation(e) {
    let that = this;
    let region = this.data.region;
    // if (typeof (e) != 'string' && !e.detail.value){
    //     return false;
    // }
    qqmapsdk.geocoder({
      address: region[0] + region[1] + region[2] + e,
      success: function (res) {
      },
      complete: res => {
        let location = res.result.location;
        that.setData({
          location: location || {}
        });
        that.getPercentage();
      }
    })
  },
  selectType(e) {
    let index = e.detail.value;
    let shopDetail = JSON.parse(JSON.stringify(this.data.shopDetail));
    shopDetail.shopType = this.data.typeList[index].id;
    this.setData({
      shopDetail,
      typeIndex: index
    })
    this.getPercentage();    
  },
  submit() {
    let that = this;
    if (this.data.percentage != 100){
      wx.showToast({
        title: '请完善店铺信息！',
        icon: 'none'
      })
      return false;
    }
    let shopDetail = JSON.parse(JSON.stringify(this.data.shopDetail));
    let region = this.data.region;
    shopDetail.id = shopDetail.id ? shopDetail.id : null;
    shopDetail.province = region[0];
    shopDetail.city = region[1];
    shopDetail.district = region[2];
    shopDetail.shopType = 1;
    shopDetail.latitude = this.data.location.lat;
    shopDetail.longitude = this.data.location.lng;
    wx.showLoading({ title: '加载中...', mask: true });
    Http.post('/shop/save', {
      paramJson: JSON.stringify(shopDetail)
    }).then(res => {
      if (res.result == 1000) {
        that.getShop();
        app.shopDetail = shopDetail;
        wx.showToast({
          title: '操作成功！',
        });
        setTimeout(res=>{
          wx.navigateBack();
        },1000);
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
  selectshopName(e) {
    this.setData({
      'shopDetail.shopName': e.detail.value
    })
    this.getPercentage();  
  },
  selectshopShortName(e) {
    this.setData({
      'shopDetail.shopShortName': e.detail.value
    })
    this.getPercentage();  
  },
  editaddress(e) {
    this.setData({
      'shopDetail.address': e.detail.value
    })
    this.getPercentage();  
    this.getsuggest(e);
  },
  bindphones(e){
    this.setData({
      'shopDetail.shopPhone': e.detail.value
    })
    this.getPercentage(); 
  },
  bindwxNumber(e) {
    this.setData({
      'shopDetail.wxNumber': e.detail.value
    })
    this.getPercentage();  
  },
  getShop() {
    let that = this;
    wx.showLoading({ title: '加载中...', mask: true });
    Http.get('/account/getShop').then(res => {
      if (res.result == 1000) {
        app.shopDetail = res.data;
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
  //数据回填方法
  backfill: function (e) {
        var title = e.currentTarget.dataset.title;
        this.setData({
          'shopDetail.address': title
        });
    this.autoGetLocation(title);
    },

  //触发关键词输入提示事件
  getsuggest: function (e) {
        var _this = this;

    if (e.detail && !e.detail.value){
        return ;
    }
        //调用关键词提示接口
        qqmapsdk.getSuggestion({
            //获取输入框值并设置keyword参数
            keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
            //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
            success: function (res) {//搜索成功后的回调
                var sug = [];
                for (var i = 0; i < res.data.length; i++) {
                    sug.push({ // 获取返回结果，放到sug数组中
                        title: res.data[i].title,
                        id: res.data[i].id,
                        addr: res.data[i].address,
                        city: res.data[i].city,
                        district: res.data[i].district,
                        latitude: res.data[i].location.lat,
                        longitude: res.data[i].location.lng
                    });
                }
                _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
                    suggestion: sug
                });
            },
            fail: function (error) {
                console.error(error);
            },
            complete: function (res) {
            }
        });
  },
  isAddress(){
    this.setData({
      showAddress: false
    });
    this.autoGetLocation(this.data.shopDetail.address);
  },
  focusaddress(){
    this.setData({
      showAddress: true
    });    
  }
})