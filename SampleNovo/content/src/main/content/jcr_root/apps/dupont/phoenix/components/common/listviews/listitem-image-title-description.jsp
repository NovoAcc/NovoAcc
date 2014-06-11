<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.ListItem, com.dupont.phoenix.Global, com.day.cq.wcm.foundation.Image" %><%
	//Pass the list item within the request object using attribute "listitem"	
	//Display single item within <li> tag
	//Takes care of displaying image, title, short description
	//Included any situation where something needs to be displayed here...
	//For example, author info, dates, etc based on the different content type
	//For images, set the appropriate width and height on the image itself so that draw method can use them
	//when creating image tag...
	ListItem item = (ListItem) request.getAttribute("listitem");
	Image image = item.getThumbnail();
	pageContext.setAttribute("itemType",item.getContentType());
	if (image != null && image.hasContent()) {	
		%><li><!--<%=item.getRelevancyScore()%>--><a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=item.getLinkURL()%>"><%
		image.draw(out);
		%></a><h2><a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=item.getLinkURL()%>"><%=item.getTextWithoutLastWord(item.getLinkText())%> <span class="no-wrap"><%=item.getTextLastWord(item.getLinkText())%><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>
		<c:if test="${itemType=='article'}">
			<!-- <div class="author"><%=item.getAuthor()%></div> -->
		</c:if>
		</li>
<% 	} else {
	%><cq:include script="/apps/dupont/phoenix/components/common/listviews/listitem-title-and-description.jsp"/><%
	}
%>
