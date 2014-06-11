<%--
  ==============================================================================

  Includes navigation, hero, and content tabs JSPs and components

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>

<cq:include path="globalnav" resourceType="dupont/phoenix/components/responsive/globalnav"/>


<cq:include path="sitesearch-mobile" resourceType="dupont/phoenix/components/responsive/search-mobile"/>

<cq:include path="siteconfig" resourceType="dupont/phoenix/components/siteconfig"/>
<section class="hero-area-wrapper">
    <cq:include script="heroarea.jsp"/>
</section>