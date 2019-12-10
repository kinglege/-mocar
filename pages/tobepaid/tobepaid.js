const app = getApp();
// pages/tobepaid/tobepaid.js
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
    num: 0,
    list: [{
        tit: "待支付",
      },
      {
        tit: "待使用",
      },
      {
        tit: "已完成",
      },
      {
        tit: "退款售后",
      },
    ],
    flag1: true,
    flag2: false,
    flag3: false,
    flag4: false,
  },
  tabSelect(e) {
    console.log(e)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.gettoBePaid()
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //联系我们电话
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  /**
   *腾讯地图转百度地图经纬度
   */
  qqMapTransBMap(lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng;
    let y = lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta) + 0.0065;
    let lats = z * Math.sin(theta) + 0.006;
    return {
      lng: lngs,
      lat: lats
    };
  },

  /*
   * 百度转腾讯
   */
  bMapTransqqMap(lng, lat) {
    let x_pi = (3.14159265358979324 * 3000.0) / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {
      longitude: lngs,
      latitude: lats
    };
  },
  //门店位置地图
  openLocation(e) {
    let that = this
    let data = this.bMapTransqqMap(Number(e.currentTarget.dataset.lng), Number(e.currentTarget.dataset.lat))
    wx.openLocation({
      latitude: data.latitude,
      longitude: data.longitude,
    })
  },
  //监听支付状态
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
            url: '/pages/payment/yuyue_Successful_pay/yuyue_Successful_pay?order_id=' + this.pay_order.id,
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
    }, 300)

  },
  //发起支付
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
        tradeNo
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
          success: function(res) {
            console.log(res)
            that.monitorOrder(tradeNo)

          },
          fail: function(res) {
            console.log(res)
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  //立即支付
  repayment(e) {
    console.log(e)
    this.pay_order = e.currentTarget.dataset.item;
    this.pay(this.pay_order.tradeNo)
  },
  //取消订单
  cancel_reservation(e){
    console.log(e)
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/cancel/cancellationOrder/cancellationOrder?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.data.order_id = options.order_id
    this.setData({
      TabCur: options.num
    })
  },
  gettoBePaid() {
    wx.showLoading({
    })
    app.auth_request({
      url: "order",
      params: {
        check_status: this.data.TabCur,
        payType: 1
      }
    }).then((res) => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        everyOrder: res
      })
    })
  },
  to_be_paid(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/payment/waiting_payment/waiting_payment?order_id=' + e.currentTarget.dataset.id,
    })
  },
  to_be_user(e) {
    wx.navigateTo({
      url: '/pages/payment/waiting_service/waiting_service?order_id=' + e.currentTarget.dataset.id,
    })
  },
  toSuccess(e) {
    wx.navigateTo({
      url: '/pages/payment/service_completion/service_completion?order_id=' + e.currentTarget.dataset.id,
    })
  },
  toRefund(e) {
    wx.navigateTo({
      url: '/pages/payment/refund_completed/refund_completed?order_id=' + e.currentTarget.dataset.id,
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
    this.gettoBePaid()

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
  //   this.RefreshData()
  //   clearTimeout(this.PullDownTime)
  //   this.PullDownTime = setTimeout((function () {
  //     wx.stopPullDownRefresh()
  //   }), 2000)
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