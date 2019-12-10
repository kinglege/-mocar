// pages/index/activity/activity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    shareLog:[]
  },
  //获取用户信息
  getUserinfo() {
    app.request({
      url: 'user/info_byopenid',
      params: {
        open_id: wx.getStorageSync('open_id')
      }
    }).then((res) => {
      // console.log(res)
      if (res.status == 200) {
        app.userInfo = res.data
        this.setData({
          auth: true
        })
      }
      this.getSharelog()
    })
  },
  to_login() {
    wx.navigateTo({
      url: '/pages/auth/auth',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.RefreshData()
  },
  RefreshData: function() {
    this.getUserinfo()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  arrTrans(num, arr) { // 一维数组转换为二维数组
    const iconsArr = []; // 声明数组
    arr.forEach((item, index) => {
      const page = Math.floor(index / num); // 计算该元素为第几个素组内
      if (!iconsArr[page]) { // 判断是否存在
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
  },
  getSharelog() {
    app.request({
      url: "sharelog",
      params: {
        user_id: app.userInfo ? app.userInfo.id : ""
      }
    }).then((res) => {
      console.log(this.arrTrans(3, res.shareLog))
      this.setData({
        shareLog: this.arrTrans(3, res.shareLog),
        shareData: res
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    if (res.from === "button") {

    }
    return {
      title: "邀请好友送魔豆",
      desc: '魔界专属推荐',
      // imageUrl: this.data.data.banner[0].img,
      path: '/pages/index/index?p_user_id=' + (app.userInfo ? app.userInfo.id : '') // 路径，传递参数到指定页面。
    }
  }

})