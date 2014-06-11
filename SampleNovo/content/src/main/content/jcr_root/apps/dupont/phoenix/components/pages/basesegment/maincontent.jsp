<%--
  ==============================================================================

  All Segment Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants,com.day.cq.wcm.api.WCMMode"%>

<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>

<%
	pageContext.setAttribute("showViewAll",Global.isSelectorActive(slingRequest, GlobalConstants.VIEW_ALL_SELECTOR_NAME));
%><c:choose>
	<c:when test="${showViewAll}">
		<cq:include path="viewallcontent" resourceType="dupont/phoenix/components/viewall"/>
	</c:when>
	<c:otherwise>
		<div id="intro" class="padding-left group">
			<div id="intro-text">			
				<cq:include path="introbodytext" resourceType="dupont/phoenix/components/introbodytext"/>		
			</div>
			<div id="video-module">    
				<cq:include path="featuredcallout" resourceType="dupont/phoenix/components/featuredcallout"/>
        	</div>
		</div>
		<div id="rows-wrapper">
			<cq:include script="pagecontent.jsp"/>	
			<cq:include path="disclaimer" resourceType="dupont/phoenix/components/disclaimer"/>
		</div>
	</c:otherwise>
</c:choose>
