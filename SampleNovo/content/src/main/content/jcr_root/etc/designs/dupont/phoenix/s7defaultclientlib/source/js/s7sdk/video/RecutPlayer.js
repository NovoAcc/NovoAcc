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
s7sdk.pkg("s7sdk.video");
s7sdk.Util.require("s7sdk.common.IconEffect");
if (!s7sdk.video.RecutPlayer) {
	s7sdk.video.RecutPlayer = function RecutPlayer(h, f, o) {
		arguments.callee.superclass.apply(this, [ o, h, "div", "s7videoplayer",
				f ]);
		this.createElement();
		this.container = s7sdk.Util.byId(h);
		this.devicePixelRatio = window.hasOwnProperty("devicePixelRatio") ? window.devicePixelRatio
				: 1;
		this.view = null;
		this.videoServerUrl = this.getParam("videoserverurl", "/e2/");
		if (this.videoServerUrl.lastIndexOf("/") != (this.videoServerUrl.length - 1)) {
			this.videoServerUrl += "/"
		}
		this.compId = (s7sdk.Util.isNull(o) ? "" : o);
		this.videoAsset = unescape(this.getParam("asset", ""));
		this.urlPrefix = this.getParam("urlprefix", "");
		this.currentTime_ = NaN;
		this.bufTime_ = NaN;
		this.duration_ = NaN;
		this.playing_ = false;
		this.initialized_ = false;
		var k = this.getParam("stagesize", "0,0");
		this.wid = k.split(",")[0];
		this.hei = (k.split(",").length >= 2 ? k.split(",")[1] : 0);
		if (this.wid == 0 || this.hei == 0) {
			this.wid = parseInt(s7sdk.Util.css.getCss("s7videoplayer", "width",
					this.compId, null, this.container));
			this.hei = parseInt(s7sdk.Util.css.getCss("s7videoplayer",
					"height", this.compId, null, this.container));
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
					this.hei = 300
				}
			}
		}
		this.outWidth = this.wid * this.devicePixelRatio;
		this.outHeight = this.hei * this.devicePixelRatio;
		this.autoload = (this.getParam("autoload", 1) == 1);
		this.autoplay = (this.getParam("autoplay", 1) == 1);
		this.controls = (this.getParam("controls", 0) == 1);
		if (("ipad" == s7sdk.browser.device.name)
				|| ("iphone" == s7sdk.browser.device.name)
				|| ("android" == s7sdk.browser.device.name)) {
			this.autoplay = false
		}
		this.clickToPlay = 0;
		var m = this.getParam("singleclick", "playPause");
		if ((/play/i).test(m)) {
			this.clickToPlay = 1
		}
		var d = this.getParam("serverurl", "/is/image/");
		if (d.lastIndexOf("/") != (d.length - 1)) {
			d += "/"
		}
		var b = this.getParam("posterimage", "");
		var a = "";
		if (b == "" || b.indexOf("?") == 0) {
			a = b;
			b = s7sdk.video.RecutPlayer.parseMovieUrl(this.videoAsset)
		}
		this.videoElement = s7sdk.Util.createObj(null, "video", null, null);
		this.videoElement.width = this.outWidth;
		this.videoElement.height = this.outHeight;
		this.videoElement.preload = (this.autoload ? "auto" : "metadata");
		if (b != "none") {
			this.videoElement.poster = d
					+ b
					+ (a != "" ? a : "?fit=constrain&wid=" + this.wid + "&hei="
							+ this.hei)
		}
		if (this.autoplay) {
			this.videoElement.autoplay = true
		}
		if (this.controls) {
			this.videoElement.controls = true
		} else {
			if ("android" == s7sdk.browser.device.name) {
				this.videoElement.controls = false
			}
		}
		this.videoElement.style.width = this.wid + "px";
		this.videoElement.style.height = this.hei + "px";
		var n = document.createElement("source");
		n.src = this.videoServerUrl + this.videoAsset + ".mp4";
		this.videoElement.appendChild(n);
		if (this.clickToPlay) {
			this.addEventListener("click", function() {
				this.togglePause()
			});
			this.addEventListener("touchstart", function() {
				this.togglePause()
			})
		}
		this.obj.appendChild(this.videoElement);
		if (this.container.firstChild) {
			this.container.replaceChild(this.obj, this.container.firstChild)
		} else {
			this.container.appendChild(this.obj)
		}
		this.iconEffect = new s7sdk.IconEffect(this.obj, f);
		if (this.autoplay) {
			this.iconEffect.hide()
		} else {
			if (this.iconEffect.enabled) {
				this.iconEffect.show(this.wid, this.hei)
			}
		}
		var g = this;
		this.overlayLayer = s7sdk.Util.createObj("s7recutoverlays", "div",
				null, "s7recutoverlays");
		this.overlayLayer.style.position = "absolute";
		this.overlayLayer.style.left = "0px";
		this.overlayLayer.style.top = "0px";
		this.overlayLayer.style.width = this.videoElement.style.width;
		this.overlayLayer.style.height = this.videoElement.style.height;
		this.overlayLayer.style.zindex = 5;
		this.overlayLayer.style.overflow = "hidden";
		this.obj.appendChild(this.overlayLayer);
		this.globalLayer = s7sdk.Util.createObj("s7globaloverlays", "div",
				null, "s7globaloverlays");
		this.globalLayer.style.position = "absolute";
		this.globalLayer.style.left = "0px";
		this.globalLayer.style.top = "0px";
		this.globalLayer.style.width = this.videoElement.style.width;
		this.globalLayer.style.height = this.videoElement.style.height;
		this.globalLayer.style.zindex = 5;
		this.globalLayer.style.overflow = "hidden";
		this.obj.appendChild(this.globalLayer);
		this.loadRecutXML(this.videoServerUrl + this.videoAsset + ".xml", e);
		this.currentInstance = null;
		function e() {
			g.parseRecutXML(this.responseXML)
		}
		this.checkRate = 100;
		function c() {
			var q = 0;
			if (g.videoElement.buffered && g.videoElement.buffered.length > 0) {
				g.videoElement.buffered.end(0)
			}
			if ((!isNaN(q)) && (q != g.bufTime_)) {
				g.bufTime_ = q;
				var s = new s7sdk.event.VideoEvent(
						s7sdk.event.VideoEvent.NOTF_LOAD_PROGRESS, q * 1000,
						true);
				s7sdk.Event.dispatch(g.obj, s, false)
			}
			var u = g.videoElement.currentTime;
			if ((!isNaN(u)) && (u != g.currentTime_)) {
				g.currentTime_ = u;
				var r = new s7sdk.event.VideoEvent(
						s7sdk.event.VideoEvent.NOTF_CURRENT_TIME, u * 1000,
						true);
				s7sdk.Event.dispatch(g.obj, r, false);
				if (g.initialized_) {
					var p = g.getInstanceAtTime(u * 1000);
					if (p != g.currentInstance) {
						g.currentInstance = p;
						g.renderInstance(p, g.overlayLayer)
					}
				}
			}
			u = g.videoElement.duration;
			if ((!isNaN(u)) && (u != g.duration_)) {
				g.duration_ = u;
				r = new s7sdk.event.VideoEvent(
						s7sdk.event.VideoEvent.NOTF_DURATION, u * 1000, true);
				s7sdk.Event.dispatch(g.obj, r, false)
			}
			if (g.playing_ && g.ended()) {
				g.playing_ = false;
				if (g.iconEffect.enabled) {
					g.iconEffect.show(this.wid, this.hei)
				}
				var t = new s7sdk.UserEvent(s7sdk.UserEvent.STOP,
						g.videoElement.currentTime, true);
				s7sdk.Event.dispatch(g.obj, t, false)
			}
		}
		this.playTimer = setInterval(c, this.checkRate);
		this.playing_ = (this.autoplay ? true : false);
		var l = new s7sdk.UserEvent(this.autoplay ? s7sdk.UserEvent.PLAY
				: s7sdk.UserEvent.PAUSE, this.videoElement.currentTime, true);
		s7sdk.Event.dispatch(this.obj, l, false)
	};
	s7sdk.Class.inherits("s7sdk.video.RecutPlayer", "s7sdk.UIComponent");
	s7sdk.video.RecutPlayer.prototype.addEventListener = function(c, b, a) {
		s7sdk.Event.addEventHandler(this.obj, c, this, b, a)
	};
	s7sdk.video.RecutPlayer.prototype.resize = function(a, b) {
		if (a == this.wid && b == this.hei) {
			return
		}
		this.wid = a > 0 ? a : 1;
		this.hei = b > 0 ? b : 1;
		this.outWidth = this.wid * this.devicePixelRatio;
		this.outHeight = this.hei * this.devicePixelRatio;
		this.videoElement.width = this.outWidth;
		this.videoElement.height = this.outHeight;
		this.videoElement.style.width = this.wid + "px";
		this.videoElement.style.height = this.hei + "px";
		if (this.iconEffect.enabled) {
			this.iconEffect.centerOverlay(a, b)
		}
		s7sdk.UIComponent.prototype.resize.apply(this, [ a, b ])
	};
	s7sdk.video.RecutPlayer.prototype.getAsset = function() {
		return this.videoAsset
	};
	s7sdk.video.RecutPlayer.prototype.setAsset = function(a) {
		this.videoAsset = a;
		if (this.videoElement) {
			while (this.videoElement.firstChild) {
				this.videoElement.removeChild(this.videoElement.firstChild)
			}
			var b = document.createElement("source");
			b.src = this.videoServerUrl + this.videoAsset;
			this.videoElement.appendChild(b)
		}
	};
	s7sdk.video.RecutPlayer.prototype.getVolume = function() {
		return (this.videoElement ? this.videoElement.volume : 0)
	};
	s7sdk.video.RecutPlayer.prototype.setVolume = function(a) {
		if (this.videoElement) {
			this.videoElement.volume = a
		}
	};
	s7sdk.video.RecutPlayer.prototype.getCurrentTime = function() {
		return (this.videoElement ? this.videoElement.currentTime * 1000 : 0)
	};
	s7sdk.video.RecutPlayer.prototype.getLoadedPosition = function() {
		return ((this.videoElement && this.videoElement.buffered && this.videoElement.buffered.length > 0) ? this.videoElement.buffered
				.end(0) * 1000
				: 0)
	};
	s7sdk.video.RecutPlayer.prototype.getDuration = function() {
		return (this.videoElement ? this.videoElement.duration * 1000 : 0)
	};
	s7sdk.video.RecutPlayer.prototype.muted = function() {
		return (this.videoElement ? this.videoElement.muted : 0)
	};
	s7sdk.video.RecutPlayer.prototype.paused = function() {
		return (this.videoElement ? this.videoElement.paused : 0)
	};
	s7sdk.video.RecutPlayer.prototype.ended = function() {
		return (this.videoElement ? this.videoElement.ended : 0)
	};
	s7sdk.video.RecutPlayer.prototype.supportsFullScreen = function() {
		if (("ipad" == s7sdk.browser.device.name)
				|| ("safari" == s7sdk.browser.name)
				|| ("chrome" == s7sdk.browser.name)) {
			return (this.videoElement ? this.videoElement.webkitSupportsFullscreen
					: false)
		}
		return false
	};
	s7sdk.video.RecutPlayer.prototype.enterFullScreen = function() {
		if (this.videoElement && this.videoElement.webkitSupportsFullscreen) {
			this.videoElement.webkitEnterFullScreen()
		}
	};
	s7sdk.video.RecutPlayer.prototype.play = function() {
		if (this.videoElement) {
			this.videoElement.play();
			this.playing_ = true;
			this.iconEffect.hide();
			var a = new s7sdk.UserEvent(s7sdk.UserEvent.PLAY,
					this.videoElement.currentTime, true);
			s7sdk.Event.dispatch(this.obj, a, false)
		}
	};
	s7sdk.video.RecutPlayer.prototype.pause = function() {
		if (this.videoElement) {
			this.videoElement.pause();
			this.playing_ = false;
			if (this.iconEffect.enabled) {
				this.iconEffect.show(this.wid, this.hei)
			}
			var a = new s7sdk.UserEvent(s7sdk.UserEvent.PAUSE,
					this.videoElement.currentTime, true);
			s7sdk.Event.dispatch(this.obj, a, false)
		}
	};
	s7sdk.video.RecutPlayer.prototype.togglePause = function() {
		if (this.videoElement) {
			if (this.videoElement.paused) {
				this.play()
			} else {
				this.pause()
			}
		}
	};
	s7sdk.video.RecutPlayer.prototype.seek = function(a) {
		if (this.videoElement) {
			this.videoElement.currentTime = a / 1000
		}
	};
	s7sdk.video.RecutPlayer.prototype.mute = function() {
		if (this.videoElement) {
			this.videoElement.muted = true
		}
	};
	s7sdk.video.RecutPlayer.prototype.unmute = function() {
		if (this.videoElement) {
			this.videoElement.muted = false
		}
	};
	s7sdk.video.RecutPlayer.prototype.loadRecutXML = function(a, c) {
		var b = new XMLHttpRequest();
		b.onreadystatechange = function() {
			if (b.readyState === 4) {
				c.apply(b)
			}
		};
		b.open("GET", a, true);
		b.send(null)
	};
	s7sdk.video.RecutPlayer.prototype.parseRecutXML = function(f) {
		var k = f.getElementsByTagName("remix");
		if (k.length > 0) {
			var c = k[0].getElementsByTagName("info");
			var b = k[0].getElementsByTagName("assets");
			var e = b[0].getElementsByTagName("asset");
			this.assets = new Array();
			for (i = 0; i < e.length; i++) {
				this.assets.push(new s7sdk.video.RecutAsset(
						s7sdk.video.RecutPlayer.getIntegerValue(e[i], "id"),
						s7sdk.video.RecutPlayer.getStringValue(e[i], "type"),
						s7sdk.video.RecutPlayer.getStringValue(e[i], "url")))
			}
			var g = k[0].getElementsByTagName("sequence");
			var h = g[0].getElementsByTagName("track");
			this.tracks = new Array();
			var d = h[0].getElementsByTagName("instance");
			var a = new Array();
			this.tracks.push(a);
			for (i = 0; i < d.length; i++) {
				var l = this.parseInstance(d[i]);
				a.push(l)
			}
			d = h[2].getElementsByTagName("instance");
			a = new Array();
			this.tracks.push(a);
			for (i = 0; i < d.length; i++) {
				var l = this.parseInstance(d[i]);
				a.push(l);
				this.renderInstance(l, this.globalLayer)
			}
			this.initialized_ = true
		}
	};
	s7sdk.video.RecutPlayer.prototype.parseInstance = function(e) {
		var b = new s7sdk.video.RecutInstance(s7sdk.video.RecutPlayer
				.getIntegerAttr(e, "start"), s7sdk.video.RecutPlayer
				.getIntegerAttr(e, "duration"));
		var a = e.getElementsByTagName("content");
		for (j = 0; j < a.length; j++) {
			var d = new s7sdk.video.RecutContent(s7sdk.video.RecutPlayer
					.getIntegerAttr(a[j], "asset"), s7sdk.video.RecutPlayer
					.getStringAttr(a[j], "type"), a[j]
					.getElementsByTagName("transform"));
			b.contents.push(d);
			if (d.type == "ComplexCaption") {
				d.text = s7sdk.video.RecutPlayer.getStringValue(a[j], "text")
			} else {
				if (d.type == "ImageContent") {
					var c = a[j].getElementsByTagName("box");
					if (c && c.length > 0) {
						d.width = s7sdk.video.RecutPlayer.getFloatValue(c[0],
								"width");
						d.height = s7sdk.video.RecutPlayer.getFloatValue(c[0],
								"height")
					}
				}
			}
		}
		return b
	};
	s7sdk.video.RecutPlayer.prototype.getInstanceAtTime = function(c) {
		for ( var b = 0; b < this.tracks[0].length; ++b) {
			var a = this.tracks[0][b];
			if ((c >= a.start) && (c < a.start + a.duration)) {
				return a
			}
		}
	};
	s7sdk.video.RecutPlayer.prototype.renderInstance = function(a, c) {
		var d;
		while (d = c.firstChild) {
			c.removeChild(d)
		}
		for ( var b = 0; b < a.contents.length; ++b) {
			this.renderContent(a.contents[b], c)
		}
	};
	s7sdk.video.RecutPlayer.prototype.renderContent = function(d, b) {
		var a;
		var c;
		if (d.type == "ImageContent") {
			c = this.getAsset(d.asset);
			if (c) {
				a = new Image();
				a.src = this.urlPrefix + c.url;
				a.style.position = "absolute";
				a.style.left = Math.round(d.x) + "px";
				a.style.top = Math.round(d.y) + "px";
				a.style.width = Math.round(d.width) + "px";
				a.style.height = Math.round(d.height) + "px";
				b.appendChild(a)
			}
		} else {
			if (d.type == "BorderContent") {
				c = this.getAsset(d.asset);
				if (c && (c.url.lastIndexOf(".png") == c.url.length - 4)) {
					a = new Image();
					a.src = this.urlPrefix + c.url;
					a.style.position = "absolute";
					a.style.left = "0px";
					a.style.top = "0px";
					a.style.width = this.wid + "px";
					a.style.height = this.hei + "px";
					b.appendChild(a)
				}
			} else {
				if (d.type == "ComplexCaption") {
					c = this.getAsset(d.asset);
					if (c) {
						a = s7sdk.Util.createObj(null, "div", null, null);
						a.style.position = "absolute";
						a.style.left = Math.round(d.x) + "px";
						a.style.top = Math.round(d.y) + "px";
						a.style.font = "bold 18px arial,sans-serif";
						a.innerHTML = d.text;
						b.appendChild(a)
					}
				}
			}
		}
	};
	s7sdk.video.RecutPlayer.prototype.getAsset = function(b) {
		for ( var a = 0; a < this.assets.length; ++a) {
			if (this.assets[a].id == b) {
				return this.assets[a]
			}
		}
		return null
	};
	s7sdk.video.RecutPlayer.getIntegerValue = function(b, a) {
		return parseInt(b.getElementsByTagName(a)[0].textContent)
	};
	s7sdk.video.RecutPlayer.getFloatValue = function(b, a) {
		return parseFloat(b.getElementsByTagName(a)[0].textContent)
	};
	s7sdk.video.RecutPlayer.getStringValue = function(b, a) {
		return b.getElementsByTagName(a)[0].textContent
	};
	s7sdk.video.RecutPlayer.getIntegerAttr = function(c, b) {
		var a = c.attributes[b];
		return (a ? parseInt(a.value) : 0)
	};
	s7sdk.video.RecutPlayer.getStringAttr = function(c, b) {
		var a = c.attributes[b];
		return (a ? a.value : "")
	};
	s7sdk.video.RecutPlayer.parseMovieUrl = function(b) {
		var a = null;
		if (b) {
			a = b.replace(/[\\]/g, "/");
			ar = a.split(".");
			if (ar.length > 1) {
				a = ar[0]
			}
			ar = a.split(":");
			if (ar.length > 1) {
				a = ar[1]
			}
			ar = a.split("/");
			a = ar.length > 1 ? ar[0] + "/" + ar[ar.length - 1] : a
		}
		return a
	};
	s7sdk.RecutPlayer = s7sdk.video.RecutPlayer;
	(function addDefaultCSS() {
		var c = s7sdk.Util.css.createCssRuleText;
		var b = s7sdk.Util.css.createCssImgUrlText;
		var a = c(".s7videoplayer .s7iconeffect", {
			width : "120px",
			height : "120px",
			"-webkit-transform" : "translateZ(0px)",
			"background-repeat" : "no-repeat",
			"background-position" : "center",
			"background-image" : b("videoplayicon.png")
		});
		s7sdk.Util.css.addDefaultCSS(a, "RecutPlayer")
	})()
}
if (!s7sdk.video.RecutAsset) {
	s7sdk.video.RecutAsset = function RecutAsset(c, b, a) {
		this.id = c;
		this.type = b;
		this.url = a
	};
	s7sdk.RecutAsset = s7sdk.video.RecutAsset
}
if (!s7sdk.video.RecutInstance) {
	s7sdk.video.RecutInstance = function RecutInstance(b, a) {
		this.start = b;
		this.duration = a;
		this.contents = new Array()
	};
	s7sdk.RecutInstance = s7sdk.video.RecutInstance
}
if (!s7sdk.video.RecutContent) {
	s7sdk.video.RecutContent = function RecutContent(d, c, b) {
		this.asset = d;
		this.type = c;
		this.x = 0;
		this.y = 0;
		this.scalex = 1;
		this.scaley = 1;
		if (b && b.length > 0) {
			var a = b[0].getElementsByTagName("matrix");
			if (a && a.length > 0) {
				this.x = s7sdk.video.RecutPlayer.getFloatValue(a[0], "tx");
				this.y = s7sdk.video.RecutPlayer.getFloatValue(a[0], "ty");
				this.scalex = s7sdk.video.RecutPlayer.getFloatValue(a[0], "a");
				this.scaley = s7sdk.video.RecutPlayer.getFloatValue(a[0], "d")
			}
		}
	};
	s7sdk.RecutContent = s7sdk.video.RecutContent
};