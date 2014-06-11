<%--

  Featured B Component component.

  Featured B Component

--%><%
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.featured.FeaturedModuleB,com.dupont.phoenix.Global, com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.ListItem, java.util.List " %>
<%
try{
Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
String featuredBViewTye = "";
String scriptType = "";
FeaturedModuleB featuredModuleB = new FeaturedModuleB(slingRequest, currentPage, resource);
//List<ListItem> items = featuredModuleB.getItems();
//listSize = (items!=null)?items.size():0;
final Integer listSize = featuredModuleB.getListSize();

request.setAttribute("hListHelper",featuredModuleB );

featuredBViewTye = featuredModuleB.getListViewType();
Boolean rowCalloutActivated = featuredModuleB.isCalloutActive();
//Boolean calloutToolSelected = featuredModuleB.isCalloutToolSelected();
scriptType=String.format("/apps/dupont/phoenix/components/common/listviews/%s.jsp",featuredBViewTye );
String moduleTitle = Global.getTranslatedText(currentPage, slingRequest,"Featured");

if(listSize > 0) {
%>
<div class="row group hlm-div-id">
    <h2 class="row-title padding-left"><%=moduleTitle%></h2>
    <%if(listSize <= 2 && rowCalloutActivated) { %>
        <cq:include script="/apps/dupont/phoenix/components/common/listviews/listrow-with-callout.jsp"/>
    <%} else {
    %>
    <cq:include script="<%=scriptType%>"/>
    <%}%>
    <a href="/" class="prev jcarousel-prev jcarousel-prev-horizontal" title="Previous" disabled="disabled" style="left: 0px;">prev</a>
    <a href="/" class="next jcarousel-next jcarousel-next-horizontal" title="Next" style="right: 0px;">next</a>
</div>
<% } else if(isEdit) {%>
<div class="row group">
    <h2 class="row-title padding-left"><%=moduleTitle%></h2>
    <ul class="row-1col padding-left group">  
        <li>
            <div class="author">Please click here to open dialog for Featured Module B <div class="author"> 
        </li>   
    </ul>
</div>
<%} } catch(Exception e) {
	log.error(e.getMessage());
}%>