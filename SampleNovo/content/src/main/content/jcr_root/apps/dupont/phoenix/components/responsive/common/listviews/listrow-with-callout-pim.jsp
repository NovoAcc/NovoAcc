<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.list.HListHelper,com.dupont.phoenix.Global,com.day.cq.i18n.I18n"%><%
%><%@ page import="java.util.List, com.dupont.phoenix.list.ListItem, com.day.cq.wcm.foundation.Image" %><%
    //This file displays list items and tool callout
    //final I18n i18n = new I18n(slingRequest);
    //final ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));
     String selectedTool = properties.containsKey("selectedTool") ? properties.get("selectedTool",String.class) : null;
%>

<aside class="row-callout">
	<%if(!"dupont/phoenix/components/linklistcurated".equals(selectedTool) && !"dupont/phoenix/components/megatrendscallout".equals(selectedTool))  { %>
    	<div class="row-title"><%=Global.getTranslatedText(currentPage, slingRequest,"Tool")%></div>
	<% } %>
	<%if(selectedTool!=null) { %>
        <sling:include path="selectedtool" resourceType="<%=selectedTool%>"/>
	<% } %>
</aside>