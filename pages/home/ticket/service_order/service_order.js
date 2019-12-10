const app = getApp()
// pages/home/ticket/service_order/service_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    car: '奥迪 奥迪Q8',
    playOrderSelectCar: '',
    playOrderSelectCoupon: '',
    service_id: '',
    title: "",
    money: "",
    img: "",
    shop_address: "",
    serve_image: "",
    payType: 0,
    showModal: false,
    pay_score_scale: '',
    order_score: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.RefreshData()
    this.setData({
      service_id: options.service_id,
      // shop_address: options.shop_address,
      // serve_image:options.serve_image,
      title: options.title,
      money: options.money,
      payType: options.payType,
      img: options.img,
      type: options.type,
      userInfo: app.userInfo
      // orderRemarks: options.orderRemarks
    });
  },
  RefreshData: function() {
    this.getShop()
    this.getVehicle()
  },
  //订单备注
  textareaBInput(e) {
    this.setData({
      orderRemarks: e.detail.value
    })
  },


  // 下单提交
  playOrder(e) {
  
    let data = {}
    if (!this.data.playOrderSelectCar) {
      wx.showToast({
        title: '请添加您的汽车',
        icon: 'none'
      })
      return
    }
    data.user_car_id = this.data.playOrderSelectCar.id
    data.shop_id = this.data.shop.shop_id 
    data.shop_address = this.data.shop.address
    data.serve_image = this.data.img
    data.shop_title = this.data.shop.title
    data.totalMoney = this.data.money
    data.orderRemarks = this.data.orderRemarks
    data.realTotalMoney = this.data.realTotalMoney
    data.payType = this.data.type
    data.serve_id = this.data.service_id
    data.serve_title = this.data.title
    data.car_full_name = this.data.playOrderSelectCar.full_name
    data.car_purchase_time = this.data.playOrderSelectCar.purchase_time
    data.car_number = this.data.playOrderSelectCar.car_number
    data.car_mileage = this.data.playOrderSelectCar.mileage
    data.user_coupon_id = this.data.playOrderSelectCoupon.uc_id ? this.data.playOrderSelectCoupon.uc_id : ""
    console.log(data)
    wx.showLoading({
      title: '',
      mask: true
    })
    app.auth_request({
      url: "order",
      method: "POST",
      data: data
    }).then((res) => {
      console.log(res)
      wx.hideLoading()
      if (res.status == 200) {
        this.data.order_id = res.data.id

        if (data.payType == 1) {

          if (res.data.realTotalMoney > 0) {
            this.pay(res.data.tradeNo)
          } else {
            wx.navigateTo({
              url: '/pages/payment/waiting_service/waiting_service?order_id=' + res.data.id,
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/payment/successful_appointment/successful_appointment?order_id=' + res.data.id,
          })
        }
      } else {
        wx.showToast({
          title: res.message,
        })
      }
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
            wx.navigateTo({
              url: '/pages/payment/yuyue_failure_pay/yuyue_failure_pay?order_id=' + that.data.order_id + "&tradeNo=" + tradeNo + "&order_score=" + that.data.order_score + "&realPayMoney=" + that.data.realPayMoney
            })
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
          success: function(res) {
            console.log(res)
            that.monitorOrder(tradeNo)

          },
          fail: function(res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/payment/yuyue_failure_pay/yuyue_failure_pay?order_id=' + that.data.order_id + "&tradeNo=" + tradeNo + "&order_score=" + that.data.order_score + "&realPayMoney=" + that.data.realPayMoney
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
  //默认车辆
  getVehicle() {
    this.setData({
      loadModal: true
    })
    app.auth_request({
      url: 'usercar/get_default'
    }).then((res) => {
      console.log(res)
      this.setData({
        playOrderSelectCar: res,
        loadModal: false
      })
    })
  },
  //获取门店信息
  getShop() {
    this.setData({
      loadModal: true
    })
    app.auth_request({
      url: "shop",
    }).then((res) => {
      console.log(res)
      this.setData({
        shop: res[0],
        shop_address: res[0].address,
        loadModal: false
      })
      this.getVehicle()
    })
  },
  change_car() {
    wx.navigateTo({
      url: '/pages/myCar_info/myCar_check/myCar_check',
    })
  },
  store() {
    wx.navigateTo({
      url: '../../../shop/details/details?shop_id=' + this.data.shop.shop_id,
    })
  },
  //跳转优惠券
  getCoupon() {
    wx.navigateTo({
      url: '/pages/coupon/choice/choice?service_id=' + this.data.service_id + '&service_price=' + this.data.money,
    })
  },
  all_orders() {
    wx.navigateTo({
      url: '../../../tobepaid/tobepaid',
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
  onShow() {
    let realTotalMoney = this.data.money;
    let coupon_money = ''
    if (this.data.playOrderSelectCoupon) {
      if (this.data.playOrderSelectCoupon.type == 2) {
        realTotalMoney = realTotalMoney - this.data.playOrderSelectCoupon.reduce_money
        coupon_money = this.data.playOrderSelectCoupon.reduce_money
      }
      if (this.data.playOrderSelectCoupon.type == 1) {
        realTotalMoney = app.count_money(realTotalMoney * this.data.playOrderSelectCoupon.discount)
        coupon_money = (this.data.money - realTotalMoney)
      }
      if (this.data.playOrderSelectCoupon.type == 3) {
        realTotalMoney = 0
        coupon_money = this.data.money
      }
    }
    this.setData({
      realTotalMoney,
      coupon_money
    })
    if (!this.data.pay_score_scale) {
      this.setData({
        loadModal: true
      })
      app.auth_request({
        url: 'preferences',
        params: {
          param: 'pay_score_scale'
        }
      }).then((res) => {
        this.setData({
          pay_score_scale: res.pay_score_scale,
          loadModal: false
        })

        let order_score = 0;
        let realPayMoney = 0;
        if (app.userInfo.orderScore >= this.data.realTotalMoney * this.data.pay_score_scale) {
          order_score = this.data.realTotalMoney*this.data.pay_score_scale
        } else {
          order_score = app.userInfo.orderScore
        }
        this.setData({
          order_score: Math.ceil(order_score),
          order_score_max: Math.ceil(order_score),
          order_score_real: order_score,
          realPayMoney: app.count_money(this.data.realTotalMoney - order_score)
        })
        console.log(this.data)
      })
    } else {
      let order_score = 0;
      let realPayMoney = 0;
      if (app.userInfo.orderScore >= this.data.realTotalMoney * this.data.pay_score_scale) {
        order_score = this.data.realTotalMoney * this.data.pay_score_scale
      } else {
        order_score = app.userInfo.orderScore
      }
      console.log((this.data.realTotalMoney - order_score))
      this.setData({
        order_score: Math.ceil(order_score),
        order_score_max: Math.ceil(order_score),
        order_score_real: order_score,
        realPayMoney: app.count_money(this.data.realTotalMoney - order_score)
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
    wx.setStorageSync('playOrderSelectCar', '')
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
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
  },
  /**
   * 监听搜索内容
   */
  inputChange: function(event) {
    let that = this;
    var inputSearch = event.detail.value;
    if (parseInt(inputSearch) > this.data.order_score_max) {
      wx.showToast({
        title: '最高可用' + this.data.order_score_max + '魔豆',
        icon: 'none'
      })
      return
    }
    if (parseInt(inputSearch) == this.data.order_score_max) {
      if (this.data.order_score_max > this.data.realTotalMoney * this.data.pay_score_scale) {
        console.log((this.data.realTotalMoney * (1 - this.data.pay_score_scale)))
        that.setData({
          order_score: inputSearch,
          realPayMoney: app.count_money(this.data.realTotalMoney * (1 - this.data.pay_score_scale))
        })
        console.log(this.data)
        return
      }
    }
    console.log(this.data.realTotalMoney - inputSearch)
    that.setData({
      order_score: inputSearch,
      realPayMoney: app.count_money(this.data.realTotalMoney - inputSearch)
    })
    this.data.order_score = this.data.order_score ? this.data.order_score : 0
  }
})