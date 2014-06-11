/*!************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
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
s7sdk.Util.require("s7sdk.model.PropertyModel");
if (!s7sdk.model.ComponentModel) {
	s7sdk.model.ComponentModel = function ComponentModel(a, b) {
		arguments.callee.superclass.apply(this, []);
		this.parsedCSS = b;
		this.component = a;
		this.propertymodels = new Array()
	};
	s7sdk.model.ComponentModel.prototype.getParsedCSS = function() {
		return this.parsedCSS
	};
	s7sdk.model.ComponentModel.prototype.getProperty = function(b) {
		for ( var a = 0; a < this.propertymodels.length; a++) {
			if (b in this.propertymodels[a].properties) {
				return this.propertymodels[a].properties[b]
			}
		}
		return null
	};
	s7sdk.model.ComponentModel.prototype.propertyChangeListener = function(b,
			a, d) {
		if (d) {
			var c = this.component.obj.style[b];
			var e = d.cssValue();
			this.component.obj.style[b] = d.cssValue()
		}
		this.notifyPropertyChanged(b, a, d)
	};
	s7sdk.model.ComponentModel.prototype.addPropertyListeners = function(c) {
		for ( var a = 0; a < this.propertymodels.length; a++) {
			for ( var b in this.propertymodels[a].properties) {
				this.addPropertyListener(b, c)
			}
		}
	};
	s7sdk.model.ComponentModel.prototype.removePropertyListeners = function(b) {
		for ( var a = 0; a < this.propertymodels.length; a++) {
			for (property in this.propertymodels[a].properties) {
				this.removePropertyListener(property, b)
			}
		}
	};
	s7sdk.Class
			.inherits("s7sdk.model.ComponentModel", "s7sdk.model.Observable")
}
if (!s7sdk.model.ContainerModel) {
	s7sdk.model.ContainerModel = function ContainerModel(d, a, b, e) {
		arguments.callee.superclass.apply(this, [ b, e ]);
		this.propertymodels.push(new s7sdk.model.CSSPositionModel(this, d));
		this.propertymodels.push(new s7sdk.model.CSSSizeModel(this, d));
		this.propertymodels.push(new s7sdk.model.CSSTextModel(this, d));
		for ( var c = 0; c < this.propertymodels.length; c++) {
			this.propertymodels[c]
					.addPropertyListeners(this.propertyChangeListener
							.bind(this))
		}
	};
	s7sdk.Class.inherits("s7sdk.model.ContainerModel",
			"s7sdk.model.ComponentModel")
}
if (!s7sdk.model.SwatchesModel) {
	s7sdk.model.SwatchesModel = function SwatchesModel(d, a, b, e) {
		arguments.callee.superclass.apply(this, [ b, e ]);
		this.container = a;
		this.propertymodels.push(new s7sdk.model.CSSPositionModel(this, d));
		this.propertymodels.push(new s7sdk.model.CSSSizeModel(this, d));
		this.propertymodels.push(new s7sdk.model.CSSTextModel(this, d));
		for ( var c = 0; c < this.propertymodels.length; c++) {
			this.propertymodels[c]
					.addPropertyListeners(this.propertyChangeListener
							.bind(this))
		}
	};
	s7sdk.Class.inherits("s7sdk.model.SwatchesModel",
			"s7sdk.model.ComponentModel")
};