/*
 * Copyright 1997-2009 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */

var Ejst = {};

Ejst.toggleProperties = function(id, expand) {
    var box = CQ.Ext.get(id);
    var arrow = CQ.Ext.get(id + '-arrow');
    if (expand || !box.hasClass('open')) {
        box.addClass('open');
        arrow.update('&laquo;');
    } else {
        box.removeClass('open');
        arrow.update('&raquo;');
    }
};

Ejst.expandProperties = function(comp) {
    comp.refresh();
    var id = comp.path.substring(comp.path.lastIndexOf('/')+1); 
    Ejst.toggleProperties(id, true);
};
