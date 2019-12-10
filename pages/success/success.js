const app = getApp()
// pages/information/information.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    basicsList: [{
      icon: 'usefullfill',
      name: '车辆信息'
    }, {
      icon: 'radioboxfill',
      name: '行驶数据'
    }, {
      icon: 'roundclosefill',
      name: '上传数据'
    }, {
      icon: 'roundcheckfill',
      name: '绑定成功'
    },],
    basics: 0,
    numList: [{
      name: '车辆信息'
    }, {
      name: '行驶数据'
    }, {
      name: '上传数据'
    }, {
      name: '绑定成功'
    },],
    num: 3,
    scroll: 0
  },
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  next() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  next: function () {
    // wx.navigateTo({
    //   url: '/pages/success/success',
    // })
  },
  scrollSteps() {
    this.setData({
      scroll: this.data.scroll == 9 ? 0 : this.data.scroll + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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