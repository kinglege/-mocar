Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/images/home.png",
        selectedIconPath: "/images/home-actived.png",
        text: "首页"
      },
      {
        pagePath: "/pages/home/home",
        iconPath: "/images/board.png",
        selectedIconPath: "/images/board-actived.png",
        text: "服务"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const url = e.currentTarget.dataset.path
      wx.switchTab({
        url
      })
    }
  },
  pageLifetimes: {
  },
})