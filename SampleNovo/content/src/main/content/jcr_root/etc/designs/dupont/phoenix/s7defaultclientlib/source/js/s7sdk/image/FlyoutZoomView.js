/*!************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2012 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/
s7sdk.pkg("s7sdk.image");
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.image.FlyoutView");
s7sdk.Util.require("s7sdk.common.ItemDesc");
if (!s7sdk.image.FlyoutZoomView) {
	s7sdk.image.FlyoutZoomView = function FlyoutZoomView(a, c, b) {
		b = (typeof b == "string" && b.length) ? b : "Flyout_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ b, a, "div",
				"s7flyoutzoomview", c ]);
		this.createElement();
		this.devicePixelRatio = ("devicePixelRatio" in window) ? window.devicePixelRatio
				: 1;
		this.container = s7sdk.Util.byId(a);
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		this.compId = (s7sdk.Util.isNull(b) ? "" : b);
		this.asset = unescape(this.asset);
		this.imageModifier = "";
		this.frame = -1;
		this.mediaSet = null;
		this.flyoutPos = new s7sdk.Rectangle(this.flyout.x, this.flyout.y,
				this.flyout.w, this.flyout.h);
		if (typeof this.getParam("flyouttransition") != "undefined") {
			this.transition.type = this.flyouttransition.type;
			this.transition.duration = {
				showTime : this.flyouttransition.showtime,
				showDelay : this.flyouttransition.showdelay,
				hideTime : this.flyouttransition.hidetime,
				hideDelay : this.flyouttransition.hidedelay
			}
		} else {
			this.transition.type = this.transition.type;
			this.transition.duration = {
				showTime : this.transition.duration,
				showDelay : 0,
				hideTime : this.transition.duration,
				hideDelay : 0
			}
		}
		if (this.transition.type == s7sdk.image.FlyoutZoomView.ANIM_NONE) {
			this.transition.duration = {
				showTime : 0.001,
				showDelay : this.flyouttransition.showdelay,
				hideTime : 0.001,
				hideDelay : this.flyouttransition.hidedelay
			}
		}
		this.url = "";
		this.mainViewPos = null;
		this.viewDivAttached = false;
		this.flyoutView = new s7sdk.FlyoutView(this);
		this.bubble_desktop = this.getLocalizedText("TIP_BUBBLE_OVER");
		this.bubble_mobile = this.getLocalizedText("TIP_BUBBLE_TAP");
		var d = s7sdk.browser.device;
		if (d.name == "ipad" || d.name == "ipod" || d.name == "iphone"
				|| (d.name == "android" && parseFloat(d.version) >= 3)) {
			this.infoText = this.bubble_mobile
		} else {
			this.infoText = this.bubble_desktop
		}
		this.flyoutView.infoMessage = new s7sdk.InfoMessage(this.id, this.tip,
				this.infoText);
		this.loadAsset()
	};
	s7sdk.Class.inherits("s7sdk.image.FlyoutZoomView", "s7sdk.UIComponent");
	s7sdk.image.FlyoutZoomView.ANIM_NONE = "none";
	s7sdk.image.FlyoutZoomView.ANIM_WIPE = "wipe";
	s7sdk.image.FlyoutZoomView.ANIM_FADE = "fade";
	s7sdk.image.FlyoutZoomView.ANIM_SLIDE = "slide";
	s7sdk.image.FlyoutZoomView.ANIM_DISSOLVE = "dissolve";
	s7sdk.image.FlyoutZoomView.NONE = "none";
	s7sdk.image.FlyoutZoomView.MASK = "mask";
	s7sdk.image.FlyoutZoomView.COLORIZE = "colorize";
	s7sdk.image.FlyoutZoomView.prototype.symbols = {
		TIP_BUBBLE_OVER : "Mouse over to zoom",
		TIP_BUBBLE_TAP : "Tap and hold to zoom"
	};
	s7sdk.image.FlyoutZoomView.prototype.modifiers = {
		serverUrl : {
			params : [ "isRootPath" ],
			defaults : [ "/is/image/" ]
		},
		asset : {
			params : [ "asset" ],
			defaults : [ "" ],
			parseParams : false
		},
		iscommand : {
			params : [ "value" ],
			defaults : [ "" ],
			parseParams : false
		},
		zoomfactor : {
			params : [ "primaryFactor", "secondaryFactor" ],
			defaults : [ 3, -1 ]
		},
		transition : {
			params : [ "type", "duration" ],
			defaults : [ s7sdk.image.FlyoutZoomView.ANIM_FADE, 1 ],
			ranges : [
					[ s7sdk.image.FlyoutZoomView.ANIM_NONE,
							s7sdk.image.FlyoutZoomView.ANIM_WIPE,
							s7sdk.image.FlyoutZoomView.ANIM_FADE,
							s7sdk.image.FlyoutZoomView.ANIM_SLIDE,
							s7sdk.image.FlyoutZoomView.ANIM_DISSOLVE ], "0:" ],
			deprecated : true
		},
		flyouttransition : {
			params : [ "type", "showtime", "showdelay", "hidetime", "hidedelay" ],
			defaults : [ s7sdk.image.FlyoutZoomView.ANIM_FADE, 1, 0, 1, 0 ],
			ranges : [
					[ s7sdk.image.FlyoutZoomView.ANIM_NONE,
							s7sdk.image.FlyoutZoomView.ANIM_WIPE,
							s7sdk.image.FlyoutZoomView.ANIM_FADE,
							s7sdk.image.FlyoutZoomView.ANIM_SLIDE,
							s7sdk.image.FlyoutZoomView.ANIM_DISSOLVE ], "0:",
					"0:", "0:", "0:" ]
		},
		tip : {
			params : [ "duration", "count", "fade" ],
			defaults : [ 3, 1, 0.3 ]
		},
		preloadtiles : {
			params : [ "preloadtiles" ],
			defaults : [ false ]
		},
		overlay : {
			params : [ "overlay" ],
			defaults : [ false ]
		},
		fmt : {
			params : [ "format" ],
			defaults : [ "jpg" ],
			ranges : [ [ "jpg", "jpeg", "png", "png-alpha", "gif", "gif-alpha" ] ]
		},
		flyout : {
			params : [ "x", "y", "w", "h" ],
			defaults : [ 0, 0, 0, 0 ],
			ranges : [ , , "0:", "0:" ],
			deprecated : true
		},
		size : {
			params : [ "width", "height" ],
			defaults : [ 0, 0 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		highlightMode : {
			params : [ "type", "showtime" ],
			defaults : [ "highlight", 0.1 ],
			ranges : [ [ "highlight", "cursor" ], "0:" ]
		},
		frameTransition : {
			params : [ "transition", "duration" ],
			ranges : [ [ "none", "fade" ], "0:" ],
			defaults : [ "none", 0.3 ]
		}
	};
	s7sdk.image.FlyoutZoomView.prototype.loadRequest = function(a) {
		this.mediaSet = s7sdk.MediaSetParser.parse(a.set, this.imageModifier);
		if (this.mediaSet.items.length > 0
				&& this.mediaSet.items[0] instanceof s7sdk.ItemDesc) {
			this.item = this.mediaSet.items[0];
			this.asset = this.item.name;
			this.configFlyoutZoomView()
		} else {
			throw new Error(
					"Set response did not contain valid items! Set may be empty.")
		}
	};
	s7sdk.image.FlyoutZoomView.prototype.loadAsset = function() {
		if (!this.asset || this.asset.length == 0) {
			return
		}
		var b = s7sdk.MediaSetParser.parseAssetForSetReq(this.asset);
		this.imageModifier = b.mod;
		this.frame = -1;
		var a = this.serverUrl + "/" + b.name;
		a += "?" + b.req;
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			a += "&locale=" + this.locale
		}
		this.isReq = new s7sdk.IS(this.serverUrl, this.asset);
		this.isReq.getHttpReq(a, function(d, c) {
			s7sdk.image.FlyoutZoomView.prototype.loadRequest.apply(c, [ d ])
		}, null, this)
	};
	s7sdk.image.FlyoutZoomView.prototype.setAsset = function(b) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.FlyoutZoomView.setAsset - asset: %0", b);
		var a = this.asset;
		if (this.isReq) {
			this.isReq.cancelHttpReq()
		}
		if (typeof b != "string") {
			throw new Error("Asset name must be represented by a string!")
		}
		this.asset = b;
		this.loadAsset();
		if (a != null && this.asset != null && this.asset != "") {
			var c = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.SWAP, [ 0,
					this.asset ], true);
			s7sdk.Event.dispatch(this.obj, c, false)
		}
	};
	s7sdk.image.FlyoutZoomView.prototype.addEventListener = function(c, b, a) {
		s7sdk.Event.addEventHandler(this.obj, c, this, b, a)
	};
	s7sdk.image.FlyoutZoomView.prototype.setItem = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.FlyoutZoomView.setItem - item: %0", a);
		if (this.isReq) {
			this.isReq.cancelHttpReq()
		}
		if (a instanceof s7sdk.ItemDesc == false) {
			throw new Error("Item must be a descendant of ItemDesc!")
		}
		if (a.parent == null) {
			throw new Error("ItemDesc must be part of a parent set!")
		}
		this.mediaSet = a.parent;
		this.item = a;
		this.asset = a.name;
		this.configFlyoutZoomView()
	};
	s7sdk.image.FlyoutZoomView.prototype.configFlyoutZoomView = function() {
		if (this.asset == null || this.asset.length <= 0) {
			console.log("ERROR: bad configFlyoutZoomView");
			return
		}
		var e = this.asset;
		function l(s, r, t) {
			s += ((s.indexOf("?") == -1) ? "?" : "&") + r;
			s += (typeof t == "undefined") ? "" : "=" + t;
			return s
		}
		if (this.iscommand != null && this.iscommand.length > 0) {
			e = l(e, this.iscommand)
		}
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			e = l(e, "locale", this.locale)
		}
		if (s7sdk.Util.isNonEmptyString(this.item.version)) {
			e = l(e, "id", this.item.version)
		}
		this.left = parseInt(s7sdk.Util.css.getCss("s7flyoutzoomview", "left",
				this.compId, null, this.container));
		this.top = parseInt(s7sdk.Util.css.getCss("s7flyoutzoomview", "top",
				this.compId, null, this.container));
		this.left = isNaN(this.left) ? 0 : this.left;
		this.top = isNaN(this.top) ? 0 : this.top;
		if (this.size.width == 0 || this.size.height == 0) {
			var p = parseInt(s7sdk.Util.css.getCss("s7flyoutzoomview",
					"border-left-width", this.compId, null, this.container));
			p = isNaN(p) ? 0 : p;
			var o = parseInt(s7sdk.Util.css.getCss("s7flyoutzoomview",
					"border-right-width", this.compId, null, this.container));
			o = isNaN(o) ? 0 : o;
			var j = parseInt(s7sdk.Util.css.getCss("s7flyoutzoomview",
					"border-top-width", this.compId, null, this.container));
			j = isNaN(j) ? 0 : j;
			var i = parseInt(s7sdk.Util.css.getCss("s7flyoutzoomview",
					"border-bottom-width", this.compId, null, this.container));
			i = isNaN(i) ? 0 : i;
			this.size.width = parseInt(s7sdk.Util.css.getCss(
					"s7flyoutzoomview", "width", this.compId, null,
					this.container))
					- (p + o);
			this.size.height = parseInt(s7sdk.Util.css.getCss(
					"s7flyoutzoomview", "height", this.compId, null,
					this.container))
					- (j + i);
			if (!s7sdk.Util.isNumber(this.size.width)
					|| !s7sdk.Util.isNumber(this.size.height)
					|| this.size.width <= 0 || this.size.height <= 0) {
				var h, b;
				if ("clientHeight" in this.container
						&& "clientWidth" in this.container) {
					h = this.container.clientWidth;
					b = this.container.clientHeight
				}
				h = h > window.innerWidth ? h : window.innerWidth;
				h = 2 * h / 5;
				b = b > window.innerHeight ? b : window.innerHeight;
				b = 4 * b / 5;
				var m, a;
				var g = (this.zoomfactor.secondaryFactor > 0) ? Math.min(
						this.zoomfactor.secondaryFactor,
						this.zoomfactor.primaryFactor)
						: this.zoomfactor.primaryFactor;
				m = Math.round(this.item.width / g);
				a = Math.round(this.item.height / g);
				if (m > h) {
					var k = h / m;
					a = a * k;
					m = h
				}
				if (a > b) {
					var f = b / a;
					m = m * f;
					a = b
				}
				this.size.width = Math.round(m);
				this.size.height = Math.round(a)
			}
			if (!s7sdk.Util.isNumber(this.size.width)
					|| !s7sdk.Util.isNumber(this.size.height)
					|| this.size.width <= 0 || this.size.height <= 0) {
				this.size.width = 300;
				this.size.height = 400
			}
		}
		this.outWidth = this.size.width * this.devicePixelRatio;
		this.outHeight = this.size.height * this.devicePixelRatio;
		this.mainViewPos = this.getComponentBounds();
		if (this.flyoutPos.equals(new s7sdk.Rectangle(0, 0, 0, 0))) {
			this.flyoutPos = new s7sdk.Rectangle(this.mainViewPos.width + 5,
					this.mainViewPos.y, this.mainViewPos.width,
					this.mainViewPos.height);
			var q = parseInt(s7sdk.Util.css.getCss("s7flyoutzoom", "width",
					this.compId, "s7flyoutzoomview", this.container));
			var n = parseInt(s7sdk.Util.css.getCss("s7flyoutzoom", "height",
					this.compId, "s7flyoutzoomview", this.container));
			var d = parseInt(s7sdk.Util.css.getCss("s7flyoutzoom", "left",
					this.compId, "s7flyoutzoomview", this.container));
			var c = parseInt(s7sdk.Util.css.getCss("s7flyoutzoom", "top",
					this.compId, "s7flyoutzoomview", this.container));
			if (!isNaN(d)) {
				this.flyoutPos.x = d
			}
			if (!isNaN(c)) {
				this.flyoutPos.y = c
			}
			if (q > 0) {
				this.flyoutPos.width = q
			}
			if (n > 0) {
				this.flyoutPos.height = n
			}
		}
		this.flyoutView.loadImage(e, this.serverUrl, this.mainViewPos,
				this.flyoutPos, this.zoomfactor.primaryFactor,
				this.transition.type, this.transition.duration,
				this.preloadtiles, this.fmt, this.iscommand,
				this.zoomfactor.secondaryFactor, this.overlay);
		this.settings.trackLoad(this)
	};
	s7sdk.image.FlyoutZoomView.prototype.flyoutViewLoaded = function(a) {
	};
	s7sdk.image.FlyoutZoomView.prototype.getComponentBounds = function() {
		return new s7sdk.Rectangle(this.left, this.top, this.size.width,
				this.size.height)
	};
	s7sdk.FlyoutZoomView = s7sdk.image.FlyoutZoomView;
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = c(".s7flyoutzoomview", {
			width : "360px",
			height : "480px",
			position : "relative",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
			"-ms-user-select" : "none",
			"user-select" : "none",
			"text-align" : "left",
			border : "1px solid #c2c2c2"
		}) + c(".s7flyoutzoomview .s7highlight", {
			opacity : "0.6",
			filter : "alpha(opacity = 60)",
			"background-color" : "#FFFFFF"
		}) + c(".s7flyoutzoomview .s7cursor[input='mouse']", {
			width : "80px",
			height : "80px",
			"background-image" : b("zoom-cursor-desktop.png")
		}) + c(".s7flyoutzoomview .s7cursor[input='touch']", {
			width : "80px",
			height : "100px",
			"background-image" : b("zoom-cursor-tablet-1x.png")
		}) + c(".s7flyoutzoomview .s7overlay", {
			opacity : "0.6",
			filter : "alpha(opacity = 60)",
			"background-color" : "#FFFFFF"
		}) + c(".s7flyoutzoomview .s7flyoutzoom", {
			width : "600px",
			height : "480px",
			left : "365px",
			top : "0px",
			position : "absolute",
			border : "1px solid #c2c2c2"
		}) + c(".s7flyoutzoomview .s7tip", {
			position : "absolute",
			bottom : "50px",
			color : "#ffffff",
			"font-family" : "Arial",
			"font-size" : "12px",
			"padding-bottom" : "10px",
			"padding-top" : "10px",
			"padding-left" : "12px",
			"padding-right" : "12px",
			"background-color" : "#000000",
			"border-radius" : "4px",
			"-webkit-transform" : "translateZ(0px)",
			opacity : "0.5",
			filter : "alpha(opacity = 50)"
		});
		s7sdk.Util.css.addDefaultCSS(a, "FlyoutZoomView")
	})()
}
if (!s7sdk.InfoMessage) {
	s7sdk.InfoMessage = function(b, a, d, c) {
		c = (typeof c == "string" && c.length) ? c : "InfoMessage_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ c, b, "div", "s7tip" ]);
		this.createElement();
		this.containerId = b;
		this.container = null;
		this.baseOpacity = null;
		this.currentOpacity = 0;
		this.hiddenState = true;
		this.enabled = true;
		this.textType = d || this.textType;
		if (a) {
			this.tip = a
		} else {
			this.tip.duration = 3;
			this.tip.count = 1;
			this.tip.fade = 0.3
		}
		this.obj.innerHTML = this.textType;
		this.obj.style.display = "none";
		this.appended = null;
		this.timerId = null
	};
	s7sdk.Class.inherits("s7sdk.InfoMessage", "s7sdk.UIComponent");
	s7sdk.InfoMessage.prototype.show = function(d, c) {
		if (!this.hiddenState || this.tip.count == 0 || !this.enabled) {
			return
		}
		if (this.tip.count > 0) {
			this.tip.count--
		}
		this.hiddenState = false;
		this.container = s7sdk.Util.byId(this.containerId) || document.body;
		this.obj.style.display = "block";
		if (!this.appended) {
			this.appended = this.container.appendChild(this.obj)
		}
		if (this.baseOpacity == null) {
			this.baseOpacity = s7sdk.Util.getStyle(this.obj, "opacity")
		}
		this.centerOverlay(d || this.container.offsetWidth, c
				|| this.container.offsetHeight);
		var b = this;
		function a() {
			if (b.currentOpacity < 1 && !b.hiddenState) {
				b.currentOpacity += 0.05 / b.tip.fade;
				b.obj.style.opacity = b.baseOpacity * b.currentOpacity;
				b.obj.style.filter = "alpha(opacity ="
						+ (b.baseOpacity * b.currentOpacity * 100) + ")";
				b.timerId = setTimeout(a, 50)
			}
		}
		if (this.tip.fade > 0) {
			a()
		} else {
			this.obj.style.opacity = this.baseOpacity;
			this.obj.style.filter = "alpha(opacity ="
					+ (this.baseOpacity * 100) + ")"
		}
	};
	s7sdk.InfoMessage.prototype.hide = function() {
		if (this.hiddenState) {
			return
		}
		this.hiddenState = true;
		var a = this;
		function b() {
			if (a.hiddenState) {
				if (a.currentOpacity > 0) {
					a.currentOpacity -= 0.05 / a.tip.fade;
					a.obj.style.opacity = a.baseOpacity * a.currentOpacity;
					a.obj.style.filter = "alpha(opacity ="
							+ (a.baseOpacity * a.currentOpacity * 100) + ")";
					a.timerId = setTimeout(b, 50)
				} else {
					a.obj.style.opacity = 0;
					a.obj.style.display = "none"
				}
			}
		}
		if (this.tip.fade > 0) {
			b()
		} else {
			this.obj.style.opacity = 0;
			this.obj.style.filter = "";
			this.obj.style.display = "none"
		}
	};
	s7sdk.InfoMessage.prototype.centerOverlay = function(b, a) {
		this.obj.style.left = 0 + "px";
		this.obj.style.left = (b - this.obj.offsetWidth) / 2 + "px"
	}
};