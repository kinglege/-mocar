const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true
  },
  onLoad() {
    this.RefreshData()
  },
  RefreshData: function () {
    this.getData()
  },
  input_search(e){
    // console.log(e)
    var keyword = e.target.dataset.service.service
    wx.navigateTo({
      url: '/pages/home/search_car/search_car?keyword=' + e.target.dataset.service[0].service[0].title,
    })
  },
  getData(){
    // console.log()
    app.auth_request({
      url: "service",
    }).then((res) => {
      // console.log(res);
      this.setData({
        service: res,
      })
    })
  },
  onReady() {
  },
  onPullDownRefresh() {
    this.RefreshData()
    clearTimeout(this.PullDownTime)
    this.PullDownTime = setTimeout((function () {
      wx.stopPullDownRefresh()
    }), 2000)
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  }
})


