import SockJS from 'sockjs-client/dist/sockjs.min'
import stomp from 'stomp-websocket/lib/stomp.min'
import Eventemitter from 'wolfy87-eventemitter'
/**
 * @description 
 * @param option scoketUrl 链接scoket 通信地址
 * @param option b 商户号唯一标识
 * @param option username 用户名
 * @param option password 密码
 * @param messageEntity 消息结构体
 */
export default class HsPhone {
  constructor() {
    this.sessionId = ''
    this.username = ''
    this.password = ''
    this.messageEntity = {
      taskId: null,
      sessionId: null,
      taskType: null,
      payload: null,
      code: null,
      tips: null,
      state: null,
      username: null,
      password: null
    }
    this.version = '1.0.0'
  }
  /**
   * @description 开始
   * @param option username 用户名
   * @param option password 密码
   */
  start(option) {
    const {
      username,
      password,
      callbackurl,
      scoketUrl
    } = option
    if (!username) throw new Error(`Uncaught ReferenceError: username is not defined`)
    if (!password) throw new Error(`Uncaught ReferenceError: password is not defined`)
    if (!scoketUrl) throw new Error(`Uncaught ReferenceError: scoketUrl is not defined`)
    this.username = username
    this.password = password
    this.scoketUrl = scoketUrl
    // new 监听事件
    this.evListener = new Eventemitter()
    // 创建 sessionid
    this.sessionId = this.genUUID()
    
    // 创建 Socket
    this.socket = new SockJS(this.scoketUrl)
    // stomp客户端
    this.stompClient = stomp.Stomp.over(this.socket)
    // stomp 链接
    this.stompConnection(callbackurl)
  }
  /**
   * @description 登记
   */
  register(callbackurl) {
    const msg = {
      ...this.messageEntity
    }
    msg.taskId = this.genUUID()
    msg.taskType = 'register'
    msg.sessionId = this.sessionId
    msg.username = this.username
    msg.password = this.password
    msg.callbackUrl = callbackurl || null
    console.log('===================================')
    console.log(`
      taskType: ${msg.taskType}\n
      state: ${msg.state}\n
      code: ${msg.code}\n 
      username: ${msg.username}\n 
      password: ${msg.password}\n 
      tips: ${msg.tips}`)
    console.log('===================================')
    this.stompClient.send('/api/register', {}, JSON.stringify(msg))
  }
  /**
   * @description stompClient connect
   */
  stompConnection(callbackurl) {
    const _this = this
    // 重新赋值 sessionid
    const sessionId = this.sessionId
    // 通信
    this.stompClient.connect({}, function () {
      // 订阅
      this.subscribe(`/user/${sessionId}/message`, function (data) {
        var msg = JSON.parse(data.body)
        console.log('===================================')
        console.log(`
        taskType: ${msg.taskType}\n
        state: ${msg.state}\n
        code: ${msg.code}\n 
        username: ${msg.username}\n 
        tips: ${msg.tips}`)
        console.log('===================================')
        if (msg.state == 1) {
          // 监听 taskType
          _this.evListener.trigger(msg.taskType, [msg])
        }
      })
      _this.register(callbackurl)
    })
  }
  /**
   * @description 邀请
   * @param option payload 需要传递的业务字符串
   * @param option callerDestinationNumber 加密手机号码
   * @param option 
   */
  invite(option) {
    const msg = {
      ...this.messageEntity
    }
    const {
      payload,
      callbackUrl,
      callerDestinationNumber,
      encryption,
      callType,
      taskId
    } = option
    msg.taskId = taskId || this.genUUID()
    msg.taskType = 'invite'
    msg.sessionId = this.sessionId
    msg.username = this.username
    msg.password = this.password
    msg.callbackUrl = callbackUrl || null
    msg.call_direction = 'outbonud'
    msg.callerDestinationNumber = callerDestinationNumber
    msg.payload = JSON.stringify(payload)
    msg.encryption = encryption
    msg.callType = callType
    console.log('===================================')
    console.log(`
      taskType: ${msg.taskType}\n
      username: ${msg.username}\n 
      password: ${msg.password}\n 
      sessionId: ${msg.sessionId}\n
      callbackUrl: ${msg.callbackUrl}\n
      callerDestinationNumber: ${msg.callerDestinationNumber}\n
      encryption: ${msg.encryption}\n
      callType: ${msg.callType}\n
      payload: ${msg.payload}\n`)
    console.log('===================================')
    this.stompClient.send('/api/command', {}, JSON.stringify(msg))
  }
  /**
   * @description 挂断
   */
  hungup(callerDestinationNumber) {
    const msg = {
      ...this.messageEntity
    }
    msg.taskId = this.genUUID()
    msg.taskType = 'hungup'
    msg.sessionId = this.sessionId
    msg.username = this.username
    msg.callerDestinationNumber = callerDestinationNumber
    console.log('===================================')
    console.log(`
      taskId: ${msg.taskId}\n
      taskType: ${msg.taskType}\n
      username: ${msg.username}\n 
      sessionId: ${msg.sessionId}\n
      callerDestinationNumber: ${msg.callerDestinationNumber}\n`)
    console.log('===================================')
    this.stompClient.send('/api/command', {}, JSON.stringify(msg))
  }
  /**
   * @description 回拨
   */
  refer(referCallerIdNumber) {
    const msg = {
      ...this.messageEntity
    }
    msg.taskId = this.genUUID()
    msg.taskType = 'refer'
    msg.sessionId = this.sessionId
    msg.username = this.username
    msg.callerDestinationNumber = referCallerIdNumber
    console.log('===================================')
    console.log(`
      taskId: ${msg.taskId}\n
      taskType: ${msg.taskType}\n
      username: ${msg.username}\n 
      sessionId: ${msg.sessionId}\n
      callerDestinationNumber: ${msg.callerDestinationNumber}\n`)
    console.log('===================================')
    this.stompClient.send('/api/command', {}, JSON.stringify(msg))
  }
  /**
   * @description 心跳
   */
  heartbeat() {
    const msg = {
      ...this.messageEntity
    }
    msg.taskId = this.genUUID()
    msg.taskType = 'heartbeat'
    msg.sessionId = this.sessionId
    msg.username = this.username
    console.log('===================================')
    console.log(`
      taskId: ${msg.taskId}\n
      taskType: ${msg.taskType}\n
      username: ${msg.username}\n 
      sessionId: ${msg.sessionId}\n`)
    console.log('===================================')
    this.stompClient.send('/api/heartbeat', {}, JSON.stringify(msg))
  }
  /**
   * @description 监听
   */
  addListener(param) {
    this.evListener.on('heartbeat', (args) => {
      this.heartbeat()
    })
    /**
     * @description 主叫
     */
    this.evListener.on('create', (args) => {
      param.create && param.create()
    })
    /**
     * @description 开始接通
     */
    this.evListener.on('answer', (args) => {
      param.answer && param.answer()
    })
    /**
     * @description 挂断完成
     */
    this.evListener.on('hangup', (args) => {
      param.hangup && param.hangup()
    })
    /**
     * @deprecated 失败
     */
    this.evListener.on('error', (args) => {
      const {
        tips,
        code
      } = args
      param.error && param.error({
        code: code,
        tips: tips
      })
    })
  }
  /**
   * @description 拨打
   * @param payload 需要传递的业务字符串 { extStr:  } 需要JSON字符串
   * @param payload  extStr b 商户号唯一标识
   * @param payload  extStr callerDestinationType 1本人 2亲友
   * @param payload  extStr specGateway 0 不清楚 
   * @param callbackUrl
   * @param callerDestinationNumber
   * @param encryption
   * @param callType
   * @param uuid 可传 可不传
   */
  dial(param) {
    const {
      option
    } = param
    if (!option) throw new Error('option is not defined')
    this.invite(option)
  }
  /**
   * @description 挂断
   */
  // hangup(param) {
  //   if (param.mobile) {
  //     this.hungup(param.callerDestinationNumber)
  //     param.success && param.success()
  //   } else {
  //     param.error && param.error({ state: 3302, tips: '手机号未传' })
  //   }
  // }
  /**
   * @description uuid
   */
  newUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
  /**
   * @description 加时间
   */
  genUUID() {
    var month = this.format('yyyyMM', new Date())
    var uuid = this.newUUID()
    return month + '-' + uuid
  }
  /**
   * @description 日期格式化
   */
  format(format, d) {
    var date = {
      'M+': d.getMonth() + 1,
      'd+': d.getDate(),
      'h+': d.getHours(),
      'm+': d.getMinutes(),
      's+': d.getSeconds(),
      'q+': Math.floor((d.getMonth() + 3) / 3),
      'S+': d.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
          date[k] : ('00' + date[k]).substr(('' + date[k]).length));
      }
    }
    return format
  }
}