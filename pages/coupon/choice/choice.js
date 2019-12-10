const app = getApp()
// pages/ticket/ticket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    flagId: 0,
    scrollLeft: 0,
    list: [{
        tit: "全部",
      },
      {
        tit: "已失效",
      }
    ],
    flag1: true,
    flag2: false,
  },
  tabSelect(e) {
    var flagId = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset.id);
    if (flagId == 1) {
      this.setData({
        flag2: true,
        flag1: false
      });
    } else {
      this.setData({
        flag1: true,
        flag2: false
      });
    }
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.RefreshData()
    this.setData({
      service_id: options.service_id,
      service_price: options.service_price
    })
  },
  RefreshData: function () {
    this.getCoupon()
  },
  //优惠券接口
  getCoupon() {
    app.auth_request({
      url: "usercoupon/by_service",
      params:{
        service_id: this.data.service_id
      }
    }).then((res) => {
      console.log(res)
      res.valid.forEach((item)=>{
        item.reduce_money = parseInt(item.reduce_money)
      })
      this.setData({
        coupon: res.valid
      })
    })
  },
  toBeOrder(e) {
    console.log(e)
    back: {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        playOrderSelectCoupon: e.currentTarget.dataset.item
      })
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {

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