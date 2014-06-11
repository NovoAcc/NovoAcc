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
s7sdk.pkg("s7sdk.set");
if (s7sdk.browser.name === "ie") {
	s7sdk.Util.require("s7sdk.image.rgn.View")
} else {
	s7sdk.Util.require("s7sdk.image.View")
}
s7sdk.Util.require("s7sdk.event.InputController");
s7sdk.Util.require("s7sdk.common.Enumeration");
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.common.IconEffect");
s7sdk.Util.require("s7sdk.event.Event");
s7sdk.Util.require("s7sdk.common.ItemDesc");
if (!s7sdk.set.PageView) {
	s7sdk.set.PageView = function PageView(a, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.set.PageView constructor - containerId: %0, settings: %1 , compId: %2",
						a, c, b);
		b = (typeof b == "string" && b.length) ? b : "PageView_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this,
				[ b, a, "div", "s7pageview", c ]);
		this.containerId = a;
		this.container = s7sdk.Util.byId(a);
		this.assetIsChanged = false;
		this.test = this.getParam("test", "");
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		this.wid = this.stagesize.width;
		this.hei = this.stagesize.height;
		if (this.wid == 0 || this.hei == 0) {
			this.wid = this.size.width;
			this.hei = this.size.height
		}
		this.startupFrame = 0;
		if (this.wid == 0 || this.hei == 0) {
			this.wid = parseInt(s7sdk.Util.css.getCss("s7pageview", "width", b,
					null, this.container));
			this.hei = parseInt(s7sdk.Util.css.getCss("s7pageview", "height",
					b, null, this.container));
			if (!s7sdk.Util.isNumber(this.wid)
					|| !s7sdk.Util.isNumber(this.hei) || this.wid <= 0
					|| this.hei <= 0) {
				if ("clientHeight" in this.container
						&& "clientWidth" in this.container) {
					this.wid = this.container.clientWidth;
					this.hei = this.container.clientHeight
				}
				if (this.wid == 0 || this.hei == 0) {
					this.wid = 400;
					this.hei = 400
				}
			}
		}
		if (this.iscommand == "") {
			this.iscommand = this.modifier
		}
		this.locale = this.getParam("locale", "");
		this.dir = this.direction == "auto" ? this.locale == "ja"
				: this.direction != "left";
		this.bgColor = s7sdk.Util.css.getCss("s7pageview", "background-color",
				this.id, null, this.container);
		this.bgColor = s7sdk.Util.convertColor(this.bgColor, "flash");
		this.clickToZoom = 0;
		if ((/reset/i).test(this.singleclick)) {
			this.clickToZoom |= s7sdk.Enum.CLICK_STATE.CLICK_TO_RESET
		}
		if ((/zoom/i).test(this.singleclick)) {
			this.clickToZoom |= s7sdk.Enum.CLICK_STATE.CLICK_TO_ZOOM
		}
		if ((/reset/i).test(this.doubleclick)) {
			this.clickToZoom |= s7sdk.Enum.CLICK_STATE.DOUBLE_CLICK_TO_RESET
		}
		if ((/zoom/i).test(this.doubleclick)) {
			this.clickToZoom |= s7sdk.Enum.CLICK_STATE.DOUBLE_CLICK_TO_ZOOM
		}
		if (this.enableHD.enable.toLowerCase() == "always") {
			this.enableHD.maxHdPixels = -1
		} else {
			if (this.enableHD.enable.toLowerCase() == "never") {
				this.enableHD.maxHdPixels = 0
			} else {
				if (this.enableHD.enable.toLowerCase() == "limit") {
					if (NaN == this.enableHD.maxHdPixels) {
						this.enableHD.maxHdPixels = 2250000
					} else {
						this.enableHD.maxHdPixels = this.enableHD.maxHdPixels
								* this.enableHD.maxHdPixels
					}
				} else {
					this.enableHD.maxHdPixels = 2250000
				}
			}
		}
		this.devicePixelRatio = s7sdk.Util.adjustDevicePixelRatio(
				this.enableHD.maxHdPixels, this.hei, this.wid);
		this.viewProps = new Object();
		this.viewProps.fmt = this.fmt;
		this.viewProps.outHeight = this.hei * this.devicePixelRatio;
		this.viewProps.outWidth = this.wid * this.devicePixelRatio;
		this.viewProps.resetHeight = this.hei * this.devicePixelRatio;
		this.viewProps.resetWidth = this.wid * this.devicePixelRatio;
		this.viewProps.zoomStep = this.zoomStep.step;
		this.viewProps.limit = this.zoomStep.limit;
		this.viewProps.transitionTime = this.transition.time;
		this.viewProps.bgColor = this.bgColor;
		this.viewProps.elasticZoom = this.elasticZoom;
		this.viewProps.clickToZoom = this.clickToZoom;
		this.totalWidth_ = this.wid;
		this.totalHeight_ = this.hei;
		this.pageFrames = null;
		this.createElement();
		if (this.container.tagName == "DIV"
				&& (!this.container.style.position || this.container.style.position == "static")) {
			this.container.style.position = "relative"
		}
		this.uid = s7sdk.Util.createUniqueId();
		this.container3 = this.prepareDiv();
		this.container3.id = "container3_" + this.uid;
		this.container3.setWidth(this.totalWidth_ * 3);
		this.container3.setHeight(this.totalHeight_);
		this.container3.style.zIndex = 0;
		this.container3.style.position = "absolute";
		this.container3.style.left = -this.totalWidth_ + "px";
		this.container3.style.top = 0 + "px";
		this.obj.appendChild(this.container3);
		this.spacing = 0;
		this.tempDisplay = new s7sdk.set.PVViewWrapper(this, 0, 0, 0, this.hei,
				0, this.spacing, 900);
		this.dLeft = new s7sdk.set.PVViewWrapper(this, this.wid, this.hei,
				this.wid, this.hei, 0, this.spacing, 900, this.devicePixelRatio);
		this.dCenter = new s7sdk.set.PVViewWrapper(this, this.wid, this.hei,
				this.wid, this.hei, 1, this.spacing, 910, this.devicePixelRatio);
		this.dRight = new s7sdk.set.PVViewWrapper(this, this.wid, this.hei,
				this.wid, this.hei, 2, this.spacing, 920, this.devicePixelRatio);
		this.dLeft.obj.id = "left" + this.uid;
		this.dCenter.obj.id = "center" + this.uid;
		this.dRight.obj.id = "right" + this.uid;
		this.container3.appendChild(this.tempDisplay.obj);
		this.container3.appendChild(this.dLeft.obj);
		this.container3.appendChild(this.dCenter.obj);
		this.container3.appendChild(this.dRight.obj);
		this.maxload = parseInt(this.maxloadradius);
		switch (this.frametransition.transition) {
		case "fade":
			this.dLeft.obj.style.left = this.totalWidth_ + "px";
			break;
		case "slide":
			this.maxload = this.maxload == 0 ? 1 : this.maxload;
			break;
		case "default":
		}
		if (this.container.firstChild) {
			this.container.insertBefore(this.obj, this.container.firstChild)
		} else {
			this.container.appendChild(this.obj)
		}
		this.addIE78overlay();
		this.setupInputController();
		this.loader = new s7sdk.set.PageFrameLoader(this);
		this.mediaSet_ = null;
		this.isReq_ = null;
		this.frame_ = 0;
		this.added = false;
		this.prevFrameIdx_ = -1;
		this.currentFrame = null;
		this.iconEffectObj = new s7sdk.IconEffect(this,
				this.iconEffect.enabled, this.iconEffect.count,
				this.iconEffect.fade, this.iconEffect.autoHide);
		this.iconEffectObj.iconEffectDiv_.style.zIndex = 1000;
		this.iconEffectVisible = true;
		this.iconEffectVisibility = {
			show : function() {
				self.iconEffectVisible = true;
				self.checkIconEffect()
			},
			hide : function() {
				self.iconEffectVisible = false;
				self.checkIconEffect()
			}
		};
		this.isNewLayout = true;
		this.splitFrames = false;
		this.setAsset(this.asset);
		this.isFirst = true
	};
	s7sdk.Class.inherits("s7sdk.set.PageView", "s7sdk.UIComponent");
	s7sdk.set.PageView.prototype.modifiers = {
		serverUrl : {
			params : [ "isRootPath" ],
			defaults : [ "/is/image/" ]
		},
		asset : {
			params : [ "asset" ],
			defaults : [ "" ],
			parseParams : false
		},
		direction : {
			params : [ "direction" ],
			defaults : [ "auto" ],
			ranges : [ [ "auto", "left", "right" ] ]
		},
		maxloadradius : {
			params : [ "value" ],
			defaults : [ "1" ],
			ranges : [ "-1:" ]
		},
		iscommand : {
			params : [ "value" ],
			defaults : [ "" ],
			parseParams : false
		},
		zoomStep : {
			params : [ "step", "limit" ],
			defaults : [ 1, 1 ]
		},
		transition : {
			params : [ "time", "easing" ],
			defaults : [ 0.5, 0 ],
			ranges : [ "0:", "0:5" ],
			deprecated : true
		},
		singleclick : {
			params : [ "singleclick" ],
			defaults : [ "none" ],
			ranges : [ [ "none", "zoom", "reset", "zoomReset" ] ]
		},
		doubleclick : {
			params : [ "doubleclick" ],
			defaults : [ "zoomReset" ],
			ranges : [ [ "none", "zoom", "reset", "zoomReset" ] ]
		},
		iconEffect : {
			params : [ "enabled", "count", "fade", "autoHide" ],
			defaults : [ true, 1, 0.3, 3 ],
			ranges : [ , "-1:", "0:", "0:" ]
		},
		enableHD : {
			params : [ "enable", "maxHdPixels" ],
			defaults : [ "limit", 1500 ],
			ranges : [ [ "always", "never", "limit" ] ]
		},
		frametransition : {
			params : [ "transition", "duration" ],
			defaults : [ "slide", 0.3 ]
		},
		stagesize : {
			params : [ "width", "height" ],
			defaults : [ 0, 0 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		size : {
			params : [ "width", "height" ],
			defaults : [ 0, 0 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		modifier : {
			params : [ "modifier" ],
			defaults : [ "" ],
			deprecated : true
		},
		elasticZoom : {
			params : [ "elasticzoom" ],
			defaults : [ 0 ],
			ranges : [ "0.0:1.0" ],
			deprecated : true
		},
		fmt : {
			params : [ "fmt" ],
			defaults : [ "jpg" ],
			ranges : [ [ "jpg", "jpeg", "png", "png-alpha", "gif", "gif-alpha" ] ]
		},
		highResTileLimit : {
			params : [ "highResTileLimit" ],
			defaults : [ -1 ],
			deprecated : true
		}
	};
	s7sdk.set.PageView.prototype.addIE78overlay = function() {
		var a = document.createElement("div");
		a.className = "s7pageview";
		a.style.position = "absolute";
		a.style.top = "0px";
		a.style.left = "0px";
		a.style.width = this.wid + "px";
		a.style.height = this.hei + "px";
		a.style.backgroundColor = "rgb(0,0,0)";
		a.style.filter = "alpha(opacity =0)";
		a.style.opacity = 0;
		this.ovrl = a;
		this.obj.appendChild(a)
	};
	s7sdk.set.PageView.prototype.checkIconEffect = function() {
		if (this.iconEffectObj.enabled) {
			if (!this.iconEffectVisible
					|| (this.currentFrame && this.currentFrame.view && (this.currentFrame.view.state & 4))) {
				this.iconEffectObj.hide()
			} else {
				if (this.iconEffectVisible) {
					this.iconEffectObj.show(this.wid, this.hei)
				}
			}
		}
	};
	s7sdk.set.PageView.prototype.setupInputController = function() {
		var a = this;
		this.handler = new s7sdk.InputController(this.ovrl);
		this.handler.singleTapCallback = function(c, b, d) {
			a.doTapAction(b, d, c.shiftKey, false);
			s7sdk.Event.dispatch(a.obj, s7sdk.Event.CLICK, false)
		};
		this.handler.doubleTapCallback = function(c, b, d) {
			a.doTapAction(b, d, c.shiftKey, true)
		};
		this.handler.startTouchCallback = function(c, b, d) {
			a.mouseDown(b, d)
		};
		this.handler.endTouchCallback = function(c, b, d) {
			a.mouseUp(b, d, new Date().getTime())
		};
		this.handler.swipeCallback = function(c) {
			var b = a.getCurrentView();
			if (b) {
				if (!(b.state & 4)) {
				} else {
					b.inPan = false;
					b.doPan(0, 0, false);
					a.invalidate();
					var d = new s7sdk.UserEvent(s7sdk.UserEvent.PAN, [], true);
					s7sdk.Event.dispatch(a.obj, d, false)
				}
				a.setInPan(false)
			}
		};
		this.handler.dragCallback = function(f, b, g, e, d) {
			var c = a.getCurrentView();
			if (c) {
				if (!(c.state & 4)) {
					a.mouseMove(b, g, new Date().getTime());
					c.inPan = false;
					a.setInPan(a.frametransition.transition == "slide" ? true
							: false)
				} else {
					a.mouseMove(b, g, new Date().getTime());
					c.inPan = true;
					c.doPan(e, d, true);
					a.setInPan(true)
				}
			}
		};
		this.handler.endDragCallback = function(f, b, h, e, d) {
			var c = a.getCurrentView();
			if (c) {
				c.inPan = false;
				c.doPan(0, 0, false);
				a.invalidate();
				var g = new s7sdk.UserEvent(s7sdk.UserEvent.PAN, [], true);
				s7sdk.Event.dispatch(a.obj, g, false);
				a.setInPan(false)
			}
		};
		this.handler.pinchCallback = function(d, b, f, e) {
			var c = a.getCurrentView();
			if (c) {
				b -= s7sdk.Util.getObjPos(a.obj).x;
				f -= s7sdk.Util.getObjPos(a.obj).y;
				c.inPinch = true;
				c.pinchZoom(b, f, e, c.viewToImage)
			}
		};
		this.handler.endPinchCallback = function(d, b, f, e) {
			var c = a.getCurrentView();
			if (c) {
				c.inPinch = false;
				c.invalidate(false);
				a.invalidate()
			}
		}
	};
	s7sdk.set.PageView.prototype.doTapAction = function(a, g, d, f) {
		var c = this.getCurrentView();
		if (c) {
			var b = f ? s7sdk.Enum.CLICK_STATE.DOUBLE_CLICK_TO_ZOOM
					: s7sdk.Enum.CLICK_STATE.CLICK_TO_ZOOM;
			var e = f ? s7sdk.Enum.CLICK_STATE.DOUBLE_CLICK_TO_RESET
					: s7sdk.Enum.CLICK_STATE.CLICK_TO_RESET;
			a -= s7sdk.Util.getObjPos(this.obj).x;
			g -= s7sdk.Util.getObjPos(this.obj).y;
			if (this.clickToZoom & b) {
				if (this.clickToZoom & e && !(c.state & 1)) {
					c.zoomReset()
				} else {
					c.zoomClick(a, g, d)
				}
			} else {
				if (this.clickToZoom & e) {
					c.zoomReset()
				}
			}
		}
	};
	s7sdk.set.PageView.prototype.mouseMove = function(a, d, b) {
		if ((this.currentFrame.view.state & 4) == 0
				&& this.frametransition.transition == "slide") {
			var c = (-this.totalWidth_ + a - this.lastX);
			if (this.currentFrame.idx == this.pageFrames.length - 1
					&& (a - this.lastX) < 0) {
				return
			} else {
				if (this.currentFrame.idx == 0 && (a - this.lastX) > 0) {
					return
				}
			}
			this.containerMove(c)
		}
		this.mouseInmove = true
	};
	s7sdk.set.PageView.prototype.mouseDown = function(b, d) {
		var a = this;
		this.__mouseUp = function(f) {
			a.onDocumentClicked(f)
		};
		this.__mouseTouchend = function(f) {
			a.onDocumentClicked(f)
		};
		s7sdk.Event
				.removeDOMListener(document, "mouseup", this.__mouseUp, true);
		s7sdk.Event.removeDOMListener(document, "touchend",
				this.__mouseTouchend, true);
		s7sdk.Event.addDOMListener(document, "mouseup", this.__mouseUp, true);
		s7sdk.Event.addDOMListener(document, "touchend", this.__mouseTouchend,
				true);
		var c = new Date();
		this.startTimeChk = c.getTime();
		this.mouseInmove = false;
		this.lastX = b;
		this.lastY = d;
		s7sdk.Logger.log(s7sdk.Logger.FINEST,
				"s7sdk.set.PageView.mouseDown - x: %0, y: %1", b, d);
		this.mouseIsDown = true;
		return false
	};
	s7sdk.set.PageView.prototype.onDocumentClicked = function(b) {
		var a = this;
		setTimeout(function() {
			a.mouseUpCheck()
		}, 0)
	};
	s7sdk.set.PageView.prototype.mouseUpCheck = function() {
		if (this.mouseIsDown) {
			this.mouseUp(this.lastX, this.lastY, new Date().getTime());
			this.handler.stop(this.dCenter.displayElement);
			this.currentFrame.view.inPan = false;
			this.currentFrame.invalidate()
		} else {
		}
	};
	s7sdk.set.PageView.prototype.mouseUp = function(i, g, d) {
		s7sdk.Event
				.removeDOMListener(document, "mouseup", this.__mouseUp, true);
		s7sdk.Event.removeDOMListener(document, "touchend",
				this.__mouseTouchend, true);
		if (this.mouseInmove && (this.currentFrame.view.state & 4) == 0
				&& this.frametransition.transition == "slide") {
			if (typeof (this.animate) == "undefined") {
				this.animate = new s7sdk.set.SlideAnimation(this,
						this.frametransition.duration)
			}
			var h = parseFloat(this.container3.style.left.replace("px", ""));
			var c;
			var f;
			var b = h + this.totalWidth_;
			var j = this.lastX - i;
			var a = (d - this.startTimeChk) < 150 && this.mouseInmove
					&& Math.abs(j) > 1;
			if (Math.abs(b) > (this.totalWidth_ / 2 + 10) || a) {
				if (a) {
					b = -j
				}
				var e;
				if (b < 0) {
					c = h / this.totalWidth_ + 1;
					e = this.getFrameByIdx(this.currentFrame.idx + 1)
				} else {
					c = -(h + this.totalWidth_) / this.totalWidth_;
					e = this.getFrameByIdx(this.currentFrame.idx - 1)
				}
				if ((!(this.currentFrame.idx == 0 && (e.idx == this.pageFrames.length - 1)) && !(this.currentFrame.idx == (this.pageFrames.length - 1) && e.idx == 0))
						|| (this.pageFrames.length == 2)) {
					this.nextFrame = e;
					this.loader.processed.idx = this.nextFrame.idx;
					this.animate.startTransition(
							this.nextFrame.idx < this.currentFrame.idx, Math
									.abs(c), false);
					this.animate.custom = true
				}
			} else {
				if (b > 0) {
					c = h / this.totalWidth_ + 1;
					this.animate.startTransition(false, 1 - Math.abs(c), true);
					this.animate.custom = true
				} else {
					c = -(h + this.totalWidth_) / this.totalWidth_;
					this.animate.startTransition(true, 1 - Math.abs(c), true);
					this.animate.custom = true
				}
			}
		}
		this.mouseInmove = false;
		this.mouseIsDown = false
	};
	s7sdk.set.PageView.prototype.getCurrentView = function() {
		return this.currentFrame && this.currentFrame.view
	};
	s7sdk.set.PageView.prototype.createCanvas = function(a) {
		var b = s7sdk.View.createDisplay();
		b.id = a;
		b.width = this.wid * this.devicePixelRatio;
		b.height = this.hei * this.devicePixelRatio;
		b.style.position = "absolute";
		b.style.width = this.wid + "px";
		b.style.height = this.hei + "px";
		b.onselectstart = function() {
			return false
		};
		this.obj.appendChild(b);
		return b
	};
	s7sdk.set.PageView.prototype.loadAsset = function() {
		s7sdk.Logger.log(s7sdk.Logger.INFO, "s7sdk.set.PageView.loadAsset");
		var b = s7sdk.MediaSetParser.parseAssetForSetReq(this.assetName_);
		this.imageModifier = b.mod;
		var a = this.serverUrl + "/" + b.name;
		a += "?" + b.req;
		if (s7sdk.Util.isNonEmptyString(this.locale_)) {
			a += "&locale=" + this.locale_
		}
		if (this.isReq) {
			this.isReq.cancelHttpReq()
		}
		this.isReq_ = new s7sdk.IS(this.serverUrl, this.assetName_);
		this.isReq_.getHttpReq(a, function(d, c) {
			s7sdk.set.PageView.prototype.setRequestComplete.apply(c, [ d ])
		}, function(d, c) {
			s7sdk.set.PageView.prototype.setRequestError.apply(c, [ d ])
		}, this)
	};
	s7sdk.set.PageView.prototype.setRequestError = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.WARNING,
				"s7sdk.set.PageView.setRequestError %0", a)
	};
	s7sdk.set.PageView.prototype.setRequestComplete = function(c) {
		var b = c.set;
		if (b == null) {
			return
		}
		var a = s7sdk.MediaSetParser.parse(b, this.imageModifier);
		this.setMediaSet(a)
	};
	s7sdk.set.PageView.prototype.createPageFrames = function() {
		function e(h, g, i) {
			h += ((h.indexOf("?") == -1) ? "?" : "&") + g;
			h += (typeof i == "undefined") ? "" : "=" + i;
			return h
		}
		var f;
		var c = 0;
		this.pageFrames = [];
		for ( var a = 0; a < this.mediaSet_.items.length; a++) {
			var d = this.mediaSet_.items[a];
			if (typeof (d) == "undefined") {
				s7sdk.Logger
						.log(
								s7sdk.Logger.WARNING,
								"s7sdk.set.PageView - Malformed data in MediaSetDesc %0",
								this.mediaSet_.name);
				continue
			}
			f = d.name || "";
			f = f.trim();
			if (this.iscommand != null && this.iscommand.length > 0) {
				f = e(f, "layer", "comp");
				f = e(f, this.iscommand)
			}
			if (s7sdk.Util.isNonEmptyString(this.locale)) {
				f = e(f, "locale", this.locale)
			}
			if (s7sdk.Util.isNonEmptyString(d.version)) {
				f = e(f, "id", d.version)
			}
			var b = this.dir ? (this.mediaSet_.items.length - 1 - c) : c;
			this.pageFrames[b] = new s7sdk.set.PageFrame(this, this.serverUrl,
					f, b, this.viewProps, d.width, d.height,
					this.splitFrames ? 0 : d.np ? (this.dir ? (c == 0 ? 1 : 2)
							: (c == 0 ? 2 : 1)) : 0, d.label);
			c++
		}
		this.settings.trackLoad(this);
		this.isstartFrame = true;
		this.startupFrame = this.startupFrame >= this.pageFrames.length ? 0
				: (this.startupFrame <= 0 ? 0 : this.startupFrame);
		this.loadFrames(this.startupFrame, true);
		this.assetIsChanged = true;
		this.isNewLayout = true
	};
	s7sdk.set.PageView.prototype.notifyAssetChanded = function() {
		if (this.currentFrame && this.currentFrame.view) {
			this.cursorChange(this.currentFrame.view.state)
		}
		if (!this.assetIsChanged) {
			return
		}
		this.assetIsChanged = false;
		var a = this;
		setTimeout(function() {
			var b = new s7sdk.event.AssetEvent(
					s7sdk.event.AssetEvent.ASSET_CHANGED, a.mediaSet_,
					a.currentFrame ? a.currentFrame.idx : 0, true);
			s7sdk.Event.dispatch(a.obj, b, false)
		}, 0)
	};
	s7sdk.set.PageView.prototype.loadFrames = function(b, c) {
		this.frame_ = b;
		if (this.inprogress) {
			return
		}
		var a = this.getFrameIdx(this.frame_);
		this.nextFrame = this.getFrameByIdx(a);
		this.nextFrame.transition = c;
		if (this.frametransition.transition == "slide") {
			this.inprogress = this.loader.load([
					this.getFrameByIdx((a - 1) < 0 ? 0 : (a - 1)),
					this.nextFrame,
					this.getFrameByIdx(((a + 1) >= this.pageFrames.length) ? a
							: a + 1) ], a, this.maxload == 1)
		} else {
			this.inprogress = this.loader.load([ this.nextFrame ], a)
		}
	};
	s7sdk.set.PageView.prototype.getFrameByIdx = function(a) {
		return this.pageFrames[this.getFrameIdx(a)]
	};
	s7sdk.set.PageView.prototype.getFrameIdx = function(a) {
		if (a < 0) {
			a = this.pageFrames.length + a % this.pageFrames.length
		}
		return a % this.pageFrames.length
	};
	s7sdk.set.PageView.prototype.invalidate = function() {
		if (this.currentFrame != null && this.frameInvalidated == false) {
			this.currentFrame.setTileRender(true);
			this.currentFrame.setDelayTileLoad(false);
			this.currentFrame.invalidate();
			this.frameInvalidated = true
		}
	};
	s7sdk.set.PageView.prototype.onResetImageLoaded = function(c, a) {
		if (this.loader.toLoad != 0) {
			return
		}
		if (!c) {
			this.inprogress = false;
			return
		}
		if (typeof (this.currentFrame) != "undefined"
				&& this.currentFrame != null) {
			if (this.pageFrames.length < 2) {
				return
			}
			this.dCenter.obj.style.display = "block";
			this.setOpacity(this.dCenter.obj, 1);
			switch (this.frametransition.transition) {
			case "fade":
				this.attachView(this.dLeft, this.nextFrame);
				this
						.dispatchTransitionEvent(s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_START);
				var b = this.currentFrame.view;
				b.targetViewToImage = b.resetView();
				b.viewToImage = b.targetViewToImage.clone();
				b.calcRes();
				b.invalidate(false);
				this.centerDivider.obj.style.display = "block";
				this.centerDivider.obj.style.visibility = "inherit";
				if (typeof (this.animate) == "undefined") {
					this.animate = new s7sdk.set.SlideAnimation(this,
							this.frametransition.duration)
				}
				this.animate.startTransition(true, 0, false);
				break;
			case "slide":
				if (typeof (this.animate) == "undefined") {
					this.animate = new s7sdk.set.SlideAnimation(this,
							this.frametransition.duration)
				}
				if (this.nextFrame.idx < this.currentFrame.idx) {
					this.attachView(this.dLeft, this.nextFrame)
				} else {
					this.attachView(this.dRight, this.nextFrame)
				}
				this.animate.startTransition(
						this.nextFrame.idx < this.currentFrame.idx, 0, false);
				this.nextFrame.transtion = false;
				break;
			default:
				this.attachView(this.dLeft, this.nextFrame);
				this.replaceFrame(true)
			}
		} else {
			this.currentFrame = this.nextFrame;
			this.notifyAssetChanded();
			switch (this.frametransition.transition) {
			case "fade":
				this.centerDivider.obj.style.display = "block";
				this.attachView(this.dLeft, this.currentFrame);
				this
						.dispatchTransitionEvent(s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_START);
				if (typeof (this.animate) == "undefined") {
					this.animate = new s7sdk.set.SlideAnimation(this,
							this.frametransition.duration)
				}
				this.animate.startTransition(true, 0, false);
				break;
			case "slide":
				this
						.dispatchTransitionEvent(s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_START);
				this.attachView(this.dCenter, this.currentFrame);
				this.prevFrameIdx_ = this.currentFrame.idx;
				this.replaceFrame(true);
				break;
			default:
				this.prevFrameIdx_ = this.currentFrame.idx;
				this.attachView(this.dCenter, this.currentFrame);
				this.replaceFrame(true)
			}
		}
	};
	s7sdk.set.PageView.prototype.dispatchTransitionEvent = function(d) {
		if (this.isFirst) {
			if (d == s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_END) {
				this.isFirst = false
			}
			return
		}
		var b = this.dir ? this.mediaSet_.items.length - 1
				- this.currentFrame.idx : this.currentFrame.idx;
		var a = this.mediaSet_.items[this.currentFrame.idx];
		var c = new s7sdk.event.FrameEvent(d, a.name, b, false);
		s7sdk.Event.dispatch(this.obj, c, false)
	};
	s7sdk.set.PageView.prototype.attachView = function(a, b) {
		b.view.detach();
		b.view.attach(a)
	};
	s7sdk.set.PageView.prototype.setOpacity = function(b, a) {
		if (s7sdk.browser.name == "ie") {
			if ((s7sdk.browser.version.minor > 5.5)
					&& (s7sdk.browser.version.minor <= 8)
					&& (document.body.filters)) {
				if (b.id == "left" || b.id == "center") {
					b.style.filter = "alpha(opacity =" + (a * 100) + ")";
					return
				}
			} else {
				b.style.opacity = a
			}
		} else {
			b.style.opacity = a
		}
	};
	s7sdk.set.PageView.prototype.animationFinalStep = function() {
		if (this.animate.reverse || this.frametransition.transition != "slide") {
			return
		}
		if (this.animate.direction) {
			this.container3.style.left = 0 + "px"
		} else {
			this.container3.style.left = -2 * this.totalWidth_ + "px"
		}
	};
	s7sdk.set.PageView.prototype.animationStop = function() {
		this.isstartFrame = false;
		if (this.frametransition.transition == "slide") {
			if (this.animate.reverse) {
				this.animate.reverse = false;
				this.animate.custom = false;
				this.container3.style.left = -this.totalWidth_ + "px";
				this.moved = false;
				this
						.dispatchTransitionEvent(s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_END);
				return
			}
			if (!this.animate.custom) {
				this.container3.style.left = -this.totalWidth_ + "px";
				this.replaceFrame(true)
			} else {
				this.animate.custom = false;
				this.replaceFrame(false)
			}
		} else {
			if (!this.animate.custom) {
				this.replaceFrame(true)
			} else {
				this.animate.custom = false;
				this.replaceFrame(false)
			}
		}
		this.checkIconEffect()
	};
	s7sdk.set.PageView.prototype.containerMove = function(a) {
		this.container3.style.left = a + "px";
		if (a != -this.totalWidth_ && !this.moved) {
			this.moved = true;
			this
					.dispatchTransitionEvent(s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_START)
		}
	};
	s7sdk.set.PageView.prototype.replaceFrame = function(c) {
		this.inprogress = false;
		if (this.pageFrames.length > 1) {
			if (this.currentFrame != null && this.currentFrame.view != null) {
				this.currentFrame.view.zoomReset();
				this.currentFrame.view.writeOverlay(null);
				this.currentFrame.unload(1);
				if (this.currentFrame.view.getDisplayElement() != null) {
					this.currentFrame.view.getDisplayElement().s7pageView = null;
					this.currentFrame.view.detach()
				}
			}
		}
		this.currentFrame = this.nextFrame;
		this.notifyAssetChanded();
		this.frameInvalidated = false;
		this.attachView(this.dCenter, this.currentFrame);
		this.currentFrame.view.invalidated = true;
		this.currentFrame.view.isClearted = false;
		this.currentFrame.view.draw();
		if (this.frametransition.transition == "slide") {
			this.container3.style.left = -this.totalWidth_ + "px"
		}
		if (this.centerDivider.obj.style.display == "none") {
			this.centerDivider.obj.style.display = "block"
		}
		var b = this;
		var a = 0;
		if (s7sdk.browser.device.name == "android"
				&& s7sdk.browser.device.version == "4") {
			a = 60
		}
		setTimeout(function() {
			b.replaceFrameDelayed(c)
		}, a)
	};
	s7sdk.set.PageView.prototype.replaceFrameDelayed = function(f) {
		this.inprogress = false;
		if (this.pageFrames.length > 1) {
			var a = this.getFrameByIdx(this.nextFrame.idx + 1);
			var g;
			if (a.view) {
				this.attachView(this.dRight, a);
				g = this.getDividerPosition(this.dRight.displayElement.view);
				this.rightDivider.obj.style.top = g.top + "px";
				this.rightDivider.obj.style.height = g.height + "px";
				this.rightDivider.obj.style.visibility = "inherit";
				a.view.invalidated = true;
				a.view.isClearted = false;
				a.view.draw()
			}
			a = this.getFrameByIdx(this.nextFrame.idx - 1);
			if (a.view) {
				this.attachView(this.dLeft, a);
				g = this.getDividerPosition(this.dLeft.displayElement.view);
				this.leftDivider.obj.style.top = g.top + "px";
				this.leftDivider.obj.style.height = g.height + "px";
				if (this.frametransition.transition != "fade") {
					this.leftDivider.obj.style.visibility = "inherit"
				} else {
					this.setOpacity(this.dLeft.obj, 0)
				}
				a.view.isClearted = false;
				a.view.invalidated = true;
				a.view.draw()
			}
		}
		if (this.frametransition.transition == "fade") {
			this.centerDivider.obj.style.visibility = "inherit"
		}
		this.setOpacity(this.dCenter.obj, 1);
		this.dCenter.obj.style.display = "block";
		this.frame = this.currentFrame.idx;
		this.invalidate();
		if (this.prevFrameIdx_ != this.currentFrame.idx
				|| this.currentFrame.idx == 0 || this.isNewLayout) {
			var c = this.dir ? this.mediaSet_.items.length - 1
					- this.currentFrame.idx : this.currentFrame.idx;
			this.viewStateChange(this.getCapabilityState());
			var b = this.mediaSet_.items[this.currentFrame.idx];
			var e = new s7sdk.event.AssetEvent(
					s7sdk.event.AssetEvent.ITEM_SELECTED_EVENT, b, c, true);
			this.dispatchEvent(e);
			this.dispatchEvent(new s7sdk.event.UserEvent(
					s7sdk.event.UserEvent.PAGE, [ c,
							typeof (b.label) != "undefined" ? b.label : "" ]));
			this.isNewLayout = false;
			this.prevFrameIdx_ = this.currentFrame.idx
		}
		if (f) {
			var d = this;
			if (this.frame_ != this.currentFrame.idx) {
				setTimeout(function() {
					d.loadFrames(d.frame_, true)
				}, 0)
			}
		} else {
			this.frame_ = this.currentFrame.idx
		}
		this.moved = false;
		this
				.dispatchTransitionEvent(s7sdk.event.FrameEvent.NOTF_FRAME_TRANSITION_END)
	};
	s7sdk.set.PageView.prototype.animationStart = function() {
	};
	s7sdk.set.PageView.prototype.animationStep = function(d, a, b) {
		if (this.frametransition.transition == "slide") {
			this.containerMove((b ? (a ? -this.totalWidth_ : this.totalWidth_)
					: 0)
					- this.totalWidth_ * (1 + ((a) ? -1 : 1) * d))
		} else {
			this.setOpacity(this.dCenter.obj, 1 - d);
			this.setOpacity(this.dLeft.obj, d);
			if (s7sdk.browser.device.name == "android"
					&& s7sdk.browser.device.version == "4") {
				this.container3.style.display = "none";
				var c = this.container3.offsetWidth;
				this.container3.style.display = "block"
			}
		}
	};
	s7sdk.set.PageView.prototype.drawChild = function() {
		this.setDividerPosition()
	};
	s7sdk.set.PageView.prototype.viewInvalidate = function(j) {
		if (this.currentFrame == null) {
			return
		}
		var h = this.currentFrame.view;
		var c = new s7sdk.Rectangle(Math.round(j.x * h.imageWidth), Math
				.round(j.y * h.imageHeight),
				Math.round(j.width * h.imageWidth), Math.round(j.height
						* h.imageHeight));
		if (!this.lastViewPort || this.lastViewPort.isEmpty()) {
			this.lastViewPort = j
		} else {
			if (j.equals(this.lastViewPort) && !this.pvResized) {
				return
			}
		}
		this.pvResized = false;
		this.lastViewPort = j;
		s7sdk.Event.dispatch(this.obj, new s7sdk.ZoomRgnEvent(
				s7sdk.ZoomRgnEvent.NOTF_ZOOM_NRGN, j), false);
		s7sdk.Event.dispatch(this.obj, new s7sdk.ZoomRgnEvent(
				s7sdk.ZoomRgnEvent.NOTF_ZOOM_RGN, c), false);
		var b = this.imagePixelsToViewPoint(c.topLeft());
		var a = this.imagePixelsToViewPoint(c.bottomRight());
		var d = (a.y - b.y) / (j.height * h.imageHeight);
		d = Math.round((d + 0.00005) * 10000) / 100;
		if (d != this.lastScale) {
			if (!h.inTransition) {
			}
			this.lastScale = d
		} else {
			var f = this.imagePixelsToViewPoint(new s7sdk.Point2D(Math
					.round(this.lastViewPort.x * h.imageWidth), Math
					.round(this.lastViewPort.y * h.imageHeight)));
			var k = Math.round(f.x - b.x);
			var i = Math.round(f.y - b.y);
			if (k != 0 || i != 0) {
				var g = new s7sdk.event.ZoomPanEvent(
						s7sdk.event.ZoomPanEvent.NOTF_ZOOM_NPAN,
						this.lastViewPort.x - j.x, this.lastViewPort.y - j.y);
				s7sdk.Event.dispatch(this.obj, g, false);
				g = new s7sdk.event.ZoomPanEvent(
						s7sdk.event.ZoomPanEvent.NOTF_ZOOM_PAN, k, i);
				s7sdk.Event.dispatch(this.obj, g, false)
			}
		}
		this.lastViewPort = j
	};
	s7sdk.set.PageView.prototype.getDividerPosition = function(g) {
		var i = {};
		var h = g.viewToImage.clone();
		h.invert();
		var d = h.transformPoint(new s7sdk.Point2D(0, 0));
		var c = h.transformPoint(new s7sdk.Point2D(1, 1));
		var e = new s7sdk.Rectangle(d.x, d.y, c.x - d.x, c.y - d.y);
		if (typeof (e) != "undefined") {
			i.left = e.x + (g.align != 0 ? (g.align != 1 ? 0 : 2) : 1)
					* e.width / 2
		}
		var f = new s7sdk.Rectangle(0, 0, g.w, g.h);
		var a = e.intersection(f);
		var b = a.intersection(f);
		if (typeof (b) != "undefined") {
			i.top = b.y;
			i.height = b.height
		}
		i.top /= this.devicePixelRatio;
		i.left /= this.devicePixelRatio;
		i.height /= this.devicePixelRatio;
		return i
	};
	s7sdk.set.PageView.prototype.setDividerPosition = function() {
		if (this.currentFrame == null || this.currentFrame.view == null) {
			return
		}
		var a = this.getDividerPosition(this.currentFrame.view);
		this.centerDivider.obj.style.left = (a.left + this.totalWidth_ - this.dividerW)
				+ "px";
		this.centerDivider.obj.style.top = a.top + "px";
		this.centerDivider.obj.style.height = a.height + "px";
		this.centerDivider.obj.style.visibility = "inherit";
		if (typeof (this.dLeft.displayElement.view) != "undefined"
				&& this.dLeft.displayElement.view != null
				&& this.frametransition.transition == "slide") {
			a = this.getDividerPosition(this.dLeft.displayElement.view);
			this.leftDivider.obj.style.left = a.left - this.dividerW + "px";
			this.leftDivider.obj.style.top = a.top + "px";
			this.leftDivider.obj.style.height = a.height + "px";
			this.leftDivider.obj.style.visibility = "inherit"
		} else {
			this.leftDivider.obj.style.visibility = "hidden"
		}
		if (typeof (this.dRight.displayElement.view) != "undefined"
				&& this.dRight.displayElement.view != null
				&& this.frametransition.transition == "slide") {
			a = this.getDividerPosition(this.dRight.displayElement.view);
			this.rightDivider.obj.style.left = (a.left + 2 * this.totalWidth_ - this.dividerW)
					+ "px";
			this.rightDivider.obj.style.top = a.top + "px";
			this.rightDivider.obj.style.height = a.height + "px";
			this.rightDivider.obj.style.visibility = "inherit"
		} else {
			this.rightDivider.obj.style.visibility = "hidden"
		}
	};
	s7sdk.set.PageView.prototype.imagePixelsToViewPoint = function(b) {
		if (this.currentFrame == null || this.currentFrame.view == null) {
			return new s7sdk.Point2D(Number.POSITIVEINFINITY,
					Number.POSITIVEINFINITY)
		}
		var a = this.currentFrame.view.imagePixelsToViewPoint(b);
		return a
	};
	s7sdk.set.PageView.prototype.viewTransitionStop = function() {
		if (this.lastSended == this.lastScale) {
			return
		}
		this.lastSended = this.lastScale;
		var a = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.ZOOM, [ Math
				.round(this.lastScale) ], true);
		s7sdk.Event.dispatch(this.obj, a, false)
	};
	s7sdk.set.PageView.prototype.setInPan = function(a) {
		if (this.viewState & 4) {
			if (this.inPan != (a && (this.viewState & 4))) {
				this.inPan = a && (this.viewState & 4);
				this.cursorChange(this.currentFrame.view.state)
			}
		} else {
			if (this.frametransition.transition == "slide") {
				this.inPan = a;
				this
						.cursorChange(this.currentFrame.view.state
								| (a ? 2048 : 0))
			}
		}
	};
	s7sdk.set.PageView.prototype.cursorChange = function(d) {
		var b = [ "default", "zoomin", "reset", "drag", "slide" ];
		var a = d == 0 ? 0 : (this.inPan ? ((d & 2048) ? 4 : 3) : (d & 8 ? 1
				: 2));
		if (this.prevCur == a) {
			return
		}
		this.prevCur = a;
		s7sdk.Util.css.setCSSAttributeSelector(this.obj, "cursortype", b[a]);
		var c = this.obj.offsetWidth
	};
	s7sdk.set.PageView.prototype.viewStateChange = function(b) {
		var c = b;
		if (typeof (b) == "number") {
			c = this.getStateInternal(b)
		}
		if (this.viewState == c.state) {
			return
		}
		this.viewState = c.state;
		this.cursorChange(this.viewState);
		var a = new s7sdk.event.CapabilityStateEvent(
				s7sdk.event.CapabilityStateEvent.NOTF_PAGEVIEW_CAPABILITY_STATE,
				c);
		s7sdk.Event.dispatch(this.obj, a, false);
		this.checkIconEffect()
	};
	s7sdk.set.PageView.prototype.getCapabilityState = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageView.getCapabilityState");
		return this.getStateInternal(this.viewState)
	};
	s7sdk.set.PageView.prototype.getStateInternal = function(b) {
		var a = new s7sdk.PageViewCapabilityState(
				typeof (b) == "undefined" ? (this.currentFrame ? this.currentFrame.view.state
						: 0)
						: b);
		a.removeCapability(s7sdk.PageViewCapabilityState.FIRST_PAGE
				| s7sdk.PageViewCapabilityState.LAST_PAGE);
		if (this.currentFrame == null || this.currentFrame.idx == 0) {
			a.setCapability(s7sdk.PageViewCapabilityState.FIRST_PAGE)
		} else {
			if (this.currentFrame.idx == (this.pageFrames.length - 1)) {
				a.setCapability(s7sdk.PageViewCapabilityState.LAST_PAGE)
			}
		}
		return a
	};
	s7sdk.set.PageView.prototype.build = function() {
		if (!this.added) {
			this.container.appendChild(this.obj);
			this.leftDivider = new s7sdk.set.PageDivider(this.container3.id,
					940);
			this.dividerW = parseInt(s7sdk.Util.getStyle(this.leftDivider.obj,
					"width")) / 2;
			this.leftDivider.obj.style.visibility = "hidden";
			this.leftDivider.obj.style.left = (this.frametransition.transition == "fade" ? this.totalWidth_
					: 0)
					+ "px";
			this.centerDivider = new s7sdk.set.PageDivider(this.container3.id,
					940);
			this.centerDivider.obj.style.visibility = "hidden";
			this.rightDivider = new s7sdk.set.PageDivider(this.container3.id,
					940);
			this.rightDivider.obj.style.visibility = "hidden";
			this.added = true
		}
		if (this.splitFrames) {
			this.leftDivider.obj.style.width = "0px";
			this.centerDivider.obj.style.width = "0px";
			this.rightDivider.obj.style.width = "0px"
		} else {
			this.leftDivider.obj.style.width = this.dividerW * 2 + "px";
			this.centerDivider.obj.style.width = this.dividerW * 2 + "px";
			this.rightDivider.obj.style.width = this.dividerW * 2 + "px"
		}
	};
	s7sdk.set.PageView.prototype.cleanUp = function() {
		if (this.isReq_) {
			this.isReq_.cancelHttpReq();
			this.isReq_ = null
		}
		this.currentFrame = null;
		this.nextFrame = null;
		if (this.pageFrames != null && this.pageFrames.length != 0) {
			for ( var b = 0; b < this.pageFrames.length; b++) {
				var a = this.pageFrames[b];
				if (a.view != null) {
					a.view.onResetImageLoaded = s7sdk.Callback.noop
				}
			}
		}
		this.inprogress = false;
		this.loader.processed = [];
		this.toLoad = 0
	};
	s7sdk.set.PageView.prototype.getContainer = function() {
		return this.container
	};
	s7sdk.set.PageView.prototype.createElement = function() {
		s7sdk.UIComponent.prototype.createElement.apply(this, []);
		this.obj = this.prepareDiv(this.obj);
		this.obj.setWidth(this.totalWidth_);
		this.obj.setHeight(this.totalHeight_);
		this.obj.className = "s7pageview";
		if (this.test == "") {
			this.obj.style.overflow = "hidden"
		}
	};
	s7sdk.set.PageView.prototype.prepareDiv = function(a) {
		var b = (a && typeof a != "undefined") ? a : document
				.createElement("div");
		b.getX = function() {
			return b.x_
		};
		b.getY = function() {
			return b.y_
		};
		b.setX = function(c) {
			b.x_ = c;
			b.style.left = c + "px"
		};
		b.setY = function(c) {
			b.y_ = c;
			b.style.top = c + "px"
		};
		b.getWidth = function() {
			return b.width_
		};
		b.getHeight = function() {
			return b.height_
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
	s7sdk.set.PageView.prototype.resize = function(a, c) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageView.resize - w: %0, h: %1", a, c);
		if (a == this.wid && c == this.hei) {
			return
		}
		this.pvResized = true;
		this.wid = a > 0 ? a : 1;
		this.hei = c > 0 ? c : 1;
		this.devicePixelRatio = s7sdk.Util.adjustDevicePixelRatio(
				this.enableHD.maxHdPixels, this.hei, this.wid);
		this.viewProps.outWidth = this.wid * this.devicePixelRatio;
		this.viewProps.outHeight = this.hei * this.devicePixelRatio;
		this.totalWidth_ = this.wid;
		this.totalHeight_ = this.hei;
		this.container3.setWidth(this.totalWidth_ * 3);
		this.container3.setHeight(this.totalHeight_);
		this.container3.style.left = -this.totalWidth_ + "px";
		this.ovrl.style.width = this.totalWidth_ + "px";
		this.ovrl.style.height = this.totalHeight_ + "px";
		this.rightDivider.obj.style.visibility = "hidden";
		this.centerDivider.obj.style.visibility = "hidden";
		this.leftDivider.obj.style.visibility = "hidden";
		this.obj.setWidth(this.totalWidth_);
		this.obj.setHeight(this.totalHeight_);
		this.dLeft.resize(this.viewProps.outWidth, this.viewProps.outHeight,
				this.wid, this.hei, this.devicePixelRatio);
		this.dCenter.resize(this.viewProps.outWidth, this.viewProps.outHeight,
				this.wid, this.hei, this.devicePixelRatio);
		this.dRight.resize(this.viewProps.outWidth, this.viewProps.outHeight,
				this.wid, this.hei, this.devicePixelRatio);
		if (this.currentFrame != null) {
			this.currentFrame.resize()
		}
		var d;
		for ( var b = 0; b < this.pageFrames.length; b++) {
			d = this.pageFrames[b];
			if (d != this.currentFrame) {
				d.resize()
			}
		}
		if (this.iconEffectObj.enabled) {
			this.iconEffectObj.centerOverlay(a, c)
		}
		this.dispatchEvent(new s7sdk.event.ResizeEvent(
				s7sdk.event.ResizeEvent.COMPONENT_RESIZE, a, c, false));
		s7sdk.UIComponent.prototype.resize.apply(this, [ a, c ])
	};
	s7sdk.set.PageView.prototype.addEventListener = function(c, b, a) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.set.PageView.addEventListener - type: %0, handler: %1, useCapture: %2",
						c,
						b.toString().substring(0, b.toString().indexOf("(")), a);
		s7sdk.Base.prototype.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.set.PageView.prototype.setAsset = function(c) {
		if (typeof c != "string") {
			throw new Error("Asset name must be represented by a string!")
		}
		if (c == "") {
			return
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageView.setAsset - assetName: %0", c);
		var a = unescape(c);
		if (this.assetName_ != null && a != this.assetName_) {
			var b = new s7sdk.UserEvent(s7sdk.UserEvent.SWAP, [ 0, c ], true);
			s7sdk.Event.dispatch(this.obj, b, false)
		}
		this.itemIndex_ = -1;
		this.filteredSet_ = [];
		this.assetName_ = a;
		this.loadAsset()
	};
	s7sdk.set.PageView.prototype.setMediaSet = function(b) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageView.setMediaSet - mediaSet: %0", b);
		if (b == null || typeof (b.items[0]) == "undefined") {
			return
		}
		this.mediaSet_ = b;
		if (parseInt(this.maxloadradius) == -1) {
			this.maxload = this.mediaSet_.items.length
		}
		this.cleanUp();
		this.startupFrame = this.dir ? (this.mediaSet_.items.length - 1) : 0;
		var a = this;
		setTimeout(function() {
			a.createPageFrames();
			a.build()
		}, 0)
	};
	s7sdk.set.PageView.prototype.setFrameTransition = function(a, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.set.PageView.setFrameTransition - frmTransition: %0, duration: %1",
						a, b);
		this.frametransition.transition = a == "slide" || a == "fade" ? a
				: "none";
		if (a == "fade") {
			this.dLeft.obj.style.left = this.totalWidth_ + "px";
			this.setOpacity(this.dLeft.obj, 0)
		} else {
			this.dLeft.obj.style.left = 0 + "px";
			this.setOpacity(this.dLeft.obj, 1)
		}
		if (typeof (b) != "undefined" && s7sdk.Util.isNumber(b)) {
			this.frametransition.duration = b
		}
	};
	s7sdk.set.PageView.prototype.nextPage = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "s7sdk.set.PageView.nextPage");
		if (this.dir) {
			this.prev_Page()
		} else {
			this.next_Page()
		}
	};
	s7sdk.set.PageView.prototype.next_Page = function() {
		if (this.pageFrames == null
				|| this.frame_ + 1 == this.pageFrames.length) {
			return
		}
		this.loadFrames(this.frame_ + 1, true)
	};
	s7sdk.set.PageView.prototype.prevPage = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "s7sdk.set.PageView.prevPage");
		if (this.dir) {
			this.next_Page()
		} else {
			this.prev_Page()
		}
	};
	s7sdk.set.PageView.prototype.prev_Page = function() {
		if (this.pageFrames == null || this.frame_ == 0) {
			return
		}
		this.loadFrames(this.getFrameIdx(this.frame_ - 1), true)
	};
	s7sdk.set.PageView.prototype.getCurrentFrameIndex = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageView.getCurrentFrameIndex");
		return this.currentFrame != null ? (this.dir ? this.mediaSet_.items.length
				- 1 - this.currentFrame.idx
				: this.currentFrame.idx)
				: -1
	};
	s7sdk.set.PageView.prototype.setCurrentFrameIndex = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageView.setCurrentFrameIndex - idx: %0", a);
		if (a >= 0 && this.mediaSet_) {
			var b = this.dir ? this.mediaSet_.items.length - 1 - a : a;
			if (!this.currentFrame) {
				this.startupFrame = b
			} else {
				if (b != this.currentFrame.idx) {
					this.loadFrames(this.getFrameIdx(b), true)
				}
			}
		}
	};
	s7sdk.set.PageView.prototype.zoomIn = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "s7sdk.set.PageView.zoomIn");
		if (this.currentFrame.view) {
			this.currentFrame.view.zoomIn()
		}
	};
	s7sdk.set.PageView.prototype.zoomOut = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "s7sdk.set.PageView.zoomOut");
		if (this.currentFrame.view) {
			this.currentFrame.view.zoomOut()
		}
	};
	s7sdk.set.PageView.prototype.zoomReset = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "s7sdk.set.PageView.zoomReset");
		if (this.currentFrame.view) {
			this.currentFrame.view.zoomReset()
		}
	};
	s7sdk.set.PageView.prototype.getFromRadius = function(a) {
		if (typeof (a) == "undefined") {
			return null
		}
		var c = null;
		this.inprogress = false;
		for ( var b = 0; b < this.maxload; b++) {
			if ((a + 1 + b) < this.pageFrames.length) {
				c = this.getFrameByIdx(a + 1 + b);
				if (c && !c.loaded && (a + 1 + b) < this.pageFrames.length) {
					return c
				}
			}
			if ((a - 1 - b) >= 0) {
				c = this.getFrameByIdx(a - 1 - b);
				if (c && !c.loaded && (a - 1 - b) >= 0) {
					return c
				} else {
					c = null
				}
			} else {
				c = null
			}
		}
		return c
	};
	s7sdk.set.PageView.prototype.setSplitFrames = function(a) {
		return this.splitFrames = a
	};
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = c(".s7pageview", {
			"background-color" : "#ffffff",
			position : "absolute",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + c(".s7pageview[cursortype='default']", {
			cursor : "default"
		}) + c(".s7pageview[cursortype='zoomin']", {
			cursor : "default"
		}) + c(".s7pageview[cursortype='reset']", {
			cursor : "default"
		}) + c(".s7pageview[cursortype='drag']", {
			cursor : "default"
		}) + c(".s7pageview[cursortype='slide']", {
			cursor : "default"
		}) + c(".s7pageview .s7iconeffect", {
			width : "120px",
			height : "120px",
			"-webkit-transform" : "translateZ(0px)",
			"background-repeat" : "no-repeat",
			"background-position" : "center"
		}) + c(".s7pageview .s7iconeffect[media-type='standard']", {
			"background-image" : b("doubletapicon.png")
		}) + c(".s7pageview .s7iconeffect[media-type='multitouch']", {
			"background-image" : b("zoomicon.png")
		});
		a += c(".s7pageview .s7pagedivider", {
			width : "40px",
			"background-image" : s7sdk.Util.css
					.createCssImgUrlText("divider.png")
		});
		s7sdk.Util.css.addDefaultCSS(a, "PageView")
	})()
}
if (!s7sdk.set.SlideAnimation) {
	s7sdk.set.SlideAnimation = function(c, a, b) {
		this.maxStep = 60;
		this.transitionTime = typeof (a) == "undefined" ? 5000 : a * 1000;
		this.transitionEasing = typeof (b) == "undefined" ? s7sdk.Enum.TRANSITION_EASING.AUTO
				: b;
		this.viewParent = c;
		this.shift = 0;
		this.testTime = null;
		this.shiftTime = 0
	};
	s7sdk.set.SlideAnimation.prototype.onEnterFrame = function() {
		if (this.isFinalStep) {
			this.isFinalStep = false;
			this.stopTransition();
			return false
		}
		var b = new Date();
		var c = b.getTime();
		var a;
		if (this.testTime == null) {
			this.testTime = c
		} else {
			this.testTime += 60
		}
		if (this.shift != 0) {
			a = this.calcStep(c);
			while (a < this.shift) {
				a = this.calcStep(c);
				this.shiftTime++;
				if (a == 0) {
					return true
				}
				if (a >= 1) {
					this.finalStep();
					this.isFinalStep = true;
					return true
				}
			}
			this.shift = 0
		} else {
			a = this.calcStep(c)
		}
		if (a == 0) {
			return true
		}
		if (a >= 1) {
			this.finalStep();
			this.isFinalStep = true;
			return true
		}
		if (this.viewParent != null && this.viewParent.animationStep != null) {
			this.viewParent.animationStep(a, this.direction, this.reverse)
		}
		return true
	};
	s7sdk.set.SlideAnimation.prototype.calcStep = function(b) {
		var a = (this.transitionTime != 0) ? (b + this.shiftTime - this.startTime)
				/ this.transitionTime
				: 1;
		if (a > this.prevStep + this.maxStep) {
			a = this.prevStep + this.maxStep
		}
		this.prevStep = a;
		if (a == 0) {
			return a
		}
		if (a >= 1) {
			return a
		}
		if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.AUTO) {
			if (this.elasticZoom > 0) {
				if (this.transitionTime >= 1500) {
					a = (a * (a - 2)) * -1
				} else {
					if (this.transitionTime > 1000) {
						a = (a -= 1) * a * a + 1
					} else {
						if (this.transitionTime > 500) {
							a = ((a -= 1) * a * a * a - 1) * -1
						} else {
							a = (a -= 1) * a * a * a * a + 1
						}
					}
				}
			}
		} else {
			if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.QUADRATIC) {
				a = (a * (a - 2)) * -1
			} else {
				if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.CUBIC) {
					a = (a -= 1) * a * a + 1
				} else {
					if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.QUARTIC) {
						a = ((a -= 1) * a * a * a - 1) * -1
					} else {
						if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.QUINTIC) {
							a = (a -= 1) * a * a * a * a + 1
						}
					}
				}
			}
		}
		return a
	};
	s7sdk.set.SlideAnimation.prototype.startTransition = function(d, a, b) {
		this.isFinalStep = false;
		var c = new Date();
		this.shiftTime = 0;
		this.direction = d;
		this.shift = a;
		this.reverse = b;
		this.custom = false;
		this.startTime = c.getTime();
		this.prevStep = 0;
		if (!this.inTransition) {
			s7sdk.Util.timeout(s7sdk.set.SlideAnimation.transitionHandler, 25,
					[ this ])
		}
		this.inTransition = true;
		if (this.viewParent != null && this.viewParent.animationStart != null) {
			this.viewParent.animationStart()
		}
	};
	s7sdk.set.SlideAnimation.transitionHandler = function(a) {
		var b = false;
		b = a.onEnterFrame();
		if (b) {
			s7sdk.Util.timeout(s7sdk.set.SlideAnimation.transitionHandler, 25,
					[ a ])
		}
	};
	s7sdk.set.SlideAnimation.prototype.finalStep = function() {
		if (this.inTransition) {
			if (this.viewParent != null
					&& this.viewParent.animationFinalStep != null) {
				this.viewParent.animationFinalStep()
			}
		}
	};
	s7sdk.set.SlideAnimation.prototype.stopTransition = function() {
		if (this.inTransition) {
			this.inTransition = false;
			if (this.viewParent != null
					&& this.viewParent.animationStop != null) {
				this.viewParent.animationStop()
			}
		}
	}
}
if (!s7sdk.set.PageDivider) {
	s7sdk.set.PageDivider = function(a, e, c, b, d) {
		arguments.callee.superclass.apply(this, [ b, a, "div", "s7pagedivider",
				c ]);
		this.parentObj = d;
		this.createElement();
		this.ctnr = document.getElementById(a);
		this.ctnr.appendChild(this.obj);
		this.obj.style.position = "absolute";
		this.obj.style.zIndex = e
	};
	s7sdk.Class.inherits("s7sdk.set.PageDivider", "s7sdk.UIComponent");
	(function addDefaultCSS() {
		var b = s7sdk.Util.css.createCssRuleText;
		var a = b(".s7pagedivider", {
			width : "40px",
			"background-image" : s7sdk.Util.css
					.createCssImgUrlText("divider.png")
		});
		s7sdk.Util.css.addDefaultCSS(a, "PageDivider")
	})()
}
if (!s7sdk.set.PageFrame) {
	s7sdk.set.PageFrame = function(c, d, e, h, a, b, f, i, g) {
		this.container = c;
		this.idx = h;
		this.imageName = e;
		this.serverUrl = d;
		this.viewProps = a;
		this.initWidth = b;
		this.initHeight = f;
		this.view = null;
		this.viewPort = null;
		this.notify = true;
		this.dragToPan = true;
		this.invalidated = false;
		this.tileRender = false;
		this.delayTileLoad = true;
		this.priority = 0;
		this.loaded = false;
		this.align = i;
		this.label = g;
		this.isReq = null;
		this.image = new Image();
		this.image.imageFrame = this
	};
	s7sdk.set.PageFrame.MAX_PRIORITY = 100;
	s7sdk.set.PageFrame.prototype.loadFrame = function() {
		if (this.view != null) {
			return
		}
		if (!this.loaded) {
			this.viewProps.width = this.initWidth;
			this.viewProps.height = this.initHeight;
			this.initView();
			s7sdk.Event.dispatch(this.image, s7sdk.Event.VIEW_LOADED, true);
			s7sdk.Event.addDOMListener(this.image, s7sdk.Event.RENDER,
					this.renderHandler, true);
			this.loaded = true
		}
	};
	s7sdk.set.PageFrame.prototype.initView = function() {
		with (this) {
			s7sdk.Logger.log(s7sdk.Logger.FINER,
					"PageFrame.initView - imageName: %0", imageName);
			this.view = new s7sdk.View(serverUrl + "/" + imageName,
					viewProps.width, viewProps.height, viewProps.resetWidth,
					viewProps.resetHeight, this.container.devicePixelRatio,
					viewProps.zoomStep, viewProps.limit,
					viewProps.transitionTime, 0, viewPort,
					viewProps.elasticZoom, viewProps.clickToZoom,
					viewProps.fmt, 0, true, this.idx, this.align);
			view.dragToPan = dragToPan;
			view.tileRender = tileRender;
			view.delayTileLoad = delayTileLoad;
			view.viewParent = this.container;
			this.container.viewStateChange(this.view.state);
			if (viewProps.resetHeight != viewProps.outHeight
					|| viewProps.resetWidth != viewProps.outWidth) {
				view.resize(viewProps.outWidth, viewProps.outHeight)
			}
			if (invalidated) {
				view.loadImage();
				view.invalidate();
				invalidated = false
			}
		}
	};
	s7sdk.set.PageFrame.prototype.resize = function() {
		if (this.view != null) {
			this.view.resize(this.viewProps.outWidth, this.viewProps.outHeight)
		}
	};
	s7sdk.set.PageFrame.prototype.renderHandler = function(a) {
		if (this.imageFrame.view != null) {
			this.imageFrame.view.draw()
		}
	};
	s7sdk.set.PageFrame.prototype.invalidate = function(a) {
		if (this.view != null) {
			this.view.tileRender = this.tileRender;
			this.view.loadImage();
			this.view.invalidate()
		} else {
			this.invalidated = true
		}
	};
	s7sdk.set.PageFrame.prototype.setDragToPan = function(a) {
		this.dragToPan = a;
		if (this.view != null) {
			this.view.dragToPan = a
		}
	};
	s7sdk.set.PageFrame.prototype.setDelayTileLoad = function(a) {
		if (this.view != null) {
			this.view.delayTileLoad = a
		}
		this.delayTileLoad = a
	};
	s7sdk.set.PageFrame.prototype.unload = function(a) {
		if (this.view != null) {
			this.view.unload(a)
		}
	};
	s7sdk.set.PageFrame.prototype.setTileRender = function(a) {
		if (this.view != null) {
			this.view.tileRender = a
		}
		this.tileRender = a
	};
	s7sdk.set.PageFrame.prototype.setPriority = function(a) {
		this.priority = (a < 1) ? 1
				: (a > s7sdk.set.PageFrame.MAX_PRIORITY) ? s7sdk.set.PageFrame.MAX_PRIORITY
						: a
	};
	s7sdk.set.PageFrame.prototype.getView = function() {
		return this.view
	};
	s7sdk.set.PageFrame.prototype.resetImageLoaded = function() {
		return this.view != null && this.view.resetImageLoaded
	}
}
if (!s7sdk.set.PageFrameLoader) {
	s7sdk.set.PageFrameLoader = function(a, b) {
		this.container = a;
		this.delay = (null == b) ? 100 : b;
		this.timer = setInterval(s7sdk.Util.wrapContext(this.onProcess, this),
				this.delay);
		this.queue = [];
		this.processed = [];
		this.toLoad = 0;
		this.frameToLoad = null
	};
	s7sdk.set.PageFrameLoader.prototype.load = function(c, a, b) {
		c.idx = a;
		c.noWait = b;
		this.queue.push(c);
		return true
	};
	s7sdk.set.PageFrameLoader.prototype.onProcess = function() {
		if (this.processed.length == 0) {
			if (this.queue.length != 0) {
				this.processed = this.queue.pop();
				this.toLoad = 0;
				this.queue = []
			} else {
				if (!this.frameToLoad) {
					this.frameToLoad = this.container
							.getFromRadius(this.processed.idx);
					if (this.frameToLoad && !this.frameToLoad.loaded) {
						this.frameToLoad.loadFrame();
						this.frameToLoad.setTileRender(false);
						this.frameToLoad.setDelayTileLoad(true)
					} else {
						this.frameToLoad = null
					}
				} else {
					if (this.frameToLoad && this.frameToLoad.loaded) {
						this.frameToLoad = null
					}
				}
			}
		}
		var a = [];
		while (this.processed.length != 0) {
			var b = this.processed.pop();
			if (!b.loaded) {
				b.loadFrame();
				if (b.view.resetImageLoaded) {
					a.push(b)
				} else {
					if (this.processed.noWait) {
						if (this.processed.idx == b.idx || b.idx == 0) {
							b.view.onResetImageLoaded = s7sdk.Util.wrapContext(
									this.onResetImageLoaded, this)
						} else {
							this.toLoad--
						}
					} else {
						b.view.onResetImageLoaded = s7sdk.Util.wrapContext(
								this.onResetImageLoaded, this)
					}
				}
				b.setTileRender(false);
				b.setDelayTileLoad(true);
				this.toLoad++
			} else {
				if (b.view.resetImageLoaded) {
					a.push(b);
					this.toLoad++
				}
			}
		}
		while (a.length != 0) {
			var b = a.pop();
			this.onResetImageLoaded(true, b.idx)
		}
	};
	s7sdk.set.PageFrameLoader.prototype.onResetImageLoaded = function(b, a) {
		this.toLoad--;
		this.container.onResetImageLoaded(b, a)
	}
}
if (!s7sdk.set.PVViewWrapper) {
	s7sdk.set.PVViewWrapper = function PVViewWrapper(c, a, j, i, d, b, e, f, g) {
		this.parentObj = c;
		this.leftPos = b;
		this.spacing = e;
		this.obj = s7sdk.Util.createObj(null, "div", null, null);
		this.obj.style.zIndex = f;
		this.displayElement = s7sdk.View.createDisplay();
		this.displayElement.width = a * g;
		this.displayElement.height = j * g;
		this.obj.style.position = "absolute";
		this.displayElement.style.width = this.obj.style.width = i + "px";
		this.displayElement.style.height = this.obj.style.height = d + "px";
		this.obj.style.left = b * (i + e) + "px";
		this.obj.style.width = (i + e) + "px";
		this.obj.appendChild(this.displayElement);
		this.loresIsloaded = false
	};
	s7sdk.set.PVViewWrapper.prototype.drawChild = function() {
		this.parentObj.drawChild()
	};
	s7sdk.set.PVViewWrapper.prototype.viewStateChange = function(a) {
	};
	s7sdk.set.PVViewWrapper.prototype.viewInvalidate = function(a) {
	};
	s7sdk.set.PVViewWrapper.prototype.onReadyToDislpay = function() {
		this.loresIsloaded = true;
		if (this.parentObj && this.parentObj.doInitialSlide) {
			this.parentObj.doInitialSlide()
		}
	};
	s7sdk.set.PVViewWrapper.prototype.resize = function(c, e, b, d, a) {
		this.displayElement.width = c;
		this.displayElement.height = e;
		this.displayElement.style.width = this.obj.style.width = b + "px";
		this.displayElement.style.height = this.obj.style.height = d + "px";
		this.obj.style.left = this.leftPos * (b + this.spacing) + "px";
		this.obj.style.width = (b + this.spacing) + "px";
		if (this.view) {
			this.view.resize(b * a, d * a)
		}
	}
};