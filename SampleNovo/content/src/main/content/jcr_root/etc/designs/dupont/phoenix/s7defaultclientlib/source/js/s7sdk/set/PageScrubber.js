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
s7sdk.Util.require("s7sdk.common.Geometry");
s7sdk.Util.require("s7sdk.common.ItemDesc");
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.event.Event");
if (!s7sdk.set.PageScrubber) {
	s7sdk.set.PageScrubber = function PageScrubber(b, d, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.set.PageScrubber constructor - containerId: %0, settings: %1 , compId: %2",
						b, d, c);
		c = (typeof c == "string" && c.length) ? c : "PageScrubber_"
				+ s7sdk.Util.createUniqueId();
		this.id = (s7sdk.Util.isNull(c) ? "" : c);
		arguments.callee.superclass.apply(this, [ c, b, "div",
				"s7pagescrubber", d ]);
		this.compConatiner = this.createElement();
		this.uiContainer = s7sdk.Util.byId(b);
		if (this.uiContainer != null) {
			this.uiContainer.appendChild(this.obj)
		}
		this.scrubberOffset = 0;
		this.track = null;
		this.dragInstance = null;
		this.mediaSet = null;
		this.logicalPage = 0;
		this.prevPage = -1;
		this.pageCount = 0;
		this.pageIndex = 1;
		this.pageData = [];
		this.pageTicks = [];
		this.amtOfChange = 0;
		this.wid = parseInt(s7sdk.Util.css.getCss("s7pagescrubber", "width", c,
				null, this.container));
		if (!s7sdk.Util.isNumber(this.wid) || this.wid <= 0) {
			if ("clientWidth" in this.container) {
				this.wid = this.container.clientWidth
			}
			if (this.wid == 0) {
				this.wid = 400
			}
		}
		var a = this;
		this.__mouseDown = function(f) {
			a.mouseDown(f)
		};
		this.__mouseMove = function(f) {
			a.mouseMove(f)
		};
		this.__mouseUp = function(f) {
			a.mouseUp(f)
		};
		this.__trackClick = function(f) {
			a.trackClick(f)
		};
		this.mouseIsDown = false;
		this.maxldradius = parseInt(this.maxloadradius);
		this.preloadImg = (this.pagethumb == "image") && this.maxldradius >= 0;
		if (this.preloadImg) {
			this.delay = 50;
			this.queue = new Array();
			this.timer = setInterval(s7sdk.Util.wrapContext(this.onProcess,
					this), this.delay)
		}
		this.parseSettings()
	};
	s7sdk.Class.inherits("s7sdk.set.PageScrubber", "s7sdk.UIComponent");
	s7sdk.set.PageScrubber.prototype.modifiers = {
		serverUrl : {
			params : [ "serverUrl" ],
			defaults : [ "/is/image/" ]
		},
		asset : {
			params : [ "imageSet" ],
			defaults : [ "" ]
		},
		locale : {
			params : [ "locale" ],
			defaults : [ "" ]
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
		pagethumb : {
			params : [ "pagethumb" ],
			defaults : [ "doublepage" ],
			ranges : [ [ "none", "singlepage", "doublepage", "image" ] ]
		},
		direction : {
			params : [ "direction" ],
			defaults : [ "auto" ],
			ranges : [ [ "auto", "left", "right" ] ]
		},
		logLevel : {
			params : [ "loglevel" ],
			defaults : [ "" ],
			parseParams : false
		},
		aligntotick : {
			params : [ "aligntotick" ],
			defaults : [ false ]
		},
		labelKey : {
			params : [ "key" ],
			defaults : [ "label" ]
		}
	};
	s7sdk.set.PageScrubber.prototype.symbols = {
		PAGE_THUMB_TEXT : "Page"
	};
	s7sdk.set.PageScrubber.prototype.parseSettings = function() {
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
		this.bubbleDiv = null;
		this.bubbleText = null;
		this.bubbleImage = null;
		this.currentMousePoint = new s7sdk.Point2D(0, 0);
		this.showtmb = (this.pagethumb == "none") ? false : true;
		this.showpagepair = (this.pagethumb == "doublepage");
		this.alignLeft = (this.direction == "auto" ? (this.settings.locale != "ja" ? true
				: false)
				: (this.direction == "left" ? true : false));
		this.build();
		if (this.asset != "") {
			this.setAsset(this.asset)
		}
	};
	s7sdk.set.PageScrubber.prototype.cleanUp = function() {
		if (this.obj) {
			this.track.removeChild(this.dragInstance);
			this.dragInstance = null;
			this.obj.removeChild(this.track)
		}
	};
	s7sdk.set.PageScrubber.prototype.loadAsset = function() {
		s7sdk.Logger.log(s7sdk.Logger.INFO, "s7sdk.set.PageScrubber.loadAsset");
		var b = s7sdk.MediaSetParser.parseAssetForSetReq(this.asset);
		var a = this.serverUrl + b.name;
		a += "?" + b.req;
		if (s7sdk.Util.isNonEmptyString(this.labelKey)) {
			a += "&labelkey=" + this.labelKey
		}
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			a += "&locale=" + this.locale
		}
		if (this.isReq) {
			this.isReq.cancelHttpReq()
		}
		this.isReq_ = new s7sdk.IS(this.serverUrl, this.asset);
		this.isReq_.getHttpReq(a, function(d, c) {
			s7sdk.set.PageScrubber.prototype.setRequestComplete.apply(c, [ d ])
		}, function(d, c) {
			s7sdk.set.PageScrubber.prototype.setRequestError.apply(c, [ d ])
		}, this)
	};
	s7sdk.set.PageScrubber.prototype.setRequestComplete = function(b) {
		var a = b.set;
		if (a == null) {
			return
		}
		var c = s7sdk.MediaSetParser.parse(a, "");
		this.setMediaSet(c);
		this.cleanUp();
		this.build()
	};
	s7sdk.set.PageScrubber.prototype.getNextToLoad = function() {
		if (this.pageData.length == 0) {
			return
		}
		var b = this.pageIndex - 1 - this.maxldradius;
		var c = this.pageIndex + this.maxldradius;
		if (b < 0) {
			b = 0
		}
		if (c > this.pageData.length - 1) {
			c = this.pageData.length
		}
		if (b == c) {
			return this.pageData[b]
		} else {
			for ( var a = b; a < c; a++) {
				if (!this.pageData[a].isComlete) {
					return this.pageData[a]
				}
			}
		}
	};
	s7sdk.set.PageScrubber.prototype.onProcess = function() {
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
	s7sdk.set.PageScrubber.prototype.setRequestError = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.WARNING,
				"s7sdk.set.PageScrubber.setRequestError - response: %0", a)
	};
	s7sdk.set.PageScrubber.prototype.build = function() {
		var d = parseInt(s7sdk.Util.css.getCss("s7track", "width", this.id,
				"s7pagescrubber", this.uiContainer));
		var b = parseInt(s7sdk.Util.css.getCss("s7track", "height", this.id,
				"s7pagescrubber", this.uiContainer));
		this.scrubberOffset = parseInt(s7sdk.Util.css.getCss("s7button",
				"width", this.id, "s7pagescrubber", this.uiContainer)) * 0.5;
		this.imageWidth = s7sdk.Util.css.getCss("s7imgbubble", "width",
				this.id, "s7pagescrubber", this.uiContainer);
		this.imageHeight = s7sdk.Util.css.getCss("s7imgbubble", "height",
				this.id, "s7pagescrubber", this.uiContainer);
		var a = s7sdk.Util.createElement("div", {});
		this.track = a;
		if (this.wid > 0) {
			d = this.wid;
			this.obj.style.width = this.formatValueForStyle(d);
			this.track.style.width = this.formatValueForStyle(d)
		}
		this.dragBounds = new s7sdk.Point2D(d, b);
		var c = s7sdk.Util.createElement("div", {});
		this.dragInstance = c;
		a.className = "s7track";
		c.className = "s7button";
		this.obj.appendChild(a);
		a.appendChild(c);
		this.addInteraction(c);
		s7sdk.Event.addDOMListener(a, "click", this.__trackClick, false);
		if (!this.alignLeft) {
			this.currentMousePoint = new s7sdk.Point2D(this.dragBounds.x,
					this.dragBounds.y);
			this.positionAt(this.dragBounds.x - (this.scrubberOffset * 2))
		} else {
			this.positionAt(0)
		}
	};
	s7sdk.set.PageScrubber.prototype.addInteraction = function(a) {
		s7sdk.Event.addDOMListener(a, "mousedown", this.__mouseDown, false);
		s7sdk.Event.addDOMListener(a, "touchstart", this.__mouseDown, false)
	};
	s7sdk.set.PageScrubber.prototype.setMediaSet = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageScrubber.setMediaSet - mediaSet: %0", a);
		if (a != null) {
			this.mediaSet = a;
			this.setPages()
		}
	};
	s7sdk.set.PageScrubber.prototype.setPages = function() {
		this.pageCount = this.mediaSet.items.length;
		this.buildPageData();
		this.buildTicks()
	};
	s7sdk.set.PageScrubber.prototype.buildTicks = function() {
		var b = Math.ceil(this.dragBounds.x / this.pageCount);
		var c = [];
		for ( var a = 0; a < this.pageCount - 1; a++) {
			c.push(a * b + (a != 0 ? b / 2 : 0))
		}
		c.push(this.dragBounds.x);
		this.pageTicks = c
	};
	s7sdk.set.PageScrubber.prototype.buildPageData = function() {
		var d = 1;
		var g = this.getLocalizedText("PAGE_THUMB_TEXT");
		this.pageData = [];
		for ( var c = 0; c < this.pageCount; c++) {
			var f = {};
			var e = "";
			var h = this.mediaSet.items[c];
			if (typeof (h.label) != "undefined" && h.label != "") {
				e = h.label;
				if (h.np == true || !this.showpagepair) {
					d++
				} else {
					d += 2
				}
			} else {
				if (h.np == true || !this.showpagepair) {
					e = g + " " + d++
				} else {
					e += g + " " + d++ + "-" + d++
				}
			}
			var b = h.name;
			var a = this.generateImageUrl(b);
			f.text = e;
			f.image = a;
			f.isLoading = false;
			f.isComlete = false;
			f.loadImage = this.loadImage;
			f.owner = this;
			f.page = c;
			this.pageData.push(f);
			if (this.pagethumb == "image" && !this.preloadImg) {
				f.loadImage()
			}
		}
		if (this.pagethumb == "image" && this.preloadImg) {
			this.pageData[0].loadImage()
		}
		if (!this.alignLeft) {
			this.pageData.reverse();
			this.pageIndex = this.pageCount
		}
	};
	s7sdk.set.PageScrubber.prototype.generateImageUrl = function(a) {
		var b = this.serverUrl;
		b += a;
		if (b.indexOf("?") > -1) {
			b += "&layer=comp&"
		} else {
			b += "?"
		}
		b += "hei=" + parseInt(this.imageHeight);
		if (this.iscommand && this.iscommand.length > 0) {
			b += "&" + this.iscommand
		}
		if (s7sdk.Util.isNonEmptyString(this.locale)) {
			b += "&locale=" + this.locale
		}
		return b
	};
	s7sdk.set.PageScrubber.prototype.loadImage = function() {
		if (this.isLoading) {
			return
		}
		var a = document.createElement("img");
		a.src = this.image;
		this.img_ = a;
		var b = this;
		b.isLoading = true;
		if (b.img_.complete) {
			b.isComlete = true;
			b.img_ = null;
			b.owner.updateBubble(b)
		} else {
			a.onabort = a.onerror = a.onload = function(c) {
				b.img_ = null;
				b.isComlete = true;
				b.owner.updateBubble(b)
			}
		}
	};
	s7sdk.set.PageScrubber.prototype.trackClick = function(a) {
		if (this.pageCount <= 0) {
			return
		}
		s7sdk.Event.preventDefault(a);
		s7sdk.Event.stopPropagation(a);
		var b = typeof (a.target) != "undefined" ? a.target : a.srcElement;
		if (b == this.track) {
			this.proceedPositioning(a)
		}
	};
	s7sdk.set.PageScrubber.prototype.proceedPositioning = function(e) {
		var a = s7sdk.Util.getObjPos(this.obj).x;
		var d = s7sdk.Util.getEventPos(e).x - (a);
		var c = s7sdk.Util.getEventPos(e).y;
		this.currentMousePoint = new s7sdk.Point2D(d, c);
		if (this.aligntotick) {
			if ((this.currentMousePoint.x - this.scrubberOffset) <= 0) {
				this.currentMousePoint.x = 0
			} else {
				if (this.currentMousePoint.x > this.dragBounds.x) {
					this.currentMousePoint.x = this.dragBounds.x
							- this.scrubberOffset
				}
			}
		} else {
			this.adjustTrackPos()
		}
		var b = Math
				.ceil(this.pageCount
						- ((this.dragBounds.x - this.currentMousePoint.x) / this.dragBounds.x)
						* this.pageCount);
		b = (b > this.pageCount) ? this.pageCount : (b <= 0) ? 1 : b;
		this.proceedPageset(b, false)
	};
	s7sdk.set.PageScrubber.prototype.proceedPageset = function(b, c) {
		if (this.aligntotick || c) {
			this.currentMousePoint.x = this.pageTicks[b - 1];
			this.adjustTrackPos()
		}
		var a = b != this.pageIndex;
		this.pageIndex = b;
		if (this.showtmb && this.bubbleDiv == null) {
			this.buildBubble()
		}
		var d = this;
		setTimeout(function() {
			if (d.showtmb) {
				d.removeBubble()
			}
		}, 600);
		(this.pagethumb == "image") ? this.setImage() : this.setText();
		this.logicalPage = this.pageData[this.pageIndex - 1].page;
		if (a) {
			this.dispatchEvent(new s7sdk.event.SliderEvent(
					s7sdk.event.SliderEvent.NOTF_SLIDER_MOVE,
					[ this.logicalPage ], false));
			this.dispatchEvent(new s7sdk.event.AssetEvent(
					s7sdk.event.AssetEvent.ITEM_SELECTED_EVENT, this
							.getCurrentAsset(), this.logicalPage, false))
		}
	};
	s7sdk.set.PageScrubber.prototype.mouseDown = function(d) {
		if (this.pageCount <= 0) {
			return
		}
		d = d || window.event;
		s7sdk.Event.preventDefault(d);
		this.mouseIsDown = true;
		this.prevPage = this.logicalPage;
		if (this.showtmb && this.bubbleDiv == null) {
			this.buildBubble()
		}
		var a = s7sdk.Util.getObjPos(this.obj).x;
		var c = s7sdk.Util.getEventPos(d).x - (a);
		var b = s7sdk.Util.getEventPos(d).y;
		this.currentMousePoint = new s7sdk.Point2D(c, b);
		s7sdk.Event.addDOMListener(document, "mousemove", this.__mouseMove,
				false);
		s7sdk.Event.addDOMListener(document, "mouseup", this.__mouseUp, false);
		s7sdk.Event.addDOMListener(document, "touchmove", this.__mouseMove,
				false);
		s7sdk.Event.addDOMListener(document, "touchend", this.__mouseUp, false);
		this.dispatchEvent(new s7sdk.event.SliderEvent(
				s7sdk.event.SliderEvent.NOTF_SLIDER_DOWN, [ this.logicalPage ],
				false))
	};
	s7sdk.set.PageScrubber.prototype.mouseMove = function(e) {
		if (this.pageCount <= 0) {
			return
		}
		e = e || window.event;
		s7sdk.Event.preventDefault(e);
		var a = s7sdk.Util.getObjPos(this.obj).x;
		var d = s7sdk.Util.getEventPos(e).x - (a);
		var c = s7sdk.Util.getEventPos(e).y;
		this.adjustTrackPos();
		this.currentMousePoint = new s7sdk.Point2D(d, c);
		var b = Math
				.ceil(this.pageCount
						- ((this.dragBounds.x - this.currentMousePoint.x) / this.dragBounds.x)
						* this.pageCount);
		b = (b > this.pageCount) ? this.pageCount : (b <= 0) ? 1 : b;
		if (b != this.pageIndex) {
			this.pageIndex = b;
			(this.pagethumb == "image") ? this.setImage() : this.setText();
			this.logicalPage = this.pageData[this.pageIndex - 1].page;
			this.dispatchEvent(new s7sdk.event.SliderEvent(
					s7sdk.event.SliderEvent.NOTF_SLIDER_MOVE,
					[ this.logicalPage ], false))
		}
	};
	s7sdk.set.PageScrubber.prototype.adjustTrackPos = function() {
		if ((this.currentMousePoint.x - this.scrubberOffset) <= 0) {
			this.positionAt(0)
		} else {
			if (this.currentMousePoint.x > (this.alignLeft ? this.dragBounds.x
					: (this.dragBounds.x - this.scrubberOffset))) {
				this
						.positionAt((this.dragBounds.x - (this.scrubberOffset * 2)))
			} else {
				this
						.positionAt((this.currentMousePoint.x - this.scrubberOffset))
			}
		}
	};
	s7sdk.set.PageScrubber.prototype.setText = function() {
		if (typeof (this.bubbleText) == "undefined" || this.bubbleText == null) {
			return
		}
		var a = this.pageData[this.pageIndex - 1].text;
		if (typeof (this.bubbleText.textContent) != "undefined") {
			this.bubbleText.textContent = a
		} else {
			this.bubbleText.nodeValue = a
		}
	};
	s7sdk.set.PageScrubber.prototype.setImage = function() {
		if (typeof (this.bubbleImage) == "undefined"
				|| this.bubbleImage == null) {
			return
		}
		var a = this.pageData[this.pageIndex - 1];
		if (a.isComlete) {
			this.bubbleImage.src = a.image;
			this.bubbleDiv.style.visibility = "inherit"
		} else {
			this.bubbleDiv.style.visibility = "hidden"
		}
		s7sdk.Logger.log(s7sdk.Logger.INFO,
				"s7sdk.set.PageScrubber.setImage - img: %0", a)
	};
	s7sdk.set.PageScrubber.prototype.updateBubble = function(a) {
		if (this.bubbleImage && ((this.pageIndex - 1) == a.page)) {
			this.bubbleImage.src = a.image;
			if (this.bubbleDiv) {
				this.bubbleDiv.style.visibility = "inherit"
			}
		}
	};
	s7sdk.set.PageScrubber.prototype.positionAt = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageScrubber.positionAt - val: %0", a);
		this.dragInstance.style.left = this.formatValueForStyle(a)
	};
	s7sdk.set.PageScrubber.prototype.buildBubble = function() {
		if (this.bubbleDiv) {
			return
		}
		this.bubbleDiv = s7sdk.Util.createElement("div", {});
		var a = (this.pagethumb == "image") ? this.buildImageBubble() : this
				.buildTextBubble();
		this.bubbleDiv.appendChild(a);
		this.bubbleDiv.className = (this.pagethumb == "image") ? "s7imgbubble"
				: "s7bubble";
		this.dragInstance.appendChild(this.bubbleDiv);
		if (this.pagethumb == "image") {
			this.setImage()
		} else {
			this.setText()
		}
	};
	s7sdk.set.PageScrubber.prototype.buildTextBubble = function() {
		var a = document.createTextNode("");
		this.bubbleText = a;
		return a
	};
	s7sdk.set.PageScrubber.prototype.buildImageBubble = function() {
		var a = document.createElement("img");
		this.bubbleImage = a;
		return a
	};
	s7sdk.set.PageScrubber.prototype.formatValueForStyle = function(b) {
		var a = b.toString();
		if ((a.lastIndexOf("px") != -1)
				&& (a.lastIndexOf("px") == (a.length - 2))) {
			return a
		} else {
			return a + "px"
		}
	};
	s7sdk.set.PageScrubber.prototype.removeBubble = function() {
		if (!this.bubbleDiv || this.mouseIsDown) {
			return
		}
		this.dragInstance.removeChild(this.bubbleDiv);
		this.bubbleDiv = null
	};
	s7sdk.set.PageScrubber.prototype.mouseUp = function(a) {
		a = a || window.event;
		s7sdk.Event.preventDefault(a);
		this.mouseIsDown = false;
		if (this.showtmb) {
			this.removeBubble()
		}
		s7sdk.Event.removeDOMListener(document, "mousemove", this.__mouseMove,
				false);
		s7sdk.Event.removeDOMListener(document, "mouseup", this.__mouseUp,
				false);
		s7sdk.Event.removeDOMListener(document, "touchmove", this.__mouseMove,
				false);
		s7sdk.Event.removeDOMListener(document, "touchend", this.__mouseUp,
				false);
		if (this.prevPage != this.logicalPage) {
			this.dispatchEvent(new s7sdk.event.SliderEvent(
					s7sdk.event.SliderEvent.NOTF_SLIDER_UP, this.logicalPage,
					false));
			this.dispatchEvent(new s7sdk.event.AssetEvent(
					s7sdk.event.AssetEvent.ITEM_SELECTED_EVENT, this
							.getCurrentAsset(), this.logicalPage, false));
			this.prevPage = this.logicalPage
		}
		if (this.aligntotick) {
			this.proceedPositioning(a)
		}
	};
	s7sdk.set.PageScrubber.prototype.getCurrentAsset = function() {
		var b = this.mediaSet.items;
		var a = b[this.logicalPage];
		return a
	};
	s7sdk.set.PageScrubber.prototype.setAsset = function(c) {
		if (typeof c != "string") {
			throw new Error("Asset name must be represented by a string!")
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageScrubber.setAsset - asset: %0", c);
		var a = unescape(c);
		if (this.asset != null && a != this.asset) {
			var b = new s7sdk.UserEvent(s7sdk.UserEvent.SWAP, [ 0, c ], true);
			s7sdk.Event.dispatch(this.obj, b, false)
		}
		this.asset = a;
		this.loadAsset()
	};
	s7sdk.set.PageScrubber.prototype.addEventListener = function(c, b, a) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.FINE,
						"s7sdk.set.PageScrubber.addEventListener - type: %0, handler: %1, useCapture: %2",
						c,
						b.toString().substring(0, b.toString().indexOf("(")), a);
		this.superproto.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.set.PageScrubber.prototype.resize = function(c, g) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.PageScrubber.resize - w: %0, h: %1", c, g);
		var b = (this.wid == 0) ? this.dragBounds.x : this.wid;
		var d = (c < this.wid);
		var e = Math.abs((b - c) / b);
		var f = (this.currentMousePoint.x < 0) ? 0 : this.currentMousePoint.x;
		var a = Math.round((f * e));
		if (!d) {
			a = f + a
		} else {
			a = Math.abs(f - a)
		}
		this.wid = c;
		this.hei = g;
		this.cleanUp();
		this.build();
		if (this.aligntotick) {
			this.buildTicks()
		}
		this.currentMousePoint.x = a;
		this.adjustTrackPos()
	};
	s7sdk.set.PageScrubber.prototype.getCurrentFrameIndex = function() {
		return this.logicalPage
	};
	s7sdk.set.PageScrubber.prototype.setCurrentFrameIndex = function(b) {
		var a = parseInt(b);
		if (this.logicalPage == a) {
			return
		}
		if (a < 0 || a > (this.pageCount - 1)) {
			return
		}
		if (!this.alignLeft) {
			a = this.pageCount - a - 1
		}
		this.proceedPageset(a + 1, true)
	};
	s7sdk.PageScrubber = s7sdk.set.PageScrubber;
	(function addDefaultCSS() {
		var e = s7sdk.Util.css.createCssRuleText;
		var f = s7sdk.Util.css.createCssImgUrlText;
		var h = s7sdk.Util.css.createCssAnimationText;
		var j = {
			background : "#49494A",
			position : "absolute",
			left : "-38px",
			top : "-30px",
			width : "100px",
			height : "26px",
			"border-radius" : "6px",
			"text-align" : "center",
			"font-family" : "Arial",
			"font-size" : "14px",
			"line-height" : "25px",
			"word-wrap" : "normal",
			"white-space" : "nowrap",
			"overflow-wrap" : "none",
			"text-wrap" : "none"
		};
		var g = {
			background : "#49494A",
			position : "absolute",
			"border-radius" : "5px",
			"text-align" : "center",
			"font-family" : "Arial",
			"font-size" : "14px",
			"line-height" : "25px",
			"word-wrap" : "normal",
			"white-space" : "nowrap",
			"overflow-wrap" : "none",
			"text-wrap" : "none",
			width : "160px",
			height : "100px",
			top : "-115px",
			left : "-73px",
			padding : "5px"
		};
		var k = {
			background : "#49494A",
			height : "24px",
			width : "24px",
			"-moz-border-radius" : "12px",
			"-webkit-border-radius" : "12px",
			"border-radius" : "12px",
			position : "absolute",
			top : "-4px",
			color : "white"
		};
		var b = {
			width : "700px",
			height : "16px",
			"text-align" : "center",
			"background-color" : "#E5E5E8",
			position : "absolute",
			bottom : "0px",
			"-moz-border-radius" : "8px",
			"-webkit-border-radius" : "8px",
			"border-radius" : "8px"
		};
		var m = {
			width : "710px",
			height : "100px",
			position : "absolute",
			"-webkit-user-select" : "none",
			"-moz-user-select" : "none",
			"-ms-user-select" : "none",
			"user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		};
		var i = e(".s7pagescrubber", m);
		var d = e(".s7pagescrubber .s7track", b);
		var l = e(".s7pagescrubber .s7button", k);
		var a = e(".s7pagescrubber .s7bubble", j);
		var c = e(".s7pagescrubber .s7imgbubble", g);
		s7sdk.Util.css.addDefaultCSS(i + d + l + a + c, "PageScrubber")
	})()
};