<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.HListHelper, com.day.cq.wcm.api.WCMMode,
				java.util.ResourceBundle,com.dupont.phoenix.Global,
				com.dupont.phoenix.GlobalConstants,
				com.dupont.phoenix.hlm.RankComparator,com.dupont.phoenix.hlm.RelevancyScoreComparator,
				com.dupont.phoenix.hlm.LastModificationDateComparator,
				com.dupont.phoenix.ListItem,com.day.cq.i18n.I18n,java.util.List" %><%
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><%
%><%
try {
    // initialize HLM List
    %><cq:include script="init.jsp"/><%	
	final Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);
    //final I18n i18n = new I18n(slingRequest);
    //final ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));
	final HListHelper hlmHelper = (HListHelper) request.getAttribute("hListHelper");
	final Integer listSize = hlmHelper.getListSize();
	final String hlmViewTye = hlmHelper.getListViewType();
	final String scriptType = String.format("/apps/dupont/phoenix/components/common/listviews/%s.jsp",hlmViewTye);
	final Boolean rowCalloutActivated = hlmHelper.isCalloutActive();
    //final Boolean calloutToolSelected = hlmHelper.isCalloutToolSelected();
   	final String pageTag = hlmHelper.getPageTag();
	final Boolean showHLM = hlmHelper.showHLM();
	final String contentType = hlmHelper.getContentType();
	final String relatedText = hlmHelper.showRelatedContent()?String.format("%s ",Global.getTranslatedText(currentPage, slingRequest,"RELATED")):"";
	if(listSize > 0 && showHLM) {
		//sort list before displaying
		hlmHelper.calculateRelevancyScore();//calculate relevancy for sorting
		hlmHelper.addSortingComparator(RankComparator.ASCENDING);
		hlmHelper.addSortingComparator(RelevancyScoreComparator.DESCENDING);
		hlmHelper.addSortingComparator(LastModificationDateComparator.DESCENDING);
		hlmHelper.sortListItems();
%>

<!-- M.5.0 HORIZONTAL LIST MODULE (ARTICLES) change-->
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
    <h2 class="row-title padding-left"><%=relatedText%><%=Global.getTranslatedText(currentPage, slingRequest,hlmHelper.getContentTypeName())%></h2>
    <%if(rowCalloutActivated) {%>
		<cq:include script="/apps/dupont/phoenix/components/common/listviews/listrow-with-callout.jsp"/>
    <%} else {%>
		<cq:include script="<%=scriptType%>"/>
	<%}%>
    <a href="/" class="prev jcarousel-prev jcarousel-prev-horizontal" title="Previous" disabled="disabled" style="left: 0px;">prev</a>
    <a href="/" class="next jcarousel-next jcarousel-next-horizontal" title="Next" style="right: 0px;">next</a>
</div>
<% 	} else if(isEdit) {%>
<div class="row group">
    <h2 class="row-title padding-left"><%=relatedText%><%=Global.getTranslatedText(currentPage, slingRequest,hlmHelper.getContentTypeName())%></h2>
	<ul class="row-1col padding-left group">
	  <li>
	  <div class="author">Please click here to open HLM dialog.<div class="author">
	  <div class="author">Hide:<%=!showHLM%></div>
	     <div class="author">HLM Content Type:<%=contentType%></div>
	     <div class="author">Page Content Type:<%=pageProperties.get("contentType",String.class)%></div>
	     <div class="author">Page Tag:<%=(pageTag!=null)?pageTag:"Please enter page tag to identify this page."%></div>
	  </li>
	</ul>
</div>
<%} } catch(Exception e) {log.error(e.getMessage());}%>
<!-- End M.5.0 HORIZONTAL LIST MODULE (ARTICLES) -->