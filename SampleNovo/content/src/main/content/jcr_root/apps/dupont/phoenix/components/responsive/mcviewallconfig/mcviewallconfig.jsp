<%--
  ==============================================================================
	Empty JSP to avoid the error within the logs...
  ==============================================================================

--%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%
 // Include the widgets only on Author Mode
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
MC View All Configuration Component
 <% } %>
