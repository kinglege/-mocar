const app = getApp()
// pages/information/information.js
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    number: '', //车牌号
    brand: '', //汽车品牌
    money: '', //款型
    displacement: '', //排量
    particular: '', //生产年份
    driving:"",//上牌时间
    mileage:"",//行驶里程
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
    num: 1,
    scroll: 0
  },
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  nextSteps() {
      this.setData({
        num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
      })
  },
  // nextSteps: function () {
  //   wx.navigateTo({
  //     url: '/pages/upload/upload',
  //   })
  // },
  // 表单事件存入value值
  formSubmit(e) {
    console.log(e)
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    this.setData({
      driving: e.detail.value.driving,
      mileage: e.detail.value.mileage
    })
    // 表单点击事件携带参数跳转
    wx.navigateTo({
      url: '/pages/upload/upload?driving=' + e.detail.value.driving + "&mileage=" + e.detail.value.mileage + "&number=" + this.data.number + "&brand=" + this.data.brand + "&money=" + this.data.money + "&displacement=" + this.data.displacement + "&particular=" + this.data.particular,
    })
  },
  scrollSteps() {
    this.setData({
      scroll: this.data.scroll == 9 ? 0 : this.data.scroll + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 存入上页跳转携带的value数据
  onLoad(options) {
    console.log(options);
    this.setData({
      number:options.number,
      brand:options.brand,
      money:options.money,
      displacement:options.displacement,
      particular:options.particular
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