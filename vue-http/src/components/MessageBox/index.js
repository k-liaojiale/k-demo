import Vue from 'vue'
import msgboxVue from './index.vue'

const CONFIRM_TEXT = '确定'
const CANCEL_TEXT = '取消'

var currentMsg, instance
var msgQueue = []

const defaultCallback = action => {
  if (currentMsg) {
    var callback = currentMsg.callback
    if (typeof callback === 'function') {
      callback(action)
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        currentMsg.resolve(action)
      } else if (action === 'cancel' && currentMsg.reject) {
        currentMsg.reject(action)
      }
    }
  }
}

const defaults = {
  title: '提示',
  message: '',
  confirmButtonText: CONFIRM_TEXT,
  cancelButtonText: CANCEL_TEXT
}

const MessageBoxConstructor = Vue.extend(msgboxVue)

var merge = function (target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i]
    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        var value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}

// 构造方法
var initInstance = function () {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })

  instance.callback = defaultCallback
}

var showNextMsg = function () {
  if (!instance) {
    initInstance()
  }

  if (!instance.value || instance.closeTimer) {
    if (msgQueue.length > 0) {
      // shift 用于把数组的第一个元素从其中删除，并返回第一个元素的值
      currentMsg = msgQueue.shift()

      var options = currentMsg.options
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }

        if (options.callback === undefined) {
          instance.callback = defaultCallback
        }

        document.body.appendChild(instance.$el)

        Vue.nextTick(() => {
          instance.value = true
        })
      }
    }
  }
}

var MessageBox = function (options, callback) {
  if (typeof options === 'string') {
    options = {
      title: options
    }
    if (arguments[1]) {
      options.message = arguments[1]
    }
  } else if (options.callback && !callback) {
    callback = options.callback
  }

  if (typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults || {}, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      })

      showNextMsg()
    })
  } else {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults || {}, options),
      callback: callback
    })

    showNextMsg()
  }
}

MessageBox.setDefaults = function (defaults) {
  MessageBox.defaults = defaults
}

MessageBox.confirm = function (message, title, options) {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  return MessageBox(merge({
    title: title,
    message: message
  }, options))
}

MessageBox.close = function () {
  if (!instance) return
  instance.value = false
  msgQueue = []
  currentMsg = null
}

export { MessageBox }
