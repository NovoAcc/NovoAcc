<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.day.cq.i18n.I18n"%>
<%@ page import="com.dupont.phoenix.Global"%>

<% 
	String printLabel =Global.getTranslatedText(currentPage, slingRequest,"Print");
%>
<div class="print-button">
	<a href="#" onclick="window:print()" class="print" title="<%=printLabel %>" data-wap="{\"linktype\":\"print\"}"> <%=printLabel %> </a>
</div>