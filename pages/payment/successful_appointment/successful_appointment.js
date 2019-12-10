const app = getApp()
// pages/payment/waiting_payment/waiting_payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    payType:0
  },
  showModal(e) {
    // console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //跳转门店
  toStoreDetail(e) {
    console.log(e)
    var that = this
    if (this.data.orderDetail.shop == null) {
      wx.showToast({
        title: '门店不存在或已搬迁',
      })
    } else {
      wx.navigateTo({
        url: '/pages/shop/details/details?shop_id=' + that.data.orderDetail.shop.shop_id,
      })
    }
  },
  //服务类目跳转详情
  toServe() {
    if (this.data.orderDetail.service == null) {
      wx.showToast({
        title: '商品不存在或已被删除',
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/ticket/ticket?id=' + this.data.orderDetail.serve_id,
      })
    }

  },
  //联系我们电话
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
    this.data.order_id = options.order_id
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
  //页面渲染
  getOrderDetail() {
    app.auth_request({
      url: "order/" + this.data.order_id
    }).then((res) => {
      console.log(res)
      this.setData({
        orderDetail: res,
        id:res.id,
        shop_id: res.shop.shop_id
      })
    })
  },
  //跳转门店
  toStoreDetail(e) {
    console.log(e)
    var that = this
    wx.navigateTo({
      url: '/pages/shop/details/details?shop_id=' + that.data.shop_id,
    })
  },
  // cancel_reservation(){
   
  //   wx.navigateTo({
  //     url: '/pages/cancel/cancellationOrder/cancellationOrder?id=' + this.data.id,
  //   })
  // },
  //取消预约
  cancel_reservation(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定取消该订单?',
      confirmColor:"red",
      success(e){
        if(e.confirm){
          app.auth_request({
            url: "order/cancel",
            method: "POST",
            params: {
              id: that.data.order_id
            }
          }).then((res) => {
            console.log(res)
            if (res.status == 200) {
              wx.showLoading({
                title: '',

              })
              wx.showToast({
                title: '取消成功',
                icon: "none"
              })
              wx.navigateBack({
                
              })
            } else {
              wx.showToast({
                title: '取消失败',
                icon: 'none',

              })
            }
          })
        }
      }
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