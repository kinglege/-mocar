const app = getApp()
// pages/information/all_car/all_car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    id:0
  },
// 模态框
  showModal(e) {
    console.log(e)
    this.currentBrandId = e.target.dataset.brand_id
    this.getsystem(this.currentBrandId)

  },
  hideModal(e) {
    this.setData({
      DrawerModalR: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    // this.setData({
    //   list: list,
    //   listCur: list[0]
    // })
    console.log(this.data)
    this.RefreshData()
  },
  RefreshData: function () {
    this.getvehicle()
  },
  // 获取车型数据
  getvehicle(){
    wx.showLoading({
      title: '正在加载',
      icon:'none'
    })
    app.auth_request({
      url:"carrecord/brand",
      // params:{
      //   id,
      // }
    }).then((res)=>{
      wx.hideLoading()
      let arr = res.info
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.firstletter]) {
          dest.push({
            firstletter: ai.firstletter,
            data: [ai]
          });
          map[ai.firstletter] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.firstletter == ai.firstletter) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      this.setData({
        brand: dest,
        listCur: dest[0].firstletter
      })
    })
  },
// 获取模态框数据车型
  getsystem(brand_id){
    wx.showLoading({
      title: '正在加载',
      icon: 'none'
    })
    app.auth_request({
      url:"carrecord/series",
      params:{
        brand_id: brand_id
      }
    }).then((res)=>{
      wx.hideLoading()
      this.setData({
        DrawerModalR: true,
        series:res.info
      })
      console.log(this.data)
    })
  },

  configuration(){
    wx.navigateTo({
      url: './configuration/configuration',
    
    })
  },

  // ============================
  onReady() {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.brand[e.target.id].firstletter,
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.brand[num].firstletter
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.brand;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i].firstletter,
          movableY: i * 20
        })
        return false
      }
    }
  }
});