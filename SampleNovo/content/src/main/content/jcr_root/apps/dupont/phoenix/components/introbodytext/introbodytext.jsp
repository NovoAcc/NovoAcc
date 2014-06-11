<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global,org.apache.commons.lang.StringUtils"%><%

	final Boolean hideInlineCallout = Global.getBooleanPropValue(properties, "hideInlineCallout");
	final Boolean hideFeaturedCallout = Global.getBooleanPropValue(properties, "hideFeaturedCallout");
	final String pageTitle = Global.getStringPropValue(properties, "pageTitle");
	final Boolean generateHTMLMarkup = !Global.isEdit(slingRequest)? StringUtils.isNotBlank(pageTitle) || 
			StringUtils.isNotBlank(Global.getStringPropValue(properties, "leadInLines")) || 
			StringUtils.isNotBlank(Global.getStringPropValue(properties, "introBodyText")): true;
	pageContext.setAttribute("hideInlineCallout", hideInlineCallout);
	pageContext.setAttribute("hideFeaturedCallout", hideFeaturedCallout);	
	pageContext.setAttribute("generateHTMLMarkup", generateHTMLMarkup);
	pageContext.setAttribute("pageTitle",pageTitle);
	//log.error("generateHTMLMarkup:"+generateHTMLMarkup);
%>
<cq:text property="pageTitle" tagName="h1"/>

<cq:text property="leadInLines" tagName="p" tagClass="lead-inlines"/>
     
<c:if test="${!hideInlineCallout}">
	<div class="intro_inline_callout">
		<cq:include path="inlinecallout-1" resourceType="dupont/phoenix/components/inlinecallout"/>            
	</div>
</c:if>

<cq:text property="introBodyText" tagName="p" />