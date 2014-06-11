/*!************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2011 Adobe Systems Incorporated
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
s7sdk.Util.require("s7sdk.event.Event");
if (!s7sdk.image.NavigationView) {
	s7sdk.image.NavigationView = function NavigationView(a, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.image.NavigationView constructor - containerId: %0, settings: %1 , compId: %2",
						a, c, b);
		arguments.callee.superclass.apply(this, [ b, a, "div",
				"s7navigationview", c ]);
		this.container = s7sdk.Util.byId(a);
		this.initialized = false;
		this.mouseDown = false;
		this.viewPort = new s7sdk.Rectangle(0, 0, 0, 0);
		this.devicePixelRatio = window.devicePixelRatio || 1;
		if (this.navSize.width == 0 || this.navSize.height == 0) {
			this.navSize.width = parseInt(s7sdk.Util.css.getCss(
					"s7navigationview", "width", b, null, this.container));
			this.navSize.height = parseInt(s7sdk.Util.css.getCss(
					"s7navigationview", "height", b, null, this.container));
			if (!s7sdk.Util.isNumber(this.navSize.width)
					|| !s7sdk.Util.isNumber(this.navSize.height)
					|| this.navSize.width <= 0 || this.navSize.height <= 0) {
				this.navSize.width = 128;
				this.navSize.height = 128
			}
		}
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		this.asset = unescape(this.asset);
		this.locale = this.getParam("locale", "");
		this.imageModifier = s7sdk.MediaSetParser
				.parseAssetForSetReq(this.asset).mod;
		this.transparent = ((this.fmt.indexOf("png") != -1 || this.fmt
				.indexOf("gif") != -1) && (this.fmt.indexOf("-alpha") > 0)) ? true
				: false;
		this.dragAspect = null;
		this.div = this.createElement();
		this.div.style.position = "absolute";
		this.div.style.width = this.navSize.width + "px";
		this.div.style.height = this.navSize.height + "px";
		this.imageDiv = document.createElement("div");
		this.imageDiv.style.position = "absolute";
		this.navBox = s7sdk.Util.createElement("div");
		this.navBox.style.position = "absolute";
		this.navBox.className = "s7highlight";
		this.div.appendChild(this.imageDiv);
		this.div.appendChild(this.navBox);
		this.container.appendChild(this.div);
		this.pad = null;
		this.img = new Image();
		this.img.onload = s7sdk.Util
				.wrapContext(
						function() {
							s7sdk.Logger
									.log(
											s7sdk.Logger.INFO,
											"s7sdk.image.NavigationView.onload - src: %0",
											this.img.src);
							this.imageDiv.style.backgroundImage = "url('"
									+ this.img.src + "')";
							this.imageDiv.style.width = this.img.width + "px";
							this.imageDiv.style.height = this.img.height + "px";
							if (this.resizable == 1) {
								this.offsetX = 0;
								this.offsetY = 0;
								this.div.style.width = this.img.width + "px";
								this.div.style.height = this.img.height + "px";
								this.imageDiv.style.left = this.offsetX + "px";
								this.imageDiv.style.top = this.offsetY + "px"
							} else {
								this.offsetX = (this.navSize.width - this.img.width) / 2;
								this.offsetY = (this.navSize.height - this.img.height) / 2;
								this.imageDiv.style.left = this.offsetX + "px";
								this.imageDiv.style.top = this.offsetY + "px"
							}
							this.dragAspect = this.img.width / this.img.height;
							this.viewToImage = new s7sdk.Matrix2D(
									1 / this.img.width, 0, 0,
									1 / this.img.height, -this.offsetX
											/ this.img.width, -this.offsetY
											/ this.img.height);
							this.init();
							this.draw()
						}, this);
		this.img.onerror = function(d) {
			s7sdk.Logger.log(s7sdk.Logger.WARNING,
					"s7sdk.image.NavigationView.onerror - failed to load nav image: "
							+ d.message)
		};
		this.img.onabort = function(d) {
			s7sdk.Logger.log(s7sdk.Logger.WARNING,
					"s7sdk.image.NavigationView.onabort - aborted nav image load: "
							+ d.message)
		};
		this.mediaSet = null;
		this.item = null;
		this.isReq = null;
		this.offsetX = 0;
		this.offsetY = 0;
		if (typeof (this.asset) == "string" && this.asset.length > 0) {
			this.setAsset(this.asset)
		}
	};
	s7sdk.Class.inherits("s7sdk.image.NavigationView", "s7sdk.UIComponent");
	s7sdk.image.NavigationView.prototype.modifiers = {
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
		resizable : {
			params : [ "enabled" ],
			defaults : [ false ]
		},
		navSize : {
			params : [ "width", "height" ],
			defaults : [ 0, 0 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		fmt : {
			params : [ "fmt" ],
			defaults : [ "jpg" ],
			ranges : [ [ "jpg", "jpeg", "png", "png-alpha", "gif", "gif-alpha" ] ]
		}
	};
	s7sdk.image.NavigationView.prototype.setViewPort = function(a) {
		if (this.mouseDown) {
			return
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.NavigationView.setViewPort - viewPort: %0", a);
		this.viewPort = a;
		this.draw()
	};
	s7sdk.image.NavigationView.prototype.setImage = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.NavigationView.setImage - asset: %0", a);
		this.asset = a;
		var b = this.setupRequest();
		this.img.src = b
	};
	s7sdk.image.NavigationView.prototype.addEventListener = function(c, b, a) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.image.NavigationView.addEventListener - type: %0, handler: %1, useCapture: %2",
						c,
						b.toString().substring(0, b.toString().indexOf("(")), a);
		this.superproto.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.image.NavigationView.prototype.setupRequest = function() {
		var a = this.serverUrl;
		a += this.asset;
		if (this.asset.indexOf("?") > -1) {
			a += "&layer=comp&"
		} else {
			a += "?"
		}
		if (this.navSize.height > 0 && this.navSize.width > 0) {
			a += "hei=" + this.navSize.height + "&wid=" + this.navSize.width
					+ "&fit=constrain,1&"
		} else {
			if (this.navSize.height > 0) {
				a += "hei=" + this.navSize.height + "&"
			} else {
				if (this.navSize.width > 0) {
					a += "wid=" + this.navSize.width + "&"
				} else {
					a += "&"
				}
			}
		}
		if (s7sdk.Util.isNonEmptyString(this.iscommand)) {
			a += this.iscommand
		}
		a += "&fmt=" + this.fmt;
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			a += "&locale=" + this.locale
		}
		return a
	};
	s7sdk.image.NavigationView.prototype.init = function() {
		if (!this.initialized) {
			s7sdk.Event.addDOMListener(this.div, "mousedown", s7sdk.Util
					.wrapContext(this.onMouseDown, this), true);
			s7sdk.Event.addDOMListener(this.div, "touchstart", s7sdk.Util
					.wrapContext(this.onMouseDown, this), true);
			this.initialized = true
		}
	};
	s7sdk.image.NavigationView.prototype.onGestureStart = function(a) {
		a = a || window.event;
		s7sdk.Event.preventDefault(a)
	};
	s7sdk.image.NavigationView.prototype.onMouseDown = function(a) {
		a = a || window.event;
		s7sdk.Event.preventDefault(a);
		s7sdk.Event.stopPropagation(a);
		this.mouseDown = true;
		if (a.type == "mousedown") {
			this.lastX = a.clientX;
			this.lastY = a.clientY;
			this.lastStageX = a.clientX;
			this.lastStageY = a.clientY;
			s7sdk.Event.addDOMListener(this, "mousemove", s7sdk.Util
					.wrapContext(this.onMouseMove, this), true);
			s7sdk.Event.addDOMListener(this, "mouseup", s7sdk.Util.wrapContext(
					this.onMouseUp, this), true)
		} else {
			this.lastX = a.targetTouches[0].clientX;
			this.lastY = a.targetTouches[0].clientY;
			this.lastStageX = a.targetTouches[0].clientX;
			this.lastStageY = a.targetTouches[0].clientY;
			s7sdk.Event.addDOMListener(this, "touchmove", s7sdk.Util
					.wrapContext(this.onMouseMove, this), true);
			s7sdk.Event.addDOMListener(this, "touchend", s7sdk.Util
					.wrapContext(this.onMouseUp, this), true);
			s7sdk.Event.addDOMListener(this, "touchcancel", s7sdk.Util
					.wrapContext(this.onMouseUp, this), true)
		}
		if (this.getImageToView(this.viewPort)
				.containsPoint(a.localX, a.localY) == false) {
			this.mouseDown = false
		}
	};
	s7sdk.image.NavigationView.prototype.onMouseMove = function(c) {
		c = c || window.event;
		s7sdk.Event.preventDefault(c);
		s7sdk.Event.stopPropagation(c);
		if (!this.mouseDown) {
			return
		}
		var b = c.clientX;
		b = b < this.div.offsetLeft ? this.div.offsetLeft : b;
		b = b > this.div.offsetLeft + this.width ? this.div.offsetLeft
				+ this.width : b;
		var a = c.clientY;
		a = a < this.div.offsetTop ? this.div.offsetTop : a;
		a = a > this.div.offsetTop + this.height ? this.div.offsetTop
				+ this.height : a;
		if (c.type == "mousemove") {
			this.lastStageX = c.clientX;
			this.lastStageY = c.clientY
		} else {
			this.lastStageX = c.targetTouches[0].clientX;
			this.lastStageY = c.targetTouches[0].clientY
		}
		this
				.panView(this.lastStageX - this.lastX, this.lastStageY
						- this.lastY);
		this.lastX = this.lastStageX;
		this.lastY = this.lastStageY
	};
	s7sdk.image.NavigationView.prototype.onMouseUp = function(a) {
		a = a || window.event;
		s7sdk.Event.preventDefault(a);
		s7sdk.Event.stopPropagation(a);
		if (a.type == "mouseup") {
			this.lastStageX = a.clientX;
			this.lastStageY = a.clientY;
			s7sdk.Event.removeDOMListener(this, "mousemove", this.onMouseMove,
					true);
			s7sdk.Event
					.removeDOMListener(this, "mouseup", this.onMouseUp, true)
		} else {
			if (a.targetTouches.length > 0) {
				this.lastStageX = a.targetTouches[0].clientX;
				this.lastStageY = a.targetTouches[0].clientY
			}
			s7sdk.Event.removeDOMListener(this, "touchmove", this.onMouseMove,
					true);
			s7sdk.Event.removeDOMListener(this, "touchend", this.onMouseUp,
					true);
			s7sdk.Event.removeDOMListener(this, "touchcancel", this.onMouseUp,
					true)
		}
		if (this.mouseDown == false) {
			return
		}
		this.mouseDown = false;
		this
				.panView(this.lastStageX - this.lastX, this.lastStageY
						- this.lastY)
	};
	s7sdk.image.NavigationView.prototype.draw = function() {
		if (!this.initialized) {
			return
		}
		var a = this.getImageToView(this.viewPort);
		this.drawViewPort(a)
	};
	s7sdk.image.NavigationView.prototype.drawViewPort = function(a) {
		if (a.width > 0 && a.height > 0) {
			this.positionNavBox(a)
		}
	};
	s7sdk.image.NavigationView.prototype.positionNavBox = function(a) {
		if (this.pad == null) {
			this.navBox.style.width = a.width + "px";
			this.navBox.style.height = a.height + "px";
			this.pad = this.navBox.offsetWidth - this.navBox.clientWidth
		}
		this.navBox.style.width = a.width - this.pad + "px";
		this.navBox.style.height = a.height - this.pad + "px";
		this.navBox.style.left = a.x + "px";
		this.navBox.style.top = a.y + "px"
	};
	s7sdk.image.NavigationView.prototype.getImageToView = function(d) {
		var b = this.viewToImage.clone();
		b.invert();
		var a = b.transformPoint(d.topLeft());
		var c = b.transformPoint(d.bottomRight());
		return new s7sdk.Rectangle(a.x, a.y, c.x - a.x, c.y - a.y)
	};
	s7sdk.image.NavigationView.prototype.panView = function(c, b) {
		if (c == 0 && b == 0) {
			return
		}
		var a = new s7sdk.Rectangle(this.viewPort.x, this.viewPort.y,
				this.viewPort.width, this.viewPort.height);
		var f = this.getImageToView(this.viewPort);
		f.x += c;
		f.y += b;
		this.viewPort = this.viewToImage.transformRect(f);
		this.clampToImage(this.viewPort);
		this.draw();
		var d = new s7sdk.event.ZoomPanEvent(
				s7sdk.event.ZoomPanEvent.NOTF_ZOOM_NPAN,
				(a.x - this.viewPort.x), (a.y - this.viewPort.y));
		this.dispatchEvent(d)
	};
	s7sdk.image.NavigationView.prototype.clampToImage = function(a) {
		a.x += (a.bottomRight().x > 1) ? 1 - a.bottomRight().x : 0;
		a.y += (a.bottomRight().y > 1) ? 1 - a.bottomRight().y : 0;
		a.x = (a.topLeft().x < 0) ? 0 : a.x;
		a.y = (a.topLeft().y < 0) ? 0 : a.y;
		a.width = (a.width < 1) ? a.width : 1;
		a.height = (a.height < 1) ? a.height : 1
	};
	s7sdk.image.NavigationView.prototype.hide = function() {
		s7sdk.Util.fade(this.obj, true, 0.3, "block")
	};
	s7sdk.image.NavigationView.prototype.show = function() {
		s7sdk.Util.fade(this.obj, false, 0.3, "block")
	};
	s7sdk.image.NavigationView.prototype.setAsset = function(a) {
		if (typeof a != "string") {
			throw new Error("Asset name must be represented by a string!")
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.NavigationView.setAsset - asset: %0", a);
		var e = this.asset;
		this.asset = unescape(a);
		this.mediaSet = null;
		var c = s7sdk.MediaSetParser.parseAssetForSetReq(this.asset);
		var b = this.serverUrl + "/" + c.name;
		b += "?" + c.req;
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			b += "&locale=" + this.locale
		}
		if (this.isReq) {
			this.isReq.cancelHttpReq()
		}
		this.isReq = new s7sdk.IS(this.serverUrl, this.asset);
		this.isReq
				.getHttpReq(
						b,
						function(g, f) {
							s7sdk.image.NavigationView.prototype.loadRequest
									.apply(f, [ g ])
						},
						function(g, f) {
							s7sdk.Logger
									.log(
											s7sdk.Logger.ERROR,
											"s7sdk.image.NavigationView.setAsset - failed to load asset: %0 with error message %1",
											a, g)
						}, this);
		if (e != this.asset && e != null) {
			var d = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.SWAP, [ 0,
					this.asset ], true);
			s7sdk.Event.dispatch(this.obj, d, false)
		}
	};
	s7sdk.image.NavigationView.prototype.getAsset = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.NavigationView.getAsset");
		return this.asset
	};
	s7sdk.image.NavigationView.prototype.loadRequest = function(a) {
		this.mediaSet = s7sdk.MediaSetParser.parse(a.set, this.imageModifier);
		if (this.mediaSet.items.length > 0
				&& this.mediaSet.items[0] instanceof s7sdk.ItemDesc) {
			this.item = this.mediaSet.items[0];
			this.update(this.item)
		} else {
			throw new Error(
					"Set response did not contain valid items! Set may be empty.")
		}
	};
	s7sdk.image.NavigationView.prototype.setItem = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.NavigationView.setItem - item: %0", a);
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
		this.update(this.item)
	};
	s7sdk.image.NavigationView.prototype.update = function(b) {
		this.asset = b.name;
		var a = this.setupRequest();
		this.img.src = a
	};
	s7sdk.NavigationView = s7sdk.image.NavigationView;
	(function addDefaultCSS() {
		var b = s7sdk.Util.css.createCssRuleText;
		var a = b(".s7navigationview", {
			width : "128px",
			height : "128px",
			"background-color" : "#FFFFFF",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + b(".s7navigationview .s7highlight", {
			border : "solid 1px",
			color : "#ff0000"
		});
		s7sdk.Util.css.addDefaultCSS(a, "NavigationView")
	})()
};