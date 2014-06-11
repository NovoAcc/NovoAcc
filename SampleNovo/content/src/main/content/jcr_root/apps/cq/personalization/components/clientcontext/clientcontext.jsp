<%@page session="false"%><%--
ADOBE CONFIDENTIAL
___________________

Copyright 2011 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  All information contained herein is, and remains
the property of Adobe Systems Incorporated and its suppliers,
if any.  The intellectual and technical concepts contained
herein are proprietary to Adobe Systems Incorporated and its
suppliers and are protected by trade secret or copyright law.
Dissemination of this information or reproduction of this material
is strictly forbidden unless prior written permission is obtained
from Adobe Systems Incorporated.
--%><%@ page import="com.day.cq.wcm.api.AuthoringUIMode,
                     com.day.cq.wcm.api.WCMMode" %><%!
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%

    if (WCMMode.fromRequest(request) == WCMMode.DISABLED) {
        %><cq:includeClientLib categories="personalization"/><%
    } else {
        /* temporary, see CQ5-29809 */
        if (AuthoringUIMode.fromRequest(slingRequest) == AuthoringUIMode.TOUCH) {
            /* to avoid cq.widgets dependency */
            %><cq:includeClientLib categories="personalization.ui,personalization.kernel"/><%
        } else if (AuthoringUIMode.fromRequest(slingRequest) == AuthoringUIMode.CLASSIC) {
            /* include personalization editing widgets */
            %><cq:includeClientLib categories="cq.personalization"/><%
        }
    }

    String segmentsPath = currentStyle.get("segmentPath", "/etc/segmentation");
    String ccPath = currentStyle.get("path","/etc/clientcontext/default");
    String currentPath = currentPage != null ? currentPage.getPath() : "";

%><script type="text/javascript">
    $CQ(function() {
        CQ_Analytics.SegmentMgr.loadSegments("<%=segmentsPath%>");
        CQ_Analytics.ClientContextUtils.init("<%=ccPath%>","<%=currentPath%>");

        CQ_Analytics.ClientContextUtils.initUI("<%=ccPath%>","<%=currentPath%>", <%=(AuthoringUIMode.fromRequest(slingRequest) != AuthoringUIMode.TOUCH)%>);
         
    });
</script>
