<%@page session="false"
        contentType="text/html; charset=utf-8"
%>
<%@page import="com.dupont.phoenix.commons.LogoutConfigReader" %>
<%@include file="/libs/foundation/global.jsp" %>
<html><body>
<%
//Determine the SSO logout url if any
 
LogoutConfigReader logoutConfig = sling.getService(com.dupont.phoenix.commons.LogoutConfigReader.class);

String logoutURL = "";

logoutURL = logoutConfig.getLogoutURL();

if(logoutURL == null || logoutURL.trim().equalsIgnoreCase("")) {
	logoutURL = request.getContextPath() +"/system/sling/logout.html";
}
response.sendRedirect(logoutURL);
%>

</body></html>
