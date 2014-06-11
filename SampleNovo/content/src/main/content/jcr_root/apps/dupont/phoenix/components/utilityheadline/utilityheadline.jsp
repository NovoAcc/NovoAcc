<%--

     Content Detail Headline Component

--%>
<%
%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%
%>
<%@ page
    import="org.apache.commons.lang.StringUtils,java.text.DateFormat,
                java.text.SimpleDateFormat"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%@page session="false"%>
<%
Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
String pageTitle = StringUtils.EMPTY;

if(!StringUtils.isEmpty(properties.get("pageTitle",String.class)))
{
    pageTitle = properties.get("pageTitle").toString();
}
else if(!StringUtils.isEmpty(pageProperties.get("pageTitle",String.class)))
{
    pageTitle = pageProperties.get("pageTitle").toString();
}

if(isEdit && StringUtils.isEmpty(pageTitle ))
{
pageTitle = "Enter Page Title";
}
%>
<div class="title padding-left">
    <h1><%=pageTitle %></h1>
</div>
