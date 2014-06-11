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
s7sdk.Util.require("s7sdk.common.Geometry");
s7sdk.Util.require("s7sdk.event.Event");
if (!s7sdk.Resolution) {
	s7sdk.Resolution = function(f, c, e, d, b, a) {
		this.view = a;
		this.level = f;
		this.w = c;
		this.h = e;
		this.regions = new Array();
		this.url = d + (d.indexOf("?") >= 0 ? "&" : "?") + "scl="
				+ Math.pow(2, f);
		this.fmt = b;
		this.transparent = ((this.fmt.indexOf("png") != -1 || this.fmt
				.indexOf("gif") != -1) && (this.fmt.indexOf("-alpha") > 0)) ? true
				: false;
		this.currentRgn = null;
		this.resToRgn = null
	};
	s7sdk.Resolution.prototype.getRegionImage = function() {
		if (this.currentRgn) {
			return this.currentRgn.image
		}
		return null
	};
	s7sdk.Resolution.prototype.getResToRgn = function() {
		return this.resToRgn
	};
	s7sdk.Resolution.prototype.intersect = function(f) {
		var h = new s7sdk.Rectangle(0, 0, this.w, this.h);
		h = h.intersection(f);
		this.currentRgn = null;
		var a;
		for ( var g = 0; g < this.regions.length; g++) {
			a = this.regions[g];
			if (a.rect.containsRect(h)) {
				this.currentRgn = a;
				break
			}
		}
		if (this.currentRgn == null) {
			var d = Math.floor(h.x / 256) * 256;
			var e = Math.floor(h.y / 256) * 256;
			var b = e;
			while (b < h.y + h.height && b < this.h) {
				b += Math.min(this.h - b, 256)
			}
			var c = d;
			while (c < h.x + h.width && c < this.w) {
				c += Math.min(this.w - c, 256)
			}
			var i = new s7sdk.Rectangle(d, e, c - d, b - e);
			this.currentRgn = new s7sdk.Region(this, this.level, i, this.url,
					this.fmt);
			this.regions.push(this.currentRgn)
		}
		this.resToRgn = new s7sdk.Matrix2D(1, 0, 0, 1, -1
				* this.currentRgn.rect.x, -1 * this.currentRgn.rect.y)
	};
	s7sdk.Resolution.prototype.release = function() {
	};
	s7sdk.Resolution.prototype.invalidate = function() {
		this.view.invalidated = true
	};
	s7sdk.Resolution.prototype.loaded = function() {
		if (this.currentRgn == null) {
			return false
		}
		return this.currentRgn.loaded
	}
}
if (!s7sdk.Region) {
	s7sdk.Region = function(c, e, d, b, a) {
		this.res = c;
		this.fmt = s7sdk.Util.checkDefault(a, "jpg");
		this.transparent = ((this.fmt.indexOf("png") != -1 || this.fmt
				.indexOf("gif") != -1) && (this.fmt.indexOf("-alpha") > 0)) ? true
				: false;
		this.url = b;
		this.level = e;
		this.rect = d;
		this.loaded = false;
		this.image = new Image();
		this.load()
	};
	s7sdk.Region.prototype.load = function() {
		var b = Math.pow(2, this.level);
		var a = this.url + (this.url.indexOf("?") < 0 ? "?" : "&");
		a += "req=tile&rect=" + this.rect.x + "," + this.rect.y + ",";
		a += this.rect.width + "," + this.rect.height;
		a += "&fmt=" + this.fmt;
		this.image.onload = this.onLoadImage;
		this.image.onerror = this.onErrorImage;
		this.image.onabort = this.onAbortImage;
		this.image.imageRegion = this;
		this.image.src = a;
		s7sdk.Logger.log(s7sdk.Logger.FINER, "Region.load %0", a)
	};
	s7sdk.Region.prototype.onLoadImage = function(a) {
		this.startWidth = this.width;
		this.startHeight = this.height;
		this.imageRegion.loaded = true;
		this.imageRegion.res.invalidate()
	};
	s7sdk.Region.prototype.onErrorImage = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.WARNING, "Region image failed to load")
	};
	s7sdk.Region.prototype.onAbortImage = function(a) {
		s7sdk.Logger.log(s7sdk.Logger.WARNING, "Region image failed to load")
	}
};