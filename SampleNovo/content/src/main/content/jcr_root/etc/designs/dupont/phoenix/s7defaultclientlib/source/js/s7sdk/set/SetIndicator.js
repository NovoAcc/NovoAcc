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
s7sdk.Util.require("s7sdk.common.Thumb");
if (!s7sdk.set.SetIndicator) {
	s7sdk.set.SetIndicator = function SetIndicator(a, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.set.SetIndicator constructor - containerId: %0, settings: %1 , compId: %2",
						a, c, b);
		arguments.callee.superclass.apply(this, [ b, a, "div",
				s7sdk.set.SetIndicator.COMPONENT_STYLE, c ]);
		this.id = (s7sdk.Util.isNull(b) ? "" : b);
		this.numberOfPages = -1;
		this.selectedPage = 0;
		this.containerId = a;
		this.container = s7sdk.Util.byId(this.containerId);
		this.componentContainer = null;
		this.hint = "";
		this.toolTip_ = null;
		this.createElement();
		this.container.appendChild(this.obj);
		this.build(this.containerId)
	};
	s7sdk.Class.inherits("s7sdk.set.SetIndicator", "s7sdk.UIComponent");
	s7sdk.set.SetIndicator.prototype.symbols = {
		TOOLTIP : ""
	};
	s7sdk.set.SetIndicator.COMPONENT_STYLE = "s7setindicator";
	s7sdk.set.SetIndicator.STATE = "state";
	s7sdk.set.SetIndicator.SELECTED = "selected";
	s7sdk.set.SetIndicator.UN_SELECTED = "unselected";
	s7sdk.set.SetIndicator.COMPONENT_CONTAINER = "s7setcontainer";
	s7sdk.set.SetIndicator.PAGE_INDICATOR = "s7dot";
	s7sdk.set.SetIndicator.prototype.setSelectedPage = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.SetIndicator.setSelectedPage - page: %0", a);
		if (a != this.selectedPage) {
			this.selectedPage = a;
			this.build(this.containerId)
		}
	};
	s7sdk.set.SetIndicator.prototype.setNumberOfPages = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.set.SetIndicator.setNumberOfPages - pages: %0", a);
		if (a != this.numberOfPages) {
			this.numberOfPages = a;
			this.build(this.containerId)
		}
	};
	s7sdk.set.SetIndicator.prototype.clearAll = function() {
		if (this.componentContainer == null) {
			return
		}
		this.obj.removeChild(this.componentContainer)
	};
	s7sdk.set.SetIndicator.prototype.build = function(b) {
		var f = 0;
		this.clearAll();
		var d = s7sdk.Util.createObj(null, "div");
		var a = parseInt(s7sdk.Util.css.getCss("s7setindicator", "height",
				this.id, null, this.container));
		this.componentContainer = d;
		this.componentContainer.className = s7sdk.set.SetIndicator.COMPONENT_CONTAINER;
		this.hint = this.getLocalizedText("TOOLTIP");
		if (this.hint && this.hint.length) {
			if (s7sdk.browser.name !== "ie") {
				if (this.toolTip_ == null) {
					this.toolTip_ = new s7sdk.SimpleToolTip(this.obj,
							this.hint, this.obj)
				}
			}
		}
		for ( var c = 0; c < this.numberOfPages; c++) {
			var e = s7sdk.Util.createObj(null, "div");
			e.className = s7sdk.set.SetIndicator.PAGE_INDICATOR;
			if (this.selectedPage == f) {
				s7sdk.Util.css.setCSSAttributeSelector(e,
						s7sdk.set.SetIndicator.STATE,
						s7sdk.set.SetIndicator.SELECTED)
			} else {
				s7sdk.Util.css.setCSSAttributeSelector(e,
						s7sdk.set.SetIndicator.STATE,
						s7sdk.set.SetIndicator.UN_SELECTED)
			}
			f++;
			e.id = "_sContainer" + c;
			d.appendChild(e)
		}
		this.obj.appendChild(d);
		this.componentContainer.className = s7sdk.set.SetIndicator.COMPONENT_CONTAINER
	};
	s7sdk.set.SetIndicator.prototype.createElement = function() {
		s7sdk.UIComponent.prototype.createElement.apply(this, []);
		this.obj.width = this.totalWidth_;
		this.obj.height = this.totalHeight_;
		this.obj.className = s7sdk.set.SetIndicator.COMPONENT_STYLE;
		this.obj.style.position = "absolute"
	};
	s7sdk.SetIndicator = s7sdk.set.SetIndicator;
	(function addDefaultCSS() {
		var h = s7sdk.Util.css.createCssRuleText;
		var e = s7sdk.Util.css.createCssImgUrlText;
		var g = s7sdk.Util.css.createCssAnimationText;
		var f = s7sdk.browser && s7sdk.browser.name == "ie"
				&& s7sdk.browser.version.major <= 8;
		var d = {
			width : "100px",
			height : "22px",
			"text-align" : "center",
			"background-color" : "#FFFFFF",
			"-webkit-user-select" : "none",
			"-moz-user-select" : "none",
			"-ms-user-select" : "none",
			"user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
			"border-radius" : "0px"
		};
		var a = {
			display : "inline-block",
			width : "10px",
			height : "10px",
			"margin-left" : "2px",
			"margin-right" : "2px",
			"margin-top" : "6px",
			"margin-bottom" : "2px",
			"border-radius" : "6px",
			"background-color" : "#d5d3d3"
		};
		if (f) {
			a["*display"] = "inline";
			a.zoom = "1"
		}
		var c = {
			"background-color" : "#939393",
			"-webkit-animation-name" : "FadeIn",
			"-webkit-animation-timing-function" : "ease-in",
			"-webkit-animation-duration" : ".15s",
			"-moz-animation-name" : "FadeIn",
			"-moz-animation-timing-function" : "ease-in",
			"-moz-animation-duration" : ".15s",
			"-animation-name" : "FadeIn",
			"-animation-timing-function" : "ease-in",
			"-animation-duration" : ".15s"
		};
		var b = h(".s7setindicator", d) + h(".s7setindicator .s7dot", a)
				+ h(".s7setindicator .s7dot[state='selected']", c)
				+ h(".s7setindicator .s7dot[state='unselected']", {
					"background-color" : "#d5d3d3;"
				}) + h(".s7setindicator .s7setcontainer", {
					overflow : "hidden",
					height : "inherit"
				}) + g("FadeIn", "opacity", "0", "1");
		s7sdk.Util.css.addDefaultCSS(b, "SetIndicator")
	})()
};