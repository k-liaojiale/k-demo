import Vue from 'vue'

const Store = function Store(options = {}) {
  const { state = {}, mutations = {}, getters = {} } = options
  this._vm = new Vue({
    data: {
      $$state: state,
      $$getters: getters
    }
  })
  this._mutations = mutations
}

// prototype 解决构造函数的对象实例之间无法共享属性的缺点
Store.prototype.commit = function(type, payload) {
  if (this._mutations[type]) {
    this._mutations[type](this.state, payload)
  }
}

Object.defineProperties(Store.prototype, {
  state: {
    get: function() {
      return this._vm._data.$$state
    }
  },
  getters: {
    get: function() {
      let data = []
      Object.keys(this._vm._data.$$getters).forEach(key => {
        data[key] = this._vm._data.$$getters[key](this.state)
      })
      return { ...data }
    }
  }
})

export default { Store }
