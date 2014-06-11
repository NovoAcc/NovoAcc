<%--

 Media Center Multimedia component.

--%>
<%@page session="false" contentType="text/html; charset=utf-8"%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.list.HListHelper,com.dupont.phoenix.hlm.HLMWrapper,
    			java.util.ResourceBundle,com.dupont.phoenix.Global,
				com.dupont.phoenix.GlobalConstants,
				com.dupont.phoenix.ListItem,com.day.cq.i18n.I18n,java.util.List,
				java.util.*,
    				com.day.cq.wcm.api.Page,java.util.Iterator,
   				org.apache.sling.api.resource.ResourceUtil,
				javax.jcr.Property,
				org.apache.sling.jcr.resource.*,
    				org.apache.sling.api.resource.ResourceResolver,
				com.dupont.phoenix.hlm.LastModificationDateComparator,
				com.dupont.phoenix.Multimedia,
				javax.jcr.query.Query,
                		org.apache.commons.lang.StringUtils"%>


<%
	String rootPage = currentPage.getPath();

	int imgCount = 0;
	int vidCount = 0;
	int tilesCount = 0;
	String heroColor = "";

    // Read the heroColor
	    if (pageProperties.get("heroColor")!= null){
   	    heroColor = pageProperties.get("heroColor").toString();
	}

	Iterator<Resource> resourceIterator=null;
	final StringBuilder queryString1 = new StringBuilder()
			.append("/jcr:root")
			.append(rootPage)
			.append("//element(*,cq:Page)")
			.append("[@jcr:content/contentType='mcimagedetail']");
	resourceIterator = slingRequest.getResourceResolver().findResources(StringUtils.trim(queryString1.toString()),Query.XPATH);
	if (resourceIterator.hasNext() == true){
		imgCount++;
	}

	final StringBuilder queryString2 = new StringBuilder( )
			.append("/jcr:root")
			.append(rootPage)
			.append("//element(*,cq:Page)")
			.append("[@jcr:content/contentType='mcvideodetail']");

	resourceIterator = slingRequest.getResourceResolver().findResources(StringUtils.trim(queryString2.toString()),Query.XPATH);

	if (resourceIterator.hasNext() == true){
		vidCount++;
	}

%>


<%
try {

    // initialize HLM List
    %><cq:include script="/apps/dupont/phoenix/components/hlm/init.jsp"/><%

	final Multimedia multimediaHelper = (Multimedia) request.getAttribute("hListHelper");

	final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);

	final Integer listSize = multimediaHelper.getListSize();

	final Boolean rowCalloutActivated = multimediaHelper.isCalloutActive();

	final Boolean showHLM = multimediaHelper.showHLM();

    final String contentType = multimediaHelper.getContentType();

   	final String viewall_vid = "viewall_vid";

    final String viewall_img = "viewall_img";

    String title = Global.getTranslatedText(currentPage,slingRequest,"Multimedia");

    HLMWrapper hlmWrapper = (HLMWrapper)request.getAttribute("hlmWrapper");

    if(hlmWrapper==null) {
        hlmWrapper = new HLMWrapper(slingRequest,currentPage);
        request.setAttribute("hlmWrapper", hlmWrapper);
    }
    final HListHelper hListHelper = hlmWrapper.getHLMById("multimedia");

    if(hListHelper!=null) {
		List items = hListHelper.getListItems();
    }

   %>
<script>

 $(document).ready(function() {

     if(<%=vidCount%>>=1){
         $('#video_tile').css('display','block');
     }else{
         $('#video_tile').css('display','none');
     }

     if(<%=imgCount%>>=1){
         $('#image_tile').css('display','block');
     }else{
         $('#image_tile').css('display','none');
     }
      if($('#video_tile').is(':hidden') || $('#image_tile').is(':hidden')){
         $('.view-link').removeClass("view-link").addClass("posleft")
     }

     if($('#video_tile').is(':hidden') && $('#image_tile').is(':hidden')){
                 $('#mul').css('visibility','hidden');
     }


     // $('#mul').removeAttr('buttonPrevHTML');


 });



</script>


<!-- Row -->
<div class="mclp_desktop">
    <div class="row group horizontal_list_module_2-3_col hlm-div-id" id="mul">
        <%if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT && heroColor.equals("")){%>
            <h2 class="row-title"><%=title%></h2>
            Please select a hero color in page properties
        <% }else{ %>
        <h2 class="row-title"><%=title%></h2>
        <div class="carousel_data">
            <div class="gray-white-button">
                <a href="<%=currentPage.getPath()%>.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.<%=multimediaHelper.getId()%>.html?title=<%=title%>" class="button" >
                    <span class="button-text"><%=Global.getTranslatedText(currentPage, slingRequest,"View All") + " "%><%=multimediaHelper.getListSize()%></span>
                </a>
            </div>
        </div>
        <div class="row-without-callout group">
            <ul class="row-2col group" id="tiles_ul">
                <li id="video_tile" class="video_tile">
                    <a href="<%=currentPage.getPath()%>.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.<%=multimediaHelper.getId()%>.html?viewall_vid=<%=viewall_vid%>&title=<%=title%>"><img class="placeholder_img" src="/etc/designs/dupont/phoenix/responsiveclientlib/source/images/mc_video_icon.png" style="background-color:#<%=heroColor%>;" /></a>
                    <h2 class="view-link"><a href="<%=currentPage.getPath()%>.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.<%=multimediaHelper.getId()%>.html?viewall_vid=<%=viewall_vid%>&title=<%=title%>"><span id="multimedia-viewall"><%=Global.getTranslatedText(currentPage, slingRequest,"ViewAllVideos")%><img src="/etc/designs/dupont/phoenix/responsiveclientlib/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>
                </li>

                <li id="image_tile" class="image_tile">
                    <a href="<%=currentPage.getPath()%>.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.<%=multimediaHelper.getId()%>.html?viewall_img=<%=viewall_img%>&title=<%=title%>"><img class="placeholder_img" src="/etc/designs/dupont/phoenix/responsiveclientlib/source/images/mc_image_icon.png" style="background-color:#<%=heroColor%>;" /></a>
                    <h2 class="view-link"><a href="<%=currentPage.getPath()%>.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.<%=multimediaHelper.getId()%>.html?viewall_img=<%=viewall_img%>&title=<%=title%>"><span id="multimedia-viewall"><%=Global.getTranslatedText(currentPage, slingRequest,"ViewAllImages")%><img src="/etc/designs/dupont/phoenix/responsiveclientlib/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>
                </li>
            </ul>
        </div>
        <a href="/" class="prev jcarousel-prev jcarousel-prev-horizontal" title="Previous" disabled="disabled" style="left: 0px;">prev</a>
    	<a href="/" class="next jcarousel-next jcarousel-next-horizontal" title="Next" style="right: 0px;">next</a>
    </div>
</div>
<%}%>


<!-- End Row -->

<% } catch(Exception e) {log.error(e.getMessage());} %>
