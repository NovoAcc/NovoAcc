<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.ListItem, com.dupont.phoenix.Global, com.day.cq.wcm.foundation.Image" %><%
	//Pass the list item within the request object using attribute "listitem"	
	//Display single item within <li> tag without image.

	ListItem item = (ListItem) request.getAttribute("listitem");
	pageContext.setAttribute("itemType",item.getContentType());
	
%><li>
	<h2><a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=item.getLinkURL()%>"><%=item.getTextWithoutLastWord(item.getLinkText())%> <span class="no-wrap"><%=item.getTextLastWord(item.getLinkText())%><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>
	<c:if test = "${itemType == 'article'}">
		<!-- <div class="author"><%=item.getAuthor()%></div>  -->
	</c:if>
	<p><%=item.getShortDesc()%></p>
</li>
