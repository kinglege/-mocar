const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    serve_c: [],
    showNewPpeoplePackageModal: false,
    modal_mask: false,
    data: ''

  },
  showModalClick() {
    this.setData({
      showNewPpeoplePackageModal: true,
      modal_mask: true
    })
  },
  //取消模态框
  modalDelete() {
    this.setData({
      showNewPpeoplePackageModal: false,
      modal_mask: false
    });
  },
  adLink(e) {
    // console.log(e)
   
  },
  roomDetails: function(e) {
    var that = this;
    this.setData({
      showPopover: (!that.data.showPopover)
    })
  },
  //  走吧热点
  getScollUp() {
    app.request({
      url: "mainpage/hot"
    }).then((res) => {
      // console.log(res)
      this.setData({
        scollList: res
      })
    })
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function(options) {
    // console.log(options)
    if (options.p_user_id) {
      wx.setStorageSync('p_user_id', options.p_user_id)
    }
    this.RefreshData()
  },
  RefreshData() {
    //获去轮播信息 
    this.getBanner()
    this.getScollUp()
    this.getCatalog()
  },
  getBanner() {
    app.request({
      url: "mainpage/ad",
      // params: {
      //   type: 3
      // },
    }).then((res) => {
      let imgpros = []
      let imgadvertisement = []
      res.forEach((item) => {

        if (item.type == 1) {
          this.setData({
            imgUrls: item
          })
        }
        if (item.type == 2) {
          this.setData({
            imggrid: item
          })
        }
        if (item.type == 3) {
          this.setData({
            horizontal: item
          })
        }
        if (item.type == 4) {
          imgpros.push(item)
        }
        if (item.type == 5) {
          imgadvertisement.push(item)
        }
      })
      this.setData({
        imgpros,
        imgadvertisement
      })
      // this.setData({
      //   imgUrls: res[0]['banner'],
      //   imggrid:res[1]['banner'],
      //   imgpros: res[3]['banner'],
      //   imgclean:res[4]['banner'],
      //   imgmaintain:res[5]['banner'],
      //   imgadvertisement:res[2]['banner']
      // })
      // console.log(this.data)
      wx.stopPullDownRefresh()
    })
  },
  //新人大礼包
  getCatalog() {

    app.request({
      url: "activity/detail",
      params: {
        type: 1,
        open_id: wx.getStorageSync('open_id')
      }
    }).then((res) => {
      // console.log(res)
      this.setData({
        giftPackage: res
      })
      if (!res.draw_log) {
        this.setData({
          showNewPpeoplePackageModal: true,
          modal_mask: true
        })
      }
    })
  },
  //判断图片跳转
  

  toBannerLink(e) {
    let data = e.currentTarget.dataset.data
    // console.log(data)
    if (data.is_link == 1) {
      if (data.link_url) {
        if (data.link_type == 1) {
          wx.navigateTo({
            url: data.link_url ? data.link_url : "",
          })
        }
        if (data.link_type == 2) {
          wx.switchTab({
            url: data.link_url ? data.link_url : "",
          })
        }
        if (data.link_type == 3) {
          wx.navigateTo({
            url: '/pages/webView/webView?url=' + data.link_url,
          })
        }
      }

    }

  },

  //拉取礼包信息
  collectImmediately() {
    app.auth_request({
      url: "activity/draw",
      method: "POST",
      params: {
        activity_id: this.data.giftPackage.activity_id
      },
    }).then((res) => {
      // console.log(res)
      if (res.status == 200) {
        wx.showToast({
          title: res.message,
        })
        this.modalDelete()
      } else {
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  //分享好友活动页
  activity() {
    wx.navigateTo({
      url: '/pages/index/activity/activity',
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  onPullDownRefresh() {
    this.RefreshData()
    clearTimeout(this.PullDownTime)
    this.PullDownTime = setTimeout((function () {
      wx.stopPullDownRefresh()
    }), 2000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // console.log(res)
    // if (res.from === "button") {

    // }
    // return {
    //   title: this.data.data.title,
    //   desc: '魔界专属推荐',
    //   imageUrl: this.data.data.banner[0].img,
    //   path: '/pages/index/index?p_user_id=' + (app.userInfo ? app.userInfo.id : '')
    // }
  }
})