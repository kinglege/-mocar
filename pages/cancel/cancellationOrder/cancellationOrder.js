// pages/cancel/ApplyRefund/ApplyRefund.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cancelReason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      id: options.id,
      orderDetail: options
    })
    this.RefreshData()
  },
  RefreshData: function() {
    this.getReason()
  },
  getReason() {
    app.auth_request({
      url: "reason",
      params: {
        type: 2
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        reason: res
      })
    })
  },
  cancelReason(e) {
    console.log(e)
    this.data.cancelReason = e.detail.value
  },

  cancel_reservation() {
    var id = this.data.id
    // var that=this
    app.auth_request({
      url: "order/cancel",
      method: "POST",
      params: {
        id,
      },
      data: {
        cancelReason: this.data.cancelReason
      }
    }).then((res) => {
      console.log(res)

      if (res.status == 200) {

        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/tobepaid/tobepaid?num=0',
        })

      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',

        })
      }
    })
  },
  no_cancel_reservation() {
    wx.navigateBack({
      delta: 1
    })
  },
  textareaBInput(e) {
    this.data.refundReson = e.detail.value
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