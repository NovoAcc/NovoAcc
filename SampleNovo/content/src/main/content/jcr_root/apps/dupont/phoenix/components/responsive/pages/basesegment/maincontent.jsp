<%--
  ==============================================================================

  All Segment Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.GlobalConstants,com.day.cq.wcm.api.WCMMode"%>
<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
%> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
<%}%>
<%
    pageContext.setAttribute("showViewAll",Global.isSelectorActive(slingRequest, GlobalConstants.VIEW_ALL_SELECTOR_NAME));
%><c:choose>
    <c:when test="${showViewAll}">
        <cq:include path="viewallcontent" resourceType="dupont/phoenix/components/viewall"/>
    </c:when>
    <c:otherwise>
        <section id="intro" class="group">
            <cq:include path="introbodytext" resourceType="dupont/phoenix/components/introbodytext"/>
            <cq:include script="utilitylinks-mobile.jsp"/>
            <cq:include path="featuredcallout" resourceType="dupont/phoenix/components/responsive/featuredcallout"/>
        </section>
        <div id="rows-wrapper">
            <cq:include script="pagecontent.jsp"/>
            <div style="clear:both"></div>
            <cq:include path="disclaimer" resourceType="dupont/phoenix/components/disclaimer"/>
        </div>
    </c:otherwise>
</c:choose>
