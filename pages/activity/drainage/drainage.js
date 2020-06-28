const QQMapWX = require('./../../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
const Http = require('./../../../utils/request.js');
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showEdit: false,
    startDate: null,
    startTime: null,
    switchColor: '#FFC41F',
    rule: "1.获得红包奖励条件：被推荐人通过推荐人的推荐链接购买商品。\n2.达到活动条件后自动发红包到账户内，凭券到店使用。消费时出示使用即可。\n3. 本次活动数量有限,先到先得。\n4. 活动以平台展示结果为准。\n5. 此次活动由店铺发起与云分店平台无关，活动解释权归本店铺所有。",
    giftList: [],
    listName: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'],
    isHorseRaceLamp: true,
    horseRaceLampText: '',
    storeimg: 'https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/branch-store/hbfxtopbg.png',
    paramJson: {
      activityPrizes: [],
      activityRedpacketRule: {
        sendType: 1
      },
      headImg: 'https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/branch-store/hbfxtopbg.png'
    },
    typeList: [{
      text: '随机红包',
      id: 1
    }, {
      text: '固定红包',
      id: 2
    }],
    typeIndex: 1,
    musicList: [],
    musicIndex: 0,
    id: null,
    inputList: [{
      type: 'text',
      name: '文本格式'
    }, {
      type: 'number',
      name: '数字格式'
    }, {
      type: 'date',
      name: '日期'
    }],
    inputIndex: 0,
    customList: [],
    ddlSwitch: true,
    isName: true,
    isBirthday: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      // key: 'VYHBZ-BEEC4-XW3UX-XW77L-RDSUK-ROF55' //这里自己的secret秘钥进行填充
      key: 'LU4BZ-LAVLW-KLYRB-OASEY-CBH42-DRB4H'
    });
    this.getMusic();
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getData();
    }else{
      
      this.setData({
        "paramJson.effectiveDays": 30,
        "paramJson.cuePhrases": "转发朋友圈，朋友下单，您即可获得2.88 - 6.66元大红包奖励，多推多得，上不封顶！",
        "paramJson.activityRole": "1.获得红包奖励条件：被推荐人通过推荐人的推荐链接购买商品。\n2.达到活动条件后自动发红包到账户内，凭券到店使用。消费时出示使用即可。\n3. 本次活动数量有限，先到先得。\n4. 活动以平台展示结果为准。\n5. 此次活动由店铺发起与云分店平台无关，活动解释权归本店铺所有。",
        "paramJson.threshold": '无使用门槛' ,
        "paramJson.availableRange" : '全国适用',
        "paramJson.activityRedpacketRule":{
          maxValue: 6.66,
          minValue: 2.22,
          fixValue: 2.22
        },
        "paramJson.activityPrizes": [{}]
      })
    }

    this.setData({
      "paramJson.redPackageName": app.shopDetail.shopShortName
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindDateSatrt(e) {

    this.setData({
      "paramJson.startTime": e.detail.value
    })
  },
  bindDateEnd(e) {
    this.setData({
      "paramJson.endTime": e.detail.value
    })
  },

  addGift() {
    let giftList = this.data.paramJson.activityPrizes || [];
    let json = {};
    giftList.push(json);
    this.setData({
      "paramJson.activityPrizes": giftList
    })
  },
  removeGift(e){
    let index = e.currentTarget.dataset.index;
    let list = this.data.paramJson.activityPrizes;
    list.splice(index,1);
    this.setData({
      "paramJson.activityPrizes": list
    })
  },
  horseRaceLamp(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.cuePhrases": detail
    })
  },
  // 广告语开关
  switchCuePhrases(e) {
    let blone = e.detail.value;
    this.setData({
      isHorseRaceLamp: blone
    })
  },
  selectHeaderImg(e) {
    let that = this
    let id = e.currentTarget.dataset.id;

    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;

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
              if (id == 1) {
                that.setData({
                  'paramJson.headImg': url + '/' + fileKey
                });

              } else if (id == 2) {
                let indexs = e.currentTarget.dataset.index;
                let arr = that.data.paramJson.activityPrizes || [];
                arr.map((item, index) => {
                  if (index == indexs) {
                    item.prizeImg = url + '/' + fileKey
                  }
                })

                that.setData({
                  'paramJson.activityPrizes': arr
                });

              } else if (id == 3) {
                let arr = that.data.paramJson.activityImgs || [];
                arr.push(url + '/' + fileKey);
                that.setData({
                  'paramJson.activityImgs': arr
                })
              }
              console.log(url + '/' + fileKey);
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
  selectType(e) {
    let index = e.detail.value;
    this.setData({
      typeIndex: index,
      "paramJson.activityRedpacketRule.sendType": Number(index) + 1
    })
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
        o.unshift({ id: 0 , name: '无' , url: null });
        that.setData({
          musicList: o
        })
        setTimeout(res => {
          o.map((item, index) => {
            if (item.id == that.data.paramJson.musicId) {
              that.setData({
                musicIndex: index
              })
            }
          })
        }, 2000);

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
  bindkeyHeadline(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityHeadline": detail
    })
  },
  bindkeyHeadline(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityHeadline": detail
    })
  },
  editProductName(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.productName": detail
    })
  },
  editShortName(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.editShortName": detail
    })
  },
  editShortName(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.shortName": detail
    })
  },
  editOrgPrice(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.orgPrice": detail
    })
  },
  editPromotionPrice(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.promotionPrice": detail
    })
  },

  editminValue(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityRedpacketRule.minValue": detail
    })
  },
  editmaxValue(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityRedpacketRule.maxValue": detail
    })
  },
  editfixValue(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityRedpacketRule.fixValue": detail
    })
  },
  editlimitCount(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityRedpacketRule.limitCount": detail
    })
  },

  editactivityRole(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityRole": detail
    })
  },
  editactivityIntroduce(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.activityIntroduce": detail
    })
  },
  editThreshold(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.threshold": detail
    })
  },

  editEffectiveDays(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.effectiveDays": detail
    })
  },
  editEffectiveDays(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.effectiveDays": detail
    })
  },
  editAvailableRange(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.availableRange": detail
    })
  },
  editlocationLimit(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.locationLimit": detail
    })
  },
  check(data, alert) {
    if (!data) {
      wx.showToast({
        title: alert,
        icon: 'none'
      })
      return false;
    } else {
      return true;
    }

  },
  save() {
    let paramJson = JSON.parse(JSON.stringify(this.data.paramJson));
    let isphone = false,isNames = false,isSr = false;
    //paramJson.otherContent = typeof (paramJson.otherContent) == 'string' ? paramJson.otherContent : JSON.parse(paramJson.otherContent);
    if (typeof (paramJson.otherContent) == 'string'){
      paramJson.otherContent = JSON.parse(paramJson.otherContent);
    }
    console.log(paramJson.otherContent);
    if (!this.data.isHorseRaceLamp) { paramJson.cuePhrases = '';   }

    paramJson.otherContent = paramJson.otherContent ? paramJson.otherContent : { list: [] }
    paramJson.otherContent.list = paramJson.otherContent.list ? paramJson.otherContent.list : [];
     paramJson.otherContent.list.map(item=>{
      if (item.name == '手机号'){
        isphone = true;
      }
      if (item.name == '姓名'){
        isNames = true;
      }
      if (item.name == '生日') {
        isSr = true;
      }
    })
    if (!isphone){
    paramJson.otherContent.list.unshift({
      type: 1,
      name: '手机号'
    });
    }
    if (this.data.isName && !isNames) {
      paramJson.otherContent.list.unshift({
        type: 0,
        name: '姓名'
      });
    }
    if (this.data.isBirthday && !isSr) {
      paramJson.otherContent.list.unshift({
        type: 2,
        name: '生日'
      });
    }
    paramJson.activityPrizes.map((item, index) => {
      if (!this.check(item.prizeName, '礼品' + this.data.listName[index] + '名称不能为空')) { return false; }
      if (!this.check(item.prizeValue, '礼品' + this.data.listName[index] + '礼品价值不能为空')) { return false; }
      // if (!this.check(item.prizeIntroduction, '礼品' + this.data.listName[index] + '广告描述不能为空')) { return false; }
      if (!this.check(item.prizeImg, '礼品' + this.data.listName[index] + '图片不能为空')) { return false; }
    })
    if (!this.check(paramJson.activityHeadline, '活动标题不能为空')) { return false; }
    if (!this.check(paramJson.startTime, '开始时间不能为空')) { return false; }
    if (!this.check(paramJson.endTime, '结束时间不能为空')) { return false; }
    if (!this.check(paramJson.productName, '商品名称不能为空')) { return false; }
    if (!this.check(paramJson.promotionPrice, '活动价格不能为空')) { return false; }
    if (!this.check(paramJson.availableRange, '适用范围不能为空')) { return false; }
    
    if (paramJson.activityRedpacketRule.sendType == 1) {
      if (!this.check(paramJson.activityRedpacketRule.minValue, '红包最小金额不能为空')) { return false; }
      if (!this.check(paramJson.activityRedpacketRule.maxValue, '红包最大金额不能为空')) { return false; }
      if (Number(paramJson.promotionPrice) < Number(paramJson.activityRedpacketRule.maxValue)){
        wx.showToast({
          title: '红包金额不能大于活动金额',
          icon: 'none'
        })
        return false;
      }
      if (Number(paramJson.activityRedpacketRule.minValue) < 1 || Number(paramJson.activityRedpacketRule.maxValue) < 1){
        wx.showToast({
          title: '红包金额不能小于1元',
          icon: 'none'
        })
        return false;
      }
    } else {
      if (!this.check(paramJson.activityRedpacketRule.fixValue, '红包金额不能为空')) { return false; }
      if (Number(paramJson.promotionPrice) < Number(paramJson.activityRedpacketRule.fixValue)) {
        wx.showToast({
          title: '红包金额不能大于活动金额',
          icon: 'none'
        })
        return false;
      }
      if (Number(paramJson.activityRedpacketRule.fixValue) < 1) {
        wx.showToast({
          title: '红包金额不能小于1元',
          icon: 'none'
        })
        return false;
      }
    }

    if (!this.check(paramJson.activityRole, '活动规则不能为空')) { return false; }
    if (!this.check(paramJson.activityIntroduce, '活动描述不能为空')) { return false; }
    if (!this.check(paramJson.activityImgs, '请上传活动图片')) { return false; }
    if (!this.check(paramJson.activityImgs.length, '请上传活动图片')) { return false; }
    paramJson.activityImgs = paramJson.activityImgs ? paramJson.activityImgs.join(',') : '';
    paramJson.locationLimit = paramJson.locationLimit ? 1 : 0;
    paramJson.templateId = 16;
    if(!this.data.ddlSwitch){
      paramJson.activityPrizes = [];
    }
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    Http.post('/activity/savePromotionActivity', {
      paramJson: JSON.stringify(paramJson)
    }).then(res => {
      if (res.result == 1000) {
        wx.navigateTo({
          url: `./detail/detail?id=${res.data}`,
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
  editprizeName(e) {
    let indexs = e.currentTarget.dataset.index;
    let detail = e.detail.value;
    let arr = this.data.paramJson.activityPrizes || [];
    arr.map((item, index) => {
      if (index == indexs) {
        item.prizeName = detail
      }
    })
    this.setData({
      'paramJson.activityPrizes': arr
    })
  },
  editprizeValue(e) {
    let indexs = e.currentTarget.dataset.index;
    let detail = e.detail.value;
    let arr = this.data.paramJson.activityPrizes || [];
    arr.map((item, index) => {
      if (index == indexs) {
        item.prizeValue = detail
      }
    })
    this.setData({
      'paramJson.activityPrizes': arr
    })
  },
  editprizeIntroduction(e) {
    let indexs = e.currentTarget.dataset.index;
    let detail = e.detail.value;
    let arr = this.data.paramJson.activityPrizes || [];
    arr.map((item, index) => {
      if (index == indexs) {
        item.prizeIntroduction = detail
      }
    })
    this.setData({
      'paramJson.activityPrizes': arr
    })
  },
  selectmusic(e) {
    let index = e.detail.value;
    this.setData({
      musicIndex: index,
      "paramJson.musicId": this.data.musicList[index].id
    })
  },
  editredPackageName(e) {
    let detail = e.detail.value;
    this.setData({
      "paramJson.redPackageName": detail
    })
  },
  getData() {
    let that = this;
    Http.get('/activity/getActivityDetail', {
      id: this.data.id
    }).then(res => {
      if (res.result == 1000) {
        res.data.activity.startTime = that.format(res.data.activity.startTime);
        res.data.activity.endTime = that.format(res.data.activity.endTime);
        res.data.activity.activityImgs = res.data.activity.activityImgs.split(',');
        let otherContent = JSON.parse(res.data.activity.otherContent); 
        let arr = otherContent.list;
        arr.forEach((item, index) => {
          if (item.name == '姓名' || item.name == '生日' || item.name == '手机号') {
            delete arr[index]
          }
        })
        arr = arr.filter(function (val) {
          return val
        })
        otherContent.list = arr;

        if (res.data.activity.activityPrizes.length){
          that.setData({
            ddlSwitch: true
          })
        }else{
          that.setData({
            ddlSwitch: false
          })
        }
        that.setData({
          isName: otherContent.isName || false,
          isBirthday: otherContent.isBirthday || false,
          customList: otherContent.list,
          paramJson: res.data.activity,
          typeIndex: res.data.activity.activityRedpacketRule.sendType - 1
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
  selectInput(e) {
    let inputtype  = e.detail.value;
    let index = e.target.dataset.index;
    let customList = this.data.customList;
    customList[index].type = inputtype;
    this.setData({
      customList
    })
  },
  addList(){
    let customList = this.data.customList;
    customList.push({
      type: 0,
      name: ''
    })
    this.setData({ customList })
  },
  selectCustomName(e){
    let val = e.detail.value;
    let index = e.target.dataset.index;
    let customList = this.data.customList;
    customList[index].name = val;
    this.setData({
      customList
    })
  },
  removeList(e){
    let index = e.target.dataset.index;
    let customList = this.data.customList;
    customList.splice(index,1);
    this.setData({ customList });
  },
  toggleNameClass(){
    if (this.data.isName){ 
        this.setData({
          isName: false
        })
     }else{
      this.setData({
        isName: true
      })       
     }
  },
  toggleBirthdayClass() {
    if (this.data.isBirthday) {
      this.setData({
        isBirthday: false
      })
    } else {
      this.setData({
        isBirthday: true
      })
    }
  },
  toggleCustomizeClass() {
    if (this.data.isCustomize) {
      this.setData({
        isCustomize: false
      })
    } else {
      this.setData({
        isCustomize: true
      })
    }
  },
  saveInputlist(){
    let otherContent = {
      isName: this.data.isName ,
      isBirthday: this.data.isBirthday,
      list: this.data.customList
    };
 
    this.setData({
      "paramJson.otherContent": otherContent,
      showEdit: false
    })
  },
  showEditfun(){
    let customList = JSON.parse(JSON.stringify(this.data.customList));
    // customList.map((item,index)=>{
    //   console.log(item.name);
    //   if (item.name == '手机号' || item.name == '生日' || item.name == '姓名' ){
        
    //     customList.splice(index,1);
    //   }
    // })
    console.log(customList);

    this.setData({
      showEdit: true,
      customList
    })
  },
  ddlSwitchfun(e){
    let switchs = e.detail.value;
    this.setData({
      ddlSwitch: switchs
    })
    if (switchs && !this.data.paramJson.activityPrizes.lenhth){
      this.setData({
        "paramJson.activityPrizes": [{}]
      })
    }
  }
})