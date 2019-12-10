const app = getApp();
// pages/home/search_car/search_car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    service:[],
    name: "",
    keyword:''
  },
  //展示列表
  getList() {
    app.auth_request({
      url: 'searchlog'
    }).then((res) => {
      console.log(res);
     this.setData({
       list:res
     })
    })
  },
  //清楚历史
  clearHistory(){
    app.auth_request({
      url: 'searchlog/clear_log',
      method:"DELETE",
      data:{
        user_id: app.userInfo ? app.userInfo.id : ''
      }
    }).then((res) => {
      console.log(res);
      this.getList()
    })
  },
  //用户信息
  getUserinfo() {
    app.auth_request({
      url: 'user/info'
    }).then((res) => {
      console.log(res);
      app.userInfo = res
      this.setData({
        userInfo: res
      })
      app.userInfo = res
    })
  },
  searchlog(e){
    this.data.keyword = e.currentTarget.dataset.keyword
    this.search()
  },
  search(){
    wx.showLoading()
    app.auth_request({
      url: 'service/search',
      params: {
        keyword: this.data.keyword,
        user_id: app.userInfo ? app.userInfo.id : ''
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        service:res
      })
      wx.hideLoading()
      this.getList()
    })
  },
  input(e){
    this.data.keyword = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.RefreshData()
    keyword: options.keyword
  },
  RefreshData: function () {
    this.getUserinfo()
    this.getList()
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