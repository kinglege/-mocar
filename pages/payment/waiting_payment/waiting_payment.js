const app = getApp()
// pages/payment/waiting_payment/waiting_payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    orderDetail:[],
    showModal:false,
    order_score: 0,
    pay_score_scale: ''
  },
  //弹框
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
  //获取登录信息
  getUserinfo() {
    wx.showLoading()
    app.auth_request({
      url: 'user/info'
    }).then((res) => {
      wx.hideLoading()
      app.userInfo = res
      this.setData({
        userInfo: res
      })
    })
  },
  //联系我们电话
  makePhone(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options)
    this.data.order_id = options.order_id
    this.data.tradeNo = options.tradeNo
    this.data.shop_id = options.shop_id
    this.RefreshData()
    
  },
  RefreshData: function () {
    this.getOrderDetail()
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
  openLocation() {
    let that = this
    let data = this.bMapTransqqMap(Number(that.data.orderDetail.shop.lng), Number(that.data.orderDetail.shop.lat))
    wx.openLocation({
      latitude: data.latitude,
      longitude: data.longitude,
    })
  },
  //支付
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
            url: '/pages/payment/yuyue_Successful_pay/yuyue_Successful_pay?order_id=' + that.data.order_id,
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
      console.log(res)
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
              icon: 'none'
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
  //支付
  repayment(e) {
    console.log(e)
    let tradeNo = e.currentTarget.dataset.orderdetail.tradeNo
    this.pay(tradeNo)
  },
  //取消订单
  cancel_reservation(){
    var that=this
    wx.navigateTo({
      url: '/pages/cancel/cancellationOrder/cancellationOrder?id=' + that.data.orderDetail.id,
    })
  },
  // cancel_reservation(e) {
  //   console.log(e)
  //   var id = e.currentTarget.dataset.id
  //   // var that=this
  //   app.auth_request({
  //     url: "order/cancel",
  //     method: "POST",
  //     params: {
  //       id,
  //     }
  //   }).then((res) => {
  //     console.log(res)
       
  //     if (res.status == 200) {
  //       wx.showToast({
  //         title: res.message,
  //         icon: "none"
  //       })
  //       // wx.navigateTo({
  //       //   url: '/pages/payment/yuyue_my_appointment/yuyue_my_appointment',
  //       // })
  //     } else {
  //       wx.showToast({
  //         title: res.message,
  //         icon: 'none',

  //       })
  //     }
  //   })
  // },
  //页面渲染
  getOrderDetail() {
    wx.showLoading()
    app.auth_request({
      url: "order/" + this.data.order_id
    }).then((res) => {
      console.log(res)
      this.setData({
        orderDetail:res
      })
      this.count_score()
      this.count_coupon_money()
    })
  },
  //跳转门店
  toStoreDetail(e){
    console.log(e)
    var that = this
    if(this.data.orderDetail.shop==null){
      wx.showToast({
        title: '门店不存在或已搬迁',
      })
    }else{
    wx.navigateTo({
      url: '/pages/shop/details/details?shop_id=' + that.data.orderDetail.shop_id,
    })
    }
  },
  //服务类目跳转详情
  toServe(){
    if(this.data.orderDetail.service==null){
      wx.showToast({
        title: '商品不存在或已被删除',
      })
    }else{
    wx.navigateTo({
      url: '/pages/home/ticket/ticket?id=' + this.data.orderDetail.serve_id,
    })
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
  onShow: function() {
    
  },
  count_coupon_money(){
    let coupon_money = ''
    if (this.data.orderDetail.coupon[0]) {
      if (this.data.orderDetail.coupon[0].type == 2) {
        coupon_money = this.data.orderDetail.coupon[0].reduce_money
      }
      if (this.data.orderDetail.coupon[0].type == 1) {
        coupon_money = (this.data.orderDetail.totalMoney - this.data.orderDetail.coupon[0].discount * this.data.orderDetail.totalMoney)
      }
      if (this.data.orderDetail.coupon[0].type == 3) {
        coupon_money = this.data.orderDetail.totalMoney
      }
      coupon_money = coupon_money.toFixed(2)
    }
    console.log(this.data)
    this.setData({
      coupon_money
    })
  },
  count_score(){
    
    if (!this.data.pay_score_scale) {
      app.auth_request({
        url: 'preferences',
        params: {
          param: 'pay_score_scale'
        }
      }).then((res) => {
        console.log(res)
        wx.hideLoading()
        this.setData({
          pay_score_scale: res.pay_score_scale
        })

        let order_score = 0;
        let realPayMoney = 0;
        if (app.userInfo.orderScore >= this.data.orderDetail.realTotalMoney * this.data.pay_score_scale) {
          order_score = this.data.orderDetail.realTotalMoney * this.data.pay_score_scale
        } else {
          order_score = app.userInfo.orderScore
        }
        console.log(this.data)
        this.setData({
          order_score: this.data.orderDetail.order_score,
          order_score_max: Math.ceil(order_score),
          order_score_real: order_score,
          realPayMoney: this.data.orderDetail.realPayMoney,
        })
        
        
      })
    } else {
      let order_score = 0;
      let realPayMoney = 0;
      if (app.userInfo.orderScore >= this.data.orderDetail.realTotalMoney * this.data.pay_score_scale) {
        order_score = this.data.orderDetail.realTotalMoney * this.data.pay_score_scale
      } else {
        order_score = app.userInfo.orderScore
      }
      this.setData({
        order_score: this.data.orderDetail.order_score,
        order_score_max: Math.ceil(order_score),
        realPayMoney: this.data.orderDetail.realPayMoney
      })
      
    }
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

  },
  /**
   * 弹窗
   */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () { },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  /**
   * 监听搜索内容
   */
  inputChange: function (event) {
    let that = this;
    console.log(event)
    var inputSearch = event.detail.value;
    
    if (parseInt(inputSearch) > this.data.order_score_max) {
      wx.showToast({
        title: '最高可用' + this.data.order_score_max + '魔豆',
        icon: 'none'
      })
      return
    }
    if (parseInt(inputSearch) == this.data.order_score_max) {
      if (this.data.order_score_max > this.data.orderDetail.realTotalMoney * this.data.pay_score_scale) {
        that.setData({
          order_score: inputSearch,
          realPayMoney: app.count_money(this.data.orderDetail.realTotalMoney * (1 - this.data.pay_score_scale))
        })
        return
      }
    }
    that.setData({
      order_score: inputSearch,
      realPayMoney: app.count_money(this.data.orderDetail.realTotalMoney - inputSearch)

    })
    this.data.order_score = this.data.order_score ? this.data.order_score :0
  }
})