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
s7sdk.pkg("s7sdk.css");
s7sdk.Util.require("s7sdk.model.ComponentModel");
if (!s7sdk.css.Unit) {
	s7sdk.css.Unit = {
		PX : "px",
		PERCENT : "%"
	}
}
if (!s7sdk.css.Position) {
	s7sdk.css.Position = {
		ABSOLUTE : "absolute",
		RELATIVE : "relative",
		STATIC : "static",
		FIXED : "fixed"
	}
}
if (!s7sdk.css.Property) {
	s7sdk.css.Property = function Property(a) {
		this.property = a
	};
	s7sdk.css.Property.TOP = "top";
	s7sdk.css.Property.BOTTOM = "bottom";
	s7sdk.css.Property.LEFT = "left";
	s7sdk.css.Property.RIGHT = "right";
	s7sdk.css.Property.WIDTH = "width";
	s7sdk.css.Property.HEIGHT = "height";
	s7sdk.css.Property.parse = function(c, b, a) {
		switch (c) {
		case s7sdk.css.Property.LEFT:
			return s7sdk.css.LengthProperty.parse(c, b,
					a.container ? a.container
							.getProperty(s7sdk.css.Property.WIDTH) : null);
		case s7sdk.css.Property.RIGHT:
			return s7sdk.css.LengthProperty.parse(c, b,
					a.container ? a.container
							.getProperty(s7sdk.css.Property.WIDTH) : null);
		case s7sdk.css.Property.TOP:
			return s7sdk.css.LengthProperty.parse(c, b,
					a.container ? a.container
							.getProperty(s7sdk.css.Property.HEIGHT) : null);
		case s7sdk.css.Property.BOTTOM:
			return s7sdk.css.LengthProperty.parse(c, b,
					a.container ? a.container
							.getProperty(s7sdk.css.Property.HEIGHT) : null);
		case s7sdk.css.Property.WIDTH:
			return s7sdk.css.LengthProperty.parse(c, b,
					a.container ? a.container
							.getProperty(s7sdk.css.Property.WIDTH) : null);
		case s7sdk.css.Property.HEIGHT:
			return s7sdk.css.LengthProperty.parse(c, b,
					a.container ? a.container
							.getProperty(s7sdk.css.Property.HEIGHT) : null);
		default:
			return s7sdk.css.GenericProperty.parse(c, b)
		}
	};
	s7sdk.css.Property.prototype.equal = function(a) {
		if (!(a instanceof s7sdk.css.Property)) {
			return false
		}
		return (this.property == a.property)
	};
	s7sdk.css.Property.prototype.toString = function() {
		return this.property + ":"
	};
	s7sdk.css.Property.prototype.cssValue = function() {
		return ""
	}
}
if (!s7sdk.css.GenericProperty) {
	s7sdk.css.GenericProperty = function GenericProperty(b, a) {
		arguments.callee.superclass.apply(this, [ b ]);
		this.value = a
	};
	s7sdk.Class.inherits("s7sdk.css.GenericProperty", "s7sdk.css.Property");
	s7sdk.css.GenericProperty.parse = function(b, a) {
		return new s7sdk.css.GenericProperty(b, a)
	};
	s7sdk.css.GenericProperty.prototype.clone = function() {
		return new s7sdk.css.GenericProperty(this.property, this.value)
	};
	s7sdk.css.GenericProperty.prototype.equal = function(a) {
		if (!(a instanceof s7sdk.css.GenericProperty)) {
			return false
		}
		return (this.value == a.value && this.superclass.prototype.equal.apply(
				this, [ a ]))
	};
	s7sdk.css.GenericProperty.prototype.toString = function() {
		return this.superclass.prototype.toString.apply(this, []) + this.value
	};
	s7sdk.css.GenericProperty.prototype.cssValue = function() {
		return this.value
	}
}
if (!s7sdk.css.LengthProperty) {
	s7sdk.css.LengthProperty = function LengthProperty(e, d, b, a, c, f) {
		arguments.callee.superclass.apply(this, [ e ]);
		this.unit = b;
		this.value = d;
		if (a) {
			this.computedValue = a
		} else {
			if (b == s7sdk.css.Unit.PX) {
				this.computedValue = this.value
			} else {
				throw new Error(
						"s7sdk.css.LengthProperty: Failed to convert value to pixels.")
			}
		}
		this.min_value = c;
		this.max_value = f
	};
	s7sdk.Class.inherits("s7sdk.css.LengthProperty", "s7sdk.css.Property");
	s7sdk.css.LengthProperty.parse = function(c, b, e) {
		var a = b.match(/(\d+)\s*(px|%)/i);
		if (!a) {
			return null
		}
		if (a[2] == "%") {
			throw new Error("s7sdk.css.LengthProperty: Support for % pending")
		}
		var d = parseInt(a[1]);
		return new s7sdk.css.LengthProperty(c, d, a[2].toLowerCase(), d, 0,
				e ? e.computedValue : 2048)
	};
	s7sdk.css.LengthProperty.prototype.clone = function() {
		return new s7sdk.css.LengthProperty(this.property, this.value,
				this.unit, this.computedValue, this.min_value, this.max_value)
	};
	s7sdk.css.LengthProperty.prototype.equal = function(a) {
		if (!(a instanceof s7sdk.css.LengthProperty)) {
			return false
		}
		return (this.unit == a.unit && this.value == a.value
				&& this.computedValue == a.computedValue
				&& this.min_value == a.min_value
				&& this.max_value == a.max_value && this.superclass.prototype.equal
				.apply(this, [ a ]))
	};
	s7sdk.css.LengthProperty.prototype.toString = function() {
		return this.superclass.prototype.toString.apply(this, []) + this.value
				+ this.unit
	};
	s7sdk.css.LengthProperty.prototype.cssValue = function() {
		return this.value + this.unit
	}
};