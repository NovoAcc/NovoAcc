<%--
  ==============================================================================

  All Segment Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants,com.day.cq.wcm.api.WCMMode"%><%
%>

<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>

<div id="rows-wrapper">
	<cq:include script="pagecontent.jsp"/>	
</div>
