<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="org.apache.sling.commons.json.io.JSONWriter, org.apache.sling.api.resource.ValueMap,
			org.apache.sling.api.resource.Resource,java.util.Iterator,
			com.day.cq.commons.jcr.JcrConstants,com.day.cq.wcm.api.designer.Style"%><%
%><%
	response.setContentType("application/json");
	response.setCharacterEncoding("utf-8");
	final JSONWriter jw = new JSONWriter(out);
    jw.array();
	final Style imageGalleryStyle = currentDesign.getStyle("siteconfig/imagegallery");
	if(imageGalleryStyle!=null) {
		final String imageGalleryPath = imageGalleryStyle.get("imageGalleryFolderPath", String.class);
	    if (imageGalleryPath != null) {
			final Resource imageGalleryFolder = resourceResolver.getResource(imageGalleryPath);
			if(imageGalleryFolder!=null) {
				final Iterator<Resource> imageGallerySets = resourceResolver.listChildren(imageGalleryFolder);
				while(imageGallerySets.hasNext()) {
					final Resource setRes = imageGallerySets.next();
					final Resource setCntRes = resourceResolver.getResource(setRes, JcrConstants.JCR_CONTENT);
					if(setCntRes!=null) {
						final ValueMap props = setCntRes.adaptTo(ValueMap.class);
						jw.object();
						jw.key("text").value(props.get("jcr:title",String.class));
						jw.key("value").value(setRes.getPath());
						jw.endObject();
					}
				}
			}
		}
	}
    jw.endArray();
%>
