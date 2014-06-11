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
s7sdk.pkg("s7sdk.info");
s7sdk.Util.require("s7sdk.common.Button");
s7sdk.Util.require("s7sdk.common.IS");
if (!s7sdk.info.InfoPanelPopup) {
	s7sdk.info.InfoPanelPopup = function InfoPanelPopup(a, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.info.InfoPanelPopup constructor - containerId: %0, settings: %1 , compId: %2",
						a, c, b);
		arguments.callee.superclass.apply(this, [ b, a, "div",
				"s7infopanelpopup", c ]);
		this.isVisible = false;
		this.compId = (s7sdk.Util.isNull(b) ? "" : b);
		if ((a != null) && (s7sdk.Util.byId(a))) {
			this.container = s7sdk.Util.byId(a)
		} else {
			this.container = document.body
		}
		this.responseTemplateInfo = this.parseResponseTemplate(this.template);
		this.infoServerConnector = new s7sdk.InfoServerConnector(
				this.infoServerUrl);
		var d = this;
		this.infoServerConnector.onLoad = function(e, f) {
			d.onInfoServerResponse(e, f)
		};
		this.infoServerConnector.onFail = function(e, f) {
			s7sdk.Logger
					.log(
							s7sdk.Logger.WARNING,
							"InfoPanelPopup.infoServerConnector.onFail failed loading info server response for rollvoer key [%0]",
							e)
		};
		s7sdk.Logger.log(s7sdk.Logger.INFO,
				"InfoPanelPopup.CTOR response template info [%0]",
				this.responseTemplateInfo);
		this.baseOpacity_ = 1;
		this.currentOpacity_ = 0;
		this.createPanelElements(a, c);
		this.setupDefaults()
	};
	s7sdk.Class.inherits("s7sdk.info.InfoPanelPopup", "s7sdk.UIComponent");
	s7sdk.info.InfoPanelPopup.prototype.modifiers = {
		infoServerUrl : {
			params : [ "infoServerTemplate" ],
			defaults : [ "" ],
			parseParams : false
		},
		template : {
			params : [ "content_template" ],
			defaults : [ "" ],
			parseParams : false
		},
		showhidetransition : {
			params : [ "transition", "duration" ],
			defaults : [ "fade", 0.3 ],
			ranges : [ [ "none", "fade" ], "0:" ]
		},
		size : {
			params : [ "width", "height" ],
			defaults : [ 0, 0 ],
			ranges : [ "0:", "0:" ],
			deprecated : true
		}
	};
	s7sdk.info.InfoPanelPopup.prototype.activateRollover = function(a) {
		if (!this.isProperlySetup()) {
			return
		}
		if (this.isVisible) {
			return
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.info.InfoPanelPopup.activateRollover - rolloverKey: %0",
				a);
		this.infoServerConnector.requestData(a)
	};
	s7sdk.info.InfoPanelPopup.prototype.deactivateRollover = function() {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.info.InfoPanelPopup.deactivateRollover");
		this.infoServerConnector.cancelRequest();
		this.hidePanel(false)
	};
	s7sdk.info.InfoPanelPopup.prototype.setItem = function(c) {
		if (c instanceof s7sdk.ItemDesc == false) {
			throw new Error("Item must be a descendant of ItemDesc!")
		}
		if (c.parent == null) {
			throw new Error("ItemDesc must be part of a parent set!")
		}
		if (!c.parent.items || !c.parent.items.length) {
			throw new Error("Parent set does not contain items!")
		}
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.info.InfoPanelPopup.setItem - item: %0", c);
		var b = -1;
		for ( var a = 0; a < c.parent.items.length; a++) {
			if (c.parent.items[a].name == c.name) {
				b = a;
				break
			}
		}
		if (b == -1) {
			throw new Error(
					"Could not determine item index from immediate parent set!")
		}
		var d = c.parent;
		while (d.parent instanceof s7sdk.ItemDesc) {
			d = d.parent
		}
		this.infoServerConnector.setAsset(d.name);
		this.infoServerConnector.setFrame(b)
	};
	s7sdk.info.InfoPanelPopup.prototype.resize = function(b, a) {
		s7sdk.Logger.log(s7sdk.Logger.FINE,
				"s7sdk.info.InfoPanelPopup.resize - width: %0, height: %1", b,
				a);
		this.obj.style.width = b + "px";
		this.obj.style.height = a + "px";
		s7sdk.UIComponent.prototype.resize.apply(this, [ b, a ])
	};
	s7sdk.info.InfoPanelPopup.prototype.createPanelElements = function(a, b) {
		this.createElement();
		this.obj.style.visibility = "hidden";
		this.container.appendChild(this.obj);
		this.backOverlay = document.createElement("div");
		this.backOverlay.className = "s7backoverlay";
		this.backOverlay.setAttribute("id", "s7backoverlay"
				+ s7sdk.Util.createUniqueId());
		this.backOverlay.style.position = "absolute";
		this.backOverlay.style.width = "100%";
		this.backOverlay.style.height = "100%";
		this.obj.appendChild(this.backOverlay);
		this.overlay = document.createElement("div");
		this.overlay.className = "s7overlay";
		this.overlay.setAttribute("id", "s7overlay"
				+ s7sdk.Util.createUniqueId());
		this.overlay.style.position = "absolute";
		this.obj.appendChild(this.overlay);
		this.closebutton = new s7sdk.InfoPanelCloseButton(this.overlay.id, b,
				"closeButton" + s7sdk.Util.createUniqueId());
		var c = this;
		s7sdk.Event.addDOMListener(this.closebutton, "click", function(d) {
			d = d || window.event;
			c.closebutton.obj.blur();
			c.onClose(d)
		}, true);
		this.content = document.createElement("div");
		this.content.style.width = "100%";
		this.content.style.height = "100%";
		this.overlay.appendChild(this.content)
	};
	s7sdk.info.InfoPanelPopup.prototype.setupDefaults = function() {
		var a = this.size.width;
		var d = this.size.height;
		if (!s7sdk.Util.isNumber(a) || !s7sdk.Util.isNumber(d) || (a == 0)
				|| (d == 0)) {
			a = parseInt(s7sdk.Util.css.getCss("s7infopanelpopup", "width",
					this.compId, null, this.container));
			d = parseInt(s7sdk.Util.css.getCss("s7infopanelpopup", "height",
					this.compId, null, this.container));
			if (!s7sdk.Util.isNumber(a) || !s7sdk.Util.isNumber(d) || (a == 0)
					|| (d == 0)) {
				if ("clientHeight" in this.container
						&& "clientWidth" in this.container) {
					a = this.container.clientWidth;
					d = this.container.clientHeight
				}
				if ((a == 0) || (d == 0)) {
					a = 300;
					d = 300
				}
			}
		}
		this.obj.style.width = a + "px";
		this.obj.style.height = d + "px";
		var b = parseInt(s7sdk.Util.css.getCss("s7overlay", "width",
				this.compId, "s7infopanelpopup", this.container));
		var f = parseInt(s7sdk.Util.css.getCss("s7overlay", "height",
				this.compId, "s7infopanelpopup", this.container));
		if (!s7sdk.Util.isNumber(b) || !s7sdk.Util.isNumber(f) || (b == 0)
				|| (f == 0)) {
			var e = this.overlay.offsetLeft;
			var c = this.overlay.offsetTop;
			this.overlay.style.width = (a - 2 * e) + "px";
			this.overlay.style.height = (d - 2 * c) + "px"
		}
	};
	s7sdk.info.InfoPanelPopup.prototype.isProperlySetup = function() {
		return (this.responseTemplateInfo != null)
				&& this.infoServerConnector.isProperlySetup()
	};
	s7sdk.info.InfoPanelPopup.prototype.onInfoServerResponse = function(a, b) {
		this.showPanel();
		var c = this.processResponse(a, b);
		this.content.innerHTML = c
	};
	s7sdk.info.InfoPanelPopup.prototype.onClose = function() {
		this.hidePanel()
	};
	s7sdk.info.InfoPanelPopup.prototype.showPanel = function() {
		if (this.isVisible) {
			return
		}
		this.isVisible = true;
		this.obj.style.visibility = "visible";
		var b = this;
		function a() {
			if (b.currentOpacity_ < 1 && b.isVisible) {
				b.currentOpacity_ += 0.05 / b.showhidetransition.duration;
				s7sdk.Util
						.setOpacity(b.obj, b.baseOpacity_ * b.currentOpacity_);
				s7sdk.Util.setOpacity(b.overlay, b.baseOpacity_
						* b.currentOpacity_);
				setTimeout(a, 50)
			} else {
				if (b.currentOpacity_ >= 1) {
					if (b.obj.style.removeProperty) {
						b.obj.style.removeProperty("filter");
						b.overlay.style.removeProperty("filter")
					} else {
						b.obj.style.removeAttribute("filter");
						b.overlay.style.removeAttribute("filter")
					}
				}
			}
		}
		if (this.showhidetransition.transition == "fade"
				&& this.showhidetransition.duration > 0) {
			a()
		} else {
		}
	};
	s7sdk.info.InfoPanelPopup.prototype.hidePanel = function() {
		if (!this.isVisible) {
			return
		}
		this.isVisible = false;
		var a = this;
		function b() {
			if (!a.isVisible) {
				if (a.currentOpacity_ > 0) {
					a.currentOpacity_ -= 0.05 / a.showhidetransition.duration;
					s7sdk.Util.setOpacity(a.obj, a.baseOpacity_
							* a.currentOpacity_);
					s7sdk.Util.setOpacity(a.overlay, a.baseOpacity_
							* a.currentOpacity_);
					setTimeout(b, 50)
				} else {
					a.obj.style.visibility = "hidden";
					if (a.obj.style.removeProperty) {
						a.obj.style.removeProperty("filter");
						a.overlay.style.removeProperty("filter")
					} else {
						a.obj.style.removeAttribute("filter");
						a.overlay.style.removeAttribute("filter")
					}
				}
			}
		}
		if (this.showhidetransition.transition == "fade"
				&& this.showhidetransition.duration > 0) {
			b()
		} else {
			this.obj.style.visibility = "hidden"
		}
	};
	s7sdk.info.InfoPanelPopup.prototype.parseResponseTemplate = function(a) {
		var q = null;
		var c = new Object();
		var e = new Object();
		var r = /\s*<info>(.*)<\/info>\s*/gi;
		var b = r.exec(a);
		if (b != null) {
			var k = b[1];
			var h = /<var([^>]+)>([^\/]*)<\/var>/gi;
			var j;
			while ((j = h.exec(k)) != null) {
				if (j.length == 3) {
					var l = j[1];
					var m = /.*name=[\'\"](\w+)[\'\"].*/gi;
					var o = m.exec(l);
					if ((o != null) && (o.length == 2)) {
						var d = o[1];
						var s = /.*rollover=[\'\"]([^\'\"]+)[\'\"].*/gi;
						var i = s.exec(l);
						var g;
						if ((i != null) && (i.length == 2)) {
							g = i[1]
						} else {
							g = null
						}
						var p = this.stripCDATA(j[2]);
						if (g != null) {
							if (e[g] == null) {
								e[g] = new Object()
							}
							e[g][d] = p
						} else {
							c[d] = p
						}
						s7sdk.Logger
								.log(
										s7sdk.Logger.FINE,
										"InfoPanelPopup.parseResponseTemplate found default variable [%0]=[%1], rollover key [%2]",
										d, p, g)
					} else {
						s7sdk.Logger
								.log(
										s7sdk.Logger.WARNING,
										"InfoPanelPopup.parseResponseTemplate cannot find var name in [%0]",
										l)
					}
				} else {
					s7sdk.Logger
							.log(
									s7sdk.Logger.WARNING,
									"InfoPanelPopup.parseResponseTemplate bad var definition [%0]",
									j[0])
				}
			}
			var n = /(?:<var[^\/]+<\/var>)*(.*)$/ig;
			var f = n.exec(k);
			if (f != null) {
				q = this.stripCDATA(f[1])
			} else {
				s7sdk.Logger
						.log(
								s7sdk.Logger.WARNING,
								"InfoPanelPopup.parseResponseTemplate unable to locate response template content")
			}
		} else {
			s7sdk.Logger
					.log(
							s7sdk.Logger.WARNING,
							"InfoPanelPopup.parseResponseTemplate bad response template, missing <info>...</info> tags")
		}
		if (q != null) {
			return new s7sdk.ResponseTemplateInfo(q, c, e)
		} else {
			return null
		}
	};
	s7sdk.info.InfoPanelPopup.prototype.stripCDATA = function(c) {
		var b = /^<\!\[CDATA\[(.*)\]\]>$/i;
		var a = b.exec(c);
		if (a != null) {
			return b.exec(c)[1]
		} else {
			return c
		}
	};
	s7sdk.info.InfoPanelPopup.prototype.processResponse = function(j, h) {
		var a = this.responseTemplateInfo.getVars(j);
		var c = new Object();
		for ( var f in a) {
			c[f] = a[f]
		}
		for ( var d = 0; d < h.length; d++) {
			var g = h[d];
			c[g.name] = g.$t;
			s7sdk.Logger
					.log(
							s7sdk.Logger.FINE,
							"InfoPanelPopup.processResponse variable [%0]=[%1] found in response",
							g.name, g.$t)
		}
		var e = this.responseTemplateInfo.template;
		for ( var b in c) {
			e = e.replace(new RegExp("\\$" + b + "\\$", "g"), c[b])
		}
		return e
	};
	s7sdk.InfoPanelPopup = s7sdk.info.InfoPanelPopup;
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = c(".s7infopanelpopup", {
			position : "absolute",
			left : "0px",
			top : "0px",
			"z-index" : "6000",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + c(".s7infopanelpopup .s7backoverlay", {
			filter : "alpha(opacity = 70)",
			opacity : "0.7",
			"background-color" : "#0f0f0f"
		}) + c(".s7infopanelpopup .s7overlay", {
			"margin-left" : "-150px",
			"margin-top" : "-100px",
			left : "50%",
			top : "50%",
			width : "300px",
			height : "200px",
			padding : "20px",
			"background-color" : "#FFFFFF"
		}) + c(".s7infopanelpopup .s7closebutton", {
			position : "absolute",
			top : "-15px",
			right : "-15px",
			padding : "8px",
			width : "30px",
			height : "30px"
		}) + c(".s7infopanelpopup .s7closebutton[state='up']", {
			"background-image" : b("close_up.png")
		}) + c(".s7infopanelpopup .s7closebutton[state='over']", {
			"background-image" : b("close_over.png")
		}) + c(".s7infopanelpopup .s7closebutton[state='down']", {
			"background-image" : b("close_down.png")
		}) + c(".s7infopanelpopup .s7closebutton[state='disabled']", {
			"background-image" : b("close_disabled.png")
		});
		s7sdk.Util.css.addDefaultCSS(a, "InfoPanelPopup")
	})()
}
if (!s7sdk.ResponseTemplateInfo) {
	s7sdk.ResponseTemplateInfo = function ResponseTemplateInfo(c, a, b) {
		this.template = c;
		this.globalVars = a;
		this.rolloverKeyVars = b
	};
	s7sdk.ResponseTemplateInfo.prototype.getVars = function(b) {
		var d = new Object();
		for ( var a in this.globalVars) {
			d[a] = this.globalVars[a]
		}
		if (b != null) {
			var c = this.rolloverKeyVars[b];
			if (c != null) {
				for ( var a in c) {
					d[a] = c[a]
				}
			}
		}
		return d
	}
}
if (!s7sdk.InfoServerConnector) {
	s7sdk.InfoServerConnector = function InfoServerConnector(a) {
		this.infoServerUrl = a;
		this.asset = null;
		this.frame = null;
		this.isReq = new s7sdk.IS("", "");
		s7sdk.Logger.log(s7sdk.Logger.INFO,
				"InfoServerConnector.CTOR info server URL template [%0]",
				this.infoServerUrl)
	};
	s7sdk.InfoServerConnector.prototype.setAsset = function(a) {
		this.asset = a
	};
	s7sdk.InfoServerConnector.prototype.setFrame = function(a) {
		this.frame = a
	};
	s7sdk.InfoServerConnector.prototype.requestData = function(b) {
		if ((this.infoServerUrl != null) && (this.infoServerUrl != "")) {
			this.isReq.cancelHttpReq();
			var a = this.createInfoServerUrl(b);
			s7sdk.Logger
					.log(
							s7sdk.Logger.FINE,
							"InfoServerConnector.requestData loading info server resopnse from [%0]",
							a);
			var c = this;
			this.isReq.getHttpReq(a, function(d) {
				c.onLoad(b, d)
			}, function(d) {
				c.onFail(b, d)
			})
		} else {
			this.onLoad(b, {})
		}
	};
	s7sdk.InfoServerConnector.prototype.cancelRequest = function() {
		this.isReq.cancelHttpReq()
	};
	s7sdk.InfoServerConnector.prototype.isProperlySetup = function() {
		return (this.infoServerUrl == null) || (this.infoServerUrl == "")
				|| ((this.asset != null) && (this.frame != null))
	};
	s7sdk.InfoServerConnector.prototype.onLoad = function(a) {
	};
	s7sdk.InfoServerConnector.prototype.onFail = function(a) {
	};
	s7sdk.InfoServerConnector.prototype.createInfoServerUrl = function(a) {
		var c = this.getCompanyName(this.asset);
		var d = this.getCatalogId(this.asset);
		var b = this.infoServerUrl.replace("$1$", a).replace("$2$", this.frame)
				.replace("$3$", c).replace("$4$", d);
		b += (b.indexOf("?") == -1 ? "?" : "&") + "fmt=2,json";
		return b
	};
	s7sdk.InfoServerConnector.prototype.getCompanyName = function(b) {
		var a = b.split("?")[0].split(",")[0].split(";")[0].split(":")[0];
		return a.split("/")[0]
	};
	s7sdk.InfoServerConnector.prototype.getCatalogId = function(b) {
		var a = b.split("?")[0].split(",")[0].split(";")[0].split(":")[0];
		if (a.indexOf("/") != -1) {
			return a.substring(a.indexOf("/") + 1)
		} else {
			return a
		}
	}
};