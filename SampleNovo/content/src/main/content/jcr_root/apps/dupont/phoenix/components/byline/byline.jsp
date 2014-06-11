<%--
     Byline Component
--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%@ page import="org.apache.commons.lang.StringUtils"%>

<%@page session="false"%>
<%
Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
String byline = StringUtils.EMPTY;
if(!StringUtils.isEmpty(properties.get("byline",String.class))) {

	byline = xssAPI.encodeForHTML(properties.get("byline").toString());
}
if(isEdit && StringUtils.isEmpty(byline))
{
	byline = "Enter Byline";
}
if(StringUtils.isNotBlank(byline)) {
%>
<div class="content-author">
    <%=byline%>
</div>
<%}%>
<%if(isEdit){%>
<div style="clear:both"></div>
<%}%>
