/**
 * @function getPhone
 * @<判断是否绑定手机>
 * 
 * @function getUserStatus
 * @<判断是否授权登录>
 * 
 */
const app = getApp();
export const getPhone = (()=>{
  return new Promise((resolve,reject)=>{
    if (app.userInfo && app.userInfo.phone){
      resolve(true)
    }else{
      wx.navigateTo({
        url: '/pages/user/bindphone/bindphone',
      })
      reject(false)
    }
  })
})
export const getUserStatus = (()=>{
  return new Promise((resolve,reject)=>{
    if (app.userInfo.openId && app.userInfo.nickName){
      resolve(true)
    }else{
      reject(false)
      wx.showToast({
        title: '请先授权获取您的用户名头像',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/index/index',
        })
      },1500)
    }
  })
})