;
(function (scope) {

    var f = parseFloat;
    var mnw = "minWidth",
        mxw = "maxWidth",
        mnh = "minHeight",
        mxh = "maxHeight";

    scope.BorderBox = function (elm) {
        elm.style.behavior = "none";
        setPixelsInStyle(elm);
        //new scope.BorderBox.Item(elm);
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
        console.log(this.oMxW);
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


    scope.getElementFontSize = function(elm){
        var cS = elm.currentStyle;
        var fs = cS.fontSize;

        if(/px/.test(cS["fontSize"])){
            return parseFloat(fs);
        }

        // ~1em = 100% = 16px
        var oldPaddingHLeft, oldPaddingRight, oldPaddingTop, oldPaddingBottom, oldBorderLeft, oldBorderRight, oldBorderTop, oldBorderBottom;

        if(elm != document.body){



            oldBorder   = cS["border"] || "";
            oldPadding  = cS["padding"];
            oldWidth    = cS["width"];
            oldMinWidth = cS["minWidth"] || 0;
            oldDisplay  = cS["display"];

            borderH = elm.offsetWidth - elm.clientWidth;

            console.log(borderH);

            // fontSize

            elm.style.border   = "0px";
            elm.style.padding  = "0 !important";
            elm.style.display  = "inline-block";
            elm.style.minWidth = "0";
            elm.style.width    = "1em";


            fontSize = elm.offsetWidth;


            elm.style.border   = oldBorder;
            elm.style.padding  = oldPadding;
            elm.style.display  = oldDisplay;
            elm.style.width    = oldWidth;
            elm.style.minWidth = oldMinWidth;

            return fontSize;








        }
        else {
            if(/pt/.test(fs)){
                return parseFloat(fs) * 4 / 3;
            }
            else if(/em/.test(fs)){
                return parseFloat(fs) * 16;
            }
            else if(/%/.test(fs)){
                return parseFloat(fs) * 16 / 100;
            }
            else {
                return parseFloat(fs);
            }

        }



    }

    function getElementPercentBase(elm){
        var p = elm.parentNode;
        return
    }


    function getHPadding(elm){
        parseFloat(elm.currentStyle.paddingLeft) + parseFloat(elm.currentStyle.paddingRight);
    }
    function getVPadding(elm){
        parseFloat(elm.currentStyle.paddingTop) + parseFloat(elm.currentStyle.paddingBottom);
    }


    scope.setPixelsInStyle = function(elm){
        var r = /(\d+)(em|%)/g,
            m,
            fs = false,
            pc = false;

        for(var p in elm.currentStyle){
            var v = ""+(elm.currentStyle[p]);
            if(!v) continue;
            var m = v.match(r);
            if(m ) {
                for (var i = 0, l = m.length; i < l; i++) {
                    var o = m[i];
                    if(/em/.test(o)){
                        (!fs) && (fs = getElementFontSize(elm));
                        v = v.replace(o, parseFloat(o) * fs);
                    }
                    else {
                        // TODO
                        (!pc) && (pc = 300 /100);
                        v = v.replace(o, parseFloat(o) * pc);
                    }

                }
                elm.style[p] = v;
            }
        }
        if(fs) elm.style.fontSize = fs + "px";

    }


    function getInnerWidth (){
        // return offsetWidth - paddingH - borderH
    }

})(this);



