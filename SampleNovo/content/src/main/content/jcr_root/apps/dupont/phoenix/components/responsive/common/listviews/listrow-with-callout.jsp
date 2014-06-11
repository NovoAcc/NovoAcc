<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.HListHelper,com.dupont.phoenix.Global,com.day.cq.i18n.I18n"%><%
%><%@ page import="java.util.List, com.dupont.phoenix.list.ListItem, com.day.cq.wcm.foundation.Image" %><%
    //This file displays list items and tool callout
    //final I18n i18n = new I18n(slingRequest);
    //final ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));
    HListHelper hListHelper = (HListHelper) request.getAttribute("hListHelper");
    List<ListItem> items = hListHelper.getListItems();
    String listViewTypeCallout = hListHelper.getListViewType();
    String scriptType=String.format("/apps/dupont/phoenix/components/responsive/common/listviews/%s.jsp",listViewTypeCallout);
    String selectedTool = properties.containsKey("selectedTool") ? properties.get("selectedTool",String.class) : null;
%>
<div class="row-with-callout group">
    <cq:include script="<%=scriptType%>"/>
</div>
<div class="row-callout">
<%if(!"dupont/phoenix/components/linklistcurated".equals(selectedTool) && !"dupont/phoenix/components/megatrendscallout".equals(selectedTool))  { %>
    <div class="row-title"><%=Global.getTranslatedText(currentPage, slingRequest,"Tool")%></div>
<%} %>
<%if(selectedTool!=null) { %>
        <sling:include path="selectedtool" resourceType="<%=selectedTool%>"/>
<%} %>
</div>