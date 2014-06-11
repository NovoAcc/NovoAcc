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
s7sdk.Util.require("s7sdk.event.Event");
s7sdk.Util.require("s7sdk.common.Enumeration");
s7sdk.Util.require("s7sdk.image.rgn.Resolution");
if (!s7sdk.View) {
	s7sdk.VIEW_ALIGN_LEFT = 1;
	s7sdk.VIEW_ALIGN_CENTER = 0;
	s7sdk.VIEW_ALIGN_RIGHT = 2;
	s7sdk.View = function(e, j, t, a, h, s, n, u, v, o, d, l, f, c, k, m, g, q) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINER,
						"View.ctor (no canvas) url: %0 image size: %1 x %2 view size: %3 x %4",
						e, j, t, a, h);
		this.idx = typeof (g) == "undefined" ? 0 : g;
		this.aspect = j / t;
		this.imageWidth = j;
		this.imageHeight = t;
		this.zoomLimit = s7sdk.Util.checkDefault(k, 0);
		this.h = h;
		this.w = a;
		if (this.w == 0) {
			this.w = Math.round(this.aspect * h)
		}
		this.align = typeof (q) == "undefined" ? s7sdk.VIEW_ALIGN_CENTER : q;
		this.constrainWidth = (this.align == s7sdk.VIEW_ALIGN_CENTER) ? 1 : 0.5;
		this.url = e;
		this.textoverlay = null;
		this.state = 7;
		this.maxHeight = Math.round(t * u);
		this.zoomStep = s7sdk.Util.checkDefault(n, 1);
		this.limit = s7sdk.Util.checkDefault(u, 1);
		this.transitionTime = s7sdk.Util.checkDefault(v, 0.5) * 1000;
		this.transitionEasing = s7sdk.Util.checkDefault(o, 0);
		this.clickToZoom = s7sdk.Util.checkDefault(f, 9);
		this.elasticZoom = s7sdk.Util.checkDefault(l, 0);
		this.elasticZoom = (this.elasticZoom < 0) ? 0
				: (this.elasticZoom > 1) ? 1 : this.elasticZoom;
		this.elasticZoom = (this.elasticZoom > 0) ? this.elasticZoom * 0.3 + 0.69
				: 0;
		this.fmt = s7sdk.Util.checkDefault(c, "jpg");
		this.transparent = ((this.fmt.indexOf("png") != -1 || this.fmt
				.indexOf("gif") != -1) && (this.fmt.indexOf("-alpha") > 0)) ? true
				: false;
		this.zoomLimit = s7sdk.Util.checkDefault(k, 0);
		this.inPan = false;
		this.inPinch = false;
		this.sliding = false;
		this.speedX = 0;
		this.speedY = 0;
		this.lastTx = 0;
		this.lastTy = 0;
		this.inTransition = false;
		this.prevStep = 0;
		this.maxStep = 1;
		this.resized = false;
		this.tileRender = true;
		this.loadResetImage = s7sdk.Util.checkDefault(m, true);
		this.onResetImageLoaded = s7sdk.Util.noop;
		this.devicePixelRatio = s;
		this.setInitView();
		this.targetViewToImage = this.resetView();
		this.topScale = 1 / this.maxHeight;
		this.initScale = this.targetViewToImage.d;
		if (!s7sdk.Util.isNull(d)) {
			this.targetViewToImage = this.zoomViewTransform(d)
		}
		this.viewToImage = this.targetViewToImage.clone();
		this.checkState();
		this.resolutions = new Array();
		var r = Math.floor(Math.log(1 / this.limit) / Math.log(2));
		var p = Math.round(j / Math.pow(2, r));
		var b = Math.round(t / Math.pow(2, r));
		var w;
		do {
			w = new s7sdk.Resolution(r++, p, b, e, this.fmt, this);
			this.resolutions.push(w);
			p = Math.round(p / 2);
			b = Math.round(b / 2)
		} while (p > 256 || b > 256);
		this.resolutions.reverse();
		this.calcRes();
		this.displayElement = null;
		this.resetImageLoaded = false;
		this.resetImage = new Image();
		this.resetImage.onload = this.onLoadImage;
		this.resetImage.onerror = this.onErrorImage;
		this.resetImage.onabort = this.onAbortImage;
		this.resetImage.view = this;
		this.delayTileLoad = false;
		this.parentView = null;
		this.loadImage();
		this.invalidated = false;
		this.drawInterval = s7sdk.Util.interval(s7sdk.View.intervalDraw,
				1000 / 12, [ this ])
	};
	s7sdk.View.epsilon1 = 0.01;
	s7sdk.View.epsilon2 = 0.00001;
	s7sdk.View.createDisplay = function() {
		var a = s7sdk.Util.createObj(null, "div", null, null);
		a.style.position = "relative";
		a.style.overflow = "hidden";
		return a
	};
	s7sdk.View.prototype.changeStatus = function(a) {
	};
	s7sdk.View.prototype.writeOverlay = function(a) {
		this.textoverlay = a
	};
	s7sdk.View.prototype.init = function() {
		var a = 24;
		if (this.transitionTime > 0) {
			this.maxStep = 2000 / (a * transitionTime)
		}
	};
	s7sdk.View.prototype.getDisplayElement = function() {
		return this.displayElement
	};
	s7sdk.View.prototype.attach = function(a) {
		this.parentView = a;
		this.displayElement = a.displayElement;
		this.displayElement.view = this;
		this.invalidate()
	};
	s7sdk.View.prototype.detach = function() {
		if (null != this.displayElement) {
			this.displayElement.view = null;
			this.displayElement = null
		}
	};
	s7sdk.View.prototype.loadImage = function() {
		if (this.resetImageLoaded || this.resetImage.src) {
			return
		}
		var a = this.url + (this.url.indexOf("?") >= 0 ? "&" : "?") + "wid="
				+ Math.floor(this.width) + "&hei=" + Math.floor(this.height)
				+ "&fmt=" + this.fmt;
		s7sdk.Logger.log(s7sdk.Logger.INFO, "View.loadImage %0", a);
		this.resetImage.src = a
	};
	s7sdk.View.prototype.onLoadImage = function(b) {
		var b = b || window.event;
		var a = s7sdk.Event.getTarget(b) || this;
		if (a.view.viewParent != null && a.view.viewParent.onReadyToDislpay) {
			a.view.viewParent.onReadyToDislpay()
		}
		a.view.invalidate(true);
		a.view.resetImageLoaded = true;
		if (a.view.resized) {
			if (a.width == a.view.width && a.height == a.view.height) {
				a.view.resized = false
			}
		}
		a.view.onResetImageLoaded.apply(a.view, [ true, a.view.idx ])
	};
	s7sdk.View.prototype.onErrorImage = function(b) {
		var b = b || window.event;
		var a = s7sdk.Event.getTarget(b) || this;
		a.view.onResetImageLoaded.apply(a.view, [ false, a.view.idx ]);
		s7sdk.Logger.log(s7sdk.Logger.WARNING, "Reset image failed to load")
	};
	s7sdk.View.prototype.onAbortImage = function(b) {
		var b = b || window.event;
		var a = s7sdk.Event.getTarget(b) || this;
		a.view.onResetImageLoaded.apply(a.view, [ false, a.view.idx ]);
		s7sdk.Logger.log(s7sdk.Logger.WARNING,
				"Reset image did not finish loading")
	};
	s7sdk.View.prototype.clampScale = function(a, c, b) {
		if (a.d * c > this.initScale) {
			c = this.initScale / a.d
		} else {
			if (a.d * c < this.topScale) {
				c = this.topScale / a.d
			}
		}
		if (b && this.zoomLimit > 0
				&& a.d * c < this.initScale / this.zoomLimit) {
			c = this.initScale / (this.zoomLimit * a.d)
		}
		if (Math.abs(c - 1) < s7sdk.View.epsilon2) {
			return 1
		} else {
			return c
		}
	};
	s7sdk.View.prototype.scaleView = function(a) {
		if (this.elasticZoom == 0) {
			a = this.clampScale(this.viewToImage, a);
			if (a == 1) {
				return
			}
			this.scaleTransform(this.viewToImage, a);
			this.clampToImage(this.viewToImage);
			this.calcRes();
			this.invalidate(true);
			this.checkState()
		} else {
			if (!this.inTransition) {
				this.targetViewToImage = this.viewToImage.clone()
			}
			a = this.clampScale(this.targetViewToImage, a);
			if (a == 1) {
				return
			}
			this.scaleTransform(this.targetViewToImage, a);
			this.clampToImage(this.targetViewToImage);
			this.startTransition()
		}
	};
	s7sdk.View.prototype.scaleTransform = function(c, d) {
		var e = c.transformPoint(new s7sdk.Point2D(this.w / 2, this.h / 2));
		c.scale(d, d);
		var b = c.a * this.w / 2 + c.b * this.h / 2;
		var a = c.c * this.w / 2 + c.d * this.h / 2;
		c.tx = e.x - b;
		c.ty = e.y - a
	};
	s7sdk.View.prototype.resize = function(d, e) {
		this.stopAction();
		if (this.displayElement != null) {
			this.displayElement.width = d;
			this.displayElement.height = e
		}
		var f = this.width;
		var b = this.height;
		var i = this.viewToImage.transformPoint(new s7sdk.Point2D(this.w / 2,
				this.h / 2));
		this.w = d;
		this.h = e;
		this.setInitView();
		this.initScale = 1 / this.height;
		var g = this.clampScale(this.viewToImage, b / this.height);
		this.viewToImage.translate(this.viewToImage.tx * -1,
				this.viewToImage.ty * -1);
		this.viewToImage.scale(g, g);
		var c = this.viewToImage.a * this.w / 2 + this.viewToImage.b * this.h
				/ 2;
		var a = this.viewToImage.c * this.w / 2 + this.viewToImage.d * this.h
				/ 2;
		this.viewToImage.tx = i.x - c;
		this.viewToImage.ty = i.y - a;
		this.clampToImage(this.viewToImage);
		this.calcRes();
		this.resized = true;
		this.resized = true;
		if (this.resetImageLoaded) {
			if (this.width == this.resetImage.width
					&& this.height == this.resetImage.height) {
				this.resized = false
			}
		}
		this.invalidate(false);
		if (this.viewParent != null && this.viewParent.viewInvalidate) {
			this.viewParent.viewInvalidate(this.getViewPort())
		}
		this.checkState()
	};
	s7sdk.View.prototype.checkState = function() {
		var a = 0;
		if (Math.abs(this.viewToImage.d - this.initScale) > s7sdk.View.epsilon2) {
			a = 6
		}
		if (Math.abs(this.viewToImage.d - this.topScale) > s7sdk.View.epsilon2) {
			a |= 8;
			if (this.zoomLimit > 0
					&& this.viewToImage.d > this.initScale / this.zoomLimit
					&& this.viewToImage.d - this.initScale / this.zoomLimit > s7sdk.View.epsilon2) {
				a |= 1
			} else {
				if (this.zoomLimit <= 0) {
					a |= 1
				}
			}
		}
		if (a & 4) {
			var b = this.getViewPort();
			if (b.x > s7sdk.View.epsilon2) {
				a |= 16
			}
			if (Math.abs(1 - (b.x + b.width)) > s7sdk.View.epsilon2) {
				a |= 32
			}
			if (b.y > s7sdk.View.epsilon2) {
				a |= 64
			}
			if (Math.abs(1 - (b.y + b.height)) > s7sdk.View.epsilon2) {
				a |= 128
			}
		}
		if (a == this.state) {
			return
		}
		this.state = a;
		if (this.viewParent != null) {
			this.viewParent.viewStateChange.apply(this.viewParent, [ a ])
		}
	};
	s7sdk.View.prototype.pinchZoom = function(g, e, a, h) {
		s7sdk.Logger.log(s7sdk.Logger.FINER, "pinchZoom x %0 y %1 scaleInc %2",
				g, e, a);
		g *= this.devicePixelRatio;
		e *= this.devicePixelRatio;
		var i = this.clampScale(h, a, false);
		if (i == 1) {
			return
		}
		var f = this.viewToImage.transformPoint(new s7sdk.Point2D(g, e));
		this.viewToImage = h.clone();
		var c = this.viewToImage.tx;
		var b = this.viewToImage.ty;
		this.viewToImage.translate(-c, -b);
		this.viewToImage.scale(i, i);
		var d = this.viewToImage.transformPoint(new s7sdk.Point2D(g, e));
		this.viewToImage.tx = f.x - d.x;
		this.viewToImage.ty = f.y - d.y;
		this.clampToImage(this.viewToImage);
		this.calcRes();
		this.invalidate(true);
		this.checkState()
	};
	s7sdk.View.prototype.zoomClick = function(b, g, d) {
		b *= this.devicePixelRatio;
		g *= this.devicePixelRatio;
		s7sdk.Logger.log(s7sdk.Logger.FINER, "zoomClick(%0, %1, %2)", b, g, d);
		var e;
		if (d) {
			e = this.zoomScale
		} else {
			e = 1 / this.zoomScale
		}
		e = this.clampScale(this.viewToImage, e, true);
		if (e == 1) {
			return
		}
		this.targetViewToImage = this.viewToImage.clone();
		var f = this.targetViewToImage.transformPoint(new s7sdk.Point2D(b, g));
		this.targetViewToImage.scale(e, e);
		var c = this.targetViewToImage.a * this.w / 2
				+ this.targetViewToImage.b * this.h / 2;
		var a = this.targetViewToImage.c * this.w / 2
				+ this.targetViewToImage.d * this.h / 2;
		this.targetViewToImage.tx = f.x - c;
		this.targetViewToImage.ty = f.y - a;
		this.clampToImage(this.targetViewToImage);
		this.startTransition()
	};
	s7sdk.View.prototype.doNPan = function(b, a, c) {
		this.viewToImage.tx -= b;
		this.viewToImage.ty -= a;
		this.clampToImage(this.viewToImage);
		this.checkState();
		this.invalidate(c)
	};
	s7sdk.View.prototype.doPan = function(b, a, c) {
		this.viewToImage.tx = this.viewToImage.tx - b * this.viewToImage.a
				* this.devicePixelRatio;
		this.viewToImage.ty = this.viewToImage.ty - a * this.viewToImage.d
				* this.devicePixelRatio;
		this.clampToImage(this.viewToImage);
		this.checkState();
		this.invalidate(c)
	};
	s7sdk.View.prototype.draw = function() {
		if (!this.invalidated) {
			return
		}
		if (this.displayElement == null) {
			return
		}
		var i = this.viewToImage.clone();
		i.invert();
		var b = i.transformPoint(new s7sdk.Point2D(0, 0));
		var a = i.transformPoint(new s7sdk.Point2D(1, 1));
		var c = new s7sdk.Rectangle(b.x, b.y, a.x - b.x, a.y - b.y);
		var e = new s7sdk.Rectangle(0, 0, this.w, this.h);
		c = c.intersection(e);
		if (this.res.loaded()
				&& (!this.inTransition && !this.inPan && !this.inPinch && (this.tileRender && (this.resized || Math
						.abs(this.viewToImage.d - this.initScale) > s7sdk.View.epsilon2)))) {
			var j = this.viewToRes();
			var f = this.res.getResToRgn();
			var g = j;
			g.concat(f);
			var h = g;
			h.invert();
			this.drawImage(this.res.getRegionImage(), h)
		} else {
			if (!this.resetImageLoaded) {
				return
			}
			var d = this.viewToImage.clone();
			d.scale(this.resetImage.width, this.resetImage.height);
			d.invert();
			s7sdk.Util.setObjSize(this.resetImage, Math
					.round(this.resetImage.width * d.a), Math
					.round(this.resetImage.height * d.d));
			s7sdk.Util.setObjPos(this.resetImage, Math.round(d.tx), Math
					.round(d.ty));
			if (this.displayElement.firstChild) {
				this.displayElement.replaceChild(this.resetImage,
						this.displayElement.firstChild)
			} else {
				this.displayElement.appendChild(this.resetImage)
			}
		}
		this.invalidated = false;
		if (typeof (this.parentView.drawChild) != "undefined") {
			this.parentView.drawChild()
		}
		this.displayElement.firstChild.style.filter = "inherit"
	};
	s7sdk.View.prototype.drawImage = function(b, a) {
		b.width = Math.round(b.startWidth * a.a);
		b.height = Math.round(b.startHeight * a.d);
		s7sdk.Util.setObjPos(b, Math.round(a.tx), Math.round(a.ty));
		if (this.displayElement.firstChild) {
			if (this.displayElement.firstChild != b) {
				this.displayElement.replaceChild(b,
						this.displayElement.firstChild)
			}
		} else {
			this.displayElement.appendChild(b)
		}
	};
	s7sdk.View.prototype.resetView = function() {
		var d = 1 / this.height;
		var c = new s7sdk.Matrix2D(d / this.aspect, 0, 0, d, 0, 0);
		var b = c.a * this.w / 2 + c.b * this.h / 2;
		var a = c.c * this.w / 2 + c.d * this.h / 2;
		if (this.align == s7sdk.VIEW_ALIGN_LEFT) {
			c.tx = 1 - b
		} else {
			if (this.align == s7sdk.VIEW_ALIGN_RIGHT) {
				c.tx = 0 - b
			} else {
				c.tx = 0.5 - b
			}
		}
		c.ty = 0.5 - a;
		return c
	};
	s7sdk.View.prototype.setInitView = function() {
		var a = (this.constrainWidth < 1) ? this.w * this.constrainWidth
				: this.w;
		if (a / this.h > this.aspect) {
			this.width = Math.round(this.aspect * this.h);
			this.height = this.h
		} else {
			this.width = a;
			this.height = Math.round(a / this.aspect)
		}
		if (this.maxHeight < this.height) {
			this.height = this.maxHeight;
			this.width = Math.round(this.aspect * this.height)
		}
		var b = (this.zoomStep > 0) ? this.zoomStep : Math.log(2)
				/ Math.log(this.maxHeight / this.h);
		this.zoomScale = Math.pow(2, 1 / b);
		if (this.elasticZoom <= 0) {
			this.scaleInc = Math.pow(2, 1 / (b * 10))
		} else {
			this.scaleInc = Math.pow(2, 1 / (b))
		}
	};
	s7sdk.View.prototype.startTransition = function() {
		this.startViewToImage = this.viewToImage.clone();
		var a = new Date();
		this.startTime = a.getTime();
		this.prevStep = 0;
		if (!this.inTransition) {
			s7sdk.Util.timeout(s7sdk.View.transitionHandler, 25, [ this ])
		}
		this.inTransition = true;
		if (this.viewParent != null
				&& this.viewParent.viewTransitionStart != null) {
			this.viewParent.viewTransitionStart()
		}
	};
	s7sdk.View.transitionHandler = function(a) {
		var b = false;
		b = a.onEnterFrame();
		if (b) {
			s7sdk.Util.timeout(s7sdk.View.transitionHandler, 25, [ a ])
		}
	};
	s7sdk.View.prototype.stopTransition = function() {
		if (this.inTransition) {
			this.viewToImage = this.targetViewToImage.clone();
			this.inTransition = false;
			this.checkState();
			if (this.viewParent != null
					&& this.viewParent.viewTransitionStop != null) {
				this.viewParent.viewTransitionStop()
			}
		}
	};
	s7sdk.View.prototype.stopAction = function() {
		this.stopTransition()
	};
	s7sdk.View.prototype.onEnterFrame = function() {
		var a = new Date();
		var b = a.getTime();
		var j = (this.transitionTime != 0) ? (b - this.startTime)
				/ this.transitionTime : 1;
		if (j > this.prevStep + this.maxStep) {
			j = this.prevStep + this.maxStep
		}
		this.prevStep = j;
		if (j == 0) {
			return true
		}
		if (j >= 1) {
			this.viewToImage = this.targetViewToImage.clone();
			this.calcRes();
			this.invalidate(false);
			this.stopTransition();
			return false
		}
		if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.AUTO) {
			if (this.elasticZoom > 0) {
				if (this.transitionTime >= 1500) {
					j = (j * (j - 2)) * -1
				} else {
					if (this.transitionTime > 1000) {
						j = (j -= 1) * j * j + 1
					} else {
						if (this.transitionTime > 500) {
							j = ((j -= 1) * j * j * j - 1) * -1
						} else {
							j = (j -= 1) * j * j * j * j + 1
						}
					}
				}
			}
		} else {
			if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.QUADRATIC) {
				j = (j * (j - 2)) * -1
			} else {
				if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.CUBIC) {
					j = (j -= 1) * j * j + 1
				} else {
					if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.QUARTIC) {
						j = ((j -= 1) * j * j * j - 1) * -1
					} else {
						if (this.transitionEasing == s7sdk.Enum.TRANSITION_EASING.QUINTIC) {
							j = (j -= 1) * j * j * j * j + 1
						}
					}
				}
			}
		}
		var i = 1 / j;
		var c = Math.exp(Math.log(this.targetViewToImage.d
				/ this.startViewToImage.d)
				/ i);
		var h;
		if (Math.abs(1 - c) > 1e-12) {
			h = (1 - Math.pow(c, i)) / (1 - c)
		} else {
			h = i
		}
		var g = (this.targetViewToImage.tx - this.startViewToImage.tx) / h;
		var f = (this.targetViewToImage.ty - this.startViewToImage.ty) / h;
		this.viewToImage = this.startViewToImage.clone();
		var e = this.viewToImage.tx;
		var d = this.viewToImage.ty;
		this.viewToImage.translate(-e, -d);
		this.viewToImage.scale(c, c);
		this.viewToImage.translate(e + g, d + f);
		this.calcRes();
		if ((1 - j) < 0.1) {
			this.invalidate(false)
		} else {
			this.invalidate(true)
		}
		this.checkState();
		return true
	};
	s7sdk.View.prototype.calcRes = function() {
		var b;
		var a = this.resolutions.length - 1;
		if (this.viewToImage.a > this.viewToImage.d) {
			b = this.viewToImage.a * this.resolutions[a].w
		} else {
			b = this.viewToImage.d * this.resolutions[a].h
		}
		while (b + s7sdk.View.epsilon1 > 2 && a > 0) {
			a--;
			b /= 2
		}
		this.res = this.resolutions[a]
	};
	s7sdk.View.prototype.invalidate = function(b) {
		b = !!b;
		if (b == false
				&& this.tileRender
				&& this.resized == false
				&& Math.abs(this.viewToImage.d - this.initScale) < s7sdk.View.epsilon2) {
			b = true
		}
		var c = new s7sdk.Rectangle(0, 0, this.w, this.h);
		var a = this.viewToRes();
		c.x = Math.round(a.a * c.x + a.b * c.y + a.tx);
		c.y = Math.round(a.c * c.x + a.d * c.y + a.ty);
		c.width = Math.round(a.a * c.width + a.b * c.height);
		c.height = Math.round(a.c * c.width + a.d * c.height);
		if (!b) {
			this.res.intersect(c)
		}
		this.invalidated = true;
		if (this.viewParent != null) {
			this.viewParent.viewInvalidate(this.getViewPort())
		}
	};
	s7sdk.View.intervalDraw = function(a) {
		a.draw()
	};
	s7sdk.View.prototype.unload = function(a) {
		if (a & 8) {
			if (this.drawInterval) {
				clearInterval(this.drawInterval);
				this.drawInterval = null
			}
		}
		if (this.resolutions == null) {
			return
		}
		if (a & 1) {
			for ( var b = 0; b < this.resolutions.length; b++) {
				this.resolutions[b].release()
			}
		}
	};
	s7sdk.View.prototype.clampToImage = function(c) {
		var e = this.h * c.d;
		var d = this.w * c.a;
		if (e <= 1) {
			c.ty = Math.max(c.ty, 0);
			c.ty = Math.min(c.ty, 1 - e)
		} else {
			var a = c.d * this.h / 2;
			c.ty = 0.5 - a
		}
		if (d <= 1) {
			c.tx = Math.max(c.tx, 0);
			c.tx = Math.min(c.tx, 1 - d)
		} else {
			var b = c.a * this.w / 2;
			if (this.align == s7sdk.VIEW_ALIGN_LEFT) {
				c.tx = 1 - b;
				c.tx = Math.min(c.tx, 0)
			} else {
				if (this.align == s7sdk.VIEW_ALIGN_RIGHT) {
					c.tx = 0 - b;
					c.tx = Math.max(c.tx, 1 - d)
				} else {
					c.tx = 0.5 - b
				}
			}
		}
	};
	s7sdk.View.prototype.zoomViewTransform = function(i) {
		var f = i.width * this.aspect;
		var b = i.height;
		var e;
		var j;
		var h = this.w;
		if ((Math.abs(i.x - 0) < s7sdk.View.epsilon2)
				&& (Math.abs(i.y - 0) < s7sdk.View.epsilon2)
				&& (Math.abs(i.right - 1) < s7sdk.View.epsilon2)
				&& (Math.abs(i.bottom - 1) < s7sdk.View.epsilon2)) {
			h = this.constrainWidth * w_
		}
		if (h / this.h > f / b) {
			j = i.height / this.h;
			e = j / this.aspect
		} else {
			e = i.width / h;
			j = e * this.aspect
		}
		var g = new s7sdk.Matrix2D(e, 0, 0, j, i.x, i.y);
		if (g.d < this.topScale) {
			var a = this.topScale / g.d;
			var d = g.tx;
			var c = g.ty;
			g.translate(-d, -c);
			g.scale(a, a);
			g.translate(d, c)
		}
		this.clampToImage(g);
		return g
	};
	s7sdk.View.prototype.viewToRes = function() {
		var a = this.viewToImage.clone();
		a.scale(this.res.w, this.res.h);
		return a
	};
	s7sdk.View.prototype.getViewPort = function() {
		var a = new s7sdk.Rectangle(0, 0, this.w, this.h);
		a.x = this.viewToImage.a * a.x + this.viewToImage.b * a.y
				+ this.viewToImage.tx;
		a.y = this.viewToImage.c * a.x + this.viewToImage.d * a.y
				+ this.viewToImage.ty;
		a.width = this.viewToImage.a * a.width + this.viewToImage.b * a.height;
		a.height = this.viewToImage.c * a.width + this.viewToImage.d * a.height;
		return a.intersection(new s7sdk.Rectangle(0, 0, 1, 1))
	};
	s7sdk.View.prototype.imagePixelsToViewPoint = function(a) {
		var b = this.viewToImage.clone();
		b.scale(this.imageWidth, this.imageHeight);
		b.invert();
		return b.transformPoint(a)
	};
	s7sdk.View.prototype.viewPointToImagePixels = function(a) {
		var b = this.viewToImage.clone();
		b.scale(this.imageWidth, this.imageHeight);
		return b.transformPoint(a)
	};
	s7sdk.View.prototype.zoomIn = function() {
		this.zoomClick(this.w / 2, this.h / 2, false)
	};
	s7sdk.View.prototype.zoomOut = function() {
		this.zoomClick(this.w / 2, this.h / 2, true)
	};
	s7sdk.View.prototype.zoomReset = function() {
		this.targetViewToImage = this.resetView();
		this.startTransition()
	};
	s7sdk.View.prototype.zoomNRgn = function(a) {
		this.targetViewToImage = this.zoomViewTransform(a);
		this.startTransition()
	};
	s7sdk.View.prototype.zoomRgn = function(a) {
		this.zoomNRgn(new s7sdk.Rectangle(a.x / this.imageWidth, a.y
				/ this.imageHeight, a.width / this.imageWidth, a.height
				/ this.imageHeight))
	};
	s7sdk.View.prototype.intervalDraw = function(a) {
		a.draw();
		requestAnimFrame(function() {
			a.intervalDraw(a)
		})
	}
};