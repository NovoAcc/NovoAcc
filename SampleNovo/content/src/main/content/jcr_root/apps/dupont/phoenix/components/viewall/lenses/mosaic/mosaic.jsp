<%--
  Copyright 1997-2009 Day Management AG
  Barfuesserplatz 6, 4001 Basel, Switzerland
  All Rights Reserved.

  This software is the confidential and proprietary information of
  Day Management AG, ("Confidential Information"). You shall not
  disclose such Confidential Information and shall use it only in
  accordance with the terms of the license agreement you entered into
  with Day.

  ==============================================================================

  Mosaic Lens component

--%><%@ page import="java.util.Calendar" %><%
%><%@include file="/libs/foundation/global.jsp"%><%

    String name = properties.get("name", "Mosaic");
    Long time = Calendar.getInstance().getTimeInMillis();

%><div id="lens-mosaic-button-wrapper-<%= time %>" class="lens-button-wrapper"></div><!--
--><script type="text/javascript">
    CQ.Ext.onLoad(function() {
        var config = {
            "xtype": "dataviewlens",
            "style": "overflow:visible;",
            "renderButtonTo": "lens-mosaic-button-wrapper-<%= time %>",
            "proxyConfig": {
                "url": "/bin/wcm/contentfinder/view.json/content/dam"
            },
            "storeConfig": {
                "baseParams": {
                    "mimeType": "image"
                }
            },
            "items": {
                "cls": "lens-dataview mosaic"
            },
            "listeners": {
                "afterlayout": function() {
                    // workaround to set overflow visible
                    var el = this.body || this.el;
                    if(el && !CQ.Ext.isIE){
                        el.setOverflow('visible');
                    }
                }
            }
        };
        var lens = CQ.Util.build(config);
        CQ.search.Util.addLens(lens, "mosaic");

    });
</script>

