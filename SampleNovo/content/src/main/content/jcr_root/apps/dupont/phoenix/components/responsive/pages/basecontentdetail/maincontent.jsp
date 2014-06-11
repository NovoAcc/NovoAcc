<%--
  ==============================================================================

  All Content Detail Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants,com.day.cq.wcm.api.WCMMode"%>

<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>
 
<section class="content">
	<div class="article-left-column">
	    <cq:include path="contentdetailheadline" resourceType="dupont/phoenix/components/contentdetailheadline"/>
	    <cq:include script="pagecontent.jsp"/>
		<cq:include script="utilitylinks-mobile.jsp"/>
	    <cq:include path="disclaimer" resourceType="dupont/phoenix/components/disclaimer"/>
	</div>
	<aside class="article-right-column">
	    <cq:include script="rightrail.jsp"/>
	</aside>
</section>
