<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.HListHelper,com.dupont.phoenix.list.ListItem, java.util.List" %><%
	//TODO: Here we should display:
	//One third page width -> Short Description 2 [302 characters]
	//width=300 & height=150

	HListHelper hListHelper = (HListHelper) request.getAttribute("hListHelper");
	List<ListItem> items = hListHelper.getListItems();
	int size = hListHelper.getMaxDisplayItemsCount();

%>
<div class="row-with-callout group">
<ul class="row-3col group"><%
%><% 
for(int count=0; count < size; count++) {
	ListItem item = items.get(count);
	item.setImageWidth("300");
	item.setImageHeight("150");	
	request.setAttribute("listitem", item);
	%><cq:include script="/apps/dupont/phoenix/components/common/listviews/listitem-image-title-description.jsp"/><%
}
%></ul>
</div>
