const app = getApp();
// pages/payment/yuyue_Successful_booking/yuyue_Successful_booking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id=options.order_id
    this.data.tradeNo = options.tradeNo
    this.data.order_score = options.order_score
    this.data.realPayMoney = options.realPayMoney
    console.log(options)
  },
  monitorOrder(tradeNo) {
    let time = 0;
    wx.showLoading({
      title: '支付中'
    })
    let that = this
    this.monitorOrderInterval = setInterval(() => {
      app.auth_request({
        url: "ips/check_pay_status",
        params: {
          tradeNo
        }
      }).then((res) => {
        console.log(res)
        time++
        if (res.status == 200) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
          })
          clearInterval(this.monitorOrderInterval)
          wx.navigateTo({
            url: '/pages/payment/yuyue_Successful_pay/yuyue_Successful_pay?order_id=' + that.data.order_id ,
          })
        } else {
          if (time >= 20) {
            wx.hideLoading()
            wx.showToast({
              title: '支付超时',
              icon: 'none'
            })
            clearInterval(this.monitorOrderInterval)
          
          }
        }
      })
    }, 1000)

  },
  pay(tradeNo) {
    let that = this
    wx.showLoading({
      title: '',
      mask: true
    })
    app.auth_request({
      url: "ips/pay",
      method: "POST",
      data: {
        tradeNo,
        order_score: this.data.order_score,
        realPayMoney: this.data.realPayMoney
      }
    }).then((res) => {
      wx.hideLoading()
      if (res.status == 200) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (res) {
            console.log(res)
            that.monitorOrder(tradeNo)

          },
          fail: function (res) {
            console.log(res)
           wx.showToast({
             title: '支付已取消',
             icon:'none'
           })
          }
        })
      } else {
        wx.showToast({
          title: res.message,
        })
      }
    })
  },
  //重新支付
  repayment(){
    this.pay(this.data.tradeNo)
  },
  //查看订单
  toOrder(){
    wx.navigateTo({
      url: '/pages/payment/waiting_payment/waiting_payment?order_id=' + this.data.order_id + "&tradeNo=" + this.data.tradeNo,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})