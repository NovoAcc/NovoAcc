<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="org.apache.sling.commons.json.io.JSONWriter, org.apache.sling.api.resource.ValueMap,
			org.apache.sling.api.resource.Resource,java.util.Iterator,
			com.day.cq.commons.jcr.JcrConstants,com.day.cq.wcm.api.designer.Style"%><%
%><%
	response.setContentType("application/json");
	response.setCharacterEncoding("utf-8");
	final JSONWriter jw = new JSONWriter(out);
    jw.array();
		jw.object();
			jw.key("text").value("Megatrends Call Out");
			jw.key("value").value("dupont/phoenix/components/megatrendscallout");
		jw.endObject();
		jw.object();
			jw.key("text").value("Product Finder Call Out");
			jw.key("value").value("dupont/phoenix/components/productfindercallout");
		jw.endObject();
		jw.object();
			jw.key("text").value("Link List (Curated)");
			jw.key("value").value("dupont/phoenix/components/linklistcurated");
		jw.endObject();
		jw.object();
			jw.key("text").value("Tool/Call Out");
			jw.key("value").value("dupont/phoenix/components/touttool");
		jw.endObject();
	jw.endArray();
%>
