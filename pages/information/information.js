const app = getApp()
// pages/information/information.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    info: '',
    number: '', //车牌号
    date: '', //日期
    mileage: '',
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
    }, ],
    basics: 0,
    numList: [{
      name: '车辆信息'
    }, {
      name: '行驶数据'
    }, {
      name: '上传数据'
    }, {
      name: '绑定成功'
    }, ],
    num: 0,
    scroll: 0
  },
  information() {
    wx.navigateTo({
      url: '../../packageA/pages/car/car',
    })
  },
  basicsSteps() {
    this.setData({
      basics: this.data.basics == this.data.basicsList.length - 1 ? 0 : this.data.basics + 1
    })
  },
  numSteps() {
    this.setData({
      num: this.data.num == this.data.numList.length - 1 ? 0 : this.data.num + 1
    })
  },
  // 表单事件存入value值
  formSubmit(e) {
    console.log(e)
    let value = e.detail.value
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      console.log(error)
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        icon: 'none'
      })
      return false
    }
    if (!this.data.info) {
      wx.showToast({
        title: '请选择车型',
        icon: 'none'
      })
      return false;
    }
    app.auth_request({
      url: 'usercar',
      method: 'POST',
      data: {
        full_name: this.data.info,
        car_number: value.number,
        mileage: value.mileage,
        purchase_time: value.date,
        brand_name: wx.getStorageSync('cur_brand_name'),
        series_name: wx.getStorageSync('cur_series_name'),
        name: wx.getStorageSync('cur_info_name'),
        brand_img: wx.getStorageSync('cur_brand_img')
      }
    }).then((res) => {
      if (res.status == 200) {
        wx.navigateBack({

        })
        wx.setStorageSync('cur_brand_name', '')
        wx.setStorageSync('cur_brand_img', '')
        wx.setStorageSync('cur_series_name', '')
        wx.setStorageSync('cur_info_name', '')
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  // numSteps: function () {
  //   wx.navigateTo({
  //     url: '/pages/data/data',
  //   })
  // },
  scrollSteps() {
    this.setData({
      scroll: this.data.scroll == 9 ? 0 : this.data.scroll + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.info) {
      let info = JSON.parse(options.info)
      this.setData({
        info: info
      })
    }
    this.RefreshData()
  },
  RefreshData: function () {
    this.validate()
  },
  onShow() {
    if (wx.getStorageSync('cur_info_name')) {
      this.setData({
        info: wx.getStorageSync('cur_brand_name') +" "+ wx.getStorageSync('cur_series_name') +" "+ wx.getStorageSync('cur_info_name')
      })
    }
  },
  validate() {
    let key = {
      number: {
        required: true,
      },
      date: {
        required: true
      },
      mileage: {
        required: true,
        number: true
      }
    }
    let message = {
      number: {
        required: '请填写车牌号',
      },
      date: {
        required: '请选择购车日期',
      },
      info: {
        required: '请选择购车日期',
      },
      mileage: {
        required: '请填写行驶里程',
        number: '里程必须是数字'
      }
    }
    this.WxValidate = app.wxValidate(key, message)
  },
  //购车日期
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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