<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.Global, org.apache.sling.api.resource.ValueMap,
				com.day.cq.wcm.api.Page, org.apache.sling.api.resource.Resource" %><%
boolean videoPlayerUpgraded = false;
final String selectedCnt = Global.getStringPropValue(properties, "selectedContent");
final Page videoPage = pageManager.getPage(selectedCnt);
if(videoPage!=null) {
	Resource videoRes = videoPage.getContentResource();
	ValueMap props = videoRes.adaptTo(ValueMap.class);
	videoPlayerUpgraded = Global.getBooleanPropValue(props, "videoPlayerUpgraded");
}
log.info("videoPlayerUpgraded:"+videoPlayerUpgraded);
if(videoPlayerUpgraded) {
	%><cq:include script="s7inlinecallout.jsp"/><%	
} else {
	%><cq:include script="bcinlinecallout"/><%	
} %>
