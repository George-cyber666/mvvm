

function Observer (data) {
    this.data = data
    this.walk(data)
}

Observer.prototype = {
    constructor: Observer,
    walk: function (data) {
        var me = this
        Object.keys(data).forEach(key => {
            me.convert(key, data[key])
        })
    },
    convert: function (key, val) {
        this.defineReactive(this.data, key, val)
    },
    defineReactive (data, key, val) {
        var dep = new Dep()
        var childObj = observe(val) // 监听子属性
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function () {
                if (Dep.target) {
                    dep.depend()
                }
                return val
            },
            set: function (newVal) {
                if (val === newVal) return
                console.log('%c 🥗 监听到变化: ', 'font-size:20px;background-color: #2EAFB0;color:#fff;', newVal)
                val = newVal
                // 新的值是object的话，进行监听
                childObj = observe(newVal)
                // 通知所有订阅者
                dep.notify()
            }
        })
    }
}

function observe (value, vm) {
    if (!value || typeof value !== 'object') {
        return
    }
    return new Observer()
}

var uid = 0

function Dep () {
    this.id = uid++
    this.subs = []
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub)
    },

    depend: function () {
        Dep.target.addDep(this)
    },

    removeSub: function (sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },
    
    notify: function () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null