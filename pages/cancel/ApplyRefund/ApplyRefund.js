// pages/cancel/ApplyRefund/ApplyRefund.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    selectReason:'',
    refundReson:'',
    orderDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderDetail:options
    })
    this.RefreshData()
  },
  RefreshData: function () {
    this.getReason()
  },
  noApplication(){
    wx.navigateBack({
      delta:1
    })
  },
  getReason(){
    app.auth_request({
      url: "reason",
      params:{
        type:2
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        reason: res
      })
    })
  },
  selectReason(e){
    console.log(e)
    this.data.selectReason = e.detail.value
  },
  //申请退款
  applyRefund(){
    if(!this.data.selectReason){
      wx.showToast({
        title: '请选择一个原因',
        icon:'none'
      })
      return
    }
    app.auth_request({
      url: "order/apply_refund",
      method:'POST',
      params:{
        order_id: this.data.orderDetail.order_id
      },
      data: {
        refundReson: this.data.selectReason,
        refundOtherReson: this.data.refundReson,
        refundRemark:''
      }
    }).then((res) => {
      console.log(res)
      if(res.status==200){
        wx.showToast({
          title: '提交成功',
        })
        wx.redirectTo({
          url: '/pages/tobepaid/tobepaid?num=3',
        })
      }else{
        wx.showToast({
          title: res.message,
          icon:'none'
        })
      }
    })
  },
  textareaBInput(e){
    this.data.refundReson = e.detail.value
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