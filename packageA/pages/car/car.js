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
    id: 0
  },
  // 模态框
  showModal(e) {
    this.getsystem(e.currentTarget.dataset.index,e.currentTarget.dataset.index2)

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
    this.init()
  },
  init(){
    let arr = this.data.carcord
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = Object.assign({}, arr[i]); 
      ai.series = [];
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
    console.log(this.data.brand)
    var map1 = {},
      dest1 = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = Object.assign({}, arr[i]);
      if (!map1[ai.firstletter]) {
        dest1.push({
          firstletter: ai.firstletter,
          data: [ai]
        });
        map1[ai.firstletter] = ai;
      } else {
        for (var j = 0; j < dest1.length; j++) {
          var dj = dest1[j];
          if (dj.firstletter == ai.firstletter) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    this.data.brand_all = dest1
  },
  // 获取模态框数据车型
  getsystem(index,index2) {
    let info = this.data.brand_all[index].data[index2].series
    this.cur_brand_name = this.data.brand_all[index].data[index2].brand_name
    this.cur_brand_img = this.data.brand_all[index].data[index2].img
    info['info'] = [];
    this.setData({
      DrawerModalR: true,
      series: info
    })
  },

  configuration() {
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
  toConfiguration(e){
    let info = JSON.stringify(e.currentTarget.dataset.item.info)
    this.cur_series_name = e.currentTarget.dataset.item.series_name
    wx.setStorageSync('cur_brand_name', this.cur_brand_name)
    wx.setStorageSync('cur_brand_img', this.cur_brand_img)
    wx.setStorageSync('cur_series_name', this.cur_series_name)
    wx.redirectTo({
      url: '/pages/information/all_car/configuration/configuration?info='+info,
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