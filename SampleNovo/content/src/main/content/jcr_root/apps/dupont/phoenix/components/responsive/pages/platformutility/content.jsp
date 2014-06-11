<%--
  ==============================================================================

  Override this file due to different HTML for Breadcrumb and other elements.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%

%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%
if(WCMMode.fromRequest(request) != WCMMode.DISABLED) {
 %> <cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 <% } %>
<div id="main-container">

    <!-- Start Utility Header -->
    <div class="row utility-header">

         <!-- Start Breadcrumbs -->

        <cq:include path="utilityheadline" resourceType="/apps/dupont/phoenix/components/responsive/utilityheadline"/>

    </div>
    <div style="clear:both"></div>
    <!-- End Base Header -->
    <!-- For Open HTML Area Component -->
    <section class="group utility-text-component" id="intro">
        <cq:include path="openareapar" resourceType="foundation/components/parsys"/>
    </section>
    <!-- End Open HTML Area Component -->

    <div style="clear:both"></div>
</div>
