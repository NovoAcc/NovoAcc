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
s7sdk.Util.require("s7sdk.common.IS");
s7sdk.Util.require("s7sdk.common.ScrollableDiv");
s7sdk.Util.require("s7sdk.common.Thumb");
s7sdk.Util.require("s7sdk.utils.SwatchesParser");
s7sdk.Util.require("s7sdk.common.ItemDesc");
s7sdk.Util.require("s7sdk.common.Geometry");
s7sdk.Util.require("s7sdk.common.Button");
s7sdk.Util.require("s7sdk.event.Event");
s7sdk.Util.require("s7sdk.common.ScrollBar");
if (!s7sdk.TableOfContents) {
	s7sdk.TableOfContents = function TableOfContents(i, g, m) {
		m = (typeof m == "string" && m.length) ? m : "TableOfContents"
				+ s7sdk.Util.createUniqueId();
		arguments.callee.superclass.apply(this, [ m, i, "div",
				"s7tableofcontents", g ]);
		this.container = s7sdk.Util.byId(i);
		var j = this.getParam("cellspacing", "").split(",");
		var d = j[0] ? Number(j[0]) : 10;
		var a = j[1] ? Number(j[1]) : 10;
		var c = "";
		var h = this.getParam("asset", "");
		h = unescape(h);
		c = this.getParam("iscommand", "");
		this.imageModifier = s7sdk.MediaSetParser.parseAssetForSetReq(h).mod;
		var f = this.getParam("serverurl", "/is/image");
		if (f.lastIndexOf("/") != (f.length - 1)) {
			f += "/"
		}
		var e = this.getParam("size", "").split(",");
		var b = e[0] ? Number(e[0]) : 0;
		var l = e[1] ? Number(e[1]) : 0;
		if (b == 0 || l == 0) {
			b = parseInt(s7sdk.Util.css.getCss("s7tableofcontents", "width", m,
					null, this.container));
			l = parseInt(s7sdk.Util.css.getCss("s7tableofcontents", "height",
					m, null, this.container));
			if (!s7sdk.Util.isNumber(b) || !s7sdk.Util.isNumber(l) || b <= 0
					|| l <= 0) {
				b = 500;
				l = 250
			}
		}
		var k = this.getParam("locale", "");
		this.createElement()
	};
	s7sdk.Class.inherits("s7sdk.TableOfContents", "s7sdk.UIComponent");
	s7sdk.TableOfContents.prototype.setMediaSet = function(a) {
	};
	s7sdk.TableOfContents.prototype.build = function() {
	}
};