const Http = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {
    phone: '',
    code: '',
    getCodeTime: 60,
    verificationCode: null,
    unphone: null
  },
  onLoad: function (options) {
    if (options.status) {
      this.setData({
        unphone: app.userInfo.phone
      })
    }
  },
  onShow: function () {
    // wx.showModal({
    //   showCancel: false,
    //   title: '温馨提示',
    //   content: '如果您是会员请绑定会员手机号'
    // });
  },
  /* -------------------- 获取验证码 -------------------- */
  getCode() {
    if (this.data.getCodeTime != 60) { return; }
    let isMobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (isMobile.test(this.data.phone)) {
      wx.showLoading({
        title: '正在获取验证码',
        mask: true
      });

      Http.get('/account/sendValidateCode', {
        phone: this.data.phone
      }).then(res => {
        wx.hideLoading();
        if (res.result == 1000) {
          this.setIntervalCode();
          // this.setData({
          //   verificationCode: res.result.verificationCode,
          //   token: res.result.token,
          //   getCodePhone: this.data.phone
          // });

        } else {
          wx.showToast({
            icon: "none",
            title: '获取验证码失败',
          })
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入正确手机号',
      })
    }
  },

  /* ---------------- 倒计时 ---------------- */
  setIntervalCode() {
    let interval = setInterval(_ => {
      let getCodeTime = this.data.getCodeTime - 1;
      this.setData({ getCodeTime });
      if (getCodeTime <= 0) { clearInterval(interval); this.setData({ getCodeTime: 60 }); }
    }, 1000)
  },

  /* ---------------- 绑定电话号码 ---------------- */
  submit() {
    Http.get('/account/updatePhone', {
      phone: this.data.phone,
    }).then(res => {
      this.getAccountInfo();
      wx.navigateBack();
      wx.hideLoading();

    })
    if (!this.data.code) {
      wx.showToast({
        icon: "none",
        title: '请输入验证码',
      });
      return;
    }
    // if (this.data.code != this.data.verificationCode && this.data.phone != this.data.getCodePhone) {
    //   wx.showToast({
    //     icon: "none",
    //     title: '验证码错误',
    //   });
    //   return;
    // }
    wx.showLoading({
      title: '绑定中...',
      mask: true
    });
    let that = this;

    Http.get('/account/checkValidateCode', {
      phone: that.data.phone,
      code: that.data.code
    }).then(result => {
      if (result.result == 1000) {
        Http.get('/account/updatePhone', {
          phone: that.data.phone,
        }).then(res => {
          that.getAccountInfo();
          wx.navigateBack();
          wx.hideLoading();

        })

      } else {
        wx.showToast({
          icon: "none",
          title: '验证码错误',
        });
      }
    })
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },
  //绑定头像用户名信息
  getUserInfo: function () {
    let that = this;
    if (!this.data.code) {
      wx.showToast({
        icon: "none",
        title: '请输入验证码',
      });
      return;
    }
    // if (this.data.code != this.data.verificationCode && this.data.phone != this.data.getCodePhone) {
    //   wx.showToast({
    //     icon: "none",
    //     title: '验证码错误',
    //   });
    //   return;
    // }
    if (e.detail.userInfo) {
      app.userInfo.nickName = e.detail.userInfo.nickName;
      app.userInfo.headImg = e.detail.userInfo.avatarUrl;
      this.submit();
    }
  },

  getAccountInfo() {
    let that = this;
    Http.get('/account/getAccountInfo').then(res => {
      app.userInfo = res.data;
      wx.setStorageSync('userInfo', JSON.stringify(res.data));
    });
  }

})