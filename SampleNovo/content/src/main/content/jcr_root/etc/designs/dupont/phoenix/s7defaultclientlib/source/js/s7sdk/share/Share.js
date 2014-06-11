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
s7sdk.pkg("s7sdk.share");
s7sdk.Util.require("s7sdk.common.Button");
s7sdk.Util.require("s7sdk.event.Event");
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.common.ScrollBar");
if (!s7sdk.share.getObjPos) {
	s7sdk.share.getObjPos = function(d) {
		var a = 0;
		var e = 0;
		var c = 0;
		var b = 0;
		while (d != null) {
			c = s7sdk.Util.getStyle(d, "border-left-width");
			b = s7sdk.Util.getStyle(d, "border-top-width");
			if (s7sdk.Util.isNumber(c) && (c != "")) {
				a += parseInt(c)
			}
			if (s7sdk.Util.isNumber(b) && (b != "")) {
				e += parseInt(b)
			}
			a += d.offsetLeft;
			e += d.offsetTop;
			a -= d.scrollLeft;
			e -= d.scrollTop;
			d = d.offsetParent
		}
		return {
			x : a,
			y : e
		}
	};
	s7sdk.share.buttonsDefaultCSS = function(e, d, g, i, h) {
		var b = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		i = (typeof i === "string") ? i : "";
		var f = "";
		if (g) {
			f += g[0] ? b(d + "[state='up']", {
				"background-image" : c(g[0])
			}) : "";
			f += g[1] ? b(d + "[state='over']", {
				"background-image" : c(g[1])
			}) : "";
			f += g[2] ? b(d + "[state='down']", {
				"background-image" : c(g[2])
			}) : "";
			f += g[3] ? b(d + "[state='disabled']", {
				"background-image" : c(g[3])
			}) : ""
		}
		f += i;
		var a = b(d, {
			width : "28px",
			height : "28px",
			"background-size" : "contain",
			"background-repeat" : "no-repeat",
			"background-position" : "center",
			"-webkit-touch-callout" : "none",
			"-webkit-user-select" : "none",
			"-moz-user-select" : "none",
			"-ms-user-select" : "none",
			"user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + f;
		if (h) {
			return a
		} else {
			s7sdk.Util.css.addDefaultCSS(a, e)
		}
	};
	s7sdk.share.dialogsDefaultCSS = function(h, g, e, m) {
		var b = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		m = (typeof m === "string") ? m : "";
		var j = "";
		if (e && e.length != 0) {
			for ( var f = 0; f < e.length; f++) {
				var d = e[f];
				var k = d.skins;
				if (!k) {
					return
				}
				j += k[0] ? b(g + " ." + d.cssNm + "[state='up']", {
					"background-image" : c(k[0])
				}) : "";
				j += k[1] ? b(g + " ." + d.cssNm + "[state='over']", {
					"background-image" : c(k[1])
				}) : "";
				j += k[2] ? b(g + " ." + d.cssNm + "[state='down']", {
					"background-image" : c(k[2])
				}) : "";
				j += k[3] ? b(g + " ." + d.cssNm + "[state='disabled']", {
					"background-image" : c(k[3])
				}) : ""
			}
		}
		j += m;
		var l = b(g + " .s7closebutton", {
			position : "absolute",
			top : "2px",
			right : "2px",
			padding : "8px",
			width : "20px",
			height : "20px"
		}) + b(g + " .s7closebutton[state='up']", {
			"background-image" : c("close_up.png")
		}) + b(g + " .s7closebutton[state='over']", {
			"background-image" : c("close_over.png")
		}) + b(g + " .s7closebutton[state='down']", {
			"background-image" : c("close_down.png")
		}) + b(g + " .s7closebutton[state='disabled']", {
			"background-image" : c("close_disabled.png")
		});
		var a = b(g, {
			position : "absolute",
			"font-family" : "Helvetica",
			left : "0px !important",
			top : "0px !important",
			"z-index" : "6000",
			"user-select" : "none",
			"-ms-user-select" : "none",
			"-moz-user-select" : "-moz-none",
			"-webkit-user-select" : "none",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + b(g + " .s7backoverlay", {
			position : "absolute !important",
			width : "100% !important",
			height : "100% !important",
			filter : "alpha(opacity = 70)",
			opacity : "0.7",
			"background-color" : "#222222"
		}) + b(g + " .s7dialog *", {
			"box-sizing" : "content-box",
			"-moz-box-sizing" : "content-box"
		}) + b(g + " .s7dialog", {
			"border-radius" : "8px",
			position : "absolute",
			"background-color" : "#dddddd"
		}) + b(g + " .s7dialogheader", {
			padding : "10px",
			position : "relative"
		}) + b(g + " .s7dialoglabel", {
			color : "#666666",
			"font-weight" : "bold",
			"font-size" : "9pt"
		}) + b(g + " .s7dialogheadericon", {
			position : "relative",
			"vertical-align" : "middle",
			display : "inline-block"
		}) + b(g + " .s7dialogheadertext", {
			"vertical-align" : "middle",
			"padding-left" : "16px",
			"font-size" : "16pt",
			position : "relative",
			"font-weight" : "bold"
		}) + b(g + " .s7dialogviewarea", {
			"background-color" : "#ffffff",
			margin : "10px",
			overflow : "hidden",
			position : "relative"
		}) + b(g + " .s7dialogbody", {
			padding : "10px",
			position : "relative",
			display : "inline-block"
		}) + b(g + " .s7dialogfooter", {
			"border-top" : "1px solid #909090",
			width : "100%",
			position : "relative"
		}) + b(g + " .s7dialogbuttoncontainer", {
			"padding-top" : "10px",
			"padding-bottom" : "6px",
			"float" : "right",
			position : "relative"
		}) + b(g + " .s7dialogfooter .s7button", {
			cursor : "default",
			"margin-right" : "10px",
			position : "relative",
			display : "inline-block",
			color : "#ffffff",
			"font-size" : "9pt",
			"font-weight" : "bold",
			"text-align" : "center",
			"vertical-align" : "middle",
			"box-shadow" : "1px 1px 1px #999999",
			"line-height" : "34px"
		}) + b(g + " .s7dialogline", {
			position : "relative",
			display : "inline-block"
		}) + b(g + " .s7dialogheader .s7dialogline", {
			padding : "10px 10px 2px"
		}) + b(g + " .s7dialogscrollpanel", {
			"vertical-align" : "top",
			width : "44px",
			height : "100%",
			display : "inline-block"
		}) + b(g + " .s7dialoglinefeed", {
			display : "block"
		});
		a += l;
		a += j;
		s7sdk.Util.css.addDefaultCSS(a, h)
	};
	s7sdk.share.getDialogSymbols = function(a) {
		var c = {};
		for ( var b in a.symbols) {
			if (b != "TOOLTIP") {
				c[b] = a.getLocalizedText(b)
			}
		}
		return c
	};
	s7sdk.share.comboBoxDDDefaultCSS = function(a) {
		var d = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		var b = d(a + " .s7comboboxdropdown", {
			"border-top" : "1px solid #cccccc",
			width : "100%",
			display : "block"
		}) + d(a + " .s7dropdownitem", {
			display : "block",
			width : "100%",
			position : "relative"
		}) + d(a + " .s7checkmark", {
			width : "25px",
			height : "25px",
			"vertical-align" : "middle",
			display : "inline-block",
			"background-image" : c("cboxchecked.png")
		}) + d(a + " .s7dropdownitemanchor", {
			display : "block",
			width : "100%",
			"background-color" : "#ffffff",
			position : "relative"
		}) + d(a + " .s7dropdownitemanchor:hover", {
			"background-color" : "#eeeeee"
		});
		return b
	}
}
if (!s7sdk.share.DlgActionButton) {
	s7sdk.share.DlgActionButton = function DlgActionButton(c, g, f, e, b, a, d) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.DlgActionButton constructor - containerId: %0, settings: %1 , compId: %2",
						c, g, f);
		if (e) {
			this.symbols = e
		}
		arguments.callee.superclass.superclass.call(this, f, c, a ? a : "span",
				null, g);
		this.w = 0;
		this.h = 0;
		this.hint = "";
		this.css = b;
		this.currentState = 0;
		this.activated = true;
		this.init();
		if (s7sdk.browser.name === "ie" && s7sdk.browser.version.major < 8) {
			this.ieelement = document.createElement("span");
			this.ieelement.style.position = "absolute";
			this.ieelement.style.width = "1px";
			this.ieelement.style.height = "1px";
			this.obj.button.obj.appendChild(this.ieelement)
		}
		if (d && d.length > 0) {
			this.setText(d)
		}
		this.makeToolTip();
		this.changeState(this.currentState)
	};
	s7sdk.Class.inherits("s7sdk.share.DlgActionButton", "s7sdk.common.Button");
	s7sdk.share.DlgActionButton.prototype.init = function() {
		this.hint = this.getLocalizedText("TOOLTIP");
		var a = this.getParent();
		this.createElement();
		if (typeof this.obj != "undefined") {
			this.obj.className = "s7button " + this.css;
			this.obj.button = this;
			this.resize(this.w, this.h);
			a.appendChild(this.obj);
			this.addEventListener("mouseover", function(d) {
				var c = (this.button ? this.button : d.srcElement.button);
				b.call(c, 2)
			});
			this.addEventListener("mouseout", function(d) {
				var c = (this.button ? this.button : d.srcElement.button);
				b.call(c, 0)
			});
			this.addEventListener("mousedown", function(d) {
				var c = (this.button ? this.button : d.srcElement.button);
				b.call(c, 1)
			});
			this.addEventListener("mouseup", function(d) {
				var c = (this.button ? this.button : d.srcElement.button);
				b.call(c, 2)
			});
			this.addEventListener("touchstart", function(f) {
				f.preventDefault();
				f.stopPropagation();
				var d = s7sdk.Event.getTarget(f);
				if (d && d.hasOwnProperty("button")) {
					var c = d.button;
					c.inTouch = true;
					c.touchX = f.targetTouches[0].clientX;
					c.touchY = f.targetTouches[0].clientY;
					b.call(c, 1);
					d.button.enableEvent("click")
				}
			});
			this.addEventListener("touchmove", function(f) {
				f.preventDefault();
				f.stopPropagation();
				if (f.targetTouches.length > 0) {
					var d = s7sdk.Event.getTarget(f);
					if (d && d.hasOwnProperty("button")) {
						var c = d.button;
						c.inTouch = true;
						c.touchX = f.targetTouches[0].clientX;
						c.touchY = f.targetTouches[0].clientY
					}
				}
			});
			this.addEventListener("touchend", function(g) {
				g.preventDefault();
				g.stopPropagation();
				var f = s7sdk.Event.getTarget(g);
				if (f && f.hasOwnProperty("button")) {
					var d = f.button;
					if (d.inTouch) {
						if (g.targetTouches.length > 0) {
							var f = s7sdk.Event.getTarget(g);
							if (f && f.hasOwnProperty("button")) {
								var d = f.button;
								d.inTouch = true;
								d.touchX = g.targetTouches[0].clientX;
								d.touchY = g.targetTouches[0].clientY
							}
						}
						var c = {
							x : s7sdk.Util.getObjPos(f).x,
							y : s7sdk.Util.getObjPos(f).y,
							ofs : s7sdk.Util.getScrollXY()
						};
						s7sdk.Event.dispatch(f, "click");
						f.button.disableEvent("click");
						b.call(d, 0);
						d.inTouch = false
					}
				}
			});
			this.addEventListener("touchcancel", function(f) {
				f.preventDefault();
				f.stopPropagation();
				var d = s7sdk.Event.getTarget(f);
				if (d && d.hasOwnProperty("button")) {
					var c = d.button;
					c.inTouch = false
				}
			});
			function b(c) {
				this.currentState = c;
				if (this.activated) {
					this.changeState(c)
				}
			}
		} else {
			s7sdk.Logger
					.log(
							s7sdk.Logger.WARNING,
							's7sdk.common.Button - Cannot initialize "%0" due to lack of button skins',
							this.id)
		}
	};
	s7sdk.share.DlgActionButton.prototype.setText = function(a) {
		this.obj.textContent = a;
		this.obj.innerText = a
	};
	s7sdk.share.DlgActionButton.prototype.symbols = {
		TOOLTIP : ""
	}
}
if (!s7sdk.share.EmailShare) {
	s7sdk.share.EmailShare = function EmailShare(b, d, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.EmailShare constructor - containerId: %0, settings: %1 , compId: %2",
						b, d, c);
		var a = document.getElementById(b);
		if (a && (a.s7base instanceof s7sdk.share.SocialShare)) {
			b = a.s7base.getPanelId()
		}
		c = (typeof c == "string" && c.length) ? c : "EmailShare_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ c, b, null, 0, 0,
				"s7emailshare", d ]);
		var e = this;
		this.addEventListener("click", function() {
			e.btnClick()
		}, false);
		if (this.serverUrl.lastIndexOf("/") != (this.serverUrl.length - 1)) {
			this.serverUrl += "/"
		}
	};
	s7sdk.Class.inherits("s7sdk.share.EmailShare", "s7sdk.common.Button");
	s7sdk.share.EmailShare.prototype.modifiers = {
		emailurl : {
			params : [ "emailurl" ],
			defaults : [ "/s7/emailFriend" ]
		},
		serverUrl : {
			params : [ "isRootPath" ],
			defaults : [ "/is/image/" ]
		}
	};
	s7sdk.share.EmailShare.prototype.symbols = {
		TOOLTIP : "Email",
		HEADER : "Email Link",
		TOOLTIP_HEADER_CLOSE : "Close",
		INVALID_ADDRESSS : "Wrong email address",
		TO : "To",
		TOOLTIP_ADD : "Add",
		ADD : "Add Another Email Address",
		FROM : "From",
		MESSAGE : "Message",
		TOOLTIP_REMOVE : "Remove",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel",
		CLOSE : "Close",
		TOOLTIP_CLOSE : "Close",
		TOOLTIP_SCROLL_UP : "Scroll up",
		TOOLTIP_SCROLL_DOWN : "Scroll down",
		ACTION : "Send Email",
		TOOLTIP_ACTION : "Send",
		SEND_SUCCESS : "Email sent successfully",
		SEND_FAILURE : "Send email falied"
	};
	s7sdk.share.EmailShare.prototype.btnClick = function() {
		if (!this.emaildialog) {
			this.emaildialog = new s7sdk.share.EmailDialog(null, this.settings,
					this.id + "_dialog", s7sdk.share.getDialogSymbols(this))
		}
		this.emaildialog.setEmailService(this.emailurl);
		this.emaildialog.setServerUrl(this.serverUrl);
		this.emaildialog.setContentUrl(this.contentUrl ? this.contentUrl : "");
		this.emaildialog.setContentTitle(this.titleStr ? this.titleStr : "");
		this.emaildialog.setOriginUrl(this.originURL ? this.originURL : "");
		this.emaildialog.setThumbnail(this.thumbnail);
		this.emaildialog.setDescription(this.descrStr ? this.descrStr : "");
		this.emaildialog.show()
	};
	s7sdk.share.EmailShare.prototype.setContentUrl = function(a) {
		this.contentUrl = a
	};
	s7sdk.share.EmailShare.prototype.setOriginUrl = function(a) {
		this.originURL = a
	};
	s7sdk.share.EmailShare.prototype.setContentTitle = function(a) {
		this.titleStr = a
	};
	s7sdk.share.EmailShare.prototype.setThumbnail = function(a) {
		this.thumbnail = a
	};
	s7sdk.share.EmailShare.prototype.setDescription = function(a) {
		this.descrStr = a
	};
	(function addDefaultCSS() {
		s7sdk.share.buttonsDefaultCSS("EmailShare", ".s7emailshare", [
				"emailbtn_up.png", "emailbtn_over.png", "emailbtn_over.png",
				"emailbtn_up.png" ])
	})()
}
if (!s7sdk.share.EmbedShare) {
	s7sdk.share.EmbedShare = function EmbedShare(b, d, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.EmbedShare constructor - containerId: %0, settings: %1 , compId: %2",
						b, d, c);
		var a = document.getElementById(b);
		if (a && (a.s7base instanceof s7sdk.share.SocialShare)) {
			b = a.s7base.getPanelId()
		}
		c = (typeof c == "string" && c.length) ? c : "EmbedShare_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ c, b, null, 0, 0,
				"s7embedshare", d ]);
		var e = this;
		this.addEventListener("click", function() {
			e.btnClick()
		}, false)
	};
	s7sdk.Class.inherits("s7sdk.share.EmbedShare", "s7sdk.common.Button");
	s7sdk.share.EmbedShare.prototype.symbols = {
		TOOLTIP : "Embed",
		HEADER : "Get Embed Code",
		TOOLTIP_HEADER_CLOSE : "Close",
		DESCRIPTION : "To get embed code, copy and paste: ",
		EMBED_SIZE : "Embed Size",
		CUSTOM_SIZE : "Custom Size",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel",
		TOOLTIP_SCROLL_UP : "Scroll up",
		TOOLTIP_SCROLL_DOWN : "Scroll down"
	};
	s7sdk.share.EmbedShare.prototype.modifiers = {
		embedsizes : {
			params : [ "embedsizes" ],
			defaults : [ "320,240;640,480,true;1280,960" ]
		}
	};
	s7sdk.share.EmbedShare.prototype.btnClick = function() {
		if (!this.embeddialog) {
			this.embeddialog = new s7sdk.share.EmbedDialog(null, this.settings,
					this.id + "_dialog", this.embedsizes, s7sdk.share
							.getDialogSymbols(this))
		}
		this.embeddialog.setEmbedCode(this.template);
		this.embeddialog.show()
	};
	s7sdk.share.EmbedShare.prototype.setEmbedCode = function(a) {
		this.template = a
	};
	(function addDefaultCSS() {
		s7sdk.share.buttonsDefaultCSS("EmbedShare", ".s7embedshare", [
				"embedbtn_up.png", "embedbtn_over.png", "embedbtn_over.png",
				"embedbtn_up.png" ])
	})()
}
if (!s7sdk.share.LinkShare) {
	s7sdk.share.LinkShare = function LinkShare(b, d, c) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.LinkShare constructor - containerId: %0, settings: %1 , compId: %2",
						b, d, c);
		var a = document.getElementById(b);
		if (a && (a.s7base instanceof s7sdk.share.SocialShare)) {
			b = a.s7base.getPanelId()
		}
		c = (typeof c == "string" && c.length) ? c : "LinkShare_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ c, b, null, 0, 0,
				"s7linkshare", d ]);
		var e = this;
		this.addEventListener("click", function() {
			e.btnClick()
		}, false)
	};
	s7sdk.Class.inherits("s7sdk.share.LinkShare", "s7sdk.common.Button");
	s7sdk.share.LinkShare.prototype.symbols = {
		TOOLTIP : "Link",
		HEADER : "Share Link",
		TOOLTIP_HEADER_CLOSE : "Close",
		DESCRIPTION : "To share this link, copy and paste:",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel"
	};
	s7sdk.share.LinkShare.prototype.btnClick = function() {
		if (!this.linkdialog) {
			this.linkdialog = new s7sdk.share.LinkDialog(null, this.settings,
					this.id + "_dialog", s7sdk.share.getDialogSymbols(this))
		}
		this.linkdialog.setContentUrl(this.sharedurl ? this.sharedurl
				: location.href);
		this.linkdialog.show()
	};
	s7sdk.share.LinkShare.prototype.setContentUrl = function(a) {
		this.sharedurl = a
	};
	(function addDefaultCSS() {
		s7sdk.share.buttonsDefaultCSS("LinkShare", ".s7linkshare", [
				"linkbtn_up.png", "linkbtn_over.png", "linkbtn_over.png",
				"linkbtn_up.png" ])
	})()
}
if (!s7sdk.share.FacebookShare) {
	s7sdk.share.FacebookShare = function FacebookShare(b, e, d) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.FacebookShare constructor - containerId: %0, settings: %1 , compId: %2",
						b, e, d);
		var a = document.getElementById(b);
		if (a && (a.s7base instanceof s7sdk.share.SocialShare)) {
			b = a.s7base.getPanelId()
		}
		arguments.callee.superclass.apply(this, [ d, b, null, 0, 0,
				"s7facebookshare", e ]);
		this.url = "";
		var c = this;
		this.addEventListener("click", function() {
			if (c.activated) {
				c.share()
			}
		}, false)
	};
	s7sdk.Class.inherits("s7sdk.share.FacebookShare", "s7sdk.common.Button");
	s7sdk.share.FacebookShare.prototype.symbols = {
		TOOLTIP : "Facebook"
	};
	s7sdk.share.FacebookShare.prototype.setContentUrl = function(a) {
		this.url = a
	};
	s7sdk.share.FacebookShare.prototype.share = function() {
		var a;
		if (s7sdk.Util.isNonEmptyString(this.url)) {
			a = encodeURIComponent(this.url)
		} else {
			a = encodeURIComponent(document.location.href)
		}
		window.open("https://www.facebook.com/sharer/sharer.php?u=" + a,
				"facebooksharedialog", s7sdk.share.FacebookShare
						.createSizeString(400, 500))
	};
	s7sdk.share.FacebookShare.createSizeString = function(b, a) {
		var d, c;
		if (screen.height < a) {
			a = screen.height;
			c = 0
		} else {
			c = Math.round((screen.height - a) / 2)
		}
		if (screen.width < b) {
			d = 0;
			b = screen.width
		} else {
			d = Math.round((screen.width - b) / 2)
		}
		return "width=" + b + ",height=" + a + ",left=" + d + ",top=" + c
	};
	(function addDefaultCSS() {
		s7sdk.share.buttonsDefaultCSS("FacebookShare", ".s7facebookshare", [
				"facebookbtn_up.png", "facebookbtn_over.png",
				"facebookbtn_over.png", "facebookbtn_up.png" ])
	})()
}
if (!s7sdk.share.TwitterShare) {
	s7sdk.share.TwitterShare = function TwitterShare(b, e, d) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.TwitterShare constructor - containerId: %0, settings: %1 , compId: %2",
						b, e, d);
		var a = document.getElementById(b);
		if (a && (a.s7base instanceof s7sdk.share.SocialShare)) {
			b = a.s7base.getPanelId()
		}
		this.message = null;
		this.url = null;
		arguments.callee.superclass.apply(this, [ d, b, null, 0, 0,
				"s7twittershare", e ]);
		var c = this;
		this.addEventListener("click", function() {
			if (c.activated) {
				c.share()
			}
		}, false)
	};
	s7sdk.Class.inherits("s7sdk.share.TwitterShare", "s7sdk.common.Button");
	s7sdk.share.TwitterShare.prototype.symbols = {
		TOOLTIP : "Twitter"
	};
	s7sdk.share.TwitterShare.prototype.setMessage = function(a) {
		this.message = a
	};
	s7sdk.share.TwitterShare.prototype.setContentUrl = function(a) {
		this.url = a
	};
	s7sdk.share.TwitterShare.prototype.share = function() {
		var a = "";
		if (s7sdk.Util.isNonEmptyString(this.url)) {
			a += "?url=";
			a += this.url
		} else {
			if (s7sdk.browser.name === "ie") {
				a += "?url=" + document.location.href
			}
		}
		if (s7sdk.Util.isNonEmptyString(this.message)) {
			a += a.length > 0 ? "&" : "?";
			a += "text=";
			a += this.message
		}
		window.open("https://twitter.com/share" + a, "twittersharedialog",
				s7sdk.share.FacebookShare.createSizeString(626, 436))
	};
	(function addDefaultCSS() {
		s7sdk.share.buttonsDefaultCSS("TwitterShare", ".s7twittershare", [
				"twitterbtn_up.png", "twitterbtn_over.png",
				"twitterbtn_over.png", "twitterbtn_up.png" ])
	})()
}
if (!s7sdk.share.SocialShare) {
	s7sdk.share.SocialShare = function SocialShare(a, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.SocialShare constructor - containerId: %0, settings: %1 , compId: %2",
						a, c, b);
		b = (typeof b == "string" && b.length) ? b : "SocShare_"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ b, a, "div", "s7socialshare",
				c ]);
		this.containerId = a;
		this.isTouch = s7sdk.browser.device.name != "desktop";
		this.stepSize = 50;
		this.duration = 300;
		this.delaytohide = 2000;
		this.waitToHide = -1;
		this.state = 0;
		this.lastMouse = {
			x : -1000000,
			y : -1000000
		};
		this.container = s7sdk.Util.byId(a);
		this.createComponent()
	};
	s7sdk.Class.inherits("s7sdk.share.SocialShare", "s7sdk.UIComponent");
	s7sdk.share.SocialShare.prototype.modifiers = {
		bearing : {
			params : [ "bearing" ],
			defaults : [ "left" ],
			ranges : [ [ "left", "right", "up", "down" ] ]
		}
	};
	s7sdk.share.SocialShare.prototype.symbols = {
		TOOLTIP : "Social Share"
	};
	s7sdk.share.SocialShare.prototype.createComponent = function() {
		this.createElement();
		this.container.appendChild(this.obj);
		this.socialbtn = new s7sdk.share.DlgActionButton(this.id,
				this.settings, this.id + "_socBtn", {
					TOOLTIP : "Share"
				}, "s7socialbutton", "div");
		this.socialbtn.obj.style.position = "absolute";
		var a = this;
		this.animate = setInterval(function() {
			a.enterFrame()
		}, this.stepSize);
		this.socialbtn.addEventListener("click", function(c) {
			a.onSocialClick()
		}, false);
		this.socCntr = document.createElement("div");
		this.socCntr.style.overflow = "hidden";
		this.socCntr.style.position = "absolute";
		this.socCntr.style.top = "0px";
		this.socCntr.style.left = "0px";
		this.socCntr.style.visibility = "hidden";
		this.obj.appendChild(this.socCntr);
		this.socCntrSp = document.createElement("div");
		this.socCntrSp.id = this.id + "_socCtnr";
		this.socCntrSp.className = "s7socialsharepanel";
		this.socCntrSp.style.position = "relative";
		this.socCntrSp.style.display = "inline-block";
		this.socCntr.appendChild(this.socCntrSp);
		if (this.isTouch) {
			return
		}
		this.socialbtn.addEventListener("mouseover", function(c) {
			a.isOver = true;
			a.onSocialOver()
		}, false);
		this.socialbtn.addEventListener("mouseout", function(c) {
			a.isOver = false;
			a.onSocialOut()
		}, false);
		this.winMouseMoveHandler = function(c) {
			c = c || window.event;
			a.lastMouse = {
				x : s7sdk.Util.getEventPos(c).x,
				y : s7sdk.Util.getEventPos(c).y
			}
		};
		this.winMouseOutHandler = function(c) {
			c = c || window.event;
			a.lastMouse = {
				x : -1000000,
				y : -1000000
			}
		};
		var b = s7sdk.browser.name == "ie" ? document : window;
		s7sdk.Event
				.addDOMListener(b, "mouseout", this.winMouseOutHandler, true);
		s7sdk.Event.addDOMListener(b, "mousemove", this.winMouseMoveHandler,
				true)
	};
	s7sdk.share.SocialShare.prototype.getPanelId = function() {
		return this.socCntrSp.id
	};
	s7sdk.share.SocialShare.prototype.onSocialOut = function() {
		this.waitToHide = this.delaytohide
	};
	s7sdk.share.SocialShare.prototype.onSocialOver = function() {
		this.show()
	};
	s7sdk.share.SocialShare.prototype.checkMouse = function() {
		var c = s7sdk.Util.getObjPos(this.socCntr);
		var b = this.lastMouse.x - c.x;
		var a = this.lastMouse.y - c.y;
		return (b > 0 && b < this.socCntr.offsetWidth && a > 0 && a < this.socCntr.offsetHeight)
	};
	s7sdk.share.SocialShare.prototype.onSocialClick = function() {
		if (!this.isTouch) {
			return
		}
		if (!this.isOver) {
			this.show()
		} else {
			this.hide()
		}
		this.isOver = !this.isOver;
		this.waitToHide = -1
	};
	s7sdk.share.SocialShare.prototype.initAnimate = function() {
		this.step = 0;
		this.shiftSize = Math.max(this.socCntrSp.offsetHeight,
				this.socCntrSp.offsetWidth);
		this.stepDuration = Math.ceil(this.shiftSize
				/ (this.duration / this.stepSize))
	};
	s7sdk.share.SocialShare.prototype.show = function() {
		if (this.state != 0) {
			return
		}
		this.socCntr.style.left = "0px";
		this.socCntr.style.top = "0px";
		var b = s7sdk.share.getObjPos(this.socCntr);
		var c = s7sdk.share.getObjPos(this.socialbtn.obj);
		this.shiftPos = {
			x : c.x - b.x,
			y : c.y - b.y
		};
		this.initAnimate();
		this.isShowig = true;
		switch (this.bearing) {
		case "left":
			this.socCntr.style.left = -this.shiftSize + "px";
			this.socCntr.style.width = this.shiftSize + "px";
			this.socCntrSp.style.left = this.shiftSize + "px";
			break;
		case "right":
			this.socCntr.style.left = this.socialbtn.obj.offsetWidth + "px";
			this.socCntr.style.width = this.shiftSize + "px";
			this.socCntrSp.style.left = -this.shiftSize + "px";
			break;
		case "up":
			this.socCntr.style.left = "0px";
			this.socCntr.style.top = -this.shiftSize + "px";
			this.socCntrSp.style.top = this.shiftSize + "px";
			break;
		case "down":
			this.socCntr.style.left = "0px";
			this.socCntr.style.top = this.socialbtn.obj.offsetHeight + "px";
			this.socCntrSp.style.top = -this.shiftSize + "px";
			break
		}
		this.socCntr.style.visibility = "inherit";
		if (this.bearing == "left" || this.bearing == "right") {
			if (s7sdk.browser.name === "ie" && s7sdk.browser.version.major == 7) {
				this.updateDisplayStyle("inline")
			} else {
				this.updateDisplayStyle("inline-block")
			}
		} else {
			if (this.bearing == "up" || this.bearing == "down") {
				if (s7sdk.browser.name === "ie"
						&& s7sdk.browser.version.major == 8) {
					this.updateDisplayStyle("block")
				} else {
					var a = s7sdk.Util.css.getCss("s7socialshare", "position",
							this.obj.id, null, this.container);
					if (a == "relative" || a == "static") {
						this.updateDisplayStyle("block")
					}
				}
			}
		}
		this.socCntr.style.left = parseInt(this.socCntr.style.left)
				+ this.shiftPos.x + "px";
		this.socCntr.style.top = parseInt(this.socCntr.style.top)
				+ this.shiftPos.y + "px";
		this.state = 1
	};
	s7sdk.share.SocialShare.prototype.hide = function() {
		this.initAnimate();
		this.isShowig = false;
		this.socCntr.style.overflow = "hidden"
	};
	s7sdk.share.SocialShare.prototype.updateDisplayStyle = function(b) {
		var c = this.socCntrSp.childNodes;
		for ( var a = 0; a < c.length; a++) {
			if (s7sdk.Util.getStyle(c[a], "display") == "none") {
				continue
			}
			if (c[a].style.display != b) {
				c[a].style.display = b;
				c[a].style.zoom = 1
			}
		}
	};
	s7sdk.share.SocialShare.prototype.enterFrame = function() {
		switch (this.state) {
		case 0:
			break;
		case 1:
			this.slideStep();
			break;
		case 2:
			this.slideStep();
			break;
		case 3:
			if (!this.isOver) {
				if (!this.isTouch) {
					if (this.checkMouse()) {
						return
					}
				}
				this.waitToHide -= this.stepSize;
				if (this.waitToHide < 0) {
					this.hide();
					this.state = 2
				}
			}
			break
		}
	};
	s7sdk.share.SocialShare.prototype.slideStep = function() {
		var a = (this.isShowig ? this.shiftSize - this.stepDuration * this.step
				: this.stepDuration * this.step);
		a = a < 0 ? 0 : a;
		a = a > this.shiftSize ? this.shiftSize : a;
		switch (this.bearing) {
		case "left":
			this.socCntrSp.style.left = a + "px";
			break;
		case "right":
			this.socCntrSp.style.left = -a + "px";
			break;
		case "up":
			this.socCntrSp.style.top = a + "px";
			break;
		case "down":
			this.socCntrSp.style.top = -a + "px";
			break
		}
		if ((this.stepDuration * this.step > this.shiftSize)
				&& (a == 0 || a == this.shiftSize)) {
			this.step = 0;
			if (this.state == 2) {
				this.socCntr.style.width = "0px";
				this.socCntr.style.visibility = "hidden";
				this.socCntr.style.left = "0px";
				this.socCntrSp.style.left = "0px";
				this.socCntrSp.style.top = "0px";
				this.socCntr.style.width = "auto";
				this.socCntr.style.overflow = "hidden";
				this.state = 0
			} else {
				this.socCntr.style.overflow = "visible";
				this.waitToHide = this.delaytohide;
				this.state = 3
			}
		}
		this.step++
	};
	s7sdk.share.SocialShare.prototype.resize = function(d, b) {
		s7sdk.Logger.log(s7sdk.Logger.FINE, "SocialShare.resize %0: %1x%2",
				this.id, d, b);
		this.socCntr.style.width = "0px";
		this.socCntr.style.visibility = "hidden";
		this.socCntr.style.left = "0px";
		this.socCntrSp.style.left = "0px";
		this.socCntrSp.style.top = "0px";
		this.socCntr.style.width = "auto";
		this.socCntr.style.overflow = "hidden";
		this.state = 0;
		this.socialbtn.resize(d, b);
		var e = this.socCntrSp.childNodes;
		for ( var c = 0; c < e.length; c++) {
			var a = e[c];
			if (a.button) {
				a.button.resize(d, b)
			}
		}
	};
	s7sdk.share.SocialShare.prototype.activate = function() {
		this.socialbtn.activate()
	};
	s7sdk.share.SocialShare.prototype.deactivate = function() {
		this.socialbtn.deactivate()
	};
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var a = c(".s7socialshare", {}) + c(".s7socialshare .s7socialbutton", {
			"background-color" : "#e7e7e7"
		}) + c(".s7socialshare .s7socialsharepanel", {
			"-webkit-transform" : "translateZ(0px)",
			"font-size" : "0px",
			"letter-spacing" : "0px",
			"word-spacing" : "0px",
			"background-color" : "#e7e7e7"
		});
		var b = s7sdk.share.buttonsDefaultCSS("",
				".s7socialshare .s7socialbutton", [ "socialbtn_up.png",
						"socialbtn_over.png", "socialbtn_over.png",
						"socialbtn_up.png" ], null, true);
		a = b + a;
		s7sdk.Util.css.addDefaultCSS(a, "SocialShare")
	})()
}
if (!s7sdk.share.CustomComboBox) {
	s7sdk.share.CustomComboBox = function CustomComboBox(a, d, c, g, f, e) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.CustomComboBox constructor - containerId: %0, settings: %1 , compId: %2",
						a, d, c);
		var b = g ? g : "div";
		arguments.callee.superclass.apply(this, [ c, a, b, "s7combobox", d ]);
		this.ddContainer = e;
		this.containertyp = b;
		this.parenObject = f;
		this.compId = (s7sdk.Util.isNull(c) ? "" : c);
		if ((a != null) && (s7sdk.Util.byId(a))) {
			this.container = s7sdk.Util.byId(a)
		} else {
			this.container = document.body
		}
		this.createCBox();
		this.changeState(s7sdk.share.CustomComboBox.EXPANDED)
	};
	s7sdk.Class.inherits("s7sdk.share.CustomComboBox", "s7sdk.UIComponent");
	s7sdk.share.CustomComboBox.EXPANDED = 0;
	s7sdk.share.CustomComboBox.ShRINKED = 1;
	s7sdk.share.CustomComboBox.prototype.symbols = {
		TOOLTIP : "Select"
	};
	s7sdk.share.CustomComboBox.prototype.createCBox = function() {
		this.createElement();
		this.container.appendChild(this.obj);
		if (!this.ddContainer) {
			this.ddContainer = this.obj
		}
		this.createInput()
	};
	s7sdk.share.CustomComboBox.prototype.createInput = function() {
		var a = document.createElement("span");
		a.className = "s7comboboxtext";
		a.style.width = "0px";
		a.style.verticalAlign = "middle";
		this.obj.appendChild(a);
		this.obj.txt = document.createTextNode("");
		this.obj.appendChild(this.obj.txt);
		this.obj.id = this.id ? this.id + "_cbxbutton" : "cbxbutton_"
				+ s7sdk.Util.createUniqueId();
		this.cbtn = new s7sdk.share.DlgActionButton(this.obj.id, this.settings,
				null, {
					TOOLTIP : ""
				}, "s7comboboxbutton");
		var b = this;
		s7sdk.Event.addDOMListener(this.cbtn, "click", function(d) {
			b.cbtn.obj.blur();
			b.onExpand()
		}, true);
		var c = document.createElement(this.containertyp);
		c.className = "s7comboboxdropdown";
		this.ddContainer.appendChild(c);
		this.cboxdd = c;
		this.cboxdd.style.display = "none"
	};
	s7sdk.share.CustomComboBox.prototype.onExpand = function() {
		if (this.cboxdd.style.display == "none") {
			if (this.ddContainer.dlgAbsolute) {
				if (this.container.onExpand) {
					this.container.onExpand()
				}
				var e = s7sdk.share.getObjPos(this.obj);
				var f = this.ddContainer.dlgAbsolute;
				f.style.left = "0px";
				f.style.top = "0px";
				var b = s7sdk.share.getObjPos(f);
				f.style.left = (e.x - b.x) + "px";
				var d = e.y - b.y;
				var a = Math.max(document.body.scrollHeight,
						document.documentElement.scrollHeight,
						document.body.offsetHeight,
						document.documentElement.offsetHeight,
						document.body.clientHeight,
						document.documentElement.clientHeight);
				a = (this.parenObject && this.parenObject.getContainerHeight) ? this.parenObject
						.getContainerHeight()
						: a;
				this.cboxdd.style.visibility = "hidden";
				this.cboxdd.style.display = "block";
				if ((d + this.obj.offsetHeight + f.offsetHeight + 2) < a) {
					d += (this.obj.offsetHeight + 2)
				} else {
					d -= (f.offsetHeight + 2)
				}
				f.style.top = d + "px";
				f.style.width = this.obj.offsetWidth + "px";
				this.cboxdd.style.visibility = "inherit"
			}
			this.cboxdd.style.display = "block"
		} else {
			this.cboxdd.style.display = "none"
		}
		this.blockScroll = true;
		var c = this;
		setTimeout(function() {
			c.blockScroll = false
		}, 500)
	};
	s7sdk.share.CustomComboBox.prototype.hideDropDn = function() {
		this.cboxdd.style.display = "none"
	};
	s7sdk.share.CustomComboBox.prototype.addItem = function(f, a) {
		var e = document.createElement("span");
		e.className = "s7dropdownitem";
		this.cboxdd.appendChild(e);
		var c = document.createElement("a");
		c.className = "s7dropdownitemanchor";
		e.appendChild(c);
		var b = document.createElement("span");
		b.className = "s7checkmark";
		b.style.visibility = a ? "inherit" : "hidden";
		c.appendChild(b);
		c.txtnode = document.createTextNode(f);
		c.appendChild(c.txtnode);
		c.checked = b;
		c.val = f;
		var d = this;
		s7sdk.Event.addDOMListener(c, "click", function(g) {
			g = g || window.event;
			d.onSelect(g)
		}, true)
	};
	s7sdk.share.CustomComboBox.prototype.onSelect = function(c) {
		var a = (c.target || c.srcElement);
		var d = this.cboxdd.childNodes;
		for ( var b = 0; b < d.length; b++) {
			if (d[b].childNodes[0].checked.style.visibility != "hidden") {
				d[b].childNodes[0].checked.style.visibility = "hidden"
			}
		}
		this.obj.txt.nodeValue = a.val;
		if (this.parenObject && this.parenObject.updateTemplate) {
			this.parenObject.updateTemplate(a.val)
		}
		a.checked.style.visibility = "inherit";
		if (this.parenObject && a.val == this.parenObject.customSizeStr) {
			this.onExpand()
		}
		this.hideDropDn()
	};
	s7sdk.share.CustomComboBox.prototype.changeState = function(a) {
		var b = [ "true", "false" ];
		s7sdk.Util.css.setCSSAttributeSelector(this.obj, "expanded", b[a])
	};
	s7sdk.share.CustomComboBox.prototype.update = function(b, c) {
		for ( var a = 0; a < b.length; a++) {
			if (c == a) {
				this.addItem(b[a], true);
				this.selected = this.obj.txt.nodeValue = b[a];
				if (this.parenObject && this.parenObject.updateTemplate) {
					this.parenObject.updateTemplate(b[a])
				}
			} else {
				this.addItem(b[a], false)
			}
		}
	};
	s7sdk.share.CustomComboBox.prototype.removeItem = function(a) {
	};
	(function addDefaultCSS() {
		var d = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		var b = s7sdk.share.buttonsDefaultCSS("",
				".s7combobox .s7comboboxbutton", [ "cboxbtndn_up.png",
						"cboxbtndn_over.png", "cboxbtndn_over.png",
						"cboxbtndn_up.png" ], null, true);
		var a = d(".s7combobox", {
			"-webkit-touch-callout" : "none",
			"-webkit-user-select" : "none",
			"-moz-user-select" : "none",
			"-ms-user-select" : "none",
			"user-select" : "none",
			border : "1px solid #cccccc",
			display : "block",
			"padding-left" : "10px",
			position : "relative",
			width : "300px",
			"-webkit-tap-highlight-color" : "rgba(0,0,0,0)"
		}) + d(".s7combobox[expanded='false']", {
			width : "110px"
		}) + d(".s7combobox[expanded='true']", {
			width : "300px"
		}) + d(".s7combobox .s7comboboxtext", {
			position : "relative",
			display : "inline-block",
			height : "40px"
		}) + d(".s7combobox .s7comboboxbutton", {
			position : "absolute",
			display : "block",
			top : "0px",
			right : "0px",
			width : "40px",
			height : "40px"
		}) + d(".s7combobox .s7comboboxdropdown", {
			"border-top" : "1px solid #cccccc",
			width : "100%",
			display : "block"
		}) + d(".s7combobox .s7dropdownitem", {
			display : "block",
			width : "100%",
			position : "relative"
		}) + d(".s7combobox .s7checkmark", {
			width : "25px",
			height : "25px",
			"vertical-align" : "middle",
			display : "inline-block",
			"background-image" : c("cboxchecked.png")
		}) + d(".s7combobox .s7dropdownitemanchor", {
			display : "block",
			width : "100%",
			"background-color" : "#ffffff",
			position : "relative"
		}) + d(".s7combobox .s7dropdownitemanchor:hover", {
			"background-color" : "#eeeeee"
		});
		a = b + a;
		s7sdk.Util.css.addDefaultCSS(a, "CustomComboBox")
	})()
}
if (!s7sdk.share.SocialDialog) {
	s7sdk.share.SocialDialog = function SocialDialog(a, e, d, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.SocialDialog constructor - containerId: %0, settings: %1 , compId: %2",
						a, e, d);
		if (b) {
			this.symbols = b
		}
		arguments.callee.superclass.apply(this, [ d, a, "div", c, e ]);
		this.compId = (s7sdk.Util.isNull(d) ? "" : d);
		this.defaultContainerId = a
	};
	s7sdk.Class.inherits("s7sdk.share.SocialDialog", "s7sdk.UIComponent");
	s7sdk.share.SocialDialog.prototype.symbols = {
		HEADER : "",
		TOOLTIP_HEADER_CLOSE : "",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel",
		TOOLTIP_SCROLL_UP : "Scroll up",
		TOOLTIP_SCROLL_DOWN : "Scroll down",
		ACTION : "",
		TOOLTIP_ACTION : ""
	};
	s7sdk.share.SocialDialog.prototype.attachDialog = function() {
		var a = document.fullscreenElement || document.mozFullScreenElement
				|| document.webkitFullscreenElement;
		var b;
		if (a) {
			b = a
		} else {
			if ((this.defaultContainerId != null)
					&& (s7sdk.Util.byId(this.defaultContainerId))) {
				b = s7sdk.Util.byId(this.defaultContainerId)
			} else {
				b = document.body
			}
		}
		if (this.container != b) {
			this.container = b;
			b.appendChild(this.obj)
		}
	};
	s7sdk.share.SocialDialog.prototype.createDialog = function(b) {
		this.createElement();
		this.obj.style.position = "absolute";
		this.obj.style.width = "100%";
		this.obj.style.height = "100%";
		this.attachDialog();
		this.backOverlay = document.createElement("div");
		this.backOverlay.className = "s7backoverlay";
		this.obj.appendChild(this.backOverlay);
		this.dialog = document.createElement("div");
		this.dialog.className = "s7dialog";
		this.obj.appendChild(this.dialog);
		var d = s7sdk.Util.getStyle(this.dialog, "width");
		this.dialog.style.width = "100%";
		var c = s7sdk.Util.getStyle(this.dialog, "width");
		this.isTouch = d == c;
		this.dialog.style.width = "";
		var e = document.createElement("div");
		e.style.top = "0px";
		e.style.left = "0px";
		e.style.position = "absolute";
		e.style.zIndex = 9999;
		this.dialog.appendChild(e);
		var a = document.createElement("span");
		a.style.position = "relative";
		e.appendChild(a);
		this.cntSpAbsolute = a;
		this.cntSpAbsolute.dlgAbsolute = e;
		this.createCaption();
		this.createContentContainer();
		this.createContent();
		this.createBottom(b);
		this.dialogStyle = this.dialog.style.height;
		this.contentIntStyle = this.contentInt.style.height;
		this.setupSz();
		this.centerDialog();
		this.setupScroll();
		this.wid_ = parseInt(s7sdk.Util.getStyle(this.obj, "width"));
		this.hei_ = parseInt(s7sdk.Util.getStyle(this.obj, "height"));
		this.hide()
	};
	s7sdk.share.SocialDialog.prototype.getContainerHeight = function() {
		return this.backOverlay.offsetHeight
	};
	s7sdk.share.SocialDialog.prototype.createContentContainer = function() {
		this.contentInt = document.createElement("div");
		this.contentInt.setAttribute("id", this.compId + "_viewArea");
		this.contentInt.className = "s7dialogviewarea";
		this.dialog.appendChild(this.contentInt);
		this.contentSpan = document.createElement("span");
		this.contentSpan.className = "s7dialogbody";
		this.contentInt.appendChild(this.contentSpan);
		if (s7sdk.browser.name === "ie" && s7sdk.browser.version.major < 8) {
			this.contentSbIE7 = document.createElement("span");
			this.contentSbIE7.id = this.compId + "_cextInt";
			this.contentSbIE7.className = "s7dialogscrollpanel";
			this.contentInt.appendChild(this.contentSbIE7)
		}
	};
	s7sdk.share.SocialDialog.prototype.centerDialog = function() {
		if (this.isTouch) {
		} else {
			if (this.obj.offsetWidth != this.dialog.offsetWidth) {
				this.dialog.style.left = (this.obj.offsetWidth - this.dialog.offsetWidth)
						/ 2 + "px";
				this.dialog.style.top = (this.obj.offsetHeight - this.dialog.offsetHeight)
						/ 2 + "px"
			}
		}
	};
	s7sdk.share.SocialDialog.prototype.getInitialHeight = function() {
		return parseInt(s7sdk.Util.css.getCss("s7dialogviewarea", "height",
				this.contentInt.id, null, this.dialog))
	};
	s7sdk.share.SocialDialog.prototype.setupSz = function() {
		if (this.obj.style.display == "none") {
			return
		}
		this.contentSpan.style.top = "0px";
		this.dialog.style.height = "";
		this.contentInt.style.height = "";
		var b = this.getInitialHeight();
		var d;
		if (!this.isTouch) {
			d = this.dialog.offsetHeight - this.backOverlay.offsetHeight;
			if (d > 0) {
				this.contentInt.style.height = b + "px";
				d = this.dialog.offsetHeight - this.backOverlay.offsetHeight;
				this.contentInt.style.height = (b - d) + "px"
			}
			this.setupScroll()
		} else {
			var a = s7sdk.Util.getObjPos(this.bottom).y
					- s7sdk.Util.getObjPos(this.contentInt).y;
			this.contentInt.style.height = a + "px";
			var c = (this.contentInt.offsetWidth - this.contentSpan.offsetWidth) / 2;
			this.contentSpan.style.left = c + "px"
		}
		d = (this.contentInt.offsetHeight - this.contentSpan.offsetHeight) / 2;
		if (d > 0) {
			this.contentSpan.style.top = d + "px"
		}
	};
	s7sdk.share.SocialDialog.prototype.setupScroll = function() {
		var b = this.contentSpan.offsetHeight - this.contentInt.clientHeight;
		if (b > 0) {
			var a = this.scrollbarInst.curPos_;
			this.scrollbarInst.setMaxScroll(b);
			this.scrollbarInst.curPos_ = a;
			this.scrollbarInst.setThumbPosition(false);
			this.contentSb.style.display = "inline-block"
		} else {
			this.contentSb.style.display = "none"
		}
		if (this.scrollbarInst) {
			this.scrollbarInst.setScrollStep(Math
					.round(this.contentInt.clientHeight * 0.1))
		}
	};
	s7sdk.share.SocialDialog.prototype.createCaption = function(e) {
		this.caption = document.createElement("div");
		this.caption.id = this.compId + "_header";
		this.caption.className = "s7dialogheader";
		this.dialog.appendChild(this.caption);
		var d = document.createElement("span");
		d.className = "s7dialogline";
		this.caption.appendChild(d);
		var a = document.createElement("span");
		a.className = "s7dialogheadericon";
		d.appendChild(a);
		var c = document.createElement("span");
		c.className = "s7dialogheadertext";
		c.innerHTML = this.getLocalizedText("HEADER");
		d.appendChild(c);
		this.closebutton = new s7sdk.share.DlgActionButton(this.caption.id,
				this.settings, null, {
					TOOLTIP : this.getLocalizedText("TOOLTIP_HEADER_CLOSE")
				}, "s7closebutton");
		var b = this;
		s7sdk.Event.addDOMListener(this.closebutton, "click", function(f) {
			f = f || window.event;
			b.closebutton.obj.blur();
			b.onClose(f)
		}, true)
	};
	s7sdk.share.SocialDialog.prototype.createBottom = function(b) {
		this.bottom = document.createElement("div");
		this.bottom.className = "s7dialogfooter";
		this.dialog.appendChild(this.bottom);
		var a = document.createElement("div");
		this.bottom.appendChild(a);
		var e = document.createElement("span");
		e.className = "s7dialogbuttoncontainer";
		e.id = this.compId + "_footerPanel";
		a.appendChild(e);
		this.lnc_tnr = a;
		this.cancelbutton = new s7sdk.share.DlgActionButton(e.id,
				this.settings, null, {
					TOOLTIP : this.getLocalizedText("TOOLTIP_CANCEL")
				}, "s7dialogcancelbutton", "span", this
						.getLocalizedText("CANCEL"));
		this.bottom.buttonsCtnrId = e.id;
		var d = this;
		if (!b) {
			this.actionbutton = new s7sdk.share.DlgActionButton(e.id,
					this.settings, null, {
						TOOLTIP : this.getLocalizedText("TOOLTIP_ACTION")
					}, "s7dialogactionbutton", "span", this
							.getLocalizedText("ACTION"));
			s7sdk.Event.addDOMListener(this.actionbutton, "click", function(f) {
				f = f || window.event;
				d.actionbutton.obj.blur();
				d.onAction(f)
			}, true)
		}
		s7sdk.Event.addDOMListener(this.cancelbutton, "click", function(f) {
			f = f || window.event;
			d.cancelbutton.obj.blur();
			d.onCancel(f)
		}, true);
		if (this.isTouch) {
			this.bottom.style.position = "absolute";
			this.bottom.style.width = "100%"
		} else {
			if (this.obj.offsetHeight != this.dialog.offsetHeight) {
				this.bottom.style.position = "absolute";
				var c = this.lnc_tnr.offsetWidth;
				this.bottom.style.width = c + "px";
				this.bottom.style.position = "relative"
			} else {
				var c = this.lnc_tnr.offsetWidth;
				this.bottom.style.width = c + "px"
			}
		}
	};
	s7sdk.share.SocialDialog.prototype.onAction = function(a) {
	};
	s7sdk.share.SocialDialog.prototype.onCancel = function(a) {
	};
	s7sdk.share.SocialDialog.prototype.createScrollbar = function() {
		this.contentSb = document.createElement("div");
		this.contentSb.id = this.id + "_scrollBarContainer";
		this.contentSb.className = "s7dialogscrollpanel";
		this.contentInt.appendChild(this.contentSb);
		var a = this;
		this.scrollbarInst = new s7sdk.ScrollBar(this.contentSb.id,
				this.settings, this.contentSb.id + "_scrollBar");
		this.scrollbarInst.upButton_.toolTip_.setContent(this
				.getLocalizedText("TOOLTIP_SCROLL_UP"));
		this.scrollbarInst.downButton_.toolTip_.setContent(this
				.getLocalizedText("TOOLTIP_SCROLL_DOWN"));
		this.scrollbarInst.addEventListener(
				s7sdk.ScrollEvent.SCROLL_POSITION_EVENT, function(b) {
					a.moveContent(b.s7event.position)
				}, false);
		if (this.isTouch) {
			this.scrollbarInst.obj.style.display = "none"
		}
	};
	s7sdk.share.SocialDialog.prototype.moveContent = function(a) {
		this.contentSpan.style.top = -a + "px";
		if (this.onPositionChanged) {
			this.onPositionChanged()
		}
	};
	s7sdk.share.SocialDialog.prototype.createLineFeed = function() {
		var a = document.createElement("span");
		a.className = "s7dialoglinefeed";
		this.contentSpan.appendChild(a)
	};
	s7sdk.share.SocialDialog.prototype.onClose = function() {
		this.hide()
	};
	s7sdk.share.SocialDialog.prototype.show = function() {
		if (this.obj.style.display == "block") {
			return
		}
		this.attachDialog();
		this.contentSpan.style.top = "0px";
		var a = this;
		this.resizeTimer = setInterval(function() {
			a.onCheckResize()
		}, 100);
		this.obj.style.visibility = "hidden";
		this.obj.style.display = "block";
		this.setupSz();
		this.setupScroll();
		this.obj.style.visibility = "inherit"
	};
	s7sdk.share.SocialDialog.prototype.onCheckResize = function() {
		var a = this.backOverlay.offsetWidth;
		var b = this.backOverlay.offsetHeight;
		if (this.wid_ != a || this.hei_ != b) {
			this.attachDialog();
			this.wid_ = a;
			this.hei_ = b;
			this.setupSz();
			if (!this.isTouch && this.scrollbarInst) {
				this.scrollbarInst.resize()
			}
			this.centerDialog()
		}
	};
	s7sdk.share.SocialDialog.prototype.hide = function() {
		this.obj.style.display = "none";
		if (this.resizeTimer) {
			window.clearInterval(this.resizeTimer)
		}
		this.resizeTimer = null
	};
	(function addDefaultCSS() {
		var b = s7sdk.Util.css.createCssRuleText;
		var a = b(".s7dialogcancelbutton", {
			width : "64px",
			height : "34px"
		}) + b(".s7dialogcancelbutton[state='up']", {
			"background-color" : "#666666",
			color : "#dddddd"
		}) + b(".s7dialogcancelbutton[state='down']", {
			"background-color" : "#555555",
			color : "#ffffff"
		}) + b(".s7dialogcancelbutton[state='over']", {
			"background-color" : "#555555",
			color : "#ffffff"
		}) + b(".s7dialogcancelbutton[state='disabled']", {
			"background-color" : "#b2b2b2",
			color : "#dddddd"
		});
		s7sdk.Util.css.addDefaultCSS(a, "SocialDialog")
	})()
}
if (!s7sdk.share.LinkDialog) {
	s7sdk.share.LinkDialog = function LinkDialog(a, d, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.LinkDialog constructor - containerId: %0, settings: %1 , compId: %2",
						a, d, c);
		arguments.callee.superclass.apply(this, [ a, d, c, "s7linkdialog", b ]);
		this.createDialog(true)
	};
	s7sdk.Class.inherits("s7sdk.share.LinkDialog", "s7sdk.share.SocialDialog");
	s7sdk.share.LinkDialog.prototype.symbols = {
		HEADER : "Share Link",
		DESCRIPTION : "To share this content with others, copy and past this link:",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel"
	};
	s7sdk.share.LinkDialog.prototype.createContent = function() {
		this.createLinkLable(this.getLocalizedText("DESCRIPTION"));
		this.createLinkLine();
		this.createScrollbar()
	};
	s7sdk.share.LinkDialog.prototype.createLinkLable = function(a) {
		var b = document.createElement("span");
		b.className = "s7dialogline s7dialoglabel s7dialoginputwide";
		this.contentSpan.appendChild(b);
		b.innerHTML = a;
		this.createLineFeed()
	};
	s7sdk.share.LinkDialog.prototype.createLinkLine = function() {
		var a = document.createElement("span");
		a.className = "s7dialogline s7dialoginputcontainer";
		this.contentSpan.appendChild(a);
		this.inplnk = document.createElement("input");
		this.inplnk.className = "s7dialoglink";
		a.appendChild(this.inplnk);
		this.createLineFeed()
	};
	s7sdk.share.LinkDialog.prototype.setupScroll = function() {
	};
	s7sdk.share.LinkDialog.prototype.createScrollbar = function() {
	};
	s7sdk.share.LinkDialog.prototype.onCancel = function() {
		this.hide()
	};
	s7sdk.share.LinkDialog.prototype.setContentUrl = function(a) {
		if (a) {
			this.inplnk.value = a
		}
	};
	(function addDefaultCSS() {
		var d = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = d(".s7linkdialog .s7dialogheadericon", {
			"background-image" : b("dlglink_cap.png"),
			width : "22px",
			height : "12px"
		}) + d(".s7linkdialog .s7dialogviewarea", {
			height : "100px"
		}) + d(".s7linkdialog .s7dialoginputwide", {
			border : "none",
			"padding-bottom" : "10px",
			width : "430px"
		}) + d(".s7linkdialog .s7dialoginputcontainer", {
			border : "1px solid #cccccc",
			padding : "9px"
		}) + d(".s7linkdialog .s7dialoglink", {
			border : "none",
			width : "450px"
		});
		var c = [];
		s7sdk.share.dialogsDefaultCSS("LinkDialog", ".s7linkdialog", c, a)
	})()
}
if (!s7sdk.share.EmailDialog) {
	s7sdk.share.EmailDialog = function EmailDialog(a, d, c, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.EmailDialog_src constructor - containerId: %0, settings: %1 , compId: %2",
						a, d, c);
		arguments.callee.superclass
				.apply(this, [ a, d, c, "s7emaildialog", b ]);
		this.createDialog()
	};
	s7sdk.Class.inherits("s7sdk.share.EmailDialog", "s7sdk.share.SocialDialog");
	s7sdk.share.EmailDialog.prototype.symbols = {
		HEADER : "Email this to a Friend",
		INVALID_ADDRESSS : "Wrong email address",
		TO : "To",
		TOOLTIP_ADD : "Add",
		ADD : "Add Another Email Address",
		FROM : "From",
		MESSAGE : "Message",
		TOOLTIP_REMOVE : "Remove",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel",
		CLOSE : "Close",
		TOOLTIP_CLOSE : "Close",
		TOOLTIP_SCROLL_UP : "Scroll up",
		TOOLTIP_SCROLL_DOWN : "Scroll down",
		ACTION : "Send Email",
		TOOLTIP_ACTION : "Send",
		SEND_SUCCESS : "Email sent successfully",
		SEND_FAILURE : "Send email falied"
	};
	s7sdk.share.EmailDialog.prototype.createContent = function() {
		s7sdk.Util.css.setCSSAttributeSelector(this.contentInt, "state", "");
		this.addrCounter = 0;
		this.createErrorMsg();
		this.createMailLine("$TOEMAIL$", this.getLocalizedText("TO"), "input",
				false, null, "s7dialoginputshort");
		this.createAddMailLine();
		this.createScrollbar();
		this.createMailLine("$FROMEMAIL$", this.getLocalizedText("FROM"),
				"input", false, null, "s7dialoginputwide");
		this.msgCtrl = this.createMailLine("$MESSAGEEMAIL$", this
				.getLocalizedText("MESSAGE"), "textarea", false, null,
				"s7dialoginputwide");
		this.createDescrLine()
	};
	s7sdk.share.EmailDialog.prototype.getInitialHeight = function() {
		var a = this.contentInt.getAttribute("state");
		return parseInt(s7sdk.Util.css.getCss("s7dialogviewarea", "height",
				this.contentInt.id, null, this.dialog, {
					state : a
				}))
	};
	s7sdk.share.EmailDialog.prototype.createErrorMsg = function() {
		var b = document.createElement("span");
		b.className = "s7dialogline s7dialogerror";
		s7sdk.Util.css.setCSSAttributeSelector(b, "error", "false");
		this.contentSpan.appendChild(b);
		var a = document.createElement("span");
		a.className = "s7dialogerrormessage";
		b.appendChild(a);
		b.errsp = a;
		b.errList = [];
		this.errLine = b;
		this.setErrorMsg("INVALID_ADDRESSS", "verifyerror");
		this.createLineFeed()
	};
	s7sdk.share.EmailDialog.prototype.setErrorMsg = function(d, c) {
		var b = this.errLine.errsp;
		s7sdk.Util.css.setCSSAttributeSelector(b, "state", c);
		var a = this.getLocalizedText(d);
		b.textContent = a;
		b.innerText = a
	};
	s7sdk.share.EmailDialog.prototype.createAddMailLine = function() {
		var d = document.createElement("span");
		d.id = this.id + "_lnctnr_" + s7sdk.Util.createUniqueId();
		d.className = "s7dialogline";
		this.contentSpan.appendChild(d);
		var c = document.createElement("span");
		c.className = "s7dialoglabel s7dialoginputlabel";
		d.appendChild(c);
		this.addBtnCtnr = d;
		var b = new s7sdk.share.DlgActionButton(d.id, this.settings, null, {
			TOOLTIP : this.getLocalizedText("TOOLTIP_ADD")
		}, "s7dialogaddemailbutton", "span", this.getLocalizedText("ADD"));
		var a = this;
		b.addEventListener("click", function() {
			a.onAddEmailAddress()
		}, false);
		this.createLineFeed()
	};
	s7sdk.share.EmailDialog.prototype.onAddEmailAddress = function() {
		var a = document.createElement("span");
		a.className = "s7dialoglinefeed";
		this.createMailLine("$ADDEMAIL" + this.addrCounter + "$", "", "input",
				true, this.addBtnCtnr, "s7dialoginputshort");
		this.addrCounter++;
		this.contentSpan.insertBefore(a, this.addBtnCtnr);
		this.setupScroll(true)
	};
	s7sdk.share.EmailDialog.prototype.createDescrLine = function() {
		var e = document.createElement("span");
		e.className = "s7dialogline s7dialogcontent";
		this.contentSpan.appendChild(e);
		var d = document.createElement("span");
		d.className = "s7dialogthumbnail";
		e.appendChild(d);
		var c = parseInt(s7sdk.Util.getStyle(d, "width"));
		var h = parseInt(s7sdk.Util.getStyle(d, "height"));
		e.imgsp = d;
		e.imgsp.w = c == 0 ? d.clientWidth : c;
		e.imgsp.h = h == 0 ? d.scrollHeight : h;
		var a = document.createElement("span");
		a.className = "s7dialoginfopanel";
		e.appendChild(a);
		var g = document.createElement("span");
		g.className = "s7dialogtitle";
		a.appendChild(g);
		e.titlestr = g;
		var b = document.createElement("span");
		b.className = "s7dialogorigin";
		a.appendChild(b);
		e.site = b;
		var f = document.createElement("span");
		f.className = "s7dialogdescription";
		a.appendChild(f);
		e.descrtext = f;
		this.descr = e
	};
	s7sdk.share.EmailDialog.prototype.createMailLine = function(c, h, i, d, g,
			j) {
		var f = document.createElement("span");
		if (d) {
			f.id = this.id + "_lnctnr_" + s7sdk.Util.createUniqueId()
		}
		f.className = "s7dialogline";
		if (g) {
			this.contentSpan.insertBefore(f, g)
		} else {
			this.contentSpan.appendChild(f)
		}
		var e = document.createElement("span");
		e.className = "s7dialoglabel s7dialoginputlabel";
		e.innerHTML = h;
		f.appendChild(e);
		var b = document.createElement("span");
		b.className = "s7dialoginputcontainer";
		f.appendChild(b);
		f.spinp = b;
		f.inp = document.createElement(i);
		if (i == "textarea") {
			f.inp.className = "s7dialogmessage " + j
		} else {
			f.inp.className = j;
			var a = this;
			f.inp.onchange = function() {
				a.verifyEmailAddress(f)
			}
		}
		b.appendChild(f.inp);
		if (d) {
			f.btn = new s7sdk.share.DlgActionButton(f.id, this.settings, null,
					{
						TOOLTIP : this.getLocalizedText("TOOLTIP_REMOVE")
					}, "s7dialogremoveemailbutton");
			if (g) {
				var a = this;
				s7sdk.Event.addDOMListener(f.btn, "click", function(k) {
					k = k || window.event;
					a.onRemove(f)
				}, true)
			} else {
				f.btn.obj.style.visibility = "hidden"
			}
		}
		this.createLineFeed();
		f.contentIdx = c;
		return f
	};
	s7sdk.share.EmailDialog.prototype.verifyEmailAddress = function(b) {
		var a = b.inp.value;
		this.setupErrorMsg(b, !this.validateEmailStr(a));
		this.setupScroll()
	};
	s7sdk.share.EmailDialog.prototype.setupScroll = function(c) {
		var d = this.contentSpan.offsetHeight - this.contentInt.clientHeight;
		if (d > 0) {
			if (!this.isTouch) {
				var b = this.scrollbarInst.curPos_;
				this.scrollbarInst.setMaxScroll(d);
				var a = c ? this.contentInt.offsetHeight
						- (s7sdk.Util.getObjPos(this.addBtnCtnr).y - s7sdk.Util
								.getObjPos(this.contentInt).y)
						- this.addBtnCtnr.offsetHeight : -b;
				if (a < 0) {
					this.scrollbarInst.curPos_ = -a;
					this.scrollbarInst.setThumbPosition(false)
				}
			}
			this.contentSb.style.display = "inline-block"
		} else {
			this.contentSb.style.display = "none"
		}
		if (this.scrollbarInst) {
			this.scrollbarInst.setScrollStep(Math
					.round(this.contentInt.clientHeight * 0.1))
		}
	};
	s7sdk.share.EmailDialog.prototype.onRemove = function(a) {
		this.setupErrorMsg(a, false);
		this.contentSpan.removeChild(a);
		this.setupScroll(true)
	};
	s7sdk.share.EmailDialog.prototype.validateEmailStr = function(c) {
		var b = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;
		var a = b.test(c);
		return a
	};
	s7sdk.share.EmailDialog.prototype.setupErrorMsg = function(c, d) {
		s7sdk.Util.css.setCSSAttributeSelector(c.spinp, "state",
				d ? "verifyerror" : "");
		var a = false;
		var b;
		for (b = 0; b < this.errLine.errList.length; b++) {
			if (this.errLine.errList[b] == c) {
				a = true;
				break
			}
		}
		if (d) {
			if (!a) {
				this.errLine.errList.push(c)
			}
		} else {
			if (a) {
				this.errLine.errList.splice(b, 1)
			}
		}
		if (this.errLine.errList.length != 0) {
			this.actionbutton.deactivate()
		} else {
			this.actionbutton.activate()
		}
		s7sdk.Util.css.setCSSAttributeSelector(this.errLine, "error",
				this.errLine.errList.length != 0)
	};
	s7sdk.share.EmailDialog.prototype.onClose = function(a) {
		this.onCancel(a)
	};
	s7sdk.share.EmailDialog.prototype.onCancel = function(a) {
		if (this.contentInt.getAttribute("state") != "") {
			s7sdk.Util.css.setCSSAttributeSelector(this.errLine, "error",
					"false");
			this.setErrorMsg("INVALID_ADDRESSS", "verifyerror");
			this.cancelbutton.setText(this.getLocalizedText("CANCEL"));
			this.cancelbutton.toolTip_.setContent(this
					.getLocalizedText("TOOLTIP_CANCEL"));
			s7sdk.Util.css
					.setCSSAttributeSelector(this.contentInt, "state", "");
			this.disableInputs(false);
			this.showContent(true);
			this.actionbutton.obj.style.display = "";
			this.actionbutton.activate();
			this.wid_ = this.hei_ = 0;
			this.onCheckResize();
			this.setupScroll()
		}
		this.hide()
	};
	s7sdk.share.EmailDialog.prototype.disableInputs = function(a) {
		var c = this.contentSpan.childNodes;
		for ( var b = 0; b < c.length; b++) {
			if (c[b].contentIdx) {
				c[b].inp.disabled = a
			}
		}
	};
	s7sdk.share.EmailDialog.prototype.showContent = function(c) {
		var b = this.contentSpan.childNodes;
		for ( var a = 0; a < b.length; a++) {
			if (b[a] != this.errLine) {
				b[a].style.display = c ? "" : "none"
			}
		}
	};
	s7sdk.share.EmailDialog.prototype.onAction = function() {
		var f = this.contentSpan.childNodes;
		var d = {
			toEmail : [ "" ],
			fromEmail : "",
			comments : ""
		};
		for ( var b = 0; b < f.length; b++) {
			var a = null;
			if (f[b].contentIdx) {
				a = f[b].inp.value;
				switch (f[b].contentIdx) {
				case "$TOEMAIL$":
					d.toEmail[0] = a;
					break;
				case "$FROMEMAIL$":
					d.fromEmail = a;
					break;
				case "$MESSAGEEMAIL$":
					d.comments = a;
					a = null;
					break;
				default:
					if (f[b].contentIdx.indexOf("$ADDEMAIL") != -1) {
						d.toEmail.push(a)
					} else {
						a = null
					}
					break
				}
			}
			if (a != null) {
				if (!this.validateEmailStr(a)) {
					this.setupErrorMsg(f[b], true);
					this.setupScroll();
					return
				}
			}
		}
		var e = "?";
		e += "toEmail=" + d.toEmail.join(",");
		e += "&fromEmail=" + d.fromEmail;
		e += "&desc=" + this.titleStr;
		e += "&comments=" + d.comments;
		e += "&url=" + encodeURIComponent(this.contentUrl);
		if (this.thumbbnailUrl) {
			e += "&thumb=" + encodeURIComponent(this.thumbbnailUrl)
		}
		if (this.descrStr) {
			e += "&desc=" + this.descrStr
		}
		e += "&language=" + this.settings.locale;
		var c = this.emailurl + e;
		this.isReq_ = new s7sdk.IS();
		this.isReq_
				.getHttpReq(c, this.requestComplete, this.requestError, this);
		this.disableInputs(true);
		this.cancelbutton.deactivate();
		this.actionbutton.deactivate()
	};
	s7sdk.share.EmailDialog.prototype.requestComplete = function(a, b) {
		b.successSend(a.message)
	};
	s7sdk.share.EmailDialog.prototype.requestError = function(a) {
		this.context.successSend(a.message)
	};
	s7sdk.share.EmailDialog.prototype.successSend = function(a) {
		this.showContent(false);
		this.cancelbutton.setText(this.getLocalizedText("CLOSE"));
		this.cancelbutton.toolTip_.setContent(this
				.getLocalizedText("TOOLTIP_CLOSE"));
		this.cancelbutton.activate();
		this.actionbutton.obj.style.display = "none";
		s7sdk.Util.css.setCSSAttributeSelector(this.contentInt, "state",
				"sendsuccess");
		if (a == "success") {
			this.setErrorMsg("SEND_SUCCESS", "sendsuccess")
		} else {
			this.setErrorMsg("SEND_FAILURE", "senderror")
		}
		s7sdk.Util.css.setCSSAttributeSelector(this.errLine, "error", "true");
		this.wid_ = this.hei_ = 0;
		this.onCheckResize();
		this.setupScroll()
	};
	s7sdk.share.EmailDialog.prototype.setContentUrl = function(a) {
		this.contentUrl = a
	};
	s7sdk.share.EmailDialog.prototype.setContentTitle = function(a) {
		this.descr.titlestr.innerHTML = a;
		this.titleStr = a
	};
	s7sdk.share.EmailDialog.prototype.setOriginUrl = function(a) {
		this.descr.site.innerHTML = a
	};
	s7sdk.share.EmailDialog.prototype.setThumbnail = function(c) {
		var b = this.descr.imgsp;
		if (!c) {
			return
		}
		var a = this.serverUrl + c;
		a += (a.indexOf("?") == -1 ? "?" : "&") + "wid=" + b.w;
		a += "&hei=" + b.h;
		b.style.backgroundImage = "url('" + a + "')";
		this.thumbbnailUrl = a
	};
	s7sdk.share.EmailDialog.prototype.setDescription = function(a) {
		this.descr.descrtext.innerHTML = a;
		this.descrStr = a
	};
	s7sdk.share.EmailDialog.prototype.setEmailService = function(a) {
		this.emailurl = a
	};
	s7sdk.share.EmailDialog.prototype.setServerUrl = function(a) {
		this.serverUrl = a
	};
	(function addDefaultCSS() {
		var e = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		var a = e(".s7emaildialog .s7dialogheadericon", {
			"background-image" : c("dlgemail_cap.png"),
			width : "24px",
			height : "17px"
		}) + e(".s7emaildialog .s7dialoginputlabel", {
			"margin-right" : "10px",
			padding : "10px",
			position : "relative",
			width : "50px",
			display : "inline-block",
			"text-align" : "right"
		}) + e(".s7emaildialog .s7dialogerrormessage", {
			position : "relative",
			display : "inline-block",
			"background-position" : "left center",
			"background-repeat" : "no-repeat",
			"font-size" : "10pt",
			"font-weight" : "bold",
			"vertical-align" : "middle",
			"text-align" : "center",
			"padding-left" : "20px",
			"line-height" : "25px"
		}) + e(".s7emaildialog .s7dialogerrormessage[state='verifyerror']", {
			"background-image" : c("dlgerrimg.png"),
			color : "#ff0000"
		}) + e(".s7emaildialog .s7dialogerrormessage[state='senderror']", {
			"background-image" : c("dlgerrimg.png"),
			color : "#ff0000"
		}) + e(".s7emaildialog .s7dialogerrormessage[state='sendsuccess']", {
			"background-image" : "none",
			color : "#00b200"
		}) + e(".s7emaildialog .s7dialogbody .s7dialogline ", {
			padding : "10px"
		}) + e(".s7emaildialog .s7dialogviewarea", {
			height : "300px"
		}) + e(".s7emaildialog .s7dialogviewarea[state='sendsuccess']", {
			height : "100px"
		}) + e(".s7emaildialog .s7dialoginputcontainer", {
			display : "inline-block",
			position : "relative",
			border : "1px solid #cccccc",
			padding : "9px"
		}) + e(".s7emaildialog .s7dialogerror[error='false']", {
			display : "none"
		}) + e(".s7emaildialog .s7dialogerror[error='true']", {
			display : "inline-block"
		}) + e(".s7emaildialog .s7dialoginputcontainer[state='verifyerror']", {
			border : "1px solid #ff0000"
		}) + e(".s7emaildialog .s7dialoginputshort", {
			border : "none",
			width : "250px"
		}) + e(".s7emaildialog .s7dialoginputwide", {
			border : "none",
			width : "300px"
		}) + e(".s7emaildialog .s7dialogmessage", {
			"white-space" : "pre-wrap",
			"white-space" : "-moz-pre-wrap",
			"white-space" : "-pre-wrap",
			"white-space" : "-o-pre-wrap",
			"word-wrap" : "break-word",
			resize : "none",
			height : "50px"
		}) + e(".s7emaildialog .s7dialogbody .s7dialogcontent", {
			padding : "0",
			border : "1px dotted #a0a0a0"
		}) + e(".s7emaildialog .s7dialogthumbnail", {
			position : "relative",
			display : "inline-block",
			"background-position" : "center center",
			"background-repeat" : "no-repeat",
			width : "90px",
			height : "60px",
			padding : "10px",
			"vertical-align" : "top"
		}) + e(".s7emaildialog .s7dialoginfopanel", {
			position : "relative",
			width : "300px",
			display : "inline-block"
		}) + e(".s7emaildialog .s7dialogtitle", {
			position : "relative",
			display : "block",
			"font-weight" : "bold",
			margin : "10px"
		}) + e(".s7emaildialog .s7dialogorigin", {
			position : "relative",
			margin : "10px",
			display : "block"
		}) + e(".s7emaildialog .s7dialogdescription", {
			"font-size" : "9pt",
			position : "relative",
			margin : "10px",
			display : "block"
		}) + e(".s7emaildialog .s7dialogactionbutton", {
			width : "82px",
			height : "34px"
		}) + e(".s7emaildialog .s7dialogactionbutton[state='up']", {
			"background-color" : "#333333",
			color : "#dddddd"
		}) + e(".s7emaildialog .s7dialogactionbutton[state='down']", {
			"background-color" : "#222222",
			color : "#cccccc"
		}) + e(".s7emaildialog .s7dialogactionbutton[state='over']", {
			"background-color" : "#222222",
			color : "#cccccc"
		}) + e(".s7emaildialog .s7dialogactionbutton[state='disabled']", {
			"background-color" : "#b2b2b2",
			color : "#dddddd"
		}) + e(".s7emaildialog .s7dialogremoveemailbutton", {
			position : "relative",
			display : "inline-block",
			width : "25px",
			height : "25px"
		}) + e(".s7emaildialog .s7dialogaddemailbutton", {
			"background-repeat" : "no-repeat",
			position : "relative",
			display : "inline-block",
			"text-align" : "right",
			"font-size" : "12pt",
			"font-weight" : "bold",
			"background-position" : "left center",
			"line-height" : "25px",
			"padding-left" : "30px",
			height : "25px"
		}) + e(".s7emaildialog .s7dialogaddemailbutton[state='up']", {
			color : "#666666"
		}) + e(".s7emaildialog .s7dialogaddemailbutton[state='down']", {
			color : "#000000"
		}) + e(".s7emaildialog .s7dialogaddemailbutton[state='over']", {
			color : "#000000",
			"text-decoration" : "underline"
		}) + e(".s7emaildialog .s7dialogaddemailbutton[state='disabled']", {
			color : "#666666"
		});
		var b = e(".s7emaildialog .s7scrollbar", {
			"background-color" : "transparent",
			position : "absolute",
			top : "8px",
			bottom : "8px",
			right : "8px",
			width : "28px"
		}) + e(".s7emaildialog .s7scrollbar .s7scrolltrack", {
			"background-color" : "rgb(178, 178, 178)"
		});
		a = b + a;
		var d = [];
		d.push({
			cssNm : "s7dialogaddemailbutton",
			skins : [ "dlgaddplus_up.png", "dlgaddplus_over.png",
					"dlgaddplus_over.png", "dlgaddplus_up.png" ]
		});
		d.push({
			cssNm : "s7dialogremoveemailbutton",
			skins : [ "dlgremove_up.png", "dlgremove_over.png",
					"dlgremove_over.png", "dlgremove_up.png" ]
		});
		d.push({
			cssNm : "s7dialogactionbutton",
			skins : []
		});
		s7sdk.share.dialogsDefaultCSS("EmailDialog", ".s7emaildialog", d, a)
	})()
}
if (!s7sdk.share.EmbedDialog) {
	s7sdk.share.EmbedDialog = function EmbedDialog(a, d, c, e, b) {
		s7sdk.Logger
				.log(
						s7sdk.Logger.CONFIG,
						"s7sdk.share.EmbedDialog constructor - containerId: %0, settings: %1 , compId: %2",
						a, d, c);
		this.embedsizes = e;
		arguments.callee.superclass
				.apply(this, [ a, d, c, "s7embeddialog", b ]);
		this.createDialog(true)
	};
	s7sdk.Class.inherits("s7sdk.share.EmbedDialog", "s7sdk.share.SocialDialog");
	s7sdk.share.EmbedDialog.prototype.symbols = {
		HEADER : "Embed Link",
		DESCRIPTION : "To share this content with others, copy and past this code:",
		EMBED_SIZE : "Embed Size",
		TOOLTIP_SCROLL_UP : "Scroll up",
		TOOLTIP_SCROLL_DOWN : "Scroll down",
		CUSTOM_SIZE : "Custom Size",
		CANCEL : "Cancel",
		TOOLTIP_CANCEL : "Cancel"
	};
	s7sdk.share.EmbedDialog.prototype.createContent = function() {
		this.createLinkLable(this.getLocalizedText("DESCRIPTION"));
		this.createLinkLine();
		this.createSelectLine();
		this.createScrollbar();
		this.createLineFeed();
		this.addBtnCtnr = this.cBox.obj;
		var a = this;
		s7sdk.Event.addDOMListener(this.contentInt, "scroll", function(b) {
			a.onNativeScroll()
		}, true)
	};
	s7sdk.share.EmbedDialog.prototype.onNativeScroll = function() {
		if (!this.cBox.blockScroll) {
			this.cBox.hideDropDn()
		}
	};
	s7sdk.share.EmbedDialog.prototype.createLinkLable = function(a) {
		var b = document.createElement("span");
		b.className = "s7dialogline s7dialoglabel s7dialoginputwide";
		this.contentSpan.appendChild(b);
		b.innerHTML = a;
		this.createLineFeed()
	};
	s7sdk.share.EmbedDialog.prototype.createLinkLine = function() {
		var b = document.createElement("span");
		b.className = "s7dialogline s7dialoginputcontainer";
		this.contentSpan.appendChild(b);
		var a = document.createElement("span");
		a.className = "s7dialogmessage";
		b.appendChild(a);
		this.inplnk = a;
		this.createLineFeed()
	};
	s7sdk.share.EmbedDialog.prototype.createSelectLine = function() {
		var b = document.createElement("span");
		b.className = "s7dialogline s7dialogembedsizepanel";
		this.contentSpan.appendChild(b);
		var g = document.createElement("span");
		g.className = "s7dialoglabel s7dialogembedsizelabel";
		g.innerHTML = this.getLocalizedText("EMBED_SIZE");
		b.appendChild(g);
		b.id = this.id + "_selectorContainer";
		this.cBox = new s7sdk.share.CustomComboBox(b.id, this.settings, b.id
				+ "_combobox", "span", this, this.cntSpAbsolute);
		this.cBox.obj.style.display = "inline-block";
		this.customSizeStr = this.getLocalizedText("CUSTOM_SIZE");
		if (this.embedsizes) {
			var f = this.embedsizes.split(";");
			var j = [];
			var a = 0;
			for ( var d = 0; d < f.length; d++) {
				var h = f[d].split(",");
				if (h.length == 3) {
					a = d
				}
				j.push(h[0] + "x" + h[1])
			}
			j.push(this.customSizeStr);
			this.cBox.update(j, a)
		} else {
			this.cBox.update([ "320x240", "640x480", "1280x960",
					this.customSizeStr ], 1)
		}
		var c = document.createElement("span");
		c.className = "s7dialogcustomsizepanel";
		b.appendChild(c);
		this.widinpsp = this.createSizeInp(c, "s7dialogcustomsize");
		var e = this;
		s7sdk.Event.addDOMListener(this.widinpsp.szinp, "change", function(i) {
			e.onInpChanged(e.widinpsp.szinp)
		}, true);
		b.onExpand = function() {
			e.onExpand()
		};
		this.heiinpsp = this.createSizeInp(c, "s7dialogcustomsize");
		s7sdk.Event.addDOMListener(this.heiinpsp.szinp, "change", function(i) {
			e.onInpChanged(e.heiinpsp.szinp)
		}, true);
		this.createLineFeed()
	};
	s7sdk.share.EmbedDialog.prototype.onInpChanged = function(a) {
		var b = this.widinpsp.szinp.value + "x" + this.heiinpsp.szinp.value;
		this.updateTemplateText(b)
	};
	s7sdk.share.EmbedDialog.prototype.createSizeInp = function(e, c) {
		var f = document.createElement("span");
		f.className = c;
		e.appendChild(f);
		var d = document.createElement("span");
		d.className = "s7comboboxtext";
		d.style.width = "0px";
		d.style.verticalAlign = "middle";
		f.appendChild(d);
		var b = document.createElement("span");
		b.className = "s7dialogcustomsizeinput";
		f.appendChild(b);
		var a = document.createElement("input");
		a.className = "s7dialogcustomsizeinput";
		f.appendChild(b);
		b.appendChild(a);
		f.style.display = "none";
		f.szinp = a;
		return f
	};
	s7sdk.share.EmbedDialog.prototype.updateTemplate = function(b) {
		if (b == this.customSizeStr) {
			this.cBox.changeState(s7sdk.share.CustomComboBox.ShRINKED);
			if (this.widinpsp && this.widinpsp.szinp) {
				this.widinpsp.style.display = "inline-block";
				this.heiinpsp.style.display = "inline-block";
				var a = this.curSize.toLowerCase().split("x");
				this.widinpsp.szinp.value = a[0];
				this.heiinpsp.szinp.value = a[1]
			}
		} else {
			if (this.widinpsp && this.widinpsp.szinp) {
				this.widinpsp.style.display = "none";
				this.heiinpsp.style.display = "none"
			}
			this.cBox.changeState(s7sdk.share.CustomComboBox.EXPANDED);
			this.updateTemplateText(b)
		}
	};
	s7sdk.share.EmbedDialog.prototype.onPositionChanged = function() {
		if (!this.cBox.blockScroll) {
			this.cBox.hideDropDn()
		}
	};
	s7sdk.share.EmbedDialog.prototype.updateTemplateText = function(b) {
		this.curSize = b;
		var a = b.toLowerCase().split("x");
		if (this.template) {
			var c = this.template.replace("$EMBED_WIDTH$", a[0]).replace(
					"$EMBED_HEIGHT$", a[1]);
			this.inplnk.innerHTML = c;
			this.setupSz()
		}
	};
	s7sdk.share.EmbedDialog.prototype.onExpand = function() {
		this.setupScroll(true)
	};
	s7sdk.share.EmbedDialog.prototype.setupScroll = function(c) {
		var d = this.contentSpan.offsetHeight - this.contentInt.clientHeight;
		if (d > 0) {
			if (!this.isTouch) {
				var b = this.scrollbarInst.curPos_;
				this.contentSb.style.display = "inline-block";
				this.scrollbarInst.setMaxScroll(d);
				var a = c ? this.contentInt.offsetHeight
						- (s7sdk.Util.getObjPos(this.addBtnCtnr).y - s7sdk.Util
								.getObjPos(this.contentInt).y)
						- this.addBtnCtnr.offsetHeight : -b;
				if (a < 0) {
					this.scrollbarInst.curPos_ = -a;
					this.scrollbarInst.setThumbPosition(false)
				}
			}
		} else {
			this.contentSb.style.display = "none"
		}
		if (this.scrollbarInst) {
			this.scrollbarInst.setScrollStep(Math
					.round(this.contentInt.clientHeight * 0.1))
		}
	};
	s7sdk.share.EmbedDialog.prototype.show = function() {
		s7sdk.share.SocialDialog.prototype.show.apply(this, []);
		this.scrollbarInst.curPos_ = 0;
		this.scrollbarInst.setThumbPosition(true)
	};
	s7sdk.share.EmbedDialog.prototype.hide = function() {
		this.cBox.hideDropDn();
		s7sdk.share.SocialDialog.prototype.hide.apply(this, [])
	};
	s7sdk.share.EmbedDialog.prototype.onCancel = function() {
		this.hide()
	};
	s7sdk.share.EmbedDialog.prototype.onClose = function() {
		s7sdk.share.SocialDialog.prototype.onClose.apply(this, [])
	};
	s7sdk.share.EmbedDialog.prototype.setEmbedCode = function(b) {
		if (!b) {
			return
		}
		var a = b;
		a = a.replace(/&/g, "&amp;");
		a = a.replace(/</g, "&lt;");
		a = a.replace(/>/g, "&gt;");
		a = a.replace(/\n/g, "<br>");
		this.template = a;
		if (this.curSize) {
			this.updateTemplate(this.curSize)
		}
	};
	(function addDefaultCSS() {
		var f = s7sdk.Util.css.createCssRuleText;
		var c = s7sdk.Util.css.createCssImgUrlText;
		var a = f(".s7embeddialog .s7dialogheadericon", {
			"background-image" : c("dlgembed_cap.png"),
			width : "24px",
			height : "14px"
		}) + f(".s7embeddialog .s7dialogviewarea", {
			height : "300px"
		}) + f(".s7embeddialog .s7dialoginputwide", {
			border : "none",
			"padding-bottom" : "10px",
			width : "430px"
		}) + f(".s7embeddialog .s7dialoginputcontainer", {
			padding : "10px",
			width : "430px",
			"font-size" : "10pt",
			border : "1px solid #cccccc"
		}) + f(".s7embeddialog .s7dialogmessage", {
			"-moz-user-select" : "text",
			"-khtml-user-select" : "text",
			"-webkit-user-select" : "text",
			"-o-user-select" : "text",
			"white-space" : "pre-wrap",
			"white-space" : "-moz-pre-wrap",
			"white-space" : "-pre-wrap",
			"white-space" : "-o-pre-wrap",
			"word-wrap" : "break-word",
			"user-select" : "text",
			border : "none",
			resize : "none",
			height : "50px"
		}) + f(".s7embeddialog .s7dialogembedsizepanel", {
			"font-size" : "10pt",
			padding : "10px",
			border : "none"
		}) + f(".s7embeddialog .s7dialogembedsizelabel", {
			"vertical-align" : "top",
			display : "inline-block",
			width : "80px"
		}) + f(".s7embeddialog .s7dialogcustomsizepanel", {
			position : "relative",
			display : "inline-block",
			left : "20px",
			"vertical-align" : "top"
		}) + f(".s7embeddialog .s7comboboxtext", {
			position : "relative",
			display : "inline-block",
			height : "40px"
		}) + f(".s7embeddialog .s7comboboxdropdown", {
			"font-size" : "10pt",
			border : "1px solid #cccccc"
		}) + f(".s7embeddialog .s7dialogcustomsize", {
			position : "relative",
			display : "inline-block",
			border : "1px solid #cccccc",
			"padding-left" : "2px",
			"padding-right" : "2px",
			"margin-right" : "20px",
			width : "70px"
		}) + f(".s7embeddialog .s7dialogcustomsizeinput", {
			border : "none",
			display : "inline-block",
			"vertical-align" : "middle",
			width : "100%"
		}) + f(".s7embeddialog .s7dialogactionbutton", {
			width : "210px",
			height : "34px"
		});
		var b = f(".s7embeddialog .s7scrollbar", {
			"background-color" : "transparent",
			position : "absolute",
			top : "8px",
			bottom : "8px",
			right : "8px",
			width : "28px"
		}) + f(".s7embeddialog .s7scrollbar .s7scrolltrack", {
			"background-color" : "rgb(178, 178, 178)"
		});
		a = b + a;
		var e = s7sdk.share.comboBoxDDDefaultCSS(".s7embeddialog");
		a = e + a;
		var d = [];
		d.push({
			cssNm : "s7dialogactionbutton",
			skins : []
		});
		s7sdk.share.dialogsDefaultCSS("EmbedDialog", ".s7embeddialog", d, a)
	})()
};