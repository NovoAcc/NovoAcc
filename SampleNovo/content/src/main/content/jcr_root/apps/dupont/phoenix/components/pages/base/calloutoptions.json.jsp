<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="org.apache.sling.commons.json.io.JSONWriter, org.apache.sling.api.resource.ValueMap,
			org.apache.sling.api.resource.Resource, com.day.cq.wcm.api.designer.Style"%><%
%><%
	response.setContentType("application/json");
	final JSONWriter jw = new JSONWriter(out);
    jw.array();
	final Style hlmStyle = currentDesign.getStyle("siteconfig/featured");
	if(hlmStyle!=null) {
		final String[] allowedTools = hlmStyle.get("allowedTools", String[].class);
	    if (allowedTools != null) {
	    	for(int i=0; i < allowedTools.length; i++) {
				final Resource toolRes = resourceResolver.getResource(String.format("/apps/%s",allowedTools[i]));
				if(toolRes!=null) {
					final ValueMap toolProps = toolRes.adaptTo(ValueMap.class);
					jw.object();
					jw.key("text").value(toolProps.get("jcr:title",String.class));
					jw.key("value").value(allowedTools[i]);
					jw.endObject();
				}
			}
	    }
	}
    jw.endArray();
%>
