<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="java.util.List, com.dupont.phoenix.list.HListHelper, com.dupont.phoenix.list.ListItem, com.dupont.phoenix.Global, com.day.cq.wcm.foundation.Image" %><%
	//HLM or Featured Module B
	//This is used only whene there is one item in the list
	//Large Thumbnail -> width=465 & height=232
	//TODO: Here we should display:
	//Full page width -> Short Description 1 [400 characters]
	HListHelper hListHelper = (HListHelper) request.getAttribute("hListHelper");
	List<ListItem> items = hListHelper.getListItems();
	//Override linkText from Page Title (Default linkText is Title)
	ListItem item = items.get(0);
	item.setImageWidth("465");
	item.setImageHeight("232");
	//item.setLinkText(item.getPageTitle());
	request.setAttribute("listitem",item);
	Image image = item.getThumbnail();
  	
%><div class="row-without-callout group">
<ul class="row-2col group">
	<!-- <cq:include script="/apps/dupont/phoenix/components/common/listviews/listitem-image.jsp"/>
	<cq:include script="/apps/dupont/phoenix/components/common/listviews/listitem-title-and-description.jsp"/> -->
	
	<li>
		<a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=item.getLinkURL()%>"><%
        if (image != null && image.hasContent()){
        	image.draw(out);
    	}	
		%></a>

			<h2><a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=item.getLinkURL()%>"><%=item.getTextWithoutLastWord(item.getLinkText())%> <span class="no-wrap"><%=item.getTextLastWord(item.getLinkText())%><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>
			<p><%=item.getShortDesc()%></p>

	</li>
</ul>
</div>
 
