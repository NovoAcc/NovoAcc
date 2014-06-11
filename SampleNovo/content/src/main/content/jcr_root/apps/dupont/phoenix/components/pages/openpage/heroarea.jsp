<%--
  ==============================================================================

  Include hero area components (Hero Normal, Content Tabs, Sub Navigation, etc.
  TODO -> Separate Hero Normal From Content Tabs

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%

%><cq:include path="heronormal" resourceType="dupont/phoenix/components/hero/heronormal"/>


<%
 // Include the widgets only on Author Mode
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>
