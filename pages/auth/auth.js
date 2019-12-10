const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    userInfoAuth: false,
    mobileAuth: false
  },
  onLoad() {
  },
  // ============
  getPhoneNum(e) {
    
    console.log(e)
    console.log(app.session_key)
    if(e.detail.iv){
      app.auth_request({
        url:'wx/get_phone',
        method:'POST',
        data:{
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          session_key: app.session_key
        }
      }).then((res)=>{
        if(res.phone){
          wx.showLoading({
            mask:true,
            title:'请稍后'
          })
          app.auth_request({
            url: 'user/register_simp',
            method: 'POST',
            data: {
              username: app.globalData.userInfo.nickName,
              open_id: wx.getStorageSync('open_id'),
              headImg: app.globalData.userInfo.avatarUrl,
              mobile: res.phone,
              p_user_id: wx.getStorageSync('p_user_id') ? wx.getStorageSync('p_user_id'):''
            }
          }).then((res) => {
            wx.hideLoading()
            if(res.status==200){
              app.userInfo = res.data
              var pages = getCurrentPages();//获取页面栈
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //调用上一个页面的onShow方法
                prePage.RefreshData()
              } 
              wx.navigateBack({
                
              })
              // wx.switchTab({
              //   url: '/pages/index/index',
              //   success: (res) => {
              //     const currentPages = getCurrentPages()
              //     console.log(currentPages[0]);
              //     currentPages[0].onLoad({
              //       ...currentPages[0].options
              //     })
              //   }
              // })
              console.log(app.userInfo)
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '请授权手机号',
        icon:'none'
      })
    }
  //   wx.request({
  //           url: 'http://host:port/local',
  //           data: {
  //          "tel": e.detail,
  //         "openId": "openId" 
  //     },
  //           method: "GET",
  //           dataType: "json",
  //           success: function (result) {
  //       console.log(result.data + "-------手机号");
        
  //     }
  //    })
  },
  // ==============
  onGetUserInfo(e) {

    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfoAuth: true
      })
    } else {
      wx.showToast({
        title: '请授权用户信息',
        icon: 'none'
      })
    }
    console.log(app.globalData.userInfo)
  }
});
// wx.login({
//   success: function(res) {
//     console.log(res)
//     if (res.code) {
//       //发起网络请求
//       wx.request({
//         url: 'http://192.168.5.3:8080/wx/get_openid',
//         header: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: {
//           code: res.code
//         },
//         method: "POST",
//         success(v) {
//           console.log(v)
//         }
//       })
//     } else {
//       console.log('登录失败！' + res.errMsg)
//     }
//   }
// });