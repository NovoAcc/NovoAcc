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
s7sdk.pkg("s7sdk.model");
s7sdk.Util.require("s7sdk.css.Property");
s7sdk.Util.require("s7sdk.model.ComponentModel");
if (!s7sdk.model.Observable) {
	s7sdk.model.Observable = function Observable() {
		this.listeners = new Object();
		this.properties = new Object()
	};
	s7sdk.model.Observable.prototype.notifyPropertyChanged = function(d, a, e) {
		if (a && a.equal(e) || a === e) {
			return
		}
		var c = this.listeners[d];
		if (s7sdk.Util.isNull(c)) {
			return
		}
		for ( var b = 0; b < c.length; b++) {
			c[b](d, a, e)
		}
	};
	s7sdk.model.Observable.prototype.addPropertyListener = function(c, b) {
		if (!b || typeof b !== "function") {
			return
		}
		var a = this.listeners[c];
		if (!a) {
			a = this.listeners[c] = new Array()
		}
		a.push(b)
	};
	s7sdk.model.Observable.prototype.addPropertyListeners = function(a) {
		for (property in this.properties) {
			this.addPropertyListener(property, a)
		}
	};
	s7sdk.model.Observable.prototype.removePropertyListener = function(d, c) {
		if (c || typeof c !== "function") {
			return
		}
		var b = this.listeners[d];
		if (!b) {
			return
		}
		var a = b.indexOf(c);
		if (a !== -1) {
			b.splice(a, 1)
		}
	};
	s7sdk.model.Observable.prototype.removePropertyListeners = function(a) {
		for (property in this.properties) {
			this.removePropertyListener(property, a)
		}
	}
}
if (!s7sdk.model.CSSPropertyModel) {
	s7sdk.model.CSSPropertyModel = function CSSPropertyModel(a) {
		arguments.callee.superclass.apply(this, []);
		if (!a || !(a instanceof s7sdk.model.Observable)) {
			throw new Error(
					"s7sdk.model.CSSPropertyModel: Invalid input arguments")
		}
		this.componentModel = a
	};
	s7sdk.model.CSSPropertyModel.prototype.createWidget = function(b) {
		if (!b) {
			return
		}
		var c;
		for ( var a = 0; a < b.length; a++) {
			c = b[a].createWidget(this.componentModel, this);
			if (!c || !(typeof c.addPropertyListeners != "undefined")) {
				throw new Error(
						"s7sdk.model.CSSPropertyModel: Factory created widget does not define a interface of 'addPropertyListeners'")
			}
			c.addPropertyListeners(this.propertyChangeListener.bind(this))
		}
	};
	s7sdk.Class.inherits("s7sdk.model.CSSPropertyModel",
			"s7sdk.model.Observable")
}
if (!s7sdk.model.CSSPositionModel) {
	s7sdk.model.CSSPositionModel = function CSSPositionModel(a, c) {
		arguments.callee.superclass.apply(this, [ a ]);
		if (!a
				|| !(a instanceof s7sdk.model.Observable)
				|| (a.container && !(a.container instanceof s7sdk.model.Observable))) {
			throw new Error(
					"s7sdk.model.CSSPositionModel: Invalid input arguments")
		}
		var e = a.getParsedCSS();
		if (!e) {
			throw new Error(
					"s7sdk.model.CSSPositionModel: Failed to get parsed CSS")
		}
		this.properties.position = s7sdk.css.Position.ABSOLUTE;
		var d;
		for ( var b = 0; b < e.length; b++) {
			d = e[b];
			if (d.classNames.length == 1) {
				for (property in d.attributes) {
					if (property == s7sdk.css.Property.TOP
							|| property == s7sdk.css.Property.BOTTOM
							|| property == s7sdk.css.Property.LEFT
							|| property == s7sdk.css.Property.RIGHT) {
						this.properties[property] = s7sdk.css.Property.parse(
								property, d.attributes[property], this)
					}
				}
				break
			}
		}
		a.addPropertyListener(s7sdk.css.Property.TOP,
				this.propertyChangeListener.bind(this));
		a.addPropertyListener(s7sdk.css.Property.BOTTOM,
				this.propertyChangeListener.bind(this));
		a.addPropertyListener(s7sdk.css.Property.LEFT,
				this.propertyChangeListener.bind(this));
		a.addPropertyListener(s7sdk.css.Property.RIGHT,
				this.propertyChangeListener.bind(this));
		if (a.container) {
			a.container.addPropertyListener(s7sdk.css.Property.WIDTH,
					this.rangeChangeListener.bind(this));
			a.container.addPropertyListener(s7sdk.css.Property.HEIGHT,
					this.rangeChangeListener.bind(this))
		}
		this.createWidget(c)
	};
	s7sdk.model.CSSPositionModel.prototype.propertyChangeListener = function(c,
			a, b) {
		if (b && !(b instanceof s7sdk.css.LengthProperty)
				|| !this.properties[c]) {
			return
		}
		var d = this.properties[c];
		this.properties[c] = b ? b.clone() : b;
		this.notifyPropertyChanged(c, d, b)
	};
	s7sdk.model.CSSPositionModel.prototype.rangeChangeListener = function(c, a,
			b) {
		if (!b || !(b instanceof s7sdk.css.LengthProperty)) {
			return
		}
		if (c == s7sdk.css.Property.WIDTH) {
			if (this.properties.left) {
				this.adjustRangeValue(this.properties.left, b)
			}
			if (this.properties.right) {
				this.adjustRangeValue(this.properties.right, b)
			}
		}
		if (c == s7sdk.css.Property.HEIGHT) {
			if (this.properties.top) {
				this.adjustRangeValue(this.properties.top, b)
			}
			if (this.properties.bottom) {
				this.adjustRangeValue(this.properties.bottom, b)
			}
		}
	};
	s7sdk.model.CSSPositionModel.prototype.adjustRangeValue = function(b, c) {
		var a = b.clone();
		if (b.unit == s7sdk.css.Unit.PX) {
			b.max_value = c.computedValue;
			console.log("New max value for: " + b + " max value: "
					+ b.max_value)
		} else {
			if (b.unit == s7sdk.css.Unit.PERCENT) {
			} else {
				throw new Error("s7sdk.css.CSSPositionModel: Unsupported unit.")
			}
		}
		this.notifyPropertyChanged(a.property, a, b)
	};
	s7sdk.Class.inherits("s7sdk.model.CSSPositionModel",
			"s7sdk.model.CSSPropertyModel")
}
if (!s7sdk.model.CSSSizeModel) {
	s7sdk.model.CSSSizeModel = function CSSSizeModel(a, c) {
		arguments.callee.superclass.apply(this, [ a ]);
		if (!a
				|| !(a instanceof s7sdk.model.Observable)
				|| (a.container && !(a.container instanceof s7sdk.model.Observable))) {
			throw new Error("s7sdk.model.CSSSizeModel: Invalid input arguments")
		}
		var e = a.getParsedCSS();
		if (!e) {
			throw new Error(
					"s7sdk.model.CSSSizeModel: Failed to get parsed CSS")
		}
		var d;
		for ( var b = 0; b < e.length; b++) {
			d = e[b];
			if (d.classNames.length == 1) {
				for (property in d.attributes) {
					if (property == s7sdk.css.Property.WIDTH
							|| property == s7sdk.css.Property.HEIGHT) {
						this.properties[property] = s7sdk.css.Property.parse(
								property, d.attributes[property], this)
					}
				}
				break
			}
		}
		a.addPropertyListener(s7sdk.css.Property.WIDTH,
				this.propertyChangeListener.bind(this));
		a.addPropertyListener(s7sdk.css.Property.HEIGHT,
				this.propertyChangeListener.bind(this));
		if (a.container) {
			a.container.addPropertyListener(s7sdk.css.Property.WIDTH,
					this.rangeChangeListener.bind(this));
			a.container.addPropertyListener(s7sdk.css.Property.HEIGHT,
					this.rangeChangeListener.bind(this))
		}
		this.createWidget(c)
	};
	s7sdk.Class.inherits("s7sdk.model.CSSSizeModel",
			"s7sdk.model.CSSPropertyModel");
	s7sdk.model.CSSSizeModel.prototype.propertyChangeListener = function(d, c,
			a) {
		if (a && !(a instanceof s7sdk.css.LengthProperty)
				|| !this.properties[d]) {
			return
		}
		var b = this.properties[d];
		this.properties[d] = a ? a.clone() : a;
		this.notifyPropertyChanged(d, b, a)
	};
	s7sdk.model.CSSSizeModel.prototype.rangeChangeListener = function(c, b, a) {
		if (!a || !(a instanceof s7sdk.css.LengthProperty)) {
			return
		}
		if (c == s7sdk.css.Property.WIDTH) {
			if (this.properties.width) {
				this.adjustRangeValue(this.properties.width, a)
			}
		}
		if (c == s7sdk.css.Property.HEIGHT) {
			if (this.properties.top) {
				this.adjustRangeValue(this.properties.height, a)
			}
		}
	};
	s7sdk.model.CSSSizeModel.prototype.adjustRangeValue = function(a, c) {
		var b = a.clone();
		if (a.unit == s7sdk.css.Unit.PX) {
			a.max_value = c.computedValue
		} else {
			if (offsetPos.unit == s7sdk.css.Unit.PERCENT) {
			} else {
				throw new Error("s7sdk.css.CSSPositionModel: Unsupported unit.")
			}
		}
		this.notifyPropertyChanged(a.property, b, a)
	};
	s7sdk.Class.inherits("s7sdk.model.CSSSizeModel",
			"s7sdk.model.CSSPropertyModel")
}
if (!s7sdk.model.CSSTextModel) {
	s7sdk.model.CSSTextModel = function CSSTextModel(a, c) {
		arguments.callee.superclass.apply(this, [ a ]);
		if (!a || !(a instanceof s7sdk.model.Observable)) {
			throw new Error("s7sdk.model.CSSTextModel: Invalid input arguments")
		}
		var e = a.getParsedCSS();
		if (!e) {
			throw new Error(
					"s7sdk.model.CSSTextModel: Failed to get parsed CSS")
		}
		var d;
		for ( var b = 0; b < e.length; b++) {
			d = e[b];
			if (d.classNames.length == 1) {
				for (property in d.attributes) {
					this.properties[property] = s7sdk.css.Property.parse(
							property, d.attributes[property], this)
				}
				break
			}
		}
		a.addPropertyListeners(this.propertyChangeListener.bind(this));
		this.createWidget(c)
	};
	s7sdk.model.CSSTextModel.prototype.propertyChangeListener = function(c, a,
			d) {
		var b = this.properties[c];
		this.properties[c] = d ? d.clone() : d;
		console.log("CSSTextModel: " + d);
		this.notifyPropertyChanged(c, b, d)
	};
	s7sdk.Class.inherits("s7sdk.model.CSSTextModel",
			"s7sdk.model.CSSPropertyModel")
};