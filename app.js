import wxValidate from 'utils/wxValidate'

App({
  onLaunch: function() {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    let that = this
    wx.login({
      success(res) {
        that.request({
          url: `wx/get_openid`,
          method: 'POST',
          data: {
            code: res.code 
          }
        }).then((res) => {
          console.log(res)
          if (res.openid) {
            wx.setStorageSync('open_id', res.openid)
            that.session_key = res.session_key
            that.request({
              url: "user/login_log",
              method: "POST",
              data: {
                open_id: res.openid
              }

            }).then((res) => {
              console.log(res)
            })


          }
        })
      }
    })
  },
  location: {
    city_code: 340100,
    city_name: '合肥市',
    region: ['安徽省', '合肥市', '瑶海区'],
    code: [340000, 340100, 340102]
  },
  globalData: {
    // api_url: 'http://apimocar.jicang001.com',
    api_url: 'https://api.mocar.gzcxjt.com',
    // api_url: 'http://192.168.5.11:8080',
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ]
  },
  wxValidate: function(rules, messages) {
    return new wxValidate(rules, messages)
  },
  // 富文本转化
  convertHtmlToText: function convertHtmlToText(inputText) {
    var returnText = "" + inputText;
    returnText = returnText.replace(/<\/div>/ig, '\r\n');
    returnText = returnText.replace(/<\/li>/ig, '\r\n');
    returnText = returnText.replace(/<li>/ig, '  *  ');
    returnText = returnText.replace(/<\/ul>/ig, '\r\n');
    //-- remove BR tags and replace them with line break
    returnText = returnText.replace(/<br\s*[\/]?>/gi, "\r\n");

    //-- remove P and A tags but preserve what's inside of them
    returnText = returnText.replace(/<p.*?>/gi, "\r\n");
    returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

    //-- get rid of more than 2 spaces:
    returnText = returnText.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    returnText = returnText.replace(/&nbsp;/gi, " ");
    returnText = returnText.replace(/ /gi, " ");
    returnText = returnText.replace(/&/gi, "&");
    returnText = returnText.replace(/"/gi, '"');
    returnText = returnText.replace(/</gi, '<');
    returnText = returnText.replace(/>/gi, '>');
    return returnText;
  },
  request({
    baseURL = this.globalData.api_url,
    url,
    method = 'GET',
    params = {},
    data = {},
    contentType = 'application/x-www-form-urlencoded'
  }) {
    let that = this
    let paramStr = '';
    for (let i in params) {
      paramStr += `${i}=${params[i]}&`
    }
    if (timeout_interval) {
      clearInterval(timeout_interval)
    }
    let timeout = 6;
    let time = 0;
    let timeout_interval = setInterval(function() {
      time++
      // console.log(time)
      if (time > timeout) {
        wx.showToast({
          title: '你的网络不太好',
          icon: 'none'
        })
        clearInterval(timeout_interval)
      }
    }, 1000)
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url: `${baseURL}/${url}?${paramStr}`,
        header: {
          'Content-Type': contentType
        },
        'source': 4,
        data: data,
        success(res) {
          clearInterval(timeout_interval)
          if (200 <= res.statusCode && res.statusCode <= 299) {
            resolve(res.data)

          } else {
            wx.showToast({
              title: '服务器错误',
              icon: 'none'
            })
          }
        }
      })
    })
  },
  auth_request({
    baseURL = this.globalData.api_url,
    url,
    method = 'GET',
    params = {},
    data = {},
    contentType = 'application/x-www-form-urlencoded',
    redirect_url = null,
    secret = null
  }) {
    let that = this
    let paramStr = '';
    for (let i in params) {
      paramStr += `${i}=${params[i]}&`
    }
    if (timeout_interval) {
      clearInterval(timeout_interval)
    }
    let timeout = 10;
    let time = 0;
    let timeout_interval = setInterval(function() {
      time++
      // console.log(time)
      if (time > timeout) {
        wx.showToast({
          title: '你的网络不太好',
          icon: 'none'
        })
        clearInterval(timeout_interval)
      }
    }, 1000)
    if (wx.getStorageSync('open_id')) {
      return new Promise((resolve, reject) => {
        wx.request({
          method: method,
          url: `${baseURL}/${url}?${paramStr}`,
          header: {
            'Content-Type': contentType,
            'Authorization': `Bearer ${wx.getStorageSync('open_id')}`,
            // 'Authorization': `Bearer o81r15eHLEDlZ5e7TxSjN9S28VbU`
          },
          data: data,
          success({
            statusCode,
            data
          }) {
            clearInterval(timeout_interval)
            if (200 <= statusCode && statusCode <= 299) {
              resolve(data)
              if (data.status == 402) {
                that.bind(redirect_url)
              } else if (data.status == 403) {
                wx.navigateTo({
                  url: '/pages/403/index'
                })
              }
            } else {
              wx.showToast({
                title: '服务器错误',
                icon: 'none'
              })
            }
          }
        })
      })
    } else {
      wx.login({
        success: ({
          code
        }) => {
          that.request({
            url: `wx/get_openid`,
            method: 'POST',
            data: {
              code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
          }).then((data) => {
            if (data.openid) {
              wx.setStorageSync('open_id', data.openid)
              that.auth_request({
                method,
                url,
                params,
                data
              })

            }

          })
        }
      })
    }

  },
  bind(redirect_url) {
    wx.navigateTo({
      url: '/pages/auth/auth',

    })
  },
  count_money(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
      alert('传递参数错误，请检查！');
      return false;
    }
    result = Math.ceil(num * 100) / 100;
    var s_x = result.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
      pos_decimal = s_x.length;
      s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
      s_x += '0';
    }
    return s_x;
  }
})