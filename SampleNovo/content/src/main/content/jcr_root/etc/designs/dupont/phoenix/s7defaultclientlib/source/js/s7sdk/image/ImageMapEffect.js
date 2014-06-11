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
s7sdk.Util.require("s7sdk.common.Thumb");
s7sdk.Util.require("s7sdk.common.Geometry");
if (!s7sdk.image.ImageMapEffect) {
	s7sdk.image.ImageMapEffect = function ImageMapEffect(b, d, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.image.ImageMapEffect constructor - containerId: %0, settings: %1 , compId: %2",
						b, d, c);
		c = (typeof c == "string" && c.length) ? c : "ImageMapEffect_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ c, b, "div",
				"s7imagemapeffect", d ]);
		s7sdk.Component.prototype.parseMods.apply(this, []);
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		this.container = document.getElementById(b);
		var e = this.container ? this.container.s7base : null;
		var a = s7sdk.image.ImageMapEffect.ICON_FLAG;
		if (this.mapTips == "1") {
			a |= s7sdk.image.ImageMapEffect.TOOLTIP_FLAG
		}
		this.create(e, this.serverUrl, a, this.rollover == "1")
	};
	s7sdk.Class.inherits("s7sdk.image.ImageMapEffect", "s7sdk.Base");
	s7sdk.image.ImageMapEffect.prototype.modifiers = {
		serverUrl : {
			params : [ "isRootPath" ],
			defaults : [ "/is/image/" ]
		},
		rollover : {
			params : [ "rollover" ],
			defaults : [ "1" ],
			ranges : [ "0", "1" ]
		},
		mapTips : {
			params : [ "maptips" ],
			defaults : [ "0" ],
			ranges : [ "0", "1" ]
		}
	};
	s7sdk.image.ImageMapEffect.ICON_FLAG = 1;
	s7sdk.image.ImageMapEffect.OVERLAY_FLAG = 2;
	s7sdk.image.ImageMapEffect.ALWAYS_ACTIVE_FLAG = 4;
	s7sdk.image.ImageMapEffect.TOOLTIP_FLAG = 8;
	s7sdk.image.ImageMapEffect.prototype.create = function(f, a, b, e, d) {
		this.flags_ = b;
		this.target_ = null;
		this.linkedOverlayMap_ = null;
		this.serverUrl_ = a;
		this.itemIndex_ = -1;
		this.mapOverlays_ = null;
		this.overlayContainer_ = null;
		this.destroyed_ = false;
		this.overlaysVisible_ = true;
		this.mediaSet_ = null;
		this.rollover_ = e;
		this.createElement();
		this.obj.style.position = "absolute";
		this.obj.style.top = "0px";
		this.obj.style.left = "0px";
		var c = this;
		this.__targetZoomRegion = function(g) {
			c.targetZoomRegion(g)
		};
		this.__targetAssetChanged = function(g) {
			c.targetAssetChanged(g)
		};
		this.__targetItemSelected = function(g) {
			c.targetAssetChanged(g)
		};
		this.__transitionStart = function(g) {
			c.transitionStart(g)
		};
		this.__transitionEnd = function(g) {
			c.transitionEnd(g)
		};
		if (f != null) {
			this.attachToView(f)
		}
	};
	s7sdk.image.ImageMapEffect.prototype.addEventListener = function(c, b, a) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.image.ImageMapEffect.addEventListener - type: %0, handler: %1, useCapture: %2",
						c,
						b.toString().substring(0, b.toString().indexOf("(")), a);
		s7sdk.Base.prototype.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.image.ImageMapEffect.prototype.attachToView = function(a) {
		if (a !== this.target) {
			if (this.target_) {
				this.target_.removeEventListener(
						s7sdk.event.ZoomRgnEvent.NOTF_ZOOM_RGN,
						this.__targetZoomRegion, false);
				this.target_.removeEventListener(
						s7sdk.event.AssetEvent.ASSET_CHANGED,
						this.__targetAssetChanged, false);
				this.target_.removeEventListener(
						s7sdk.event.AssetEvent.ITEM_SELECTED_EVENT,
						this.__targetItemSelected, false);
				this.target_.removeEventListener(
						s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_START,
						this.__transitionStart, false);
				this.target_.removeEventListener(
						s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_END,
						this.__transitionEnd, false);
				this.target_.obj.removeChild(this.obj)
			}
			this.target_ = a;
			if (a) {
				this.target_.addEventListener(
						s7sdk.event.ZoomRgnEvent.NOTF_ZOOM_RGN,
						this.__targetZoomRegion, false);
				this.target_.addEventListener(
						s7sdk.event.AssetEvent.ASSET_CHANGED,
						this.__targetAssetChanged, false);
				this.target_.addEventListener(
						s7sdk.event.AssetEvent.ITEM_SELECTED_EVENT,
						this.__targetItemSelected, false);
				this.target_.addEventListener(
						s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_START,
						this.__transitionStart, false);
				this.target_.addEventListener(
						s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_END,
						this.__transitionEnd, false);
				this.target_.obj.appendChild(this.obj)
			}
		}
	};
	s7sdk.image.ImageMapEffect.prototype.targetZoomRegion = function(a) {
		this.updateOverlayCoverage()
	};
	s7sdk.image.ImageMapEffect.prototype.targetAssetChanged = function(b) {
		var a = b.s7event.asset instanceof s7sdk.MediaSetDesc ? b.s7event.asset.items[b.s7event.frame]
				: b.s7event.asset;
		if (typeof a == "string") {
			throw new Error(
					"AssetEvent should not be providing a string as the asset, it should be an ItemDesc!")
		}
		if (a.parent == null) {
			throw new Error("ItemDesc must be part of a parent set!")
		}
		this.mediaSet_ = a.parent;
		if (this.mediaSet_.items && this.mediaSet_.items[b.s7event.frame]) {
			if (!this.mediaSet_.items[b.s7event.frame].mapsuppressed) {
				this.setCurrentIndex(b.s7event.frame)
			} else {
				this.retrieveImageMap(this.mediaSet_.items[b.s7event.frame])
			}
		}
	};
	s7sdk.image.ImageMapEffect.prototype.transitionStart = function(a) {
		if (this.overlayContainer_) {
			this.overlayContainer_.style.visibility = "hidden"
		}
	};
	s7sdk.image.ImageMapEffect.prototype.transitionEnd = function(a) {
		if (this.overlayContainer_) {
			this.overlayContainer_.style.visibility = "inherit"
		}
	};
	s7sdk.image.ImageMapEffect.prototype.retrieveImageMap = function(a) {
		if (this.serverUrl_ == null || !(a instanceof s7sdk.ImageDesc)) {
			s7sdk.Logger
					.log(s7sdk.Logger.WARNING,
							"ImageMapEffectCC.retrieveImageMap Neither serverUrl or image can be null!");
			return
		}
		this.removeOverlaysFromView(true);
		this.stopRequest();
		s7sdk.Logger
				.log(
						s7sdk.Logger.INFO,
						"ImageMapEffectCC.retrieveImageMap Performing map request for image: %0",
						a.name);
		var b = this.serverUrl_ + a.name;
		if (b.indexOf("?") == -1) {
			b += "?req=map"
		} else {
			b += "&req=map"
		}
		b += ",json,utf-8&scl=1";
		this.isReq_ = new s7sdk.IS(this.serverUrl_, a.name);
		this.isReq_.getHttpReq(b, function(d, c) {
			s7sdk.ImageMapEffect.prototype.loadCompleteHandler.apply(c, [ d ])
		}, null, this)
	};
	s7sdk.image.ImageMapEffect.prototype.loadCompleteHandler = function(b) {
		if (this.destroyed_) {
			return
		}
		var a = s7sdk.ImageMapUtil.parseMapAreaArray(b);
		if (this.mediaSet_) {
			var c = [];
			if (this.mediaSet_.maps) {
				c = c.concat(this.mediaSet_.maps)
			}
			if (typeof a != "undefined" && a instanceof Array) {
				c = c.concat(a)
			}
			this.createMapOverlays(c)
		} else {
			throw new Error("Internal media-set unknown!")
		}
	};
	s7sdk.image.ImageMapEffect.prototype.stopRequest = function() {
		if (this.isReq_) {
			this.isReq_.cancelHttpReq()
		}
	};
	s7sdk.image.ImageMapEffect.prototype.setCurrentIndex = function(a) {
		this.itemIndex_ = a;
		if (this.mediaSet_) {
			var c = [];
			if (this.mediaSet_.maps) {
				c = c.concat(this.mediaSet_.maps)
			}
			if (this.mediaSet_.items && this.mediaSet_.items[a]) {
				var b = this.mediaSet_.items[a];
				if (typeof b.maps != "undefined" && b.maps instanceof Array) {
					c = c.concat(b.maps)
				}
			}
			this.createMapOverlays(c)
		} else {
			throw new Error("Internal media-set unknown!")
		}
	};
	s7sdk.image.ImageMapEffect.prototype.getOverlaysVisible = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.ImageMapEffect.getOverlaysVisible");
		return this.overlaysVisible_
	};
	s7sdk.image.ImageMapEffect.prototype.setOverlaysVisible = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.ImageMapEffect.setOverlaysVisible - value: %0", a);
		this.overlaysVisible_ = a;
		if (a) {
			this.updateOverlayCoverage(true)
		} else {
			this.removeOverlaysFromView(false)
		}
	};
	s7sdk.image.ImageMapEffect.prototype.updateOverlayCoverage = function(a) {
		a = (typeof a == "undefined") ? false : a;
		if (this.mapOverlays_ && this.mapOverlays_.length
				&& this.overlaysVisible_) {
			if (!this.overlayContainer_) {
				this.overlayContainer_ = this
						.createOverlayContainer(0, 0, 0, 0)
			}
			this.overlayContainer_.setWidth(this.target_.wid);
			this.overlayContainer_.setHeight(this.target_.hei);
			if (!this.overlayContainer_.parentNode) {
				this.obj.appendChild(this.overlayContainer_)
			}
			for ( var c = 0; c < this.mapOverlays_.length; c++) {
				var b = this.mapOverlays_[c];
				b.updateOverlay();
				if (!b.element_.parentNode) {
					this.overlayContainer_.appendChild(b.element_)
				}
			}
			if (a) {
				this.fadeInOverlays_()
			}
		}
	};
	s7sdk.image.ImageMapEffect.prototype.fadeInOverlays_ = function() {
		var b = this.overlayContainer_;
		function a() {
			if (!b.currentOpacity_) {
				b.currentOpacity_ = 0
			}
			if (b.currentOpacity_ < 1) {
				b.currentOpacity_ += 0.05 / 0.5;
				s7sdk.Util.setOpacity(b, b.currentOpacity_);
				setTimeout(a, 50)
			}
			if (s7sdk.browser.device.name == "android"
					&& s7sdk.browser.device.version == "4") {
				b.style.display = "none";
				var c = b.offsetWidth;
				b.style.display = "block"
			}
		}
		a()
	};
	s7sdk.image.ImageMapEffect.prototype.removeOverlaysFromView = function(c) {
		c = (typeof c == "undefined") ? false : c;
		if (this.overlayContainer_ && this.overlayContainer_.parentNode) {
			this.overlayContainer_.parentNode
					.removeChild(this.overlayContainer_)
		}
		if (c) {
			this.overlayContainer_ = null;
			if (this.mapOverlays_) {
				for ( var b = 0; b < this.mapOverlays_.length; b++) {
					var a = this.mapOverlays_[b];
					a.cleanUp()
				}
				this.mapOverlays_ = null
			}
		}
	};
	s7sdk.image.ImageMapEffect.prototype.cleanUp = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.ImageMapEffect.cleanUp");
		this.removeOverlaysFromView(true);
		this.destroyed_ = true
	};
	s7sdk.image.ImageMapEffect.prototype.createMapOverlays = function(b) {
		this.removeOverlaysFromView(true);
		this.mapOverlays_ = [];
		this.linkedOverlayMap_ = {};
		for ( var e = 0; e < b.length; e++) {
			var a = b[e];
			var d = new s7sdk.MapAreaOverlay(this, a, this.flags_,
					this.rollover_);
			this.mapOverlays_.push(d);
			var c;
			if (a.rolloverKey && a.rolloverKey.length) {
				c = a.rolloverKey
			} else {
				if (a.href && a.href.length) {
					c = a.href
				}
			}
			if (c) {
				var g = this.linkedOverlayMap_[c];
				if (!g) {
					g = [];
					this.linkedOverlayMap_[c] = g
				}
				g.push(d)
			}
		}
		function f(i, h) {
			return (i.getArea() == h.getArea()) ? 0 : ((i.getArea() > h
					.getArea()) ? 1 : -1)
		}
		this.mapOverlays_.sort(f);
		if (this.overlaysVisible_) {
			this.updateOverlayCoverage(true)
		}
	};
	s7sdk.image.ImageMapEffect.prototype.createOverlayContainer = function(b,
			e, c, a) {
		var d = s7sdk.image.ImageMapEffect.createSmartDiv();
		d.setX(b);
		d.setY(e);
		d.setWidth(c);
		d.setHeight(a);
		d.style.overflow = "hidden";
		d.style.position = "absolute";
		d.style.pointerEvents = "none";
		d.id = this.id + "_overlayContainer";
		return d
	};
	s7sdk.image.ImageMapEffect.createSmartDiv = function(a) {
		var b = (a && typeof a != "undefined") ? a : document
				.createElement("div");
		b.getX = function() {
			return b.x_ || parseInt(b.style.left)
		};
		b.getY = function() {
			return b.y_ || parseInt(b.style.top)
		};
		b.getWidth = function() {
			return b.width_ || parseInt(b.style.width)
		};
		b.getHeight = function() {
			return b.height_ || parseInt(b.style.height)
		};
		b.setX = function(c) {
			b.x_ = c;
			b.style.left = c + "px"
		};
		b.setY = function(c) {
			b.y_ = c;
			b.style.top = c + "px"
		};
		b.setWidth = function(c) {
			b.width_ = c;
			b.style.width = c + "px"
		};
		b.setHeight = function(c) {
			b.height_ = c;
			b.style.height = c + "px"
		};
		return b
	};
	s7sdk.image.ImageMapEffect.prototype.getLinkedOverlays = function(c) {
		var d;
		if (this.linkedOverlayMap_) {
			var b;
			var a = c.getMapDesc();
			if (a.rolloverKey && a.rolloverKey.length) {
				b = a.rolloverKey
			} else {
				if (a.href && a.href.length) {
					b = a.href
				}
			}
			d = this.linkedOverlayMap_[b]
		}
		if (!d) {
			d = []
		}
		return d
	};
	s7sdk.image.ImageMapEffect.prototype.transformPoint = function(a) {
		return this.target_.imagePixelsToViewPoint(a)
	};
	s7sdk.image.ImageMapEffect.prototype.getTargetId = function() {
		return this.target_.obj.id
	};
	s7sdk.image.ImageMapEffect.prototype.getTargetClassName = function() {
		return this.target_.obj.className
	};
	s7sdk.image.ImageMapEffect.prototype.overlayRolloverEvent = function(a) {
		this.dispatchEvent(a)
	};
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = c(".s7imagemapeffect .s7mapoverlay", {
			width : "50px",
			height : "50px",
			"background-repeat" : "no-repeat",
			"background-position" : "center",
			"background-image" : b("map_overlay_icon.png"),
			cursor : "pointer",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + c(".s7imagemapeffect .s7mapoverlay[state='default']", {
			opacity : "0.6",
			filter : "alpha(opacity = 60)"
		}) + c(".s7imagemapeffect .s7mapoverlay[state='active']", {
			opacity : "1",
			filter : "alpha(opacity = 100)"
		});
		s7sdk.Util.css.addDefaultCSS(a, "ImageMapEffect")
	})()
}
if (!s7sdk.MapAreaOverlay) {
	s7sdk.MapAreaOverlay = function MapAreaOverlay(e, b, c, d) {
		this.overlayManager_ = e;
		this.mapDesc_ = b;
		this.flags_ = c;
		this.iconStyle_ = "s7mapareaicon";
		this.rollover_ = d;
		this.active_ = false;
		this.rawShapeInfo_ = null;
		this.prevRect_ = null;
		this.targetClassName_ = this.overlayManager_.cl;
		this.targetId_ = this.overlayManager_.id;
		this.element_ = this.createDiv();
		if (this.mapDesc_.shape == s7sdk.MapDescShape.SHAPE_POLY) {
			this.rawShapeInfo_ = this.processPolygon(this.getPoints(
					this.mapDesc_.coords, false))
		}
		var a = this;
		this.__overlayRolloverHandler = function(f) {
			a.overlayRolloverHandler_(f)
		};
		this.__overlayClickHandler = function(f) {
			a.overlayClickHandler_(f)
		};
		this.__touchHandler = function(f) {
			a.touchHandler_(f)
		};
		if (this.rollover_) {
			s7sdk.Event.addDOMListener(this.element_, "mouseover",
					this.__overlayRolloverHandler, false);
			s7sdk.Event.addDOMListener(this.element_, "mouseout",
					this.__overlayRolloverHandler, false)
		}
		s7sdk.Event.addDOMListener(this.element_, "click",
				this.__overlayClickHandler, false);
		s7sdk.Event.addDOMListener(this.element_, "touchstart",
				this.__touchHandler, false);
		s7sdk.Event.addDOMListener(this.element_, "touchmove",
				this.__touchHandler, false);
		s7sdk.Event.addDOMListener(this.element_, "touchend",
				this.__touchHandler, false);
		if ((this.flags_ & s7sdk.image.ImageMapEffect.TOOLTIP_FLAG)
				&& this.mapDesc_.alt && this.mapDesc_.alt.length) {
			this.toolTip_ = new s7sdk.SimpleToolTip(this.element_,
					this.mapDesc_.alt, this.overlayManager_.obj)
		}
		if (this.flags_ & s7sdk.image.ImageMapEffect.ALWAYS_ACTIVE_FLAG) {
			this.setActive(true)
		}
		this.focusRect = false;
		this.prevRect_ = new s7sdk.Rectangle()
	};
	s7sdk.MapAreaOverlay.prototype.touchHandler_ = function(a) {
		if (a.type == "touchmove") {
			a.preventDefault()
		}
	};
	s7sdk.MapAreaOverlay.prototype.getActive = function() {
		return this.active_
	};
	s7sdk.MapAreaOverlay.prototype.setActive = function(a) {
		if (this.active_ != a) {
			this.active_ = a;
			this.updateOverlay()
		}
	};
	s7sdk.MapAreaOverlay.prototype.getArea = function() {
		return this.rawShapeInfo_ ? this.rawShapeInfo_.area : NaN
	};
	s7sdk.MapAreaOverlay.prototype.getMapDesc = function() {
		return this.mapDesc_
	};
	s7sdk.MapAreaOverlay.prototype.cleanUp = function() {
		if (this.rollover_) {
			s7sdk.Event.removeDOMListener(this.element_, "mouseover",
					this.__overlayRolloverHandler);
			s7sdk.Event.removeDOMListener(this.element_, "mouseout",
					this.__overlayRolloverHandler)
		}
		if (this.toolTip_) {
			this.toolTip_.removeToolTip()
		}
		s7sdk.Event.removeDOMListener(this.element_, "click",
				this.__overlayClickHandler);
		s7sdk.Event.removeDOMListener(this.element_, "touchstart",
				this.__touchHandler);
		s7sdk.Event.removeDOMListener(this.element_, "touchmove",
				this.__touchHandler);
		s7sdk.Event.removeDOMListener(this.element_, "touchend",
				this.__touchHandler)
	};
	s7sdk.MapAreaOverlay.prototype.updateOverlay = function() {
		if (this.mapDesc_.shape == s7sdk.MapDescShape.SHAPE_POLY) {
			var b = this.getPoints(this.mapDesc_.coords, true);
			var a = this.processPolygon(b).centroid;
			this.element_.setX(a.x - this.element_.getWidth() / 2);
			this.element_.setY(a.y - this.element_.getHeight() / 2);
			s7sdk.Util.css.setCSSAttributeSelector(this.element_, "state",
					this.active_ ? "active" : "default")
		}
	};
	s7sdk.MapAreaOverlay.prototype.drawPolygon_ = function(a, b) {
	};
	s7sdk.MapAreaOverlay.prototype.overlayRolloverHandler_ = function(d) {
		var a = this.overlayManager_.getLinkedOverlays(this);
		var c = (d.type == "mouseover");
		if (!(this.flags_ & s7sdk.image.ImageMapEffect.ALWAYS_ACTIVE_FLAG)) {
			this.setLinkedOverlaysActive(c)
		}
		if (this.mapDesc_.rolloverKey && this.mapDesc_.rolloverKey.length
				&& this.rollover_) {
			var f, b = this.getBounds();
			if (c) {
				f = new s7sdk.event.RolloverKeyEvent(
						s7sdk.event.RolloverKeyEvent.ROLLOVER_ACTIVATED,
						this.mapDesc_.rolloverKey, b);
				var e = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.ITEM,
						[ "rolloverKey=" + this.mapDesc_.rolloverKey ], true);
				this.overlayManager_.overlayRolloverEvent(e)
			} else {
				f = new s7sdk.event.RolloverKeyEvent(
						s7sdk.event.RolloverKeyEvent.ROLLOVER_DEACTIVATED,
						this.mapDesc_.rolloverKey, b)
			}
			this.overlayManager_.overlayRolloverEvent(f)
		}
	};
	s7sdk.MapAreaOverlay.prototype.getBounds = function() {
		var a = s7sdk.ImageMapUtil.getPosition(this.element_);
		var b = new s7sdk.Rectangle(a.x, a.y, this.element_.getWidth(),
				this.element_.getHeight());
		return b
	};
	s7sdk.MapAreaOverlay.prototype.setLinkedOverlaysActive = function(d) {
		var b, a = this.overlayManager_.getLinkedOverlays(this);
		this.setActive(d);
		for ( var c = 0; c < a.length; c++) {
			var b = a[c];
			if (b != this) {
				b.setActive(d)
			}
		}
	};
	s7sdk.MapAreaOverlay.prototype.overlayClickHandler_ = function(d) {
		if (this.rollover_ == false) {
			if (this.mapDesc_.href && this.mapDesc_.href.length > 0) {
				var f = this.mapDesc_.href.toLowerCase();
				if (f.indexOf("target:") == 0) {
					f = f.substring("target:".length);
					var c = new s7sdk.event.RolloverKeyEvent(
							s7sdk.event.RolloverKeyEvent.TARGET_INDEX,
							this.mapDesc_.rolloverKey, b, this.mapDesc_.href,
							false, f);
					this.overlayManager_.overlayRolloverEvent(c)
				} else {
					if (this.mapDesc_.href.split(/^\s*http:/i).length > 1) {
						this.evaluateWebLink_(this.mapDesc_.href)
					} else {
						this.evaluateJavaScriptLink_(this.mapDesc_.href)
					}
				}
				var e = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.HREF,
						[ "href=" + this.mapDesc_.href ], true);
				this.overlayManager_.overlayRolloverEvent(e)
			} else {
				if (this.mapDesc_.rolloverKey
						&& this.mapDesc_.rolloverKey.length > 0) {
					var g, b = this.getBounds(), a = this;
					this.setLinkedOverlaysActive(true);
					setTimeout(function() {
						a.setLinkedOverlaysActive(false)
					}, 200);
					g = new s7sdk.event.RolloverKeyEvent(
							s7sdk.event.RolloverKeyEvent.ROLLOVER_ACTIVATED,
							this.mapDesc_.rolloverKey, b);
					this.overlayManager_.overlayRolloverEvent(g);
					var e = new s7sdk.event.UserEvent(
							s7sdk.event.UserEvent.ITEM, [ "rolloverKey="
									+ this.mapDesc_.rolloverKey ], true);
					this.overlayManager_.overlayRolloverEvent(e)
				} else {
				}
			}
		} else {
			if (this.mapDesc_.href && this.mapDesc_.href.length > 0) {
				var f = this.mapDesc_.href.toLowerCase();
				if (f.indexOf("target:") == 0) {
					f = f.substring("target:".length);
					var c = new s7sdk.event.RolloverKeyEvent(
							s7sdk.event.RolloverKeyEvent.TARGET_INDEX,
							this.mapDesc_.rolloverKey, b, this.mapDesc_.href,
							false, f);
					this.overlayManager_.overlayRolloverEvent(c)
				} else {
					if (this.mapDesc_.href.split(/^\s*http:/i).length > 1) {
						this.evaluateWebLink_(this.mapDesc_.href)
					} else {
						this.evaluateJavaScriptLink_(this.mapDesc_.href)
					}
				}
				var e = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.HREF,
						[ "href=" + this.mapDesc_.href ], true);
				this.overlayManager_.overlayRolloverEvent(e)
			} else {
			}
		}
	};
	s7sdk.MapAreaOverlay.prototype.evaluateWebLink_ = function(a) {
		window.open(a, this.mapDesc_.target || "_self")
	};
	s7sdk.MapAreaOverlay.prototype.evaluateJavaScriptLink_ = function(a) {
		window.open(a, this.mapDesc_.target || "_self")
	};
	s7sdk.MapAreaOverlay.prototype.getPoints = function(f, d) {
		d = (typeof d == "undefined") ? false : d;
		var c = [];
		if (f.length % 2) {
			s7sdk.Logger
					.log(
							s7sdk.Logger.WARNING,
							"s7sdk.image.ImageMapEffect - s7sdk.MapAreaOverlay.getPoints - There are an odd number of coordinates!")
		}
		var b = Math.floor(f.length / 2);
		for ( var e = 0; e < b; e++) {
			var a = new s7sdk.Point2D(f[e * 2], f[e * 2 + 1]);
			if (d) {
				a = this.overlayManager_.transformPoint(a)
			}
			c.push(a)
		}
		return c
	};
	s7sdk.MapAreaOverlay.prototype.processPolygon = function(d) {
		var b = d.length;
		var e = 0;
		var a = 0;
		var h = 0;
		for ( var f = 0; f < b; f++) {
			var c = (f + 1) % b;
			var g = d[f].x * d[c].y - d[c].x * d[f].y;
			e += g;
			a += (d[f].x + d[c].x) * g;
			h += (d[f].y + d[c].y) * g
		}
		e *= 0.5;
		a /= 6 * e;
		h /= 6 * e;
		return new s7sdk.ShapeInfo(new s7sdk.Point2D(a, h), Math.abs(e))
	};
	s7sdk.MapAreaOverlay.prototype.createDiv = function() {
		var a = s7sdk.image.ImageMapEffect.createSmartDiv();
		a.className = "s7mapoverlay";
		a.style.position = "absolute";
		a.style.backgroundRepeat = "no-repeat";
		a.style.backgroundPosition = "center";
		a.style.pointerEvents = "auto";
		a.setWidth(parseInt(s7sdk.Util.css.getCss("s7mapoverlay", "width",
				this.targetId_, this.targetClassName_,
				this.overlayManager_.container)));
		a.setHeight(parseInt(s7sdk.Util.css.getCss("s7mapoverlay", "height",
				this.targetId_, this.targetClassName_,
				this.overlayManager_.container)));
		return a
	};
	s7sdk.ImageMapEffect = s7sdk.image.ImageMapEffect
}
if (!s7sdk.ImageMapUtil) {
	s7sdk.ImageMapUtil = {
		getPosition : function(b) {
			var a = 0;
			var c = 0;
			while (b != document) {
				a += b.offsetLeft;
				c += b.offsetTop;
				b = b.parentNode
			}
			return new s7sdk.Point2D(a, c)
		},
		parseMapAreaArray : function(d) {
			var e = new Array();
			for ( var b = 0; b < d.length; b++) {
				var c = d[b];
				for ( var a = 0; a < c.coords.length; a++) {
					c.coords[a] = parseInt(c.coords[a])
				}
				e.push(new s7sdk.MapDesc(c.shape, c.coords, c.alt, c.href,
						c.rollover_key, c.target))
			}
			return e
		}
	}
}
if (!s7sdk.ShapeInfo) {
	s7sdk.ShapeInfo = function ShapeInfo(a, b) {
		this.centroid = a;
		this.area = b
	}
};