App({
  userInfo:{},
  globalConfig: {
    userInfo: null,
    token: null,
    latitude:'',
    longitude:'',
    cityid: '',
  },
  envVersion: 'develop', //跳转体验版
  //envVersion: 'release', //跳转正式版
  shopDetail: {},
  token: null,
  //domain: 'http://39.107.232.95:6086/cloudstore',
  domain: "https://cloudstore.haochengzhang.com/cloudstore",
  onLaunch: function () {
    // 获取屏幕参数
    try {
      const res = wx.getSystemInfoSync()
      if (res.platform == 'ios') {
        this.globalData.platform = 'ios'
      } else if (res.platform == 'android') {
        this.globalData.platform = 'android'
      }
      // 导航高度
      let navHeight = res.statusBarHeight
      // 屏幕宽度/高度，单位px
      this.globalData.screenWidth = res.screenWidth
      this.globalData.screenHeight = res.screenHeight
      // 状态栏的高度，单位px
      this.globalData.statusBarHeight = res.statusBarHeight
      // 设备像素比
      this.globalData.pixelRatio = res.pixelRatio
      // 可使用窗口宽度，单位px
      this.globalData.winWidth = res.windowWidth
      // 安卓时，胶囊距离状态栏8px，iOS距离4px
      if (res.system.indexOf('Android') !== -1) {
        this.globalData.navHeight = navHeight + 14 + 32
        this.globalData.navTitleTop = navHeight + 8
        // 视窗高度 顶部有占位栏时
        this.globalData.winHeight = res.screenHeight - navHeight - 14 - 32
        // tab主页视窗高度
        this.globalData.winHeightTab = res.windowHeight - navHeight - 14 - 32
      } else {
        this.globalData.navHeight = navHeight + 12 + 32
        this.globalData.navTitleTop = navHeight + 4
        // 视窗高度 顶部有占位栏时
        this.globalData.winHeight = res.screenHeight - navHeight - 12 - 32
        // tab主页视窗高度
        this.globalData.winHeightTab = res.windowHeight - navHeight - 12 - 32
      }
      // console.log(wx.getSystemInfoSync(), this.globalData.winHeightTab)
    } catch (e) {
      console.log(e)
    }
  },
  globalData: {
    platform: 'ios',
    pixelRatio: 2,
    statusBarHeight: 20,
    navHeight: 64,
    navTitleTop: 26,
    winHeight: 655,
    winWidth: 750,
    screenWidth: 375,
    screenHeight: 812
  }
})
