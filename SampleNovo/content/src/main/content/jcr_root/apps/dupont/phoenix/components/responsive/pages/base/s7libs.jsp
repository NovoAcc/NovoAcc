<%--
  ==============================================================================

  All Scene7 component should override this
  file to include Scene7 lib here.

  ==============================================================================

--%>

<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.GlobalConstants"%>
<!-- Include JS and CSS for S7 components -->
<cq:includeClientLib css="apps.dupont.s7default"/>
<script src="<%= GlobalConstants.s7domain %>/s7sdk/2.5/js/s7sdk/utils/Utils.js"></script>
