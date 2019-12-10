 const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    data: {},
    desc: '',

  },
  place_order() {
    if(!app.userInfo){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }
    wx.navigateTo({
      url: './service_order/service_order?service_id=' + this.data.data.id + '&title=' + this.data.data.title + "&money=" + this.data.data.price + "&img=" + this.data.data.list_image + "&type=" + this.data.data.type + "&payType=" + this.data.data.type,
    })
  },
  details_next(e) {
    wx.navigateTo({
      url: '../../shop/details/details?shop_id=' + e.currentTarget.dataset.id,
    })
  },
  // 模态框
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.serviceId = options.id
    this.RefreshData()
  },
  RefreshData:function(){
    this.getShop()
    this.getUserinfo()
  },
  //获取用户信息
  getUserinfo() {
    wx.showLoading()
    app.request({
      url: 'user/info_byopenid',
      params: {
        open_id: wx.getStorageSync('open_id')
      }
    }).then((res) => {
      console.log(res)
      wx.hideLoading()
      if (res.status == 200) {
        app.userInfo = res.data
     
        this.setData({
          auth:true
        })
      }
      this.getsearch()

    })
  },
  getsearch() {
    app.auth_request({
      url: "service/" + this.serviceId,
      params:{
        user_id: app.userInfo ? app.userInfo.id:""
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        data: res
      });
      WxParse.wxParse('desc', 'html', res.desc, this, 5);
      // wx.stopPullDownRefresh()
    })
  },
  getShop() {
    app.auth_request({
      url: "shop",

    }).then((res) => {
      // console.log(res)
      this.setData({
        shop: res,
      })
    })
  },
  next_price(e) {
    console.log(e)
    app.auth_request({
      url: "usercoupon",
      method: "POST",
      data: {
        coupon_id: e.currentTarget.dataset.id
      }
    }).then((res) => {
      // console.log(res)w
      this.getsearch()
     
      if (res.status == 200) {
        // success((res)=>{
        wx.showToast({
          title: '领取成功',
          icon: 'none'
        })
        // })
      } else {
        wx.showToast({
          title: '每人限领一张',
          icon: 'none'
        })
      }

    })
  },
  to_login() {
    wx.navigateTo({
      url: '/pages/auth/auth',
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
  onShow: function(options) {
    
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
    // this.RefreshData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // console.log(res)
    if (res.from === "button") {

    }
    return {
      title: this.data.data.title,
      desc: '魔界专属推荐',
      imageUrl: this.data.data.banner[0].img,
      path: '/pages/index/index?p_user_id=' + (app.userInfo ? app.userInfo.id :'') // 路径，传递参数到指定页面。
    }
  }
})