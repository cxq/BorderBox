/* not ready yet */
;
(function (scope) {

    scope.BorderBox = function (elm, live) {
        elm.style.behavior = "none";
        new scope.BorderBox.Item(elm, live);
    };

    // set the computed width/height
    function setComputed(elm, prop, Prop,val, min, max, gap) {
        console.log(elm +":"+ prop+":"+Prop+":"+val+":"+min+":"+max+":"+gap);

        if (val < gap)  elm.style[prop] = "0px";
        else if(val - gap <= min) elm.style[prop] = Math.max(0, min - gap) + "px";
        else if(val - gap >= max) elm.style[prop] = Math.max(0, max - gap) + "px";
        else elm.style[prop] = Math.max(0, val - (gap*2)) + "px";
        return elm["offset" + Prop];
    }

    function refreshWidth(o, elm){
        var w = elm.offsetWidth;
        console.log(o.oldW +":"+ w);
        if(o.oldW != w) o.oldW = setComputed(elm, "width", "Width", w, o.minWidth, o.maxWidth, getCSS(elm, "paddingLeft") + getCSS(elm, "paddingRight") + getCSS(elm, "borderLeftWidth") + getCSS(elm, "borderRightWidth"));
    }

    function refreshHeight(o, elm){
        var h = elm.offsetHeight;
        if(o.oldH != h) o.oldH = setComputed(elm, "height", "Height", h, o.minHeight, o.maxHeight, getCSS(elm, "paddingTop") + getCSS(elm, "paddingBottom") + getCSS(elm, "borderTopWidth") + getCSS(elm, "borderBottomWidth"));
    }

    function refreshAll(o, elm){
        o.isLocked = true;
        o.minWidth = refreshMinMax(o, elm, "minWidth") || 0;
        o.minHeight = refreshMinMax(o, elm, "minHeight") || 0;
        o.el.style.minWidth = o.el.style.minHeight = 0;

        o.maxWidth = refreshMinMax(o, elm, "maxWidth") || Infinity;
        o.maxHeight = refreshMinMax(o, elm, "maxHeight") || Infinity;
        o.el.style.maxWidth = o.el.style.maxHeight = "none";

        o.isLocked = false;
        refreshWidth(o, elm);
        refreshHeight(o, elm);
    }

    // get the new value and refresh
    function refreshMinMax(o, elm, prop){
        o[prop] = getCSS(elm, prop);
        /width/.test(prop) ? refreshWidth(o, elm) : refreshHeight(o, elm);
        return o[prop];
    }

    // read the current style
    function getCSS(elm, prop){
        return parseFloat(elm.currentStyle[prop]) || 0;
    }

    function listen(o, fq){
        (!typeof  fq == "number") && (fq = 1000);
        refreshWidth(o, o.el);
        refreshHeight(o, o.el);
        setTimeout(function (){
            listen(o, fq);
        }, 1000);
    }

    // power switch
    var switchProperty = {
        "width": refreshWidth,
        "minWidth": refreshMinMax,
        "maxWidth": refreshMinMax,
        "borderLeftWidth": refreshWidth,
        "borderRightWidth": refreshWidth,
        "paddingLeft": refreshWidth,
        "paddingRight": refreshWidth,

        "height": refreshHeight,
        "minHeight": refreshMinMax,
        "maxHeight": refreshMinMax,
        "borderBottomWidth": refreshHeight,
        "borderTopWidth": refreshHeight,
        "paddingBottom": refreshHeight,
        "paddingTop": refreshHeight,

        "className": refreshAll,
        "id": refreshAll,

        "_default": function (){}
    }

    /**
     * @constructor
     */
    scope.BorderBox.Item = function (el, live) {
        // list from box-sizing.htc
        // skip on unauthorized element
        if(/html|head|title|script|style|link|meta/gi.test(el.tagName)) return;

        var _this = this,
            cS = el.currentStyle;

        // set datas
        this.el = el;

        // listen property change
        // keep it before changing min/max
        this.el.attachEvent("onpropertychange", function (e) {
            if(_this.isLocked) return;

            var prop = e.propertyName.replace(/^style\./, "");
            console.log(prop);
            _this.isLocked = true;
            (switchProperty.hasOwnProperty(prop) && switchProperty[prop] || switchProperty._default)(_this, el, prop);
            _this.isLocked = false;
        });

        this.isLocked = true;
        // min-width and min-height will be manage by script, reset to default
        // and keep original value
        this.minWidth = refreshMinMax(this, el, "minWidth") || 0;
        this.minHeight = refreshMinMax(this, el, "minHeight") || 0;
        el.style.minWidth = el.style.minHeight = 0;

        this.maxWidth = refreshMinMax(this, el, "maxWidth") || Infinity;
        this.maxHeight = refreshMinMax(this, el, "maxHeight") || Infinity;
        el.style.maxWidth = el.style.maxHeight = "none";

        this.isLocked = false;
        refreshWidth(this, el);
        refreshHeight(this, el);




        this.oldW = this.el.offsetWidth;
        this.oldH = this.el.offsetHeight;

        if(live){
            //listen(this, live || 40);
        }


    }




})(this);



