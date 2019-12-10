const app = getApp()

// pages/mycar/mycar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    car: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  default_car(e) {
    console.log(e)
    app.auth_request({
      url: "usercar/default",
      method: "POST",
      params: {
        car_id: e.currentTarget.dataset.id
      }
    }).then(() => {
      this.getCar()
    })

  },
  //删除车辆
  getDelete(e) {
    let that = this
    var carId = e.currentTarget.dataset.id
    //提示弹框 动作等待
    wx.showModal({
      title: '确定删除？',
      success(e) {
        if (e.confirm) {
          wx.showLoading({
            title: '',
            mask: true
          })
          app.auth_request({
            url: "usercar/" + carId,
            method: "DELETE"
          }).then(() => {
            wx.hideLoading()
            that.getCar()
          })
        }
      }
    })

  },
  getCar() {
    app.auth_request({
      url: 'usercar'
    }).then((res) => {
      console.log(res)
      this.setData({
        car: res
      })
    })
  },
  toOrderCar(e) {
    back: {
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2]
      prevPage.setData({
        playOrderSelectCar: e.currentTarget.dataset.item
      })
      wx.navigateBack()
    }

  },
  addCar: function () {
    wx.navigateTo({
      url: '/pages/information/information',
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
    this.getCar()
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