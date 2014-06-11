<%--
  ==============================================================================

  All Segment Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><% %>

<cq:include path="openareapar" resourceType="foundation/components/parsys"/>
  <cq:include path="fullbleedimage" resourceType="dupont/phoenix/components/responsive/annualreports/fullbleedimage"/>
  <cq:include path="mediagallery" resourceType="dupont/phoenix/components/responsive/mediagallery"/>
  <div class="grid-wrapper">
    <cq:include path="par_featuredx" resourceType="foundation/components/parsys"/>
  </div>