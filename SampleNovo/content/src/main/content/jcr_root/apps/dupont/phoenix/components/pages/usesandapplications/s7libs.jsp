<%--
  ==============================================================================

  All Scene7 component should override this
  file to include Scene7 lib here.

  ==============================================================================

--%>

<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.GlobalConstants"%>
<cq:includeClientLib css="apps.dupont.s7default"/>
<script src="<%= GlobalConstants.s7domain %>/s7sdk/2.5/js/s7sdk/utils/Utils.js"></script>
<!-- Hiding the Safari on iPhone OS UI components -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-touch-fullscreen" content="YES" />
<!-- Specifying a per-page Home screen icon -->
<link rel="apple-touch-icon" href=""/>
<link rel="apple-touch-startup-image" href="" />
