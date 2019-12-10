const app = getApp()
// pages/information/information.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo:{}
  },
  add_car: function () {
    wx.navigateTo({
      url: '/pages/mycar/mycar',
    })
  },
  ification_next(){
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  //待支付
  wait_order(){
    wx.navigateTo({
      url: '../tobepaid/tobepaid?num=0',
    })
  },
  //待使用
  wait_user(){
    wx.navigateTo({
      url: '../tobepaid/tobepaid?num=1',
    })
  },
  //已完成
  success_order(){
    wx.navigateTo({
      url: '../tobepaid/tobepaid?num=2',
    })
  },
  //撤销单
  cencel_order(){
    wx.navigateTo({
      url: '../tobepaid/tobepaid?num=3',
    })
  },

  my_appointment(){
    wx.navigateTo({
      url: '../payment/yuyue_my_appointment/yuyue_my_appointment',
    })
  },
  //全部订单
  toFullOrder(){
wx.navigateTo({
  url: '/pages/tobepaid/tobepaid?num=0',
})
  },
  //签到
  calendarCheck(){
    wx.navigateTo({
      url: '/pages/us/signin/signin',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.RefreshData()
  },
  RefreshData: function () {
    this.getUserinfo()
  },
  getUserinfo(){
    app.auth_request({
      url: 'user/info'
    }).then((res) => {
      console.log(res);
      app.userInfo = res
      this.setData({
        userInfo:res
      })
      if(res.status!=402){
        this.getDay()
      }
    })
  },
 
 getDay(){
   app.auth_request({
     url: 'signinlog/count'
   }).then((res) => {
    //  console.log(res);
     this.setData({
       dayNum: res
     })
   })
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
    this.onLoad()
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
    this.RefreshData()
    clearTimeout(this.PullDownTime)
    this.PullDownTime = setTimeout((function(){
      wx.stopPullDownRefresh()
    }),2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})