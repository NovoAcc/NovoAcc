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
function TileAddress(b, e, a, d, c) {
	this.w_ = b;
	this.h_ = e;
	this.idx_ = a;
	this.pos_x_ = d;
	this.pos_y_ = c
}
TileAddress.prototype._x = function() {
	return this.pos_x_
};
TileAddress.prototype._y = function() {
	return this.pos_y_
};