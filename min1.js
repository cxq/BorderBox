function d(b, a, c, j, k, e) {
    b.style[a] = c < e ? "0px" : c - e <= j ? j - e + "px" : c - e >= k ? k - e + "px" : c - 2 * e + "px"
}
function f(b, a) {
    d(a, "width", a.offsetWidth, b.minWidth, b.maxWidth, g(a, "paddingLeft") + g(a, "paddingRight") + g(a, "borderLeftWidth") + g(a, "borderRightWidth"))
}
function h(b, a) {
    d(a, "height", a.offsetHeight, b.minHeight, b.maxHeight, g(a, "paddingTop") + g(a, "paddingBottom") + g(a, "borderTopWidth") + g(a, "borderBottomWidth"))
}
function i(b, a, c) {
    b[c] = g(a, c);
    /width/.test(c) ? f(b, a) : h(b, a);
    return b[c]
}
function g(b, a) {
    return parseFloat(b.currentStyle[a]) || 0
}
var l = {width:f, minWidth:i, maxWidth:i, borderLeftWidth:f, borderRightWidth:f, paddingLeft:f, paddingRight:f, height:h, minHeight:i, maxHeight:i, borderBottomWidth:h, borderTopWidth:h, paddingBottom:h, paddingTop:h, _default:function () {
}};