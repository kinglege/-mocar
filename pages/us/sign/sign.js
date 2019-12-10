//index.js
const app = getApp()
//获取应用实例

var calendarSignData;
var date;
var calendarSignDay;
Page({
  data:{
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },
  //事件处理函数
  calendarSign: function () {
    calendarSignData[date] = date;
    console.log(calendarSignData);
    calendarSignDay = calendarSignDay + 1;
    wx.setStorageSync("calendarSignData", calendarSignData);
    wx.setStorageSync("calendarSignDay", calendarSignDay);

    wx.showToast({
      title: '签到成功',
      icon: 'success',
      duration: 2000
    })
    this.setData({

      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },
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
  onLoad: function () {
    this.RefreshData()
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    date = mydate.getDate();
    console.log("date" + date)
    var day = mydate.getDay();
    console.log(day)
    var nbsp = 7 - ((date - day) % 7);
    console.log("nbsp" + nbsp);
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    // 判断是否签到过
    if (wx.getStorageSync("calendarSignData") == null || wx.getStorageSync("calendarSignData") == '') {
      wx.setStorageSync("calendarSignData", new Array(monthDaySize));
    };
    if (wx.getStorageSync("calendarSignDay") == null || wx.getStorageSync("calendarSignDay") == '') {
      wx.setStorageSync("calendarSignDay", 0);
    }
    calendarSignData = wx.getStorageSync("calendarSignData")
    calendarSignDay = wx.getStorageSync("calendarSignDay")
    console.log(calendarSignData);
    console.log(calendarSignDay)
    this.setData({
      year: year,
      month: month,
      nbsp: nbsp,
      monthDaySize: monthDaySize,
      date: date,
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },
  RefreshData(){
    this.getUserinfo()
  },
  //模态框
   showModal(e) {
    console.log(e)
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
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === "button") {

    }
    return {
      title: this.data.data.title,
      desc: '邀请好友每日拿豆',
      imageUrl: "https://gzch.oss-cn-beijing.aliyuncs.com/office/image/%E9%82%80%E8%AF%B7%E5%A5%BD%E5%8F%8B.png",
      path: '/pages/index/index?p_user_id=' + (app.userInfo ? app.userInfo.id : '') // 路径，传递参数到指定页面。
    }
  }
})

