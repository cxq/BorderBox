Function.prototype.bind || (Function.prototype.bind = function (a) {
    if ("function" !== typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var c = Array.prototype.slice.call(arguments, 1), d = this, b = function () {
    }, e = function () {
        return d.apply(this instanceof b && a ? this : a, c.concat(Array.prototype.slice.call(arguments)))
    };
    b.prototype = this.prototype;
    e.prototype = new b;
    return e
});
var BorderBox = function (a) {
    a.style.behavior = "none";
    new BorderBox.Item(a)
};
BorderBox.Item = function (a) {
    this.el = a;
    this.isLocked = !1;
    this.addEvents();
    this.computeSize()
};
BorderBox.Item.prototype = {addEvents:function () {
    this.el.attachEvent("onpropertychange", this.computeSize.bind(this))
}, computeSize:function () {
    if (!this.isLocked) {
        this.lock();
        var a = this.el.currentStyle, c = parseInt(a.width, 10), d = parseInt(a.height, 10), b = parseInt(a.paddingLeft, 10) || 0, e = parseInt(a.paddingRight, 10) || 0, f = parseInt(a.paddingTop, 10) || 0, g = parseInt(a.paddingBottom, 10) || 0, h = parseInt(a.borderLeftWidth, 10) || 0, i = parseInt(a.borderRightWidth, 10) || 0, j = parseInt(a.borderTopWidth, 10) || 0, a = parseInt(a.borderBottomWidth,
            10) || 0;
        isNaN(c) || (this.el.style.width = Math.max(0, c - b - e - h - i) + "px");
        isNaN(d) || (this.el.style.height = Math.max(0, d - f - g - j - a) + "px");
        this.unlock()
    }
}, lock:function () {
    this.isLocked = !0
}, unlock:function () {
    this.isLocked = !1
}};