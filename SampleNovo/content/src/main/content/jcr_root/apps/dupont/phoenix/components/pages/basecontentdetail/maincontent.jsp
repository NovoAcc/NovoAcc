<%--
  ==============================================================================

  All Content Detail Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants,com.day.cq.wcm.api.WCMMode"%>

<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
<% } %>
 
<!-- The Article -->
<%--<div id="rows-wrapper">--%>
<div class="article-left-column padding-left">
    <cq:include path="contentdetailheadline" resourceType="dupont/phoenix/components/contentdetailheadline"/>
    <cq:include script="pagecontent.jsp"/>  
    <cq:include path="disclaimer" resourceType="dupont/phoenix/components/disclaimer"/>
</div>
<!-- End the Article -->
<!-- Start the Article Sidebar -->
<div class="article-right-column padding-left">
    <cq:include script="rightrail.jsp"/>  
</div>
<!-- End the Article Sidebar -->
