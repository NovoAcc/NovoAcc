<%--
  ==============================================================================

  Include this file where media gallery needs to be displayed

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.Global,org.apache.sling.api.resource.ValueMap" %><%
%><%
boolean videoMediaGalleryUpgraded = Global.getBooleanPropValue(pageProperties, "videoMediaGalleryUpgraded");
boolean imageMediaGalleryUpgraded = Global.getBooleanPropValue(pageProperties, "imageMediaGalleryUpgraded");
boolean displayImageGallery = false;
boolean displayVideoGallery = false;
final Resource imageMedRes = resourceResolver.getResource(currentPage.getContentResource(),"imagemediagallery");
if(imageMedRes!=null) {
	ValueMap imageMedResProps = imageMedRes.adaptTo(ValueMap.class);
	displayImageGallery = imageMedResProps.containsKey("selectedGallery");
}
final Resource videoMedRes = resourceResolver.getResource(currentPage.getContentResource(),"videomediagallery");
if(videoMedRes!=null) {
	ValueMap videoMedResProps = videoMedRes.adaptTo(ValueMap.class);
	displayVideoGallery = videoMedResProps.containsKey("videoPlaylistID");
}
boolean displayMMG = videoMediaGalleryUpgraded || imageMediaGalleryUpgraded || (!displayImageGallery && !displayVideoGallery);
log.info("(!displayImageGallery && !displayVideoGallery):"+(!displayImageGallery && !displayVideoGallery));
log.info("displayMMG:"+displayMMG+" firstMediaGallery:"+Global.getFirstGallery(currentPage) + " displayImageGallery:"+displayImageGallery + " displayVideoGallery:"+displayVideoGallery);
%>
<% if(!videoMediaGalleryUpgraded && displayVideoGallery && "videomediagallery".equals(Global.getFirstGallery(currentPage))) {
	%><cq:include path="videomediagallery" resourceType="dupont/phoenix/components/videomediagallery"/><%
}%>
<% if(!imageMediaGalleryUpgraded && displayImageGallery && "imagemediagallery".equals(Global.getFirstGallery(currentPage))) {
		%><cq:include path="imagemediagallery" resourceType="dupont/phoenix/components/imagemediagallery"/><%
}%>
<%if(displayMMG) {
	%><cq:include path="mediagallery" resourceType="dupont/phoenix/components/responsive/mediagallery"/><%	
}%>
<% if(!videoMediaGalleryUpgraded && displayVideoGallery && !"videomediagallery".equals(Global.getFirstGallery(currentPage))) {
	%><cq:include path="videomediagallery" resourceType="dupont/phoenix/components/videomediagallery"/><%
}%>
<% if(!imageMediaGalleryUpgraded && displayImageGallery && !"imagemediagallery".equals(Global.getFirstGallery(currentPage))) {
		%><cq:include path="imagemediagallery" resourceType="dupont/phoenix/components/imagemediagallery"/><%
}%>
	
