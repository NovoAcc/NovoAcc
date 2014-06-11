<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="java.util.List, com.dupont.phoenix.Global, com.dupont.phoenix.list.ListItem, com.day.cq.wcm.foundation.Image" %><%
	//Used within HLM or Featured Module B
	//Use this file when only image is displayed within <li> tag.
	//When image is rendered, image width and height is used from the image
	//When building list, set the height and width on the image itself.
	
	ListItem item = (ListItem) request.getAttribute("listitem");
  	Image image = item.getThumbnail();
	if (image != null && image.hasContent()) {
%><li>
		<a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=item.getLinkURL()%>"><%
		image.draw(out);
		%></a>
</li>
<% } %>