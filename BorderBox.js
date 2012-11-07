// function.bind polyfill
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
	if (typeof this !== "function") {
	  // closest thing possible to the ECMAScript 5 internal IsCallable function
	  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	}
 
	var aArgs = Array.prototype.slice.call(arguments, 1), 
		fToBind = this, 
		/**
		 * @constructor
		 */
		fNOP = function () {},
		fBound = function () {
		  return fToBind.apply(this instanceof fNOP && oThis
								 ? this
								 : oThis,
							   aArgs.concat(Array.prototype.slice.call(arguments)));
		};
 
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
 
	return fBound;
  };
}

var BorderBox = function(elm){
	elm.style.behavior = "none";
	new BorderBox.Item(elm);
}

/**
 * @constructor
 */
BorderBox.Item = function(el){
	// set datas to instance
	this.el = el;
	this.isLocked = false;
	
	this.addEvents();
	this.computeSize();
}

BorderBox.Item.prototype = {
	
	addEvents: function (){
		this.el.attachEvent("onpropertychange", this.computeSize.bind(this));
	},
	
	computeSize: function (){
		if(this.isLocked) {return;}
		
		// set lock to prevent unwanted recursivity (set width -> propertychange -> set width -> propertychange ....)
		this.lock();

		
		// get values
		var cS = this.el.currentStyle;
		
		var w =  parseInt(cS.width, 10);
		var h =  parseInt(cS.height, 10);
		
		var pl = parseInt(cS.paddingLeft, 10) || 0;
		var pr = parseInt(cS.paddingRight, 10) || 0;
		var pt = parseInt(cS.paddingTop, 10) || 0;
		var pb = parseInt(cS.paddingBottom, 10) || 0;
		
		var bl = parseInt(cS.borderLeftWidth, 10) || 0;
		var br = parseInt(cS.borderRightWidth, 10) || 0;
		var bt = parseInt(cS.borderTopWidth, 10) || 0;
		var bb = parseInt(cS.borderBottomWidth, 10) || 0;

		// TODO if width/height < (padding + border)
		
		
		// apply new width/height if needed
		
		if(!isNaN(w)) this.el.style.width = Math.max(0, (w - pl - pr - bl - br)) + "px";
		if(!isNaN(h)) this.el.style.height = Math.max(0, (h - pt - pb - bt - bb)) + "px";
		
		
		// free locl
		this.unlock();
	},
	
	lock: function (){
		this.isLocked = true;
	},
	unlock: function (){
		this.isLocked = false;
	}
}