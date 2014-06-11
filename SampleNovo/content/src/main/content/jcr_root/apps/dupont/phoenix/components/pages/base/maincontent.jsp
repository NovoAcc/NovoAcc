<%--
  ==============================================================================

  Base Segment, Sub Segment, and Content Details templates should override this
  file to include content components here.
  Disclaimer is included here for Inheritance.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants,com.day.cq.wcm.api.WCMMode"%>

<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
<% } %>

<cq:include path="disclaimer" resourceType="dupont/phoenix/components/disclaimer"/>
