;
(function (scope) {

    var f = parseFloat;
    var mnw = "minWidth",
        mxw = "maxWidth",
        mnh = "minHeight",
        mxh = "maxHeight";

    scope.BorderBox = function (elm) {
        elm.style.behavior = "none";
        new scope.BorderBox.Item(elm);
    };

    function setComputed(elm, prop, Prop,val, min, max, gap) {
        if (val < gap)  elm.style[prop] = "0px";
        else if(val - gap <= min) elm.style[prop] = min - gap + "px";
        else if(val - gap >= max) elm.style[prop] = max - gap + "px";
        else elm.style[prop] = val - gap*2 + "px";
        return elm["offset" + Prop];
    }

    /**
     * @constructor
     */
    scope.BorderBox.Item = function (el) {
        var _this = this,
            cS = el.currentStyle;

        // set datas
        this.el = el;

        // min-width and min-height will be manage by script, reset to default
        // and keep original value
        this.oMnW = f(cS.minWidth) || 0;
        this.oMnH = f(cS.minHeight) || 0;
        el.style.minWidth = el.style.minHeight = 0;

        this.oMxW = f(cS.maxWidth) || Infinity;
        this.oMxH = f(cS.maxHeight) || Infinity;
        el.style.maxWidth = el.style.maxHeight = "none";

        this.vGap =  f(cS.paddingTop) + f(cS.paddingBottom) + f(cS.borderTopWidth) + f(cS.borderBottomWidth);
        this.hGap =  f(cS.paddingLeft) + f(cS.paddingRight) + f(cS.borderLeftWidth) + f(cS.borderRightWidth);

        this.isLocked = false;
        this.oldW = 0;
        this.oldH = 0;

        // listen property change
        this.el.attachEvent("onpropertychange", function () {
            _this.computeSize();
        });

        // set
        this.computeSize();
    }
    scope.BorderBox.Item.prototype = {
        computeSize:function () {
            if(this.isLocked) return;

            // set lock to prevent unwanted recursivity (set width -> propertychange -> set width -> propertychange ....)
            this.isLocked = true;

            // get values
            var w = this.el.offsetWidth,
                h = this.el.offsetHeight;

            if (this.oldW != w){ this.oldW = setComputed(this.el, "width", "Width",w, this.oMnW, this.oMxW, this.hGap );}
            if (this.oldH != h){ this.oldH = setComputed(this.el, "height", "Height",h, this.oMnH, this.oMxH, this.vGap);}

            // free lock
            this.isLocked = false;
        }
    }

})(this);



