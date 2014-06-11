<%--

  Megatrends Callout Component component.

  Megatrends Callout Component

--%>
<%@page
	import="java.util.*,com.day.cq.wcm.api.WCMMode,org.apache.commons.lang.StringUtils,org.apache.commons.lang3.StringEscapeUtils,com.day.text.Text,com.dupont.phoenix.Global"%>
<%@include file="/libs/foundation/global.jsp"%>
<%@page import="com.dupont.phoenix.tools.MegaTrendHelper"%>
<%
%><%@page session="false"%>
<%
%>

<%
MegaTrendHelper megaTrendHelper = new MegaTrendHelper(slingRequest, currentPage, resource);
List<HashMap<String,String>> list = megaTrendHelper.getMegaTrendLinks();

int size = list.size(); 
boolean editMode = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
%>
<c:set var="length" value="<%=size%>"></c:set>
<c:set var="editMode" value="<%=editMode %>"></c:set>
<c:choose>
	<c:when test="${length > 0}">
		<div class="megatrend-callout">
			<h2>
				<a href=""><%= Global.getTranslatedText(currentPage, slingRequest,"GlobalChallenges") %></a>
			</h2>
			<ul class="megatrend-callout-list">
				<c:forEach var="megatrendItem" items="<%= list %>">
					<li class="megatrend-callout-item ${megatrendItem.isActive ? 'active' : ''}">
                        <div class="megatrend-callout-item-thumbnail">
                             <img src="${megatrendItem.iconimage}" alt="Megatrend Icon">
                         </div>
                         <a href="${megatrendItem.linkUrl}" class="megatrend-callout-item-title">
                             ${megatrendItem.linkTitle} <img class="cta-arrow" alt="Red arrow, click to navigate"
                             src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png">
                         </a>
                     </li>
				</c:forEach>
			</ul>
			<div style="clear: both"></div>
		</div>
	</c:when>
	<c:otherwise>
		<c:if test="${editMode == true}">
			<c:out value="Click here to Select Active Mega Trends"></c:out>
		</c:if>
	</c:otherwise>
</c:choose>



