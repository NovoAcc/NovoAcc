<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="java.util.List, com.dupont.phoenix.list.ListItem, com.dupont.phoenix.list.HListHelper, com.day.cq.wcm.foundation.Image" %><%
	//Used when there are two items within the list (Not used when callout is activated)
	//TODO: Here we should display:
	//Half page width (Two items in two columns across whole page)
	//Title (Short Headline) & Short Description
	//Image Width & Height => 465 X 232
	HListHelper hListHelper = (HListHelper) request.getAttribute("hListHelper");
	List<ListItem> items = hListHelper.getListItems();
	int listSize = hListHelper.getListSize();
	
%>
<div class="row-without-callout padding-left group">
<ul class="row-2col padding-left group"><%
	for(int count=0; count < listSize; count++) {
		ListItem item = items.get(count);
		item.setImageWidth("465");
		item.setImageHeight("232");
		request.setAttribute("listitem",item);
		%><cq:include script="/apps/dupont/phoenix/components/common/listviews/listitem-image-title-description.jsp"/><%
	}
%>
</ul>
</div>
