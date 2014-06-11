<%--
  ==============================================================================

  Cookie Alert

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
try {
	String enabled ="";
	if (currentDesign.getStyle("siteconfig/cookiemessage").get("enabled", String.class) != null){
		enabled= currentDesign.getStyle("siteconfig/cookiemessage").get("enabled").toString();
		if (enabled.equals("true")) { %>
			<cq:include path="cookiealert" resourceType="dupont/phoenix/components/cookiealert"/><%
		}
	}
}
catch (Exception e) {
    log.error(e.getMessage());
}
%>
