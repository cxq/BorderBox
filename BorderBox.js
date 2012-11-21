;
(function (env) {
    env.BorderBox = function (elm) {
        elm.style.behavior = "none";
        new BorderBox.Item(elm);
    };

    function setComputedWidth(elm, w, minw, maxw, paddingAndBorder) {
        elm.style.minWidth = minw - paddingAndBorder + "px";
        elm.style.width = ((w >= maxw) ? maxw + paddingAndBorder : (w <= minw) ? minw : w) - paddingAndBorder * 2 + "px";
        elm.style.maxWidth = maxw - paddingAndBorder + "px";
    }

    function setComputedHeight(elm, h, minh, maxh, paddingAndBorder) {
        elm.style.minHeight = minh - paddingAndBorder + "px";
        elm.style.height = ((h >= maxh) ? maxh + paddingAndBorder : (h <= minh) ? minh : h) - paddingAndBorder * 2 + "px";
        elm.style.maxHeight = maxh - paddingAndBorder + "px";
    }

    /**
     * @constructor
     */
    BorderBox.Item = function (el) {
        // set datas to instance
        this.el = el;

        this.originalMinWidth = parseInt(el.currentStyle.minWidth, 10) || 0;
        this.originalMaxWidth = parseInt(el.currentStyle.maxWidth, 10) || 0;

        this.originalMinHeight = parseInt(el.currentStyle.minHeight, 10) || 0;
        this.originalMaxHeight = parseInt(el.currentStyle.maxHeight, 10) || 0;

        this.el.style.minWidth = "0";
        this.el.style.maxWidth = "none";
        this.el.style.minHeight = "0";
        this.el.style.maxHeight = "none";

        this.isLocked = false;

        this.addEvents();
        this.computeSize();
    }

    BorderBox.Item.prototype = {

        addEvents:function () {
            var _this = this;
            this.el.attachEvent("onpropertychange", function () {
                _this.computeSize();
            });
        },

        computeSize:function () {
            if (this.isLocked) {return;}

            // set lock to prevent unwanted recursivity (set width -> propertychange -> set width -> propertychange ....)
            this.lock();

            // get values
            var cS = this.el.currentStyle;

            //var w =  parseFloat(cS.width, 10) || 0;
            var w = this.el.offsetWidth;
            var minw = this.originalMinWidth;
            var maxw = this.originalMaxWidth;
            var minh = this.originalMinHeight;
            var maxh = this.originalMaxHeight;


            var h =this.el.offsetHeight;

            var pl = parseFloat(cS.paddingLeft, 10) || 0;
            var pr = parseFloat(cS.paddingRight, 10) || 0;
            var pt = parseFloat(cS.paddingTop, 10) || 0;
            var pb = parseFloat(cS.paddingBottom, 10) || 0;

            var bl = parseFloat(cS.borderLeftWidth, 10) || 0;
            var br = parseFloat(cS.borderRightWidth, 10) || 0;
            var bt = parseFloat(cS.borderTopWidth, 10) || 0;
            var bb = parseFloat(cS.borderBottomWidth, 10) || 0;

            // TODO if width/height < (padding + border)


            // apply new width/height if needed

            setComputedWidth(this.el, w, minw, maxw, pl + pr + bl + br);
            setComputedHeight(this.el, h, minh, maxh, pt + pb + bt + bb);


            // free lock
            this.unlock();
        },

        lock:function () {
            this.isLocked = true;
        },
        unlock:function () {
            this.isLocked = false;
        }
    }


})(this);



