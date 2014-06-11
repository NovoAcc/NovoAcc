<%--
  ==============================================================================

  Includes content jsps (breadcrumb, utility links, main content, and disclaimer).

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%

%>

<section id="main-container">
    <div class="group">
        <cq:include path="breadcrumb" resourceType="dupont/phoenix/components/breadcrumb"/>
        <cq:include path="breadcrumb-mobile" resourceType="dupont/phoenix/components/responsive/breadcrumb-mobile"/>
    </div>
    <cq:include script="utilitylinks.jsp"/>
    <cq:include script="maincontent.jsp"/>
</section>