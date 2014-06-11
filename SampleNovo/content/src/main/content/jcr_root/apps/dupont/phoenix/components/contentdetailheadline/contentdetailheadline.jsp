<%--

     Content Detail Headline Component

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@page import="com.dupont.phoenix.ContentDetailHeadline"%>
<%@page import="com.day.cq.wcm.api.WCMMode" %>
<%@ page import="org.apache.commons.lang.StringUtils"%>

<%  String PageTitle="";
   ContentDetailHeadline contentDetailHeadline = new ContentDetailHeadline(currentPage, resource, slingRequest);
   pageContext.setAttribute("contentDetailHeadline",contentDetailHeadline); 
   final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
   
   if(contentDetailHeadline.getPageTitle()!=null) {
	    PageTitle =contentDetailHeadline.getPageTitle();
	}
 %>
   
<% if(StringUtils.isNotEmpty(PageTitle)) {  %>   
<h1>${contentDetailHeadline.pageTitle }</h1>
<c:if test="${not contentDetailHeadline.hideDate }">
<div class="content-date">
	${contentDetailHeadline.date}
</div>
</c:if>

<% 	} else if(isEdit) {%>

Please enter page title.

<% } %>