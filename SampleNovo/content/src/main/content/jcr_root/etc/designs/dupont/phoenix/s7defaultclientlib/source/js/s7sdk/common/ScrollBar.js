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
s7sdk.Util.require("s7sdk.common.Button");
s7sdk.Util.require("s7sdk.event.Event");
if (!s7sdk.ScrollBar) {
	s7sdk.ScrollBar = function ScrollBar(a, c, b) {
		arguments.callee.superclass.apply(this,
				[ b, a, "div", "s7scrollbar", c ]);
		this.containerId_ = a;
		this.createElement();
		this.build()
	};
	s7sdk.Class.inherits("s7sdk.ScrollBar", "s7sdk.UIComponent");
	s7sdk.ScrollBar.prototype.getIntFromStyle = function(d, a, c) {
		var b = parseInt(s7sdk.Util.getStyle(d, a));
		return s7sdk.Util.isNumber(b) ? b : c
	};
	s7sdk.ScrollBar.prototype.getThumbMovingDistance = function() {
		return this.getTrackHeight() - this.thumb_.obj.offsetHeight
	};
	s7sdk.ScrollBar.prototype.getTrackHeight = function() {
		var a = parseInt(this.downButton_.obj.offsetTop)
				- (parseInt(this.upButton_.obj.offsetTop)
						+ this.upButton_.obj.offsetHeight
						+ this.getIntFromStyle(this.track_.obj,
								"border-top-width", 0) + this.getIntFromStyle(
						this.track_.obj, "border-bottom-width", 0));
		return a < 0 ? 0 : a
	};
	s7sdk.ScrollBar.prototype.layoutControls = function() {
		this.track_ = new s7sdk.UIComponent(null, this.obj.id, "div",
				"s7scrolltrack", null);
		this.track_.createElement();
		this.track_.obj.style.position = "absolute";
		this.track_.obj.style.backgroundRepeat = "no-repeat";
		this.track_.obj.style.backgroundPosition = "center";
		this.obj.appendChild(this.track_.obj);
		this.upButton_ = new s7sdk.ScrollUpButton(this.obj.id, this.settings);
		this.upButton_.obj.style.position = "absolute";
		this.downButton_ = new s7sdk.ScrollDownButton(this.obj.id,
				this.settings);
		this.downButton_.obj.style.position = "absolute";
		this.thumb_ = new s7sdk.ScrollBarThumb(this.obj.id, this.settings);
		this.thumb_.obj.style.top = this.upButton_.obj.offsetTop
				+ this.upButton_.obj.offsetHeight + "px";
		this.track_.obj.style.top = this.thumb_.obj.style.top;
		this.screenStartY_ = s7sdk.Util.getObjPos(this.track_.obj).y;
		var b = this.getTrackHeight();
		if (b <= 0) {
			this.downButton_.obj.style.bottom = 0 + "px";
			b = this.getTrackHeight()
		}
		this.track_.obj.style.height = this.getTrackHeight() + "px";
		this.obj.appendChild(this.thumb_.obj);
		this.thumb_.changeState(0);
		var a = this;
		this.__mouseDown = function(c) {
			a.mouseDown(c)
		};
		this.__mouseMove = function(c) {
			a.mouseMove(c)
		};
		this.__mouseUp = function(c) {
			a.mouseUp(c)
		};
		s7sdk.Event.addDOMListener(this.thumb_.obj, "mousedown",
				this.__mouseDown, false);
		s7sdk.Event.addDOMListener(this.thumb_.obj, "touchstart",
				this.__mouseDown, false);
		this.downButton_.addEventListener("click", function(c) {
			a.thumbStepMove(false)
		});
		this.upButton_.addEventListener("click", function(c) {
			a.thumbStepMove(true)
		});
		if ("ontouchstart" in window) {
			s7sdk.Event.addDOMListener(this.track_.obj, "touchstart", function(
					c) {
				a.mouseMoveTrack(c)
			}, false)
		} else {
			s7sdk.Event.addDOMListener(this.track_.obj, "click", function(c) {
				a.mouseMoveTrack(c)
			}, false)
		}
	};
	s7sdk.ScrollBar.prototype.mouseDown = function(b) {
		b = b || window.event;
		s7sdk.Event.preventDefault(b);
		var a = s7sdk.Util.getEventPos(b).y;
		this.mouseIsDown_ = true;
		this.cursorStartStage_ = a;
		s7sdk.Event.addDOMListener(document, "mousemove", this.__mouseMove,
				false);
		s7sdk.Event.addDOMListener(document, "mouseup", this.__mouseUp, false);
		s7sdk.Event.addDOMListener(document, "touchmove", this.__mouseMove,
				false);
		s7sdk.Event.addDOMListener(document, "touchend", this.__mouseUp, false);
		this.thumb_.changeState(1)
	};
	s7sdk.ScrollBar.prototype.mouseMoveTrack = function(b) {
		b = b || window.event;
		s7sdk.Event.preventDefault(b);
		var a = s7sdk.Util.getEventPos(b).y - this.screenStartY_
				- this.thumb_.obj.offsetHeight / 2;
		this.cursorStartStage_ = s7sdk.Util.getEventPos(b).y;
		this.curPos_ = a * this.maxScroll_ / this.getThumbMovingDistance();
		this.setThumbPosition();
		this.thumb_.changeState(1)
	};
	s7sdk.ScrollBar.prototype.mouseMove = function(b) {
		b = b || window.event;
		s7sdk.Event.preventDefault(b);
		var a = s7sdk.Util.getEventPos(b).y - this.cursorStartStage_;
		this.cursorStartStage_ = s7sdk.Util.getEventPos(b).y;
		var d = s7sdk.Util.getObjPos(this.track_.obj).y;
		var c = this.curPos_ > 0 && this.curPos_ < this.maxScroll_;
		a = (this.cursorStartStage_ > d)
				&& (this.cursorStartStage_ < (d + this.track_.obj.offsetHeight) || c) ? a
				: 0;
		this.curPos_ += a * this.maxScroll_ / this.getThumbMovingDistance();
		this.setThumbPosition();
		this.thumb_.changeState(1)
	};
	s7sdk.ScrollBar.prototype.mouseUp = function(a) {
		a = a || window.event;
		s7sdk.Event.preventDefault(a);
		this.mouseIsDown_ = false;
		s7sdk.Event.removeDOMListener(document, "mousemove", this.__mouseMove,
				false);
		s7sdk.Event.removeDOMListener(document, "mouseup", this.__mouseUp,
				false);
		s7sdk.Event.removeDOMListener(document, "touchmove", this.__mouseMove,
				false);
		s7sdk.Event.removeDOMListener(document, "touchend", this.__mouseUp,
				false);
		this.thumb_.changeState(0)
	};
	s7sdk.ScrollBar.prototype.thumbStepMove = function(a) {
		this.curPos_ = this.curPos_
				+ (a ? -this.scrollStep_ : this.scrollStep_);
		this.setThumbPosition()
	};
	s7sdk.ScrollBar.prototype.setThumbPosition = function(b) {
		if (this.curPos_ <= 0) {
			this.curPos_ = 0;
			if (this.upButton_.activated) {
				this.upButton_.deactivate()
			}
			this.downButton_.activate()
		} else {
			if (this.curPos_ >= this.maxScroll_) {
				this.curPos_ = this.maxScroll_;
				if (this.downButton_.activated) {
					this.downButton_.deactivate()
				}
				this.upButton_.activate()
			} else {
				if (!this.downButton_.activated) {
					this.downButton_.currentState = 0;
					this.downButton_.activate()
				}
				if (!this.upButton_.activated) {
					this.upButton_.currentState = 0;
					this.upButton_.activate()
				}
			}
		}
		var a = this.getThumbMovingDistance() * this.curPos_ / this.maxScroll_;
		this.thumb_.obj.style.top = (this.track_.obj.offsetTop + a) + "px";
		if (this.prevPos != this.curPos_) {
			this.prevPos = this.curPos_;
			if (!b) {
				this.dispatchEvent(new s7sdk.ScrollEvent(
						s7sdk.ScrollEvent.SCROLL_POSITION_EVENT, this.curPos_,
						true))
			}
		}
	};
	s7sdk.ScrollBar.prototype.build = function() {
		this.maxScroll_ = 2;
		this.curPos_ = 0;
		this.scrollStep_ = 1;
		this.container_ = document.getElementById(this.containerId_);
		this.container_.appendChild(this.obj);
		this.layoutControls()
	};
	s7sdk.ScrollBar.prototype.addEventListener = function(c, b, a) {
		this.superproto.addEventListener.apply(this, [ c, b, a ])
	};
	s7sdk.ScrollBar.prototype.resize = function() {
		this.track_.obj.style.height = this.getTrackHeight() + "px";
		if (this.prevHeight) {
			this.curPos_ = this.curPos_ * this.getThumbMovingDistance()
					/ this.prevHeight
		} else {
			this.curPos_ = 0
		}
		this.prevHeight = this.getThumbMovingDistance();
		this.setThumbPosition()
	};
	s7sdk.ScrollBar.prototype.setMaxScroll = function(a) {
		this.curPos_ = 0;
		this.maxScroll_ = a;
		this.resize()
	};
	s7sdk.ScrollBar.prototype.setScrollStep = function(a) {
		this.scrollStep_ = a < 1 ? 1 : a
	};
	s7sdk.ScrollBar.prototype.getNormalizedPosition = function() {
		return this.curPos_ / this.maxScroll_
	};
	s7sdk.ScrollBar.prototype.setNormalizedPosition = function(a) {
		this.curPos_ = a * this.maxScroll_;
		this.setThumbPosition(false);
		this.thumb_.obj.style.visibility = "inherit"
	};
	s7sdk.ScrollBar.prototype.setPosition = function(a) {
		if (!this.mouseIsDown_) {
			this.curPos_ = a;
			this.setThumbPosition(true)
		}
	};
	s7sdk.ScrollBar.prototype.getPosition = function() {
		return this.curPos_
	};
	s7sdk.ScrollBar.prototype.show = function(a) {
		this.obj.style.visibility = a ? "inherit" : "hidden"
	};
	(function addDefaultCSS() {
		var e = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var c = s7sdk.browser && s7sdk.browser.name == "ie"
				&& s7sdk.browser.version.major <= 8;
		var d = {
			display : "block",
			width : "28px",
			height : "32px"
		};
		var a = e(".s7scrollbar", {
			"background-color" : c ? "rgb(224, 224, 224)"
					: "rgba(102, 102, 102, 0)",
			top : "8px",
			bottom : "8px",
			right : "8px",
			width : "28px"
		})
				+ e(".s7scrollbar .s7scrollthumb", {
					width : "28px",
					position : "absolute",
					"background-repeat" : "no-repeat",
					"background-position" : "center",
					"padding-top" : "10px",
					"padding-bottom" : "10px",
					height : "45px"
				})
				+ e(".s7scrollbar .s7scrollthumb[state='up']", {
					"background-image" : b("scrollbar_thumb_up.png")
				})
				+ e(".s7scrollbar .s7scrollthumb[state='over']", {
					"background-image" : b("scrollbar_thumb_over.png")
				})
				+ e(".s7scrollbar .s7scrollthumb[state='down']", {
					"background-image" : b("scrollbar_thumb_down.png")
				})
				+ e(".s7scrollbar .s7scrollthumb[state='disabled']", {
					"background-image" : b("scrollbar_thumb_up.png")
				})
				+ e(".s7scrollbar .s7scrolltrack", {
					width : "28px",
					"background-color" : "rgba(102, 102, 102, 0.5)"
				})
				+ e(".s7scrollbar .s7scrollupbutton", d)
				+ e(".s7scrollbar .s7scrollupbutton[state='up']", {
					"background-image" : b("scroll_up_up.png")
				})
				+ e(".s7scrollbar .s7scrollupbutton[state='over']", {
					"background-image" : b("scroll_up_over.png")
				})
				+ e(".s7scrollbar .s7scrollupbutton[state='down']", {
					"background-image" : b("scroll_up_down.png")
				})
				+ e(".s7scrollbar .s7scrollupbutton[state='disabled']", {
					"background-image" : b("scroll_up_up.png")
				})
				+ e(".s7scrollbar .s7scrolldownbutton", d)
				+ e(".s7scrollbar .s7scrolldownbutton[state='up']", {
					"background-image" : b("scroll_down_up.png")
				}) + e(".s7scrollbar .s7scrolldownbutton[state='over']", {
					"background-image" : b("scroll_down_over.png")
				}) + e(".s7scrollbar .s7scrolldownbutton[state='down']", {
					"background-image" : b("scroll_down_down.png")
				}) + e(".s7scrollbar .s7scrolldownbutton[state='disabled']", {
					"background-image" : b("scroll_down_up.png")
				});
		s7sdk.Util.css.addDefaultCSS(a, "ScrollBar")
	})()
}
if (!s7sdk.ScrollBarThumb) {
	s7sdk.ScrollBarThumb = function ScrollBarThumb(b, d, c) {
		arguments.callee.superclass.apply(this, [ c, b, "div", "s7scrollthumb",
				d ]);
		this.createElement();
		var a = this;
		this.addEventListener("mouseover", function(e) {
			a.changeState(2)
		});
		this.addEventListener("mouseout", function(e) {
			a.changeState(0)
		})
	};
	s7sdk.Class.inherits("s7sdk.ScrollBarThumb", "s7sdk.UIComponent");
	s7sdk.ScrollBarThumb.prototype.changeState = function(a) {
		if (this.curState == a) {
			return
		}
		var b = [ "up", "down", "over", "disabled" ];
		s7sdk.Util.css.setCSSAttributeSelector(this.obj, "state", b[a]);
		this.curState = a
	}
};