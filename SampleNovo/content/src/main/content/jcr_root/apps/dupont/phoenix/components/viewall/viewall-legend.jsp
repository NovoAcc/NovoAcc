<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.hlm.HLMWrapper,
				com.dupont.phoenix.GlobalConstants,com.dupont.phoenix.hlm.LastModificationDateComparator,
				com.dupont.phoenix.hlm.StringComparator,com.dupont.phoenix.list.HListHelper"%><%
%><%@ page import="com.day.cq.wcm.foundation.Image,com.dupont.phoenix.list.ListItem,java.util.List,java.util.ArrayList" %>
<%
try { 
	//Check and get HLMWrapper
    HLMWrapper hlmWrapper = (HLMWrapper)request.getAttribute("hlmWrapper");
    if(hlmWrapper==null) {
        hlmWrapper = new HLMWrapper(slingRequest,currentPage);
       request.setAttribute("hlmWrapper", hlmWrapper);
    }
    final HListHelper hListHelper = hlmWrapper.getHLMById(Global.getSelectorByIndex(slingRequest,1));
    if(hListHelper!=null) {

%><div class="view_container group padding-left padding-right">	  

<%if(hListHelper.getContentTypeName()!= null){ %>
	<h1><%=Global.getTranslatedText(currentPage, slingRequest, hListHelper.getContentTypeName())%></h1>
<% }else{ %>
    <h1><%=Global.getTranslatedText(currentPage, slingRequest,request.getParameter("title"))%></h1>
<%}%>
	<!-- Right Rail -->	
	<div class="right_col"> 
       	<div class="view_sort_results"><div class="view_sort_wrap"></div></div><%    	
		List<ListItem> items = hListHelper.getListItems();
		int size = hListHelper.getListSize();

		if(size > 0) {
			//Press Releases - Last Modification Date Descending
            if(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME.equalsIgnoreCase(hListHelper.getContentType())) {
				hListHelper.addSortingComparator(LastModificationDateComparator.DESCENDING);				
			} else {
				hListHelper.addSortingComparator(StringComparator.ASCENDING_IGNORECASE);
			}
			hListHelper.sortListItems();
		}
                            %><div class="row_results"><%
            for(int count=0; count < size; count++) {


                ListItem item = items.get(count);

                String currentItemContentType = item.getContentType();


               if((request.getParameter("viewall_vid")!= null && currentItemContentType.equalsIgnoreCase("mcvideodetail")) || (request.getParameter("viewall_img")!= null && currentItemContentType.equalsIgnoreCase("mcimagedetail")) || (request.getParameter("viewall_img")== null && request.getParameter("viewall_vid")== null)){
                    item.setImageWidth("122");
                    item.setImageHeight("62");
                    Image vidImage = item.getThumbnail();
                    vidImage.addCssClass("result_image");
                   	%>

        		<div class="row">
       			 <h2 class="view_all_title"><a href="<%=item.getLinkURL()%>"><%=item.getTextWithoutLastWord(item.getLinkText())%> <span class="no-wrap"><%=item.getTextLastWord(item.getLinkText())%><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>

					<% 	if (vidImage != null && vidImage.hasContent()) {	
							%><a href="<%=item.getLinkURL()%>"><%
							vidImage.draw(out);
							%></a><%
						}%><p><%=item.getShortDesc()%></p>
        	    </div><%
                }%>

         <% } %>
        </div>
	</div>
</div>
  <% }

} catch(Exception e) {
	log.error(e.getMessage());
}%>
