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
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.common.ScrollableDiv");
s7sdk.Util.require("s7sdk.common.Thumb");
s7sdk.Util.require("s7sdk.utils.SwatchesParser");
s7sdk.Util.require("s7sdk.common.ItemDesc");
s7sdk.Util.require("s7sdk.common.Geometry");
s7sdk.Util.require("s7sdk.common.Button");
s7sdk.Util.require("s7sdk.event.Event");
if (!s7sdk.image.ZoomTargets) {
	s7sdk.image.ZoomTargets = function ZoomTargets(l, g, n) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.image.ZoomTargets constructor - containerId: %0, settings: %1 , compId: %2",
						l, g, n);
		n = (typeof n == "string" && n.length) ? n : "Targets_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ n, l, "div", "s7zoomtargets",
				g ]);
		this.container = s7sdk.Util.byId(l);
		this.BTN_LEFT_SIDE = "leftSide";
		this.BTN_RIGHT_SIDE = "rightSide";
		this.BTN_TOP_SIDE = "topSide";
		this.BTN_BOTTOM_SIDE = "bottomSide";
		this.SCROLL_BUTTON_TAP = "tap";
		this.SCROLL_BUTTON_HOLD = "hold";
		this.mediaSet = null;
		this.containerId = l;
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		var b = "";
		this.asset = unescape(this.asset);
		if (this.asset.indexOf("?") >= 0) {
			b = this.asset.substring(this.asset.indexOf("?") + 1);
			this.asset = this.asset.substring(0, this.asset.indexOf("?"))
		}
		this.iscommand = (b.length > 0 ? "&" : "") + this.iscommand;
		if (this.border.color.indexOf("#") < 0) {
			this.border.color = "#" + this.border.color
		}
		if (this.size.width == 0 || this.size.height == 0) {
			this.size.width = parseInt(s7sdk.Util.css.getCss("s7zoomtargets",
					"width", n, null, this.container));
			this.size.height = parseInt(s7sdk.Util.css.getCss("s7zoomtargets",
					"height", n, null, this.container));
			if (!s7sdk.Util.isNumber(this.size.width)
					|| !s7sdk.Util.isNumber(this.size.height)
					|| this.size.width <= 0 || this.size.height <= 0) {
				this.size.width = 300;
				this.size.height = 95
			}
		}
		this.totalWidth = this.size.width;
		this.totalHeight = this.size.height;
		this.size.width = this.size.width - this.border.thickness * 2;
		this.size.height = this.size.height - this.border.thickness * 2;
		var f = parseInt(s7sdk.Util.css.getCss("s7thumb", "width", this.id,
				"s7zoomtargets", this.container));
		var e = parseInt(s7sdk.Util.css.getCss("s7thumb", "height", this.id,
				"s7zoomtargets", this.container));
		this.tmbWid = (f > 0 && f < this.size.width) ? f : 75;
		this.tmbHei = (e > 0 && e < this.size.height) ? e : 75;
		this.tmbWid = (this.tmbSize.width != 75) ? this.tmbSize.width
				: this.tmbWid;
		this.tmbHei = (this.tmbSize.height != 75) ? this.tmbSize.height
				: this.tmbHei;
		this.maxTmbWid = this.tmbWid;
		this.maxTmbHei = this.tmbHei;
		if (typeof this.getParam("cellspacing") != "undefined") {
		} else {
			var d = 0;
			var a = 0;
			var j = 0;
			var c = 0;
			var m = [ "margin-left", "margin-right" ];
			var k = [ "margin-top", "margin-bottom" ];
			for ( var h = 0; h < m.length; h++) {
				j = parseInt(s7sdk.Util.css.getCss("s7thumbcell", m[h],
						this.id, "s7zoomtargets", this.container));
				if (s7sdk.Util.isNumber(j)) {
					d += j
				}
			}
			for ( var h = 0; h < k.length; h++) {
				c = parseInt(s7sdk.Util.css.getCss("s7thumbcell", k[h],
						this.id, "s7zoomtargets", this.container));
				if (s7sdk.Util.isNumber(c)) {
					a += c
				}
			}
			d = isNaN(d) ? 0 : d;
			a = isNaN(a) ? 0 : a;
			this.cellSpacing.horizontal = d;
			this.cellSpacing.vertical = a
		}
		this.rollover = false;
		this.buttonBehavior = this.SCROLL_BUTTON_TAP;
		this.scrollVelocity = 600;
		this.delay = 1;
		this.locale = this.getParam("locale", "");
		this.interval = this.getParam("interval", 20);
		this.leftButton_ = null;
		this.rightButton_ = null;
		this.upButton_ = null;
		this.downButton_ = null;
		this.buttonSize_ = Math.max.apply(null, [
				[ "s7scrollleftbutton", "width" ],
				[ "s7scrollrightbutton", "width" ],
				[ "s7scrollupbutton", "height" ],
				[ "s7scrolldownbutton", "height" ] ].map(function(i) {
			return parseInt(s7sdk.Util.css.getCss(i[0], i[1], this.id,
					"s7zoomtargets", this.container))
		}, this)) || 0;
		this.fitCols_ = NaN;
		this.fitRows_ = NaN;
		this.assetName_ = null;
		this.isReq_ = null;
		this.targets = [];
		this.itemsArray_ = [];
		this.swatchGroup_ = null;
		this.scrollParentDiv = null;
		this.swatchGroupRect_ = null;
		this.currentSwatch_ = null;
		this.itemIndex_ = -1;
		this.createElement();
		this.setAsset(this.asset)
	};
	s7sdk.Class.inherits("s7sdk.image.ZoomTargets", "s7sdk.UIComponent");
	s7sdk.image.ZoomTargets.prototype.modifiers = {
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
		tmbLayout : {
			params : [ "cols", "rows" ],
			defaults : [ 0, 1 ],
			ranges : [ "0:", "0:" ]
		},
		cellSpacing : {
			params : [ "horizontal", "vertical" ],
			defaults : [ 10, 10 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		textPos : {
			params : [ "position" ],
			defaults : [ "bottom" ],
			ranges : [ [ "bottom", "top", "left", "right", "tooltip", "none" ] ]
		},
		resizable : {
			params : [ "resizable" ],
			defaults : [ false ]
		},
		pageMode : {
			params : [ "pagemode" ],
			defaults : [ false ]
		},
		enableScrollButtons : {
			params : [ "enable" ],
			defaults : [ true ]
		},
		scrollStep : {
			params : [ "hStep", "vStep" ],
			defaults : [ 3, 3 ],
			ranges : [ "0:", "0:" ]
		},
		enableDragging : {
			params : [ "enabled", "overdragvalue" ],
			defaults : [ true, 0.5, 0 ],
			ranges : [ , "0:1" ]
		},
		buttonSnapMode : {
			params : [ "mode" ],
			defaults : [ "snapin" ],
			ranges : [ [ "snapin", "snapout", "overlay" ] ]
		},
		partialSwatches : {
			params : [ "enable" ],
			defaults : [ false ]
		},
		orientation : {
			params : [ "rowMajor" ],
			defaults : [ false ]
		},
		tmbSize : {
			params : [ "width", "height" ],
			defaults : [ 75, 75 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		size : {
			params : [ "width", "height" ],
			defaults : [ 0, 0 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		},
		border : {
			params : [ "color", "thickness" ],
			defaults : [ "#cccccc", 1 ],
			deprecated : true
		},
		fmt : {
			params : [ "fmt" ],
			defaults : [ "jpg" ],
			ranges : [ [ "jpg", "jpeg", "png", "png-alpha", "gif", "gif-alpha" ] ]
		},
		highlight : {
			params : [ "color", "value" ],
			defaults : [ "#3366CC", -1 ],
			deprecated : true
		}
	};
	s7sdk.image.ZoomTargets.prototype.setAsset = function(b) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.ZoomTargets.setAsset - assetName: %0", b);
		var a = unescape(b);
		this.itemIndex_ = -1;
		this.itemsArray_ = [];
		this.mediaSet = null;
		this.assetName_ = a;
		this.loadAsset()
	};
	s7sdk.image.ZoomTargets.prototype.getContainer = function() {
		return document.getElementById(this.containerId)
	};
	s7sdk.image.ZoomTargets.prototype.build = function() {
		this.getContainer().appendChild(this.obj);
		this.initTargets();
		this.layoutSwatches();
		this.obj.insertBefore(this.scrollParentDiv, this.obj.firstChild);
		if (this.itemIndex_ != -1) {
			this.selectTarget(this.itemIndex_, true)
		}
	};
	s7sdk.image.ZoomTargets.prototype.cleanUp = function() {
		if (this.isReq_) {
			this.isReq_.cancelHttpReq();
			this.isReq_ = null
		}
		this.targets = [];
		this.currentSwatch_ = null;
		if (this.scrollParentDiv != null) {
			if (this.swatchGroup_) {
				this.swatchGroup_.dispose()
			}
			this.obj.removeChild(this.scrollParentDiv);
			this.scrollParentDiv = null;
			this.swatchGroup_ = null
		}
		if (this.obj != null && this.obj.parentNode != null) {
			this.obj.parentNode.removeChild(this.obj)
		}
		a(this.leftButton_);
		a(this.rightButton_);
		a(this.upButton_);
		a(this.downButton_);
		function a(b) {
			if (b && b.obj && b.obj.parentNode) {
				b.obj.parentNode.removeChild(b.obj)
			}
		}
	};
	s7sdk.image.ZoomTargets.prototype.loadAsset = function() {
		var a = this.serverUrl + "/" + this.assetName_;
		if (a.indexOf("?") == -1) {
			a += "?req=set,json"
		} else {
			a += "&req=set,json"
		}
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			a += "&locale=" + this.locale
		}
		s7sdk.Logger.log(s7sdk.Logger.INFO,
				"s7sdk.image.ZoomTargets.loadAsset - req: %0", a);
		this.isReq_ = new s7sdk.IS(this.serverUrl, this.assetName_);
		this.isReq_.getHttpReq(a, function(c, b) {
			s7sdk.image.ZoomTargets.prototype.requestComplete.apply(b, [ c ])
		}, function(c, b) {
			s7sdk.Logger.log(s7sdk.Logger.WARNING,
					"s7sdk.image.ZoomTargets - image load error: " + c.message)
		}, this)
	};
	s7sdk.image.ZoomTargets.prototype.requestComplete = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINER,
				"s7sdk.image.ZoomTargets.requestComplete");
		if (a.set == null || a.set.type == "empty") {
			s7sdk.Logger
					.log(s7sdk.Logger.FINER,
							"s7sdk.image.ZoomTargets - instantiated without an asset, doing nothing.");
			return
		}
		var b = s7sdk.MediaSetParser.parse(a.set);
		if (b.items.length > 0) {
			this.setItem(b.items[0])
		}
	};
	s7sdk.image.ZoomTargets.prototype.setItem = function(b) {
		if (b instanceof s7sdk.ItemDesc == false) {
			throw new Error("Item must be a descendant of ItemDesc!")
		}
		if (b.parent == null) {
			throw new Error("ItemDesc must be part of a parent set!")
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.ZoomTargets.setItem - item: %0", b);
		this.cleanUp();
		this.mediaSet = b.parent;
		this.assetName_ = b.name;
		this.itemIndex_ = -1;
		var a = [];
		if (this.mediaSet.targets) {
			a = a.concat(this.mediaSet.targets)
		}
		if (b.targets) {
			a = a.concat(b.targets)
		}
		if (a.length == 0) {
			return
		}
		this.itemsArray_ = a;
		this.build()
	};
	s7sdk.image.ZoomTargets.prototype.initTargets = function() {
		var c = 0;
		var d;
		var a;
		for ( var b = 0; b < this.itemsArray_.length; b++) {
			d = this.itemsArray_[b];
			d.image = this.assetName_;
			a = new s7sdk.Thumb(this.obj, this.serverUrl, this.iscommand, d,
					this.tmbWid, this.tmbHei, this.fmt, this.highlight.value,
					this.highlight.color, d.rect, this.textPos, this.cl,
					this.locale);
			this.maxTmbWid = (a.getWidth() < this.maxTmbWid) ? this.maxTmbWid
					: a.getWidth();
			this.maxTmbHei = (a.getHeight() < this.maxTmbHei) ? this.maxTmbHei
					: a.getHeight();
			if (!d.hasOwnProperty("frame")) {
				d.frame = c++
			}
			this.targets[d.frame] = a
		}
	};
	s7sdk.image.ZoomTargets.prototype.resize = function(b, a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.image.ZoomTargets.resize - width: %0, height: %1", b, a);
		this.totalWidth = b;
		this.totalHeight = a;
		this.size.width = b - this.border.thickness * 2;
		this.size.height = a - this.border.thickness * 2;
		this.obj.setWidth(this.totalWidth);
		this.obj.setHeight(this.totalHeight);
		this.cleanUp();
		this.build();
		s7sdk.UIComponent.prototype.resize.apply(this, [ b, a ])
	};
	s7sdk.image.ZoomTargets.prototype.layoutSwatches = function() {
		var a = (!this.resizable && this.enableScrollButtons
				&& this.buttonSnapMode != "overlay" && this.buttonSize_) ? this.buttonSize_
				: 0;
		if (this.size.width != 0) {
			var l = Math.floor((this.size.width - this.cellSpacing.horizontal)
					/ (this.maxTmbWid + this.cellSpacing.horizontal));
			if (this.tmbLayout.cols != 0 && this.tmbLayout.cols <= l) {
				l = this.tmbLayout.cols
			}
		} else {
			l = this.tmbLayout.cols
		}
		if (this.size.height != 0) {
			var h = Math.floor((this.size.height - this.cellSpacing.vertical)
					/ (this.maxTmbHei + this.cellSpacing.vertical));
			if (this.tmbLayout.rows != 0 && this.tmbLayout.rows <= h) {
				h = this.tmbLayout.rows
			}
		} else {
			h = this.tmbLayout.rows
		}
		this.fitCols_ = l;
		this.fitRows_ = h;
		while (l * h < this.targets.length
				&& (this.tmbLayout.cols == 0 || this.tmbLayout.rows == 0
						|| l < this.tmbLayout.cols || h < this.tmbLayout.rows)) {
			if (this.orientation == 0) {
				if (this.tmbLayout.cols == 0 || l < this.tmbLayout.cols) {
					l++
				}
				if (h == 0
						|| (h * l < this.targets.length && (this.tmbLayout.rows == 0 || h < this.tmbLayout.rows))) {
					h++
				}
			} else {
				if (this.tmbLayout.rows == 0 || h < this.tmbLayout.rows) {
					h++
				}
				if (l == 0
						|| (h * l < this.targets.length && (this.tmbLayout.cols == 0 || l < this.tmbLayout.cols))) {
					l++
				}
			}
		}
		if (l > this.fitCols_) {
			this.fitCols_ = Math.floor((this.size.width
					- this.cellSpacing.horizontal - 2 * a)
					/ (this.maxTmbWid + this.cellSpacing.horizontal))
		}
		if (h > this.fitRows_) {
			this.fitRows_ = Math.floor((this.size.height
					- this.cellSpacing.vertical - 2 * a)
					/ (this.maxTmbHei + this.cellSpacing.vertical))
		}
		if (!this.resizable && (this.fitCols_ == 0 || this.fitRows_ == 0)) {
			s7sdk.Logger
					.log(
							s7sdk.Logger.WARNING,
							"s7sdk.image.ZoomTargets.layoutSwatches - Cannot fit any swatches into the given area: width %0, height %1",
							this.size.width, this.size.height);
			this.createScrollParentDiv(0, 0);
			return
		}
		var D = NaN;
		var A = NaN;
		var t = 0;
		var p = 0;
		var z = 0;
		var y = 0;
		var w = NaN;
		var q;
		this.swatchGroup_ = new s7sdk.ScrollableDiv(
				this,
				this.enableDragging.enabled,
				new s7sdk.Point2D(this.fitCols_
						* (this.cellSpacing.horizontal + this.maxTmbWid),
						this.fitRows_
								* (this.cellSpacing.vertical + this.maxTmbHei)),
				this.interval, null, this.enableDragging.overdragvalue,
				this.pageMode);
		var e = [];
		for (w = 0; w < this.targets.length && w < l * h; w++) {
			if (this.orientation == 0) {
				D = Math.floor(w / l);
				A = w % l;
				e[w] = {
					col : A,
					row : D
				}
			} else {
				A = Math.floor(w / h);
				D = w % h;
				e[w] = {
					col : A,
					row : D
				}
			}
			t = (t < D) ? D : t;
			p = (p < A) ? A : p
		}
		t++;
		p++;
		if (this.pageMode) {
			var x = Math.ceil(p / this.fitCols_);
			var C = Math.ceil(t / this.fitRows_);
			e = [];
			if (this.orientation == 0) {
				for ( var v = 0; v < x; v++) {
					for ( var w = 0; w < C; w++) {
						var B = (v + w * x) * (this.fitRows_ * this.fitCols_);
						for ( var u = 0; u < this.fitCols_; u++) {
							for ( var r = 0; r < this.fitRows_; r++) {
								var n = u + r * this.fitCols_ + B;
								e[n] = {
									col : u + v * this.fitCols_,
									row : r + w * this.fitRows_
								}
							}
						}
					}
				}
			} else {
				for ( var v = 0; v < C; v++) {
					for ( var w = 0; w < x; w++) {
						var B = (v + w * C) * (this.fitRows_ * this.fitCols_);
						for ( var u = 0; u < this.fitRows_; u++) {
							for ( var r = 0; r < this.fitCols_; r++) {
								var n = u + r * this.fitRows_ + B;
								e[n] = {
									col : r + w * this.fitCols_,
									row : u + v * this.fitRows_
								}
							}
						}
					}
				}
			}
		}
		for (w = 0; w < this.targets.length && w < l * h; w++) {
			q = this.targets[w];
			q.x = e[w].col * (this.maxTmbWid + this.cellSpacing.horizontal);
			if (this.textPos == s7sdk.Thumb.TEXT_LEFT) {
				q.x += this.maxTmbWid - q.getWidth()
			}
			q.y = e[w].row * (this.maxTmbHei + this.cellSpacing.vertical);
			if (this.textPos == s7sdk.Thumb.TEXT_TOP) {
				q.y += this.maxTmbHei - q.getHeight()
			}
			this.swatchGroup_.div.appendChild(q.div);
			q.div.style.position = "absolute";
			q.updatePosition();
			function s(i, j) {
				s7sdk.Event.addDOMListener(j.div, "click", function(k) {
					i.onSwatchClicked(k, j)
				}, true);
				s7sdk.Event.addDOMListener(j.div, "touchend", function(k) {
					i.onSwatchClicked(k, j)
				}, true)
			}
			s(this, q);
			if (z < q.x) {
				z = q.x
			}
			if (y < q.y) {
				y = q.y
			}
		}
		var d = 0;
		var f = 0;
		if (this.pageMode) {
			this.swatchGroup_.xNotch = this.fitCols_
					* (this.cellSpacing.horizontal + this.maxTmbWid);
			this.swatchGroup_.yNotch = this.fitRows_
					* (this.cellSpacing.vertical + this.maxTmbHei);
			var o = (l % this.fitCols_);
			var b = (h % this.fitRows_);
			if (o) {
				d = this.fitCols_ - o
			}
			if (b) {
				f = this.fitRows_ - b
			}
			this.scrollStep.hStep = this.fitCols_;
			this.scrollStep.vStep = this.fitRows_
		} else {
			if (!this.partialSwatches) {
				this.swatchGroup_.xNotch = (this.cellSpacing.horizontal + this.maxTmbWid);
				this.swatchGroup_.yNotch = (this.cellSpacing.vertical + this.maxTmbHei)
			} else {
				this.swatchGroup_.xNotch = 1;
				this.swatchGroup_.xNotch = 1
			}
		}
		var c = this.cellSpacing.horizontal + p
				* (this.cellSpacing.horizontal + this.maxTmbWid);
		var g = this.cellSpacing.vertical + t
				* (this.cellSpacing.vertical + this.maxTmbHei);
		this.swatchGroup_.setLogicalWidth(z + this.cellSpacing.horizontal
				+ this.maxTmbWid);
		this.swatchGroup_.setLogicalHeight(y + this.cellSpacing.vertical
				+ this.maxTmbHei);
		if (this.resizable) {
			this.obj.setWidth(c + this.border.thickness * 2);
			this.obj.setHeight(g + this.border.thickness * 2);
			this.createScrollParentDiv(c, g);
			this.scrollParentDiv.appendChild(this.swatchGroup_.div);
			this.scrollParentDiv.setX((c + this.border.thickness * 2 - c) / 2);
			this.scrollParentDiv.setY((g + this.border.thickness * 2 - g) / 2)
		} else {
			this.swatchGroupRect_ = new s7sdk.Rectangle(0, 0, Math.max(Math
					.min(this.swatchGroup_.scrollBounds.x, c), 0), Math.max(
					Math.min(this.swatchGroup_.scrollBounds.y, g), 0));
			this.createScrollParentDiv(this.swatchGroupRect_.width,
					this.swatchGroupRect_.height);
			this.scrollParentDiv.appendChild(this.swatchGroup_.div);
			this.scrollParentDiv
					.setX((this.totalWidth - this.swatchGroupRect_.width) / 2);
			this.scrollParentDiv
					.setY((this.totalHeight - this.swatchGroupRect_.height) / 2);
			this.layoutButtons()
		}
		this.swatchGroup_.layout()
	};
	s7sdk.image.ZoomTargets.prototype.onSwatchClicked = function(b, a) {
		if (this.swatchGroup_.getInterpretAsClick() || this.rollover) {
			this.itemIndex_ = a.item.frame;
			this.applyTargetSelection(a, false, true)
		}
	};
	s7sdk.image.ZoomTargets.prototype.applyTargetSelection = function(i, b, c) {
		b = typeof (b) == "undefined" ? false : b;
		c = typeof (c) == "undefined" ? false : c;
		if (this.currentSwatch_) {
			this.currentSwatch_.setSelected(false)
		}
		this.currentSwatch_ = i;
		this.currentSwatch_.setSelected(true);
		if (b) {
			var f = 0;
			var d = 0;
			var h = this.swatchGroup_.scrollBounds.x / 2;
			var g = this.swatchGroup_.scrollBounds.y / 2;
			if (i.x > h && i.x < (this.swatchGroup_.getLogicalWidth() - h)) {
				f = -i.x + h
			} else {
				if (i.x >= (this.swatchGroup_.getLogicalWidth() - h)) {
					f = -this.swatchGroup_.getLogicalWidth()
							+ this.swatchGroup_.scrollBounds.x
				}
			}
			if (i.y > g && i.y < (this.swatchGroup_.getLogicalHeight() - g)) {
				d = -i.y + g
			} else {
				if (i.y >= (this.swatchGroup_.getLogicalHeight() - g)) {
					d = -this.swatchGroup_.getLogicalHeight()
							+ this.swatchGroup_.scrollBounds.y
				}
			}
			var j = this;
			function e() {
				if (j.swatchGroup_) {
					j.swatchGroup_.slideTo(new s7sdk.Point2D(f, d))
				}
			}
			setTimeout(e, 100)
		}
		this.dispatchEvent(new s7sdk.event.ZoomTargetEvent(
				s7sdk.event.ZoomTargetEvent.ZOOM_TARGET, -1, i.item.frame,
				i.item, i.sourceRect));
		var a = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.TARG, [
				i.item.frame, i.item.label ? i.item.label : "" ], true);
		s7sdk.Event.dispatch(this.obj, a, false)
	};
	s7sdk.image.ZoomTargets.prototype.addEventListener = function(c, b, a) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.image.ZoomTargets.addEventListener - type: %0, handler: %1, useCapture: %2",
						c,
						b.toString().substring(0, b.toString().indexOf("(")), a);
		s7sdk.Base.prototype.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.image.ZoomTargets.prototype.selectTarget = function(a, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.image.ZoomTargets.selectTarget - targetDesc: %0, triggerScroll: %1",
						a, c);
		c = typeof (c) == "undefined" ? true : c;
		for ( var b = 0; b < this.itemsArray_.length; b++) {
			var d = this.itemsArray_[b];
			if (d.label == a.label && d.rect.toString() == a.rect.toString()) {
				break
			}
		}
		if (b == this.itemsArray_.length) {
			throw new Error(
					"Could not identify internal target based upon input target!;")
		}
		this.itemIndex_ = b;
		if (this.targets[b] != null) {
			this.applyTargetSelection(this.targets[b], c)
		}
	};
	s7sdk.image.ZoomTargets.prototype.placeButton = function(b, c, a) {
		var d = new s7sdk.Rectangle(0, 0, this.buttonSize_, this.buttonSize_);
		switch (a) {
		case this.BTN_LEFT_SIDE:
			b.x = c.x;
			b.y = c.y + (c.height - d.height) / 2;
			break;
		case this.BTN_RIGHT_SIDE:
			b.x = c.getRight() - d.width;
			b.y = c.y + (c.height - d.height) / 2;
			break;
		case this.BTN_TOP_SIDE:
			b.x = c.x + (c.width - d.width) / 2;
			b.y = c.y;
			break;
		case this.BTN_BOTTOM_SIDE:
			b.x = c.x + (c.width - d.width) / 2;
			b.y = c.getBottom() - d.height;
			break
		}
		b.x -= d.x;
		b.y -= d.y;
		b.obj.style.position = "absolute";
		b.obj.style.left = b.x + "px";
		b.obj.style.top = b.y + "px"
	};
	s7sdk.image.ZoomTargets.prototype.layoutButtons = function() {
		var c;
		var b = this.scrollParentDiv.getX();
		var d = this.scrollParentDiv.getY();
		switch (this.buttonSnapMode) {
		default:
		case "overlay":
			c = new s7sdk.Rectangle(b + 5, d + 5,
					this.swatchGroup_.scrollBounds.x - 10,
					this.swatchGroup_.scrollBounds.y - 10);
			break;
		case "snapin":
			c = new s7sdk.Rectangle(b - this.buttonSize_ - 2, d
					- this.buttonSize_ - 2, this.swatchGroup_.scrollBounds.x
					+ 2 * this.buttonSize_ + 4,
					this.swatchGroup_.scrollBounds.y + 2 * this.buttonSize_ + 4);
			break;
		case "snapout":
			c = new s7sdk.Rectangle(2 + this.border.thickness,
					2 + this.border.thickness, this.size.width - 4,
					this.size.height - 4);
			break
		}
		if (this.swatchGroup_.getLogicalWidth() > this.swatchGroup_.scrollBounds.x
				&& this.fitCols_) {
			this.swatchGroup_.scrollX = true;
			if (this.enableScrollButtons) {
				this.leftButton_ = new s7sdk.ScrollLeftButton(this.obj.id,
						this.settings, "leftButton_"
								+ s7sdk.Util.createUniqueId());
				this.rightButton_ = new s7sdk.ScrollRightButton(this.obj.id,
						this.settings, "rightButton_"
								+ s7sdk.Util.createUniqueId());
				this.placeButton(this.leftButton_, c, this.BTN_LEFT_SIDE);
				this.placeButton(this.rightButton_, c, this.BTN_RIGHT_SIDE);
				var a = this;
				s7sdk.Event.addDOMListener(this.leftButton_, "mouseup",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.leftButton_)
						});
				s7sdk.Event.addDOMListener(this.leftButton_, "touchend",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.leftButton_)
						});
				s7sdk.Event.addDOMListener(this.rightButton_, "mouseup",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.rightButton_)
						});
				s7sdk.Event.addDOMListener(this.rightButton_, "touchend",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.rightButton_)
						})
			}
		}
		if (this.swatchGroup_.getLogicalHeight() > this.swatchGroup_.scrollBounds.y
				&& this.fitRows_) {
			this.swatchGroup_.scrollY = true;
			if (this.enableScrollButtons) {
				this.upButton_ = new s7sdk.ScrollUpButton(this.obj.id,
						this.settings, "upButton_"
								+ s7sdk.Util.createUniqueId());
				this.downButton_ = new s7sdk.ScrollDownButton(this.obj.id,
						this.settings, "downButton_"
								+ s7sdk.Util.createUniqueId());
				this.placeButton(this.upButton_, c, this.BTN_TOP_SIDE);
				this.placeButton(this.downButton_, c, this.BTN_BOTTOM_SIDE);
				var a = this;
				s7sdk.Event.addDOMListener(this.upButton_, "mouseup", function(
						f) {
					f = f || window.event;
					a.buttonClick(f, a.upButton_)
				});
				s7sdk.Event.addDOMListener(this.upButton_, "touchend",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.upButton_)
						});
				s7sdk.Event.addDOMListener(this.downButton_, "mouseup",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.downButton_)
						});
				s7sdk.Event.addDOMListener(this.downButton_, "touchend",
						function(f) {
							f = f || window.event;
							a.buttonClick(f, a.downButton_)
						})
			}
		}
	};
	s7sdk.image.ZoomTargets.prototype.buttonClick = function(b, a) {
		if (this.buttonBehavior == this.SCROLL_BUTTON_HOLD) {
			return
		}
		if (!a.activated) {
			return
		}
		var e = Math.floor(this.scrollStep.hStep
				* (this.cellSpacing.horizontal + this.maxTmbWid));
		var c = Math.floor(this.scrollStep.vStep
				* (this.cellSpacing.vertical + this.maxTmbHei));
		var f = NaN;
		var d = NaN;
		if (a === this.leftButton_) {
			f = this.swatchGroup_.getScrollDest().x + e
		}
		if (a === this.rightButton_) {
			f = this.swatchGroup_.getScrollDest().x - e
		}
		if (a === this.upButton_) {
			d = this.swatchGroup_.getScrollDest().y + c
		}
		if (a === this.downButton_) {
			d = this.swatchGroup_.getScrollDest().y - c
		}
		if (!isNaN(f)) {
			if (f >= 0) {
				f = 0
			}
			if (f <= this.swatchGroupRect_.width
					- this.swatchGroup_.getLogicalWidth()) {
				f = this.swatchGroupRect_.width
						- this.swatchGroup_.getLogicalWidth()
			}
			this.swatchGroup_.slideTo(new s7sdk.Point2D(f, this.swatchGroup_
					.getY()))
		}
		if (!isNaN(d)) {
			if (d >= 0) {
				d = 0
			}
			if (d <= this.swatchGroupRect_.height
					- this.swatchGroup_.getLogicalHeight()) {
				d = this.swatchGroupRect_.height
						- this.swatchGroup_.getLogicalHeight()
			}
			this.swatchGroup_.slideTo(new s7sdk.Point2D(this.swatchGroup_
					.getX(), d))
		}
	};
	s7sdk.image.ZoomTargets.prototype.toggleLeftButton = function(a) {
		if (this.leftButton_) {
			a ? this.leftButton_.activate() : this.leftButton_.deactivate()
		}
	};
	s7sdk.image.ZoomTargets.prototype.toggleRightButton = function(a) {
		if (this.rightButton_) {
			a ? this.rightButton_.activate() : this.rightButton_.deactivate()
		}
	};
	s7sdk.image.ZoomTargets.prototype.toggleUpButton = function(a) {
		if (this.upButton_) {
			a ? this.upButton_.activate() : this.upButton_.deactivate()
		}
	};
	s7sdk.image.ZoomTargets.prototype.toggleDownButton = function(a) {
		if (this.downButton_) {
			a ? this.downButton_.activate() : this.downButton_.deactivate()
		}
	};
	s7sdk.image.ZoomTargets.prototype.getWidth = function() {
		return this.totalWidth
	};
	s7sdk.image.ZoomTargets.prototype.getHeight = function() {
		return this.totalHeight
	};
	s7sdk.image.ZoomTargets.prototype.getDiv = function() {
		return this.obj
	};
	s7sdk.image.ZoomTargets.prototype.getFrame = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "s7sdk.image.ZoomTargets.getFrame");
		return this.itemIndex_
	};
	s7sdk.image.ZoomTargets.prototype.createElement = function() {
		s7sdk.UIComponent.prototype.createElement.apply(this, []);
		this.obj = this.prepareDiv(this.obj);
		this.obj.setWidth(this.totalWidth);
		this.obj.setHeight(this.totalHeight);
		this.obj.className = "s7zoomtargets";
		this.obj.style.position = "absolute"
	};
	s7sdk.image.ZoomTargets.prototype.createScrollParentDiv = function(b, a) {
		if (this.scrollParentDiv == null) {
			this.scrollParentDiv = this.prepareDiv();
			this.scrollParentDiv.setWidth(b);
			this.scrollParentDiv.setHeight(a);
			this.scrollParentDiv.style.position = "absolute";
			this.scrollParentDiv.style.overflow = "hidden"
		}
	};
	s7sdk.image.ZoomTargets.prototype.prepareDiv = function(a) {
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
	s7sdk.ZoomTargets = s7sdk.image.ZoomTargets;
	(function addDefaultCSS() {
		var e = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var c = s7sdk.browser && s7sdk.browser.name == "ie"
				&& s7sdk.browser.version.major <= 8;
		var d = {
			display : "block",
			position : "absolute",
			top : "0px",
			left : "0px",
			width : "20px",
			height : "20px"
		};
		var a = e(".s7zoomtargets", {
			"background-color" : c ? "rgb(224, 224, 224)"
					: "rgba(100, 100, 100, 0.2)",
			"z-index" : "0",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
			width : "400px",
			height : "150px"
		})
				+ e(".s7zoomtargets .s7thumbcell", {
					margin : "5px"
				})
				+ e(".s7zoomtargets .s7thumb", {
					border : "1px solid transparent",
					width : "75px",
					height : "75px"
				})
				+ e(".s7zoomtargets .s7thumb[state='selected']", {
					border : "1px solid #FFFFFF"
				})
				+ e(".s7zoomtargets .s7scrollleftbutton", d)
				+ e(".s7zoomtargets .s7scrollleftbutton[state='up']", {
					"background-image" : b("scroll_left_up.png")
				})
				+ e(".s7zoomtargets .s7scrollleftbutton[state='over']", {
					"background-image" : b("scroll_left_over.png")
				})
				+ e(".s7zoomtargets .s7scrollleftbutton[state='down']", {
					"background-image" : b("scroll_left_down.png")
				})
				+ e(".s7zoomtargets .s7scrollleftbutton[state='disabled']", {
					"background-image" : b("scroll_left_disabled.png")
				})
				+ e(".s7zoomtargets .s7scrollrightbutton", d)
				+ e(".s7zoomtargets .s7scrollrightbutton[state='up']", {
					"background-image" : b("scroll_right_up.png")
				})
				+ e(".s7zoomtargets .s7scrollrightbutton[state='over']", {
					"background-image" : b("scroll_right_over.png")
				})
				+ e(".s7zoomtargets .s7scrollrightbutton[state='down']", {
					"background-image" : b("scroll_right_down.png")
				})
				+ e(".s7zoomtargets .s7scrollrightbutton[state='disabled']", {
					"background-image" : b("scroll_right_disabled.png")
				})
				+ e(".s7zoomtargets .s7scrollupbutton", d)
				+ e(".s7zoomtargets .s7scrollupbutton[state='up']", {
					"background-image" : b("scroll_up_up.png")
				})
				+ e(".s7zoomtargets .s7scrollupbutton[state='over']", {
					"background-image" : b("scroll_up_over.png")
				})
				+ e(".s7zoomtargets .s7scrollupbutton[state='down']", {
					"background-image" : b("scroll_up_down.png")
				})
				+ e(".s7zoomtargets .s7scrollupbutton[state='disabled']", {
					"background-image" : b("scroll_up_disabled.png")
				})
				+ e(".s7zoomtargets .s7scrolldownbutton", d)
				+ e(".s7zoomtargets .s7scrolldownbutton[state='up']", {
					"background-image" : b("scroll_down_up.png")
				})
				+ e(".s7zoomtargets .s7scrolldownbutton[state='over']", {
					"background-image" : b("scroll_down_over.png")
				})
				+ e(".s7zoomtargets .s7scrolldownbutton[state='down']", {
					"background-image" : b("scroll_down_down.png")
				})
				+ e(".s7zoomtargets .s7scrolldownbutton[state='disabled']", {
					"background-image" : b("scroll_down_disabled.png")
				}) + e(".s7zoomtargets .s7label", {
					"box-sizing" : "border-box",
					padding : "3px",
					font : "14px Helvetica, Arial",
					"text-shadow" : "0px 4px 4px #555555"
				});
		s7sdk.Util.css.addDefaultCSS(a, "ZoomTargets")
	})()
};