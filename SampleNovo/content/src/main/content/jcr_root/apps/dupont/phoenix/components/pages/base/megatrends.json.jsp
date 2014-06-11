<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="org.apache.sling.commons.json.io.JSONWriter, org.apache.sling.api.resource.ValueMap,
			org.apache.sling.api.resource.Resource,java.util.Iterator,
			com.day.cq.commons.jcr.JcrConstants,com.day.cq.wcm.api.designer.Style"%><%
%><%
	response.setContentType("application/json");
	response.setCharacterEncoding("utf-8");
	final JSONWriter jw = new JSONWriter(out);
    jw.array();
	final Style generalStyle = currentDesign.getStyle("siteconfig/general");
	if(generalStyle!=null) {
		final String megatrendFolderPath = generalStyle.get("megatrendFolderPath", String.class);
	    if (megatrendFolderPath != null) {
			final Resource megatrendFolder = resourceResolver.getResource(megatrendFolderPath);
			if(megatrendFolder!=null) {
				final Iterator<Resource> megatrends = resourceResolver.listChildren(megatrendFolder);
				while(megatrends.hasNext()) {
					final Resource megatrendRes = megatrends.next();
					final Resource megatrendCntRes = resourceResolver.getResource(megatrendRes, JcrConstants.JCR_CONTENT);
					if(megatrendCntRes!=null) {
						final ValueMap props = megatrendCntRes.adaptTo(ValueMap.class);
                        if(props.get("hideInNav","false").equals("false")){
							jw.object();
							jw.key("text").value(props.get("jcr:title",String.class));
							jw.key("value").value(megatrendRes.getPath());
							jw.endObject();
                        }
					}
				}
			}
		}
	}
    jw.endArray();
%>