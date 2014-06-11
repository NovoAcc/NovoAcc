<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.HListHelper,com.dupont.phoenix.list.ListItem,java.util.List" %><%

	//Used when four items needs to be displayed within HLM or Featured Module B
	//TODO: Here we should display:
	//One fourth page width -> Short Description 2 [192 characters]
	//width=218 & height=109
	HListHelper hListHelper = (HListHelper) request.getAttribute("hListHelper");
	List<ListItem> items = hListHelper.getListItems();
	int size = hListHelper.getMaxDisplayItemsCount();
	
%><div class="row-without-callout padding-left group"> 
<ul class="row-4col group"><%
%><% 
for(int count=0; count < size; count++) {
	ListItem item = items.get(count);
	item.setImageWidth("218");
	item.setImageHeight("109");
	request.setAttribute("listitem", item);
	%><cq:include script="/apps/dupont/phoenix/components/common/listviews/listitem-image-title-description.jsp"/><%
}
%></ul>
</div>
