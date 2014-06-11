<%--
  ==============================================================================

  All Content Detail Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%
 // Include the widgets only on Author Mode
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>

<section class="content">
	  	    <cq:include script="pagecontent.jsp"/>
</section>