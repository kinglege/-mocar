const app = getApp()

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
  onLoad(options) {
    this.series_id = options.series_id
    this.RefreshData()
  },
  RefreshData: function () {
    this.getCar_type()
  },
  getCar_type(series_id){
    wx.showLoading({
      title: '正在加载',
      icon: 'none'
    })
    app.auth_request({
      url:"carrecord/info",
      params: {
        series_id: this.series_id
      }
    }).then((res)=>{
      wx.hideLoading()
      console.log(res)
      this.setData({
        carrecord:res.info
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toInformation(e){
    console.log(e)
    let info = JSON.stringify(e.currentTarget.dataset.info)
    wx.navigateBack({
      url: '/pages/information/information?info='+info,
    })
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