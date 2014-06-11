<%--
  ==============================================================================

  Include this file where media gallery needs to be displayed

  ==============================================================================

--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.Global" %>
<%
boolean videoPlayerUpgraded = Global.getBooleanPropValue(pageProperties, "videoPlayerUpgraded");

  if(videoPlayerUpgraded) {
	%><cq:include path="videoplayer" resourceType="dupont/phoenix/components/ps7videoplayer"/><%	
} else {
%>
    <cq:include path="videoplayer" resourceType="dupont/phoenix/components/videoplayer"/><%
}
%>
