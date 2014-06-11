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
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.common.ScrollableDiv");
s7sdk.Util.require("s7sdk.common.Thumb");
s7sdk.Util.require("s7sdk.utils.SwatchesParser");
s7sdk.Util.require("s7sdk.common.ItemDesc");
s7sdk.Util.require("s7sdk.common.Geometry");
s7sdk.Util.require("s7sdk.common.Button");
s7sdk.Util.require("s7sdk.event.Event");
s7sdk.Util.require("s7sdk.common.ScrollBar");
if (!s7sdk.set.ThumbnailGridView) {
	s7sdk.set.ThumbnailGridView = function ThumbnailGridView(j, d, l) {
		l = (typeof l == "string" && l.length) ? l : "ThumbnailGridView_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ l, j, "div",
				"s7thumbnailgridview", d ]);
		this.containerId_ = j;
		this.container = s7sdk.Util.byId(j);
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		this.imageModifier = s7sdk.MediaSetParser
				.parseAssetForSetReq(this.asset).mod;
		if (this.size.width == 0 || this.size.height == 0) {
			this.size.width = parseInt(s7sdk.Util.css.getCss(
					"s7thumbnailgridview", "width", this.id, null,
					this.container));
			this.size.height = parseInt(s7sdk.Util.css.getCss(
					"s7thumbnailgridview", "height", this.id, null,
					this.container));
			if (!s7sdk.Util.isNumber(this.size.width)
					|| !s7sdk.Util.isNumber(this.size.height)
					|| this.size.width <= 0 || this.size.height <= 0) {
				this.size.width = 500;
				this.size.height = 250
			}
		}
		if (this.tmbSize.width == 0 || this.tmbSize.height == 0) {
			this.tmbSize.width = parseInt(s7sdk.Util.css.getCss("s7thumb",
					"width", this.id, "s7thumbnailgridview", this.container));
			this.tmbSize.height = parseInt(s7sdk.Util.css.getCss("s7thumb",
					"height", this.id, "s7thumbnailgridview", this.container));
			if (!s7sdk.Util.isNumber(this.tmbSize.width)
					|| !s7sdk.Util.isNumber(this.tmbSize.height)
					|| this.tmbSize.width <= 0 || this.tmbSize.height <= 0) {
				this.tmbSize.width = 75;
				this.tmbSize.height = 75
			}
		}
		if (typeof this.getParam("cellspacing") != "undefined") {
		} else {
			var c = 0;
			var a = 0;
			var g = 0;
			var b = 0;
			var k = [ "margin-left", "margin-right" ];
			var h = [ "margin-top", "margin-bottom" ];
			for ( var f = 0; f < k.length; f++) {
				g = parseInt(s7sdk.Util.css.getCss("s7thumbcell", k[f],
						this.id, "s7thumbnailgridview", this.container));
				if (s7sdk.Util.isNumber(g)) {
					c += g
				}
			}
			for ( var f = 0; f < h.length; f++) {
				b = parseInt(s7sdk.Util.css.getCss("s7thumbcell", h[f],
						this.id, "s7thumbnailgridview", this.container));
				if (s7sdk.Util.isNumber(b)) {
					a += b
				}
			}
			c = isNaN(c) ? 0 : c;
			a = isNaN(a) ? 0 : a;
			this.cellSpacing.horizontalSpacing = c;
			this.cellSpacing.verticalSpacing = a
		}
		this.maxTmbWid_ = this.tmbSize.width;
		this.maxTmbHei_ = this.tmbSize.height;
		var e = 0;
		this.locale = this.getParam("locale", "");
		this.dir = this.direction == "auto" ? this.locale == "ja"
				: this.direction != "left";
		this.mediaSet_ = null;
		this.totalWidth_ = this.size.width;
		this.totalHeight_ = this.size.height;
		this.wid_ = this.size.width - e * 2;
		this.hei_ = this.size.height - e * 2;
		this.showSwatches_ = true;
		this.fitCols_ = NaN;
		this.fitRows_ = NaN;
		this.assetName_ = null;
		this.isReq_ = null;
		this.swatches_ = [];
		this.filteredSet_ = [];
		this.swatchGroup_ = null;
		this.scrollParentDiv_ = null;
		this.swatchGroupRect_ = null;
		this.currentSwatch_ = null;
		this.itemIndex_ = -1;
		this.rollOver_ = false;
		this.createElement();
		if (this.maxloadradius != -1) {
			this.delay = 50;
			this.queue = new Array();
			this.timer = setInterval(s7sdk.Util.wrapContext(this.onProcess,
					this), this.delay)
		}
		this.splitFrames = false;
		this.setAsset(this.asset)
	};
	s7sdk.Class.inherits("s7sdk.set.ThumbnailGridView", "s7sdk.UIComponent");
	s7sdk.set.ThumbnailGridView.prototype.modifiers = {
		serverUrl : {
			params : [ "isRootPath" ],
			defaults : [ "/is/image/" ]
		},
		asset : {
			params : [ "imageSet" ],
			defaults : [ "" ],
			parseParams : false
		},
		iscommand : {
			params : [ "value" ],
			defaults : [ "" ],
			parseParams : false
		},
		maxloadradius : {
			params : [ "value" ],
			defaults : [ "1" ],
			ranges : [ "-1:" ]
		},
		cellSpacing : {
			params : [ "horizontalSpacing", "verticalSpacing" ],
			defaults : [ 10, 10 ],
			ranges : [ "0:", "0:" ]
		},
		textPos : {
			params : [ "textpos" ],
			defaults : [ "bottom" ],
			ranges : [ [ "bottom", "top", "left", "right", "tooltip", "none" ] ]
		},
		fmt : {
			params : [ "format" ],
			defaults : [ "jpg" ],
			ranges : [ [ "jpg", "jpeg", "png", "png-alpha", "gif", "gif-alpha" ] ]
		},
		direction : {
			params : [ "direction" ],
			defaults : [ "auto" ],
			ranges : [ [ "auto", "left", "right" ] ]
		},
		enableDragging : {
			params : [ "enabled", "overdragvalue" ],
			defaults : [ true, 0.5, 0 ],
			ranges : [ , "0:1" ]
		},
		scrollbar : {
			params : [ "value" ],
			defaults : [ true ],
			ranges : [ [ true, false ] ]
		},
		align : {
			params : [ "align" ],
			defaults : [ "center" ],
			ranges : [ [ "left", "center", "right" ] ]
		},
		interval : {
			params : [ "value" ],
			defaults : [ 20 ],
			ranges : [ "1:1000" ]
		},
		tmbSize : {
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
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.setAsset = function(c) {
		if (typeof c != "string") {
			throw new Error("Asset name must be represented by a string!")
		}
		var a = unescape(c);
		if (!(a.length > 0)) {
			return
		}
		if (this.assetName_ != null && a != this.assetName_) {
			var b = new s7sdk.event.UserEvent(s7sdk.event.UserEvent.SWAP, [ 0,
					c ], true);
			s7sdk.Event.dispatch(this.obj, b, false)
		}
		this.itemIndex_ = -1;
		this.filteredSet_ = [];
		this.assetName_ = a;
		this.loadAsset()
	};
	s7sdk.set.ThumbnailGridView.prototype.getContainer = function() {
		return document.getElementById(this.containerId_)
	};
	s7sdk.set.ThumbnailGridView.prototype.build = function() {
		this.getContainer().appendChild(this.obj);
		this.initSwatches();
		this.layoutGrid()
	};
	s7sdk.set.ThumbnailGridView.prototype.getObjRect = function(b) {
		var a = b.getBoundingClientRect();
		a = new s7sdk.Rectangle(a.left, a.top, b.offsetWidth, b.offsetHeight);
		return a
	};
	s7sdk.set.ThumbnailGridView.prototype.getNextToLoad = function() {
		if (!this.swatchGroup_ || !this.toLoad || this.toLoad.length == 0) {
			return
		}
		var g = new Array();
		for ( var c = 0; c < this.toLoad.length; c++) {
			idxToLoad = this.toLoad[c];
			if (!(this.swatches_[idxToLoad].isLoading || this.swatches_[idxToLoad].isComlete)) {
				g.push(idxToLoad)
			}
		}
		this.toLoad = g;
		var e = this.getObjRect(this.swatchGroup_.div);
		var d = this.getObjRect(this.scrollParentDiv_);
		d.x = d.x - e.x;
		d.y = d.y - e.y;
		this.checkForload = function() {
			for ( var k = 0; k < this.toLoad.length; k++) {
				idxToLoad = this.toLoad[k];
				if (this.swatchesPositions[idxToLoad]
						&& this.swatchesPositions[idxToLoad].rect) {
					var j = d
							.intersection(this.swatchesPositions[idxToLoad].rect);
					if (j.width == 0 || j.height == 0
							|| this.swatches_[idxToLoad].isLoading
							|| this.swatches_[idxToLoad].isComlete) {
						continue
					}
					return this.swatches_[idxToLoad]
				}
			}
			return null
		};
		var f = this.checkForload();
		if (f) {
			return f
		}
		var h = this.maxloadradius == 0 ? 0
				: (Math.ceil(this.maxloadradius) - 0.5);
		if (h == 0) {
			return null
		}
		var a = (this.maxTmbWid_ + this.cellSpacing.horizontalSpacing) * h;
		var b = (this.maxTmbHei_ + this.cellSpacing.verticalSpacing) * h;
		d.x -= a;
		d.width += 2 * a;
		d.y -= b;
		d.height += 2 * b;
		return this.checkForload()
	};
	s7sdk.set.ThumbnailGridView.prototype.onProcess = function() {
		var b = new Array();
		for ( var a = 0; a < 3; a++) {
			var c = this.queue[a];
			if (c != null && !c.isComlete) {
				b.push(c)
			} else {
				var c = this.getNextToLoad();
				if (c) {
					c.loadImage();
					b.push(c)
				}
			}
		}
		this.queue = b
	};
	s7sdk.set.ThumbnailGridView.prototype.cleanUp = function() {
		if (this.isReq_) {
			this.isReq_.cancelHttpReq();
			this.isReq_ = null
		}
		this.swatches_ = [];
		this.currentSwatch_ = null;
		this.cleanUpcommon()
	};
	s7sdk.set.ThumbnailGridView.prototype.cleanUpcommon = function() {
		if (this.scr) {
			this.obj.removeChild(this.scr);
			this.scrollbarInst = null;
			this.scr = null
		}
		if (this.scrollParentDiv_ != null) {
			if (this.swatchGroup_) {
				this.swatchGroup_.dispose()
			}
			this.obj.removeChild(this.scrollParentDiv_);
			this.scrollParentDiv_ = null;
			this.swatchGroup_ = null
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.layoutGrid = function() {
		var a = this.layoutSwatches(false);
		if (a == null) {
			return
		}
		if ((this.fitRows_ < Math.ceil(this.filteredSet_.length / a.cols) && this.scrollbar)) {
			a = this.layoutSwatches(true)
		}
		this.injectSwatches(a);
		this.obj.appendChild(this.scrollParentDiv_);
		if (this.itemIndex_ != -1) {
			this.selectSwatch(this.itemIndex_, true)
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.setMediaSet = function(b, a) {
		a = (typeof a == "number") ? a : 0;
		this.cleanUp();
		this.mediaSet_ = b;
		this.itemIndex_ = -1;
		this.assetName_ = null;
		this.filteredSet_ = s7sdk.SwatchesParser.filterSet(b, a,
				this.showSwatches_);
		this.build()
	};
	s7sdk.set.ThumbnailGridView.prototype.getIndexFromItem = function(d) {
		if (this.mediaSet_ == null) {
			throw new Error(
					"Cannot get index of item because media-set is does not exist!")
		}
		var c = -1;
		var b = this.filteredSet_;
		for ( var a = 0; a < b.length; a++) {
			if (b[a].name == d.name) {
				c = a;
				break
			}
		}
		return c
	};
	s7sdk.set.ThumbnailGridView.prototype.applyItem = function(b) {
		var a = this.getIndexFromItem(b);
		if (a < 0) {
			throw new Error(
					"Cannot apply item because it does not exist in set!")
		}
		this.selectSwatch(a)
	};
	s7sdk.set.ThumbnailGridView.prototype.loadAsset = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINER,
				"s7sdk.set.ThumbnailGridView.loadAsset");
		var b = s7sdk.MediaSetParser.parseAssetForSetReq(this.assetName_);
		var a = this.serverUrl + "/" + b.name;
		a += "?" + b.req;
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			a += "&locale=" + this.locale
		}
		if (this.isReq) {
			this.isReq.cancelHttpReq()
		}
		this.isReq_ = new s7sdk.IS(this.serverUrl, this.assetName_);
		this.isReq_.getHttpReq(a, function(d, c) {
			s7sdk.set.ThumbnailGridView.prototype.setRequestComplete.apply(c,
					[ d ])
		}, function(d, c) {
			s7sdk.set.ThumbnailGridView.prototype.setRequestError.apply(c,
					[ d ])
		}, this)
	};
	s7sdk.set.ThumbnailGridView.prototype.setRequestComplete = function(b) {
		var a = b.set;
		if (a == null) {
			return
		}
		var c = s7sdk.MediaSetParser.parse(a, this.imageModifier);
		this.cleanUp();
		this.mediaSet_ = c;
		this.filteredSet_ = s7sdk.SwatchesParser.filterSet(c, 0,
				this.showSwatches_);
		this.build()
	};
	s7sdk.set.ThumbnailGridView.prototype.setRequestError = function(a) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.WARNING,
						"s7sdk.set.ThumbnailGridView.setRequestError - response: %0",
						a)
	};
	s7sdk.set.ThumbnailGridView.prototype.initSwatches = function() {
		var f;
		var e;
		var c;
		var b = 1;
		this.toLoad = new Array();
		var a = (this.splitFrames) ? Math.round(this.tmbSize.width / 2)
				: this.tmbSize.width;
		this.maxTmbWid_ = a;
		for ( var d = 0; d < this.filteredSet_.length; d++) {
			f = this.filteredSet_[d];
			e = f.swatch;
			var g = b.toString();
			b++;
			if (!f.np) {
				g += " - " + b;
				b++
			}
			c = new s7sdk.Thumb(this.obj, this.serverUrl, this.iscommand, e, a,
					this.tmbSize.height, this.fmt, -1, 0, undefined,
					this.textPos, this.cl, this.locale, true, g,
					this.maxloadradius != -1);
			this.maxTmbWid_ = (c.getWidth() < this.maxTmbWid_) ? this.maxTmbWid_
					: c.getWidth();
			this.maxTmbHei_ = (c.getHeight() < this.maxTmbHei_) ? this.maxTmbHei_
					: c.getHeight();
			this.swatches_[e.frame] = c;
			this.toLoad[d] = d;
			c.div.style.margin = 0 + "px"
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.resize = function(a, b) {
		this.normalizedPosition = this.scrollbarInst ? this.scrollbarInst
				.getNormalizedPosition() : 0;
		var c = false;
		if (b != null && b != "" && s7sdk.Util.isNumber(b)) {
			this.obj.style.height = b + "px";
			c = true
		}
		if (a != null && a != "" && s7sdk.Util.isNumber(a)) {
			this.obj.style.width = a + "px";
			c = true
		}
		if (c) {
			this.cleanUpcommon();
			this.layoutGrid()
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.layoutSwatches = function(c) {
		this.wid_ = this.obj.clientWidth;
		if (c) {
			this.scr = document.createElement("div");
			this.scr.id = "ctnr_" + s7sdk.Util.createUniqueId();
			this.scr.style.position = "absolute";
			this.scr.style.height = this.obj.clientHeight + "px";
			this.scr.style.width = this.obj.clientWidth + "px";
			this.obj.appendChild(this.scr);
			this.scrollbarInst = new s7sdk.ScrollBar(this.scr.id,
					this.settings, "scrollBar_" + s7sdk.Util.createUniqueId());
			this.scrollbarInst.thumb_.obj.style.visibility = "hidden";
			var a = this;
			this.scrollbarInst.addEventListener(
					s7sdk.ScrollEvent.SCROLL_POSITION_EVENT, function(f) {
						a.move(f.s7event.position)
					}, false);
			this.wid_ -= this.scrollbarInst.obj.offsetWidth
		}
		this.hei_ = this.obj.clientHeight;
		var e = Math.floor((this.wid_ - this.cellSpacing.horizontalSpacing)
				/ (this.maxTmbWid_ + this.cellSpacing.horizontalSpacing));
		var b = c ? Math.ceil : Math.floor;
		var d = b((this.hei_ - this.cellSpacing.verticalSpacing)
				/ (this.maxTmbHei_ + this.cellSpacing.verticalSpacing));
		if (e <= 0) {
			this.cleanUpcommon();
			return null
		}
		if (d <= 0) {
			this.cleanUpcommon();
			return null
		}
		this.fitCols_ = e;
		this.fitRows_ = d;
		while (e * d < this.swatches_.length) {
			if (d == 0 || (d * e < this.swatches_.length)) {
				d++
			}
		}
		if (d > this.fitRows_) {
			this.fitRows_ = Math
					.floor((this.hei_ - this.cellSpacing.verticalSpacing)
							/ (this.maxTmbHei_ + this.cellSpacing.verticalSpacing))
		}
		if (this.fitCols_ == 0 || this.fitRows_ == 0) {
			s7sdk.Logger
					.log(
							s7sdk.Logger.WARNING,
							"s7sdk.set.ThumbnailGridView.layoutSwatches - Cannot fit any thumbnails into the given area: width %0 height %1",
							this.wid_, this.hei_);
			this.createScrollParentDiv(0, 0);
			return null
		}
		if (e > this.swatches_.length) {
			e = this.swatches_.length
		}
		return {
			cols : e,
			rows : d
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.injectSwatches = function(d) {
		var n = NaN;
		var b = NaN;
		var l = 0;
		var o = 0;
		var m;
		this.swatchGroup_ = new s7sdk.ScrollableDiv(
				this,
				this.enableDragging.enabled,
				new s7sdk.Point2D(
						this.fitCols_
								* (this.cellSpacing.horizontalSpacing + this.maxTmbWid_)
								+ 2 * this.cellSpacing.horizontalSpacing,
						this.hei_ - this.cellSpacing.verticalSpacing),
				this.interval, this.pageHandler,
				this.enableDragging.overdragvalue);
		var e = new Array();
		for ( var f = 0; f < this.swatches_.length && f < d.cols * d.rows; f++) {
			m = this.swatches_[f];
			n = Math.floor(f / d.cols);
			b = f % d.cols;
			e[f] = {
				col : b,
				row : n
			};
			l = (l < n) ? n : l;
			o = (o < b) ? b : o;
			m.x = this.cellSpacing.horizontalSpacing / 2
					+ (this.dir ? (d.cols - 1 - b) : b)
					* (this.maxTmbWid_ + this.cellSpacing.horizontalSpacing);
			if (this.textPos == s7sdk.Thumb.TEXT_LEFT) {
				m.x += this.maxTmbWid_ - m.getWidth()
			}
			m.y = this.cellSpacing.verticalSpacing / 2 + n
					* (this.maxTmbHei_ + this.cellSpacing.verticalSpacing);
			if (this.textPos == s7sdk.Thumb.TEXT_TOP) {
				m.y += this.maxTmbHei_ - m.getHeight()
			}
			this.swatchGroup_.div.appendChild(m.div);
			m.div.style.position = "absolute";
			m.updatePosition();
			function c(i, p) {
				s7sdk.Event.addDOMListener(p.div, "mouseup", function(q) {
					i.onSwatchClicked(q, p)
				}, true);
				s7sdk.Event.addDOMListener(p.div, "touchend", function(q) {
					i.onSwatchClicked(q, p)
				}, true)
			}
			c(this, m);
			e[f].rect = new s7sdk.Rectangle(m.x, m.y, this.maxTmbWid_,
					this.maxTmbHei_)
		}
		this.swatchesPositions = e;
		l++;
		o++;
		var j = 0;
		var a = 0;
		this.swatchGroup_.xNotch = 2;
		this.swatchGroup_.xNotch = 2;
		var k = this.cellSpacing.horizontalSpacing + o
				* (this.cellSpacing.horizontalSpacing + this.maxTmbWid_);
		var h = this.obj.clientHeight;
		this.swatchGroup_.setLogicalWidth((o + j)
				* (this.cellSpacing.horizontalSpacing + this.maxTmbWid_)
				+ this.cellSpacing.horizontalSpacing);
		this.swatchGroup_.setLogicalHeight((l + a)
				* (this.cellSpacing.verticalSpacing + this.maxTmbHei_));
		this.swatchGroupRect_ = new s7sdk.Rectangle(0, 0, Math.max(Math.min(
				this.swatchGroup_.scrollBounds.x, k), 0), Math.max(h, 0));
		this.createScrollParentDiv(this.swatchGroupRect_.width,
				this.swatchGroupRect_.height);
		this.scrollParentDiv_.appendChild(this.swatchGroup_.div);
		switch (this.align) {
		case "left":
			this.scrollParentDiv_.setX(0);
			break;
		case "right":
			this.scrollParentDiv_.setX(this.wid_ - this.swatchGroupRect_.width);
			break;
		default:
			this.scrollParentDiv_
					.setX((this.wid_ - this.swatchGroupRect_.width) / 2);
			break
		}
		this.scrollParentDiv_.setY(0);
		this.swatchGroup_.layout();
		if (this.scrollbarInst) {
			this.scrollbarInst.setMaxScroll(this.swatchGroup_
					.getLogicalHeight()
					- this.swatchGroupRect_.height
					+ this.cellSpacing.verticalSpacing);
			this.scrollbarInst.setScrollStep(this.maxTmbHei_ + 2
					* this.cellSpacing.verticalSpacing);
			var g = this;
			setTimeout(
					function() {
						if (g.scrollbarInst) {
							g.scrollbarInst
									.setNormalizedPosition(g.normalizedPosition ? g.normalizedPosition
											: 0)
						}
					}, 20)
		}
		if (this.scrollbarInst
				|| (d.rows
						* (this.cellSpacing.verticalSpacing + this.maxTmbHei_) > this.hei_)) {
			this.swatchGroup_.scrollY = true
		}
		this.swatchGroup_.positionEvents_ = true
	};
	s7sdk.set.ThumbnailGridView.prototype.onSwatchClicked = function(b, a) {
		if (this.swatchGroup_.getInterpretAsClick()) {
			this.itemIndex_ = a.item.frame;
			if (a != this.currentSwatch_) {
				this.dispatchEvent(new s7sdk.event.UserEvent(
						s7sdk.event.UserEvent.SWATCH, [ a.item.frame,
								a.item.label ? a.item.label : "" ], false))
			}
			this.applySwatchSelection(a, true, true)
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.applySwatchSelection = function(h, a,
			b) {
		a = (typeof a != "undefined") ? a : false;
		b = (typeof b != "undefined") ? b : false;
		if (h == this.currentSwatch_) {
			return
		}
		if (this.currentSwatch_ != null) {
			this.currentSwatch_.setSelected(false)
		}
		this.currentSwatch_ = h;
		this.currentSwatch_.setSelected(true);
		if (a) {
			var e = 0;
			var c = 0;
			var g = this.swatchGroup_.scrollBounds.x / 2;
			var f = this.swatchGroup_.scrollBounds.y / 2;
			if (h.x > g && h.x < (this.swatchGroup_.getLogicalWidth() - g)) {
				e = -h.x + g
			} else {
				if (h.x >= (this.swatchGroup_.getLogicalWidth() - g)) {
					e = -this.swatchGroup_.getLogicalWidth()
							+ this.swatchGroup_.scrollBounds.x
				}
			}
			if (h.y > f && h.y < (this.swatchGroup_.getLogicalHeight() - f)) {
				c = -h.y + f
			} else {
				if (h.y >= (this.swatchGroup_.getLogicalHeight() - f)) {
					c = -this.swatchGroup_.getLogicalHeight()
							+ this.swatchGroup_.scrollBounds.y
				}
			}
			var i = this;
			function d() {
				if (i.swatchGroup_) {
					i.swatchGroup_.slideTo(new s7sdk.Point2D(e, c))
				}
			}
			setTimeout(d, 100)
		}
		var j = this.mediaSet_.items[this.itemIndex_];
		this.dispatchEvent(new s7sdk.event.AssetEvent(
				s7sdk.event.AssetEvent.SWATCH_SELECTED_EVENT, j, h.item.frame,
				false))
	};
	s7sdk.set.ThumbnailGridView.prototype.addEventListener = function(c, b, a) {
		this.superproto.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.set.ThumbnailGridView.prototype.selectSwatch = function(a, b) {
		b = (typeof b != "undefined") ? b : true;
		this.itemIndex_ = a;
		if (this.swatches_[a] != null && this.swatchGroup_) {
			this.applySwatchSelection(this.swatches_[a], b)
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.move = function(a) {
		this.swatchGroup_.slideToImmediately(new s7sdk.Point2D(
				this.swatchGroup_.getX(), -a))
	};
	s7sdk.set.ThumbnailGridView.prototype.positionChanged = function(a) {
		if (this.scrollbarInst) {
			this.scrollbarInst.setPosition(-a.y)
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.getWidth = function() {
		return this.totalWidth_
	};
	s7sdk.set.ThumbnailGridView.prototype.getHeight = function() {
		return this.totalHeight_
	};
	s7sdk.set.ThumbnailGridView.prototype.getDiv = function() {
		return this.obj
	};
	s7sdk.set.ThumbnailGridView.prototype.getFrame = function() {
		return this.itemIndex_
	};
	s7sdk.set.ThumbnailGridView.prototype.createElement = function() {
		s7sdk.UIComponent.prototype.createElement.apply(this, []);
		this.obj = this.prepareDiv(this.obj);
		this.obj.setWidth(this.totalWidth_);
		this.obj.setHeight(this.totalHeight_);
		this.obj.className = "s7thumbnailgridview";
		s7sdk.Event.addDOMListener(this.obj, "click", function(a) {
			a = a || window.event;
			s7sdk.Event.preventDefault(a)
		}, true);
		s7sdk.Event.addDOMListener(this.obj, "touchstart", function(a) {
			a = a || window.event;
			s7sdk.Event.preventDefault(a)
		}, true);
		s7sdk.Event.addDOMListener(this.obj, "touchmove", function(a) {
			a = a || window.event;
			s7sdk.Event.preventDefault(a)
		}, true);
		s7sdk.Event.addDOMListener(this.obj, "touchend", function(a) {
			a = a || window.event;
			s7sdk.Event.preventDefault(a)
		}, true)
	};
	s7sdk.set.ThumbnailGridView.prototype.createScrollParentDiv = function(b, a) {
		if (this.scrollParentDiv_ == null) {
			this.scrollParentDiv_ = this.prepareDiv();
			this.scrollParentDiv_.setWidth(b);
			this.scrollParentDiv_.setHeight(a);
			this.scrollParentDiv_.style.position = "absolute";
			this.scrollParentDiv_.style.overflow = "hidden"
		}
	};
	s7sdk.set.ThumbnailGridView.prototype.prepareDiv = function(a) {
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
	s7sdk.set.ThumbnailGridView.prototype.hide = function() {
		s7sdk.Util.fade(this.obj, true, 0.3, "block")
	};
	s7sdk.set.ThumbnailGridView.prototype.show = function() {
		s7sdk.Util.fade(this.obj, false, 0.3, "block")
	};
	s7sdk.set.ThumbnailGridView.prototype.setSplitFrames = function(a) {
		return this.splitFrames = a
	};
	s7sdk.ThumbnailGridView = s7sdk.set.ThumbnailGridView;
	(function addDefaultCSS() {
		var f = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		var d = s7sdk.browser && s7sdk.browser.name == "ie"
				&& s7sdk.browser.version.major <= 8;
		var a = f(".s7thumbnailgridview", {
			"background-color" : d ? "rgb(224, 224, 224)"
					: "rgba(100, 100, 100, 0.2)",
			position : "absolute",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
			width : "500px",
			height : "250px"
		})
				+ f(".s7thumbnailgridview .s7thumbcell", {
					margin : "5px"
				}) + f(".s7thumbnailgridview .s7thumb", {
					border : "1px solid transparent",
					width : "75px",
					height : "75px"
				}) + f(".s7thumbnailgridview .s7thumb[state='selected']", {
					border : "1px solid #FFFFFF"
				}) + f(".s7thumbnailgridview .s7label", {
					"font-family" : "Helvetica, sans-serif",
					"font-size" : "12px"
				});
		var e = {
			display : "block",
			width : "20px",
			height : "20px"
		};
		var b = f(".s7thumbnailgridview .s7scrollbar", {
			"background-color" : d ? "rgb(224, 224, 224)"
					: "rgba(100, 100, 100, 0.2)",
			position : "absolute",
			top : "0px",
			bottom : "0px",
			right : "0px",
			width : "22px"
		})
				+ f(".s7thumbnailgridview .s7scrollbar .s7scrollthumb", {
					width : "20px",
					position : "absolute",
					backgroundRepeat : "no-repeat",
					backgroundPosition : "center",
					height : "30px"
				})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollthumb[state='up']",
						{
							"background-image" : c("scrollbar_thumb_up.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollthumb[state='over']",
						{
							"background-image" : c("scrollbar_thumb_over.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollthumb[state='down']",
						{
							"background-image" : c("scrollbar_thumb_down.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollthumb[state='disabled']",
						{
							"background-image" : c("scrollbar_thumb_disabled.png")
						})
				+ f(".s7thumbnailgridview .s7scrollbar .s7scrolltrack", {
					width : "20px",
					"background-color" : "#cbcbcb"
				})
				+ f(".s7thumbnailgridview .s7scrollbar .s7scrollupbutton", e)
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollupbutton[state='up']",
						{
							"background-image" : c("scroll_up_up.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollupbutton[state='over']",
						{
							"background-image" : c("scroll_up_over.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollupbutton[state='down']",
						{
							"background-image" : c("scroll_up_down.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrollupbutton[state='disabled']",
						{
							"background-image" : c("scroll_up_disabled.png")
						})
				+ f(".s7thumbnailgridview .s7scrollbar .s7scrolldownbutton", e)
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrolldownbutton[state='up']",
						{
							"background-image" : c("scroll_down_up.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrolldownbutton[state='over']",
						{
							"background-image" : c("scroll_down_over.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrolldownbutton[state='down']",
						{
							"background-image" : c("scroll_down_down.png")
						})
				+ f(
						".s7thumbnailgridview .s7scrollbar .s7scrolldownbutton[state='disabled']",
						{
							"background-image" : c("scroll_down_disabled.png")
						});
		s7sdk.Util.css.addDefaultCSS(a + b, "ThumbnailGridView")
	})()
};