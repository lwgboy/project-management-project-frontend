export function getBrowserInfo () {
  var Browser = Browser || (function (window) {
    const document = window.document
    const navigator = window.navigator
    const agent = navigator.userAgent.toLowerCase()
    // IE8+支持.返回浏览器渲染当前文档所用的模式
    // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
    // IE10:10(兼容模式7||8||9)
    const IEMode = document.documentMode
    // chorme
    const chrome = window.chrome || false
    const System = {
      // user-agent
      agent: agent,
      // 是否为IE
      isIE: /trident/.test(agent),
      // Gecko内核
      isGecko: agent.indexOf('gecko') > 0 && agent.indexOf('like gecko') < 0,
      // webkit内核
      isWebkit: agent.indexOf('webkit') > 0,
      // 是否为标准模式
      isStrict: document.compatMode === 'CSS1Compat',
      // 是否支持subtitle
      supportSubTitle: function () {
        return 'track' in document.createElement('track')
      },
      // 是否支持scoped
      supportScope: function () {
        return 'scoped' in document.createElement('style')
      },

      // 获取IE的版本号
      ieVersion: function () {
        var rMsie = /(msie\s|trident.*rv:)([\w.]+)/
        var ma = window.navigator.userAgent.toLowerCase()
        var match = rMsie.exec(ma)
        try {
          return match[2]
        } catch (e) {
          // console.log('error')
          return IEMode
        }
      },
      // Opera版本号
      operaVersion: function () {
        try {
          if (window.opera) {
            return agent.match(/opera.([\d.]+)/)[1]
          } else if (agent.indexOf('opr') > 0) {
            return agent.match(/opr\/([\d.]+)/)[1]
          }
        } catch (e) {
          // console.log('error')
          return 0
        }
      }
    }

    try {
      // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
      System.type = System.isIE ? 'IE'
        : window.opera || (agent.indexOf('opr') > 0) ? 'Opera'
          : (agent.indexOf('chrome') > 0) ? 'Chrome'
            : window.openDatabase ? 'Safari'
              : (agent.indexOf('firefox') > 0) ? 'Firefox'
                : 'Unknown'

      // 版本号
      System.version = (System.type === 'IE') ? System.ieVersion()
        : (System.type === 'Firefox') ? agent.match(/firefox\/([\d.]+)/)[1]
          : (System.type === 'Chrome') ? agent.match(/chrome\/([\d.]+)/)[1]
            : (System.type === 'Opera') ? System.operaVersion()
              : (System.type === 'Safari') ? agent.match(/version\/([\d.]+)/)[1]
                : '0'

      // 浏览器外壳
      System.shell = function () {
        if (agent.indexOf('edge') > 0) {
          System.version = agent.match(/edge\/([\d.]+)/)[1] || System.version
          return 'edge'
        }
        // 遨游浏览器
        if (agent.indexOf('maxthon') > 0) {
          System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version
          return 'maxthon'
        }
        // QQ浏览器
        if (agent.indexOf('qqbrowser') > 0) {
          System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version
          return 'QQ'
        }
        // 搜狗浏览器
        if (agent.indexOf('se 2.x') > 0) {
          return 'sougou'
        }

        // Chrome:也可以使用window.chrome && window.chrome.webstore判断
        if (chrome && System.type !== 'Opera') {
          const external = window.external
          // const clientInfo = window.clientInformation
          // 客户端语言:zh-cn,zh.360下面会返回undefined
          // const clientLanguage = clientInfo.languages
          // 猎豹浏览器:或者agent.indexOf('lbbrowser')>0
          if (external && 'LiebaoGetVersion' in external) {
            return 'liebao'
          }
          // 百度浏览器
          if (agent.indexOf('bidubrowser') > 0) {
            System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
              agent.match(/chrome\/([\d.]+)/)[1]
            return 'baidu'
          }
          // 360极速浏览器和360安全浏览器
          // if (System.supportSubTitle() && typeof clientLanguage === 'undefined') {
          //   // object.key()返回一个数组.包含可枚举属性和方法名称
          //   const storeKeyLen = Object.keys(chrome.webstore).length
          //   return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器'
          // }
          // 360的userAgent取到的是chrome和IE取不到相關的信息
          return 'Chrome'
        }
        return System.type
      }
      // 浏览器名称(如果是壳浏览器,则返回壳名称)
      System.name = System.shell()
    } catch (e) {
      // console.log(e.message)
    }
    return {
      client: System
    }
  })(window)

  if (Browser.client.name === undefined || Browser.client.name === '') {
    Browser.client.name = 'Unknown'
    Browser.client.version = 'Unknown'
  } else if (Browser.client.version === undefined) {
    Browser.client.version = 'Unknown'
  }
  // return Browser
  return { // 浏览器外壳和版本
    type: Browser.client.name,
    version: Browser.client.version
  }
}

export function getBrowserOS () {
  var userAgent = navigator.userAgent
  var os = navigator.platform
  let name = ''
  // 判断操作系统
  if (os.indexOf('Win') > -1) {
    if (userAgent.indexOf('Windows NT 5.0') > -1) {
      name = 'Win2000'
    } else if (userAgent.indexOf('Windows NT 5.1') > -1) {
      name = 'WinXP'
    } else if (userAgent.indexOf('Windows NT 5.2') > -1) {
      name = 'Win2003'
    } else if (userAgent.indexOf('Windows NT 6.0') > -1) {
      name = 'WindowsVista'
    } else if (userAgent.indexOf('Windows NT 6.1') > -1 || userAgent.indexOf('Windows 7') > -1) {
      name = 'Win7'
    } else if (userAgent.indexOf('Windows NT 6.2') > -1 || userAgent.indexOf('Windows 8') > -1) {
      name = 'Win8'
    } else if (userAgent.indexOf('Windows NT 6.3') > -1 || userAgent.indexOf('Windows 8.1') > -1) {
      name = 'Win8.1'
    } else if (userAgent.indexOf('Windows NT 10.0') > -1 || userAgent.indexOf('Windows 10') > -1) {
      name = 'Win10'
    } else {
      name = 'Other'
    }
  } else if (os.indexOf('Mac') > -1) {
    name = 'Mac'
  } else if (os.indexOf('X11') > -1) {
    name = 'Unix'
  } else if (os.indexOf('Linux') > -1) {
    name = 'Linux'
  } else {
    name = 'Other'
  }
  return name
}

