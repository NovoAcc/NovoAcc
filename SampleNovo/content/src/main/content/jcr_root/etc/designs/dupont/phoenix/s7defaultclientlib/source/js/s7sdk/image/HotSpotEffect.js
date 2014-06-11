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
if (!s7sdk.image.HotSpotEffect) {
	s7sdk.image.HotSpotEffect = function HotSpotEffect(a, d, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.image.HotSpotEffect constructor - containerId: %0, settings: %1 , compId: %2",
						a, d, c);
		c = (typeof c == "string" && c.length) ? c : "HotSpotEffect_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ c, a, "div",
				"s7hotspoteffect", d ]);
		this.container = document.getElementById(a);
		var b = this.container ? this.container.s7base : null;
		this.viewComponent = null;
		this.mediaSet_ = null;
		this.currentIndex_ = -1;
		this.currentItem_ = null;
		this.overlayContainer_ = null;
		this.overlaysVisible_ = true;
		this.hotspotOverlays_ = [];
		this.destroyed_ = false;
		var e = this;
		this.viewComponent_ASSET_CHANGED_ = function(f) {
			e.viewComponent_ASSET_CHANGED(f)
		};
		this.targetStateChanged_ = function(f) {
			e.targetStateChanged(f)
		};
		this.resize_COMPONENT_RESIZE_ = function(f) {
			e.resize_COMPONENT_RESIZE(f)
		};
		this.createElement();
		if (b != null) {
			this.viewComponent = b;
			this.viewComponent.addEventListener(
					s7sdk.event.AssetEvent.ASSET_CHANGED,
					this.viewComponent_ASSET_CHANGED_, false);
			this.viewComponent
					.addEventListener(
							s7sdk.event.CapabilityStateEvent.NOTF_ZOOM_CAPABILITY_STATE,
							this.targetStateChanged_, false);
			this.viewComponent
					.addEventListener(
							s7sdk.event.CapabilityStateEvent.NOTF_SPIN_CAPABILITY_STATE,
							this.targetStateChanged_, false);
			this.viewComponent.addEventListener(
					s7sdk.event.ResizeEvent.COMPONENT_RESIZE,
					this.resize_COMPONENT_RESIZE_, false);
			this.viewComponent.obj.appendChild(this.obj)
		}
	};
	s7sdk.Class.inherits("s7sdk.image.HotSpotEffect", "s7sdk.UIComponent");
	s7sdk.image.HotSpotEffect.prototype.attachToView = function(a) {
		if (a !== this.viewComponent) {
			var b = this;
			if (this.viewComponent) {
				this.viewComponent.removeEventListener(
						s7sdk.event.AssetEvent.ASSET_CHANGED,
						this.viewComponent_ASSET_CHANGED_, false);
				this.viewComponent
						.removeEventListener(
								s7sdk.event.CapabilityStateEvent.NOTF_ZOOM_CAPABILITY_STATE,
								this.targetStateChanged_, false);
				this.viewComponent
						.removeEventListener(
								s7sdk.event.CapabilityStateEvent.NOTF_SPIN_CAPABILITY_STATE,
								this.targetStateChanged_, false);
				this.viewComponent.removeEventListener(
						s7sdk.event.ResizeEvent.COMPONENT_RESIZE,
						this.resize_COMPONENT_RESIZE_, false);
				this.viewComponent.obj.removeChild(this.obj)
			}
			this.viewComponent = a;
			if (this.viewComponent != null) {
				this.viewComponent.addEventListener(
						s7sdk.event.AssetEvent.ASSET_CHANGED,
						this.viewComponent_ASSET_CHANGED_, false);
				this.viewComponent
						.addEventListener(
								s7sdk.event.CapabilityStateEvent.NOTF_ZOOM_CAPABILITY_STATE,
								this.targetStateChanged_, false);
				this.viewComponent
						.addEventListener(
								s7sdk.event.CapabilityStateEvent.NOTF_SPIN_CAPABILITY_STATE,
								this.targetStateChanged_, false);
				this.viewComponent.addEventListener(
						s7sdk.event.ResizeEvent.COMPONENT_RESIZE,
						this.resize_COMPONENT_RESIZE_, false);
				this.viewComponent.obj.appendChild(this.obj)
			}
		}
	};
	s7sdk.image.HotSpotEffect.prototype.targetStateChanged = function(c) {
		if ((c.s7event.state
				.hasCapability(s7sdk.ZoomCapabilityState.ZOOM_RESET))
				|| (c.s7event.state
						.hasCapability(s7sdk.SpinCapabilityState.ZOOM_RESET))) {
			this.setOverlaysVisible(false)
		} else {
			var a = null;
			for ( var b = 0; b < this.hotspotOverlays_.length; b++) {
				a = this.hotspotOverlays_[b];
				a.updateOverlay()
			}
			if (!this.getOverlaysVisible()) {
				this.setOverlaysVisible(true);
				s7sdk.Util.fade(this.obj, false, 0.9, "block")
			}
		}
	};
	s7sdk.image.HotSpotEffect.prototype.viewComponent_ASSET_CHANGED = function(
			b) {
		var a = b.s7event.asset;
		if (a instanceof s7sdk.ItemDesc == false) {
			throw new Error(
					"AssetEvent should not be providing a string as the asset, it should be an ItemDesc!")
		} else {
			if (a.parent == null) {
				throw new Error("ItemDesc must be part of a parent set!")
			} else {
				this.mediaSet_ = a.parent;
				this.setCurrentIndex(b.s7event.frame)
			}
		}
	};
	s7sdk.image.HotSpotEffect.prototype.resize_COMPONENT_RESIZE = function(a) {
		this.updateOverlayCoverage(false)
	};
	s7sdk.image.HotSpotEffect.prototype.setCurrentIndex = function(b) {
		if (this.mediaSet_) {
			var a = [];
			if (this.mediaSet_.targets) {
				a = a.concat(this.mediaSet_.targets)
			}
			if (this.mediaSet_.items && this.mediaSet_.items[b]) {
				this.currentItem_ = this.mediaSet_.items[b];
				this.currentIndex_ = b;
				var c = null;
				if (typeof this.currentItem_.targets != "undefined") {
					c = this.currentItem_.targets
				}
				if (c) {
					a = a.concat(c)
				}
			}
			this.createHotSpotOverlays(a)
		} else {
			s7sdk.Logger.log(s7sdk.Logger.WARNING,
					"s7sdk.image.HotSpotEffect - internal media set is empty")
		}
	};
	s7sdk.image.HotSpotEffect.prototype.getOverlaysVisible = function() {
		return this.overlaysVisible_
	};
	s7sdk.image.HotSpotEffect.prototype.setOverlaysVisible = function(a) {
		this.overlaysVisible_ = a;
		if (a) {
			this.updateOverlayCoverage(true)
		} else {
			this.removeOverlaysFromView(false)
		}
	};
	s7sdk.image.HotSpotEffect.prototype.updateOverlayCoverage = function(a) {
		if (this.hotspotOverlays_.length && this.overlaysVisible_) {
			if (!this.overlayContainer_) {
				this.overlayContainer_ = this
						.createOverlayContainer(0, 0, 0, 0)
			}
			if (!this.overlayContainer_.parentNode) {
				this.obj.appendChild(this.overlayContainer_)
			}
			this.setSize(this.viewComponent.wid, this.viewComponent.hei);
			for ( var e = 0; e < this.hotspotOverlays_.length; e++) {
				var c = this.hotspotOverlays_[e];
				c.updateOverlay();
				var d = false;
				for ( var b = 0; b < this.overlayContainer_.children.length; b++) {
					if (c.element_ == (this.overlayContainer_.children[b])) {
						d = true;
						break
					}
				}
				if (!d) {
					this.overlayContainer_.appendChild(c.element_)
				}
			}
			if (a) {
			}
		}
	};
	s7sdk.image.HotSpotEffect.prototype.removeOverlaysFromView = function(c) {
		if (this.overlayContainer_ && this.overlayContainer_.parentNode) {
			while (this.overlayContainer_.children.length > 0) {
				this.overlayContainer_.children[0].s7base.setActive(false);
				this.overlayContainer_
						.removeChild(this.overlayContainer_.children[0])
			}
			this.overlayContainer_.parentNode
					.removeChild(this.overlayContainer_);
			delete this.overlayContainer_
		}
		if (c) {
			this.overlayContainer_ = null;
			if (this.hotspotOverlays_) {
				for ( var b = 0; b < this.hotspotOverlays_.length; b++) {
					var a = this.hotspotOverlays_[b];
					a.cleanUp()
				}
				this.hotspotOverlays_ = []
			}
		}
	};
	s7sdk.image.HotSpotEffect.prototype.cleanUp = function() {
		this.removeOverlaysFromView(true);
		this.destroyed_ = true
	};
	s7sdk.image.HotSpotEffect.prototype.createHotSpotOverlays = function(d) {
		this.removeOverlaysFromView(true);
		this.hotspotOverlays_ = [];
		for ( var c = 0; c < d.length; c++) {
			var a = d[c];
			var b = new s7sdk.HotspotOverlay(this, a);
			this.hotspotOverlays_.push(b)
		}
		this.updateOverlayCoverage(true)
	};
	s7sdk.image.HotSpotEffect.prototype.createOverlayContainer = function(c, e,
			d, b) {
		var a = document.getElementById(this.id + "_overlayContainer");
		if (!a) {
			a = document.createElement("div");
			a.id = this.id + "_overlayContainer"
		}
		a.style.overflow = "hidden";
		a.style.position = "absolute";
		a.style.pointerEvents = "none";
		a.style.left = c + "px";
		a.style.top = e + "px";
		a.style.width = d + "px";
		a.style.height = b + "px";
		return a
	};
	s7sdk.image.HotSpotEffect.prototype.transformPoint = function(a) {
		return this.viewComponent.imagePixelsToViewPoint(a)
	};
	s7sdk.image.HotSpotEffect.prototype.getTargetId = function() {
		return this.viewComponent.obj.id
	};
	s7sdk.image.HotSpotEffect.prototype.getTargetClassName = function() {
		return this.viewComponent.obj.className
	};
	s7sdk.image.HotSpotEffect.prototype.getSize = function() {
		return {
			width : parseInt(this.overlayContainer_.style.width) || -1,
			height : parseInt(this.overlayContainer_.style.height) || -1
		}
	};
	s7sdk.image.HotSpotEffect.prototype.getPosition = function() {
		return {
			x : parseInt(this.overlayContainer_.style.left) || -1,
			y : parseInt(this.overlayContainer_.style.top) || -1
		}
	};
	s7sdk.image.HotSpotEffect.prototype.setSize = function(a, b) {
		this.overlayContainer_.style.width = a + "px";
		this.overlayContainer_.style.height = b + "px";
		return {
			width : parseInt(this.overlayContainer_.style.width) || -1,
			height : parseInt(this.overlayContainer_.style.height) || -1
		}
	};
	s7sdk.image.HotSpotEffect.prototype.setPosition = function(a, b) {
		this.overlayContainer_.style.left = a + "px";
		this.overlayContainer_.style.top = b + "px";
		return {
			x : parseInt(this.overlayContainer_.style.left) || -1,
			y : parseInt(this.overlayContainer_.style.top) || -1
		}
	};
	s7sdk.image.HotSpotEffect.prototype.getBounds = function() {
		var a = new s7sdk.Rectangle(this.getPosition().x, this.getPosition().y,
				this.getSize().width, this.getSize().height);
		return a
	};
	s7sdk.HotSpotEffect = s7sdk.image.HotSpotEffect;
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = c(".s7hotspoteffect .s7hotspotoverlay", {
			width : "150px",
			height : "150px",
			"background-repeat" : "no-repeat",
			"background-position" : "center",
			"background-image" : b("hotspots_overlay_icon.png"),
			cursor : "pointer",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + c(".s7hotspoteffect .s7hotspotoverlay[state='default']", {
			opacity : "0.6",
			filter : "alpha(opacity = 60)"
		}) + c(".s7hotspoteffect .s7hotspotoverlay[state='active']", {
			opacity : "1",
			filter : "alpha(opacity = 100)"
		});
		s7sdk.Util.css.addDefaultCSS(a, "HotSpotEffect")
	})()
}
if (!s7sdk.HotspotOverlay) {
	s7sdk.HotspotOverlay = function HotspotOverlay(overlayManager, targetDesc) {
		this.overlayManager_ = overlayManager;
		this.targetDesc_ = targetDesc;
		this.targetClassName_ = this.overlayManager_.cl;
		this.targetId_ = this.overlayManager_.id;
		this.active_ = false;
		this.element_ = document.createElement("div");
		this.element_.className = "s7hotspotoverlay";
		this.element_.s7base = this;
		with (this.element_.style) {
			position = "absolute";
			backgroundRepeat = "no-repeat";
			backgroundPosition = "center";
			pointerEvents = "auto";
			width = s7sdk.Util.css.getCss("s7hotspotoverlay", "width",
					this.targetId_, this.targetClassName_,
					this.overlayManager_.container);
			height = s7sdk.Util.css.getCss("s7hotspotoverlay", "height",
					this.targetId_, this.targetClassName_,
					this.overlayManager_.container)
		}
		var selfRef = this;
		this.hotspotClickHandler_ = function(e) {
			selfRef.hotspotClickHandler(e)
		};
		this.touchHandler_ = function(e) {
			selfRef.touchHandler(e)
		};
		s7sdk.Event.addDOMListener(this.element_, "click",
				this.hotspotClickHandler_, false);
		s7sdk.Event.addDOMListener(this.element_, "mouseover",
				this.touchHandler_, false);
		s7sdk.Event.addDOMListener(this.element_, "mouseout",
				this.touchHandler_, false);
		s7sdk.Event.addDOMListener(this.element_, "touchstart",
				this.touchHandler_, false);
		s7sdk.Event.addDOMListener(this.element_, "touchmove",
				this.touchHandler_, false);
		s7sdk.Event.addDOMListener(this.element_, "touchend",
				this.hotspotClickHandler_, false)
	};
	s7sdk.HotspotOverlay.prototype.touchHandler = function(a) {
		if (a.type == "touchmove") {
			a.preventDefault()
		}
		if ((a.type == "touchstart") || (a.type == "mouseover")) {
			this.setActive(true)
		}
		if ((a.type == "touchend") || (a.type == "mouseout")) {
			this.setActive(false)
		}
	};
	s7sdk.HotspotOverlay.prototype.getSize = function() {
		return {
			width : parseInt(this.element_.style.width) || -1,
			height : parseInt(this.element_.style.height) || -1
		}
	};
	s7sdk.HotspotOverlay.prototype.getPosition = function() {
		return {
			x : parseInt(this.element_.style.left) || -1,
			y : parseInt(this.element_.style.top) || -1
		}
	};
	s7sdk.HotspotOverlay.prototype.setSize = function(a, b) {
		this.element_.style.width = a + "px";
		this.element_.style.height = b + "px";
		return {
			width : parseInt(this.element_.style.width) || -1,
			height : parseInt(this.element_.style.height) || -1
		}
	};
	s7sdk.HotspotOverlay.prototype.setPosition = function(a, b) {
		this.element_.style.left = a + "px";
		this.element_.style.top = b + "px";
		return {
			x : parseInt(this.element_.style.left) || -1,
			y : parseInt(this.element_.style.top) || -1
		}
	};
	s7sdk.HotspotOverlay.prototype.getActive = function() {
		return this.active_
	};
	s7sdk.HotspotOverlay.prototype.setActive = function(a) {
		if (this.active_ != a) {
			this.active_ = a;
			this.updateOverlay()
		}
	};
	s7sdk.HotspotOverlay.prototype.getTargetDesc = function() {
		return this.targetDesc_
	};
	s7sdk.HotspotOverlay.prototype.cleanUp = function() {
		s7sdk.Event.removeDOMListener(this.element_, "click",
				this.hotspotClickHandler_);
		s7sdk.Event.removeDOMListener(this.element_, "mouseover",
				this.touchHandler_);
		s7sdk.Event.removeDOMListener(this.element_, "mouseout",
				this.touchHandler_);
		s7sdk.Event.removeDOMListener(this.element_, "touchstart",
				this.touchHandler_);
		s7sdk.Event.removeDOMListener(this.element_, "touchmove",
				this.touchHandler_);
		s7sdk.Event.removeDOMListener(this.element_, "touchend",
				this.hotspotClickHandler_)
	};
	s7sdk.HotspotOverlay.prototype.updateOverlay = function() {
		var b = new s7sdk.Point2D(this.targetDesc_.rect.x
				+ this.targetDesc_.rect.width / 2, this.targetDesc_.rect.y
				+ this.targetDesc_.rect.height / 2);
		var a = this.overlayManager_.transformPoint(b);
		this.element_.style.left = a.x - parseInt(this.element_.style.width)
				/ 2 + "px";
		this.element_.style.top = a.y - parseInt(this.element_.style.height)
				/ 2 + "px";
		s7sdk.Util.css.setCSSAttributeSelector(this.element_, "state",
				this.active_ ? "active" : "default")
	};
	s7sdk.HotspotOverlay.prototype.getBounds = function() {
		var a = new s7sdk.Rectangle(this.getPosition().x, this.getPosition().y,
				this.getSize().width, this.getSize().height);
		return a
	};
	s7sdk.HotspotOverlay.prototype.hotspotClickHandler = function(a) {
		if (this.overlayManager_.viewComponent) {
			this.overlayManager_.viewComponent.zoomRgn(this.targetDesc_.rect)
		}
	}
};