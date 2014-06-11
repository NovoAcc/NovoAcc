<%--

    Basic Hero Title annual Reports Component

--%>
<%
%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.hero.BasicHeroTitleHelper" %>
<%@ page import="com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.Global, org.apache.commons.lang.StringUtils,org.apache.sling.api.resource.ValueMap"%>
<%@page session="false"%>
<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) { %>
        <cq:includeClientLib categories="apps.dupont.widgets.custom" /><%
} 

//properties.put("useGrayIcons","yes");

String pageTitle = BasicHeroTitleHelper.getPageTitle(properties, pageProperties, slingRequest);


%>

	 <div class="hero-title-only">
	
		   <h2><%=pageTitle %></h2>
		   
		   <!--- cqinclude the Social Chicklets component -->
		   <cq:include path="socialchannels" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_header" />
	 </div>
	 