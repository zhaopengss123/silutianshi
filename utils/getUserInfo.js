const app = getApp();

/**
 *
 * @module 获取用户信息
 * ---------------------------------------------------------------
 * 
 * @param gobind: boolean 默认为 true  =>  是否判断有无绑定信息并跳转到相关页面
 * @param latest: boolean 默认为 false =>  是否向服务器请求最新数据
 * 
 * @description 
 * 
 *      latest 为 true 则直接请求服务器最新数据
 * 
 *      判断App.js 是否存储用户信息（是否为第一次调用）
 *        
 *          第一次调用：
 *              监测用户登录状态是否过期：
 *                    未过期 => 获取本地存储用户信息并返回成功
 *                    已过期 => 调用登录方法，获取用户信息存储至本地并返回
 *          不是第一次：
 *              获取App.userInfo 并返回
 *
 * ---------------------------------------------------------------
 */
const Login = (getToken) => {
  return new Promise((resolve, reject) => {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    userInfo = userInfo ? JSON.parse(userInfo) : {};
    if (userInfo.openId && token && !getToken) {
      app.userInfo = userInfo;
      app.token = token;      
      resolve(userInfo);
    } else {
      wx.login({
        success(res) {
          wx.request({
            url: `${app.domain}/account/login`,
            method: "get",
            data: {
              code: res.code
            },
            dataType: 'json',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              if (res.data.result == 1000) {
                wx.setStorageSync('token', res.data.data);
                app.token = res.data.data;
                wx.request({
                  url: `${app.domain}/account/getAccountInfo`,
                  method: "GET",
                  dataType: 'json',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': app.token
                  },
                  success(res) {
                    if (res.data.result == 1000) {
                      resolve(res.data.data);
                      app.userInfo = res.data.data;
                      wx.setStorageSync('userInfo', JSON.stringify(res.data.data))
                    } else {
                      reject(null);
                    }
                  },
                  fail(err) {
                    reject(err);
                  }
                })

              } else {
                reject(null);
              }
            }
          })
        }
      })
    }
  })

}

const GetUserInfo = (getToken) => {
  return new Promise((resolve, reject) => {
    Login(getToken).then(res => {
      resolve(res)
    }).catch(err => {
      reject(null)
    })


  })
}


module.exports = GetUserInfo;