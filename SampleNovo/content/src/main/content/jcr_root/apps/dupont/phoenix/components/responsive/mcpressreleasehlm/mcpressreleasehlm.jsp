<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.list.HListHelper,
				java.util.ResourceBundle,com.dupont.phoenix.Global,
				com.dupont.phoenix.GlobalConstants,
				org.apache.commons.lang.StringUtils,
				com.dupont.phoenix.mchlm.pressreleashlm.PressReleaseHLM,
				com.dupont.phoenix.hlm.RankComparator,com.dupont.phoenix.hlm.RelevancyScoreComparator,
				com.dupont.phoenix.hlm.PublishDateComparator,
				com.dupont.phoenix.hlm.LastModificationDateComparator,
				com.dupont.phoenix.ListItem,com.day.cq.i18n.I18n,java.util.List,
				java.util.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
try {
    // initialize HLM List
    %><cq:include script="init.jsp"/><%
	final PressReleaseHLM hlmHelper = (PressReleaseHLM) request.getAttribute("hListHelper");
    final String corporateFolderPath = hlmHelper.getCorporateFolderPath();
    String hlmContext = hlmHelper.getHlmContext();
	final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
    //final I18n i18n = new I18n(slingRequest);
    //final ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));    
	final Integer listSize = hlmHelper.getListSize();
	final String hlmViewTye = hlmHelper.getListViewType();
	final String scriptType = String.format("/apps/dupont/phoenix/components/responsive/common/listviews/%s.jsp",hlmViewTye);
	final Boolean rowCalloutActivated = hlmHelper.isCalloutActive();
    //final String pageTag = hlmHelper.getPageTag();	
	final Boolean showHLM = hlmHelper.showHLM();
	final String contentType = hlmHelper.getContentType();
    //String queryString = hlmHelper.getQueryString();
    final String relatedText = hlmHelper.showRelatedContent()?String.format("%s ",Global.getTranslatedText(currentPage, slingRequest,"RELATED")):"";
	if(listSize > 0 && showHLM) {		
		//sort list before displaying
		if(!hlmHelper.isCorporateMCPage() && !hlmHelper.isCorporate()) {
			//log.info("standard HLM sorting:"+resource.getPath());
        	hlmHelper.calculateRelevancyScore();//calculate relevancy for sorting
        	hlmHelper.addSortingComparator(RankComparator.ASCENDING);
        	hlmHelper.addSortingComparator(RelevancyScoreComparator.DESCENDING);
		}
		hlmHelper.addSortingComparator(PublishDateComparator.DESCENDING);
		hlmHelper.addSortingComparator(LastModificationDateComparator.DESCENDING);
		hlmHelper.sortListItems();

%>

<!-- M.5.0 HORIZONTAL LIST MODULE (ARTICLES) -->
<div class="row group <%=hlmHelper.getJQueryColViewClass()%> hlm-div-id">
	<% if(hlmHelper.showViewAll()) {%>
	<div class="carousel_data">
       <div class="gray-white-button">
           <a href="<%=currentPage.getPath()%>.<%=GlobalConstants.VIEW_ALL_SELECTOR_NAME%>.<%=hlmHelper.getId()%>.html" class="button">
               <span class="button-text"><%=Global.getTranslatedText(currentPage, slingRequest,"View All")%> <%=hlmHelper.getListSize()%></span>
           </a>
       </div>
   </div>
	<%} %>
    <h2 class="row-title"><%=relatedText%><%=Global.getTranslatedText(currentPage, slingRequest,hlmHelper.getContentTypeName())%></h2>
    <%if(rowCalloutActivated) {%>
		<cq:include script="/apps/dupont/phoenix/components/responsive/common/listviews/listrow-with-callout.jsp"/>
    <%} else {%>
		<cq:include script="<%=scriptType%>"/>
	<%}%>
    <a href="/" class="prev jcarousel-prev jcarousel-prev-horizontal" title="Previous" disabled="disabled" style="left: 0px;">prev</a>
    <a href="/" class="next jcarousel-next jcarousel-next-horizontal" title="Next" style="right: 0px;">next</a>
</div>

 <%if(rowCalloutActivated) {%>

<%
	String selectedTool = properties.containsKey("selectedTool") ? properties.get("selectedTool",String.class) : null;
%>

<div class="callout-mobile row group row-color">
<%if(!"dupont/phoenix/components/linklistcurated".equals(selectedTool) && !"dupont/phoenix/components/megatrendscallout".equals(selectedTool))  { %>
    <div class="row-title"><%=Global.getTranslatedText(currentPage, slingRequest,"Tool")%></div>
<%} %>  
<%if(selectedTool!=null) { %>
        <sling:include path="selectedtool" resourceType="<%=selectedTool%>"/>
<%} %>
</div>

<%}%>

<% 	} else if(isEdit) {%>
<div class="row group">
    <h2 class="row-title"><%=relatedText%><%=Global.getTranslatedText(currentPage, slingRequest,hlmHelper.getContentTypeName())%></h2>
	<ul class="row-1col">
	  <li>
          	<div class="author">Please click here to open HLM dialog.</div>
	  		<div class="author">Hide:<%=!showHLM%></div>
	     	<div class="author">HLM Content Type:<%=contentType%></div>
          	<div class="author">Page Context: <%=hlmContext%></div>
	     	<div class="author">Page Content Type:<%=pageProperties.get("contentType",String.class)%></div>

	  </li>
	</ul>
</div>	
<%} } catch(Exception e) {log.error(e.getMessage());}%>
<!-- End M.5.0 HORIZONTAL LIST MODULE (ARTICLES) -->
