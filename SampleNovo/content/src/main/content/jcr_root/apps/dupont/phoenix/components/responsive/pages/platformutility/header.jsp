<%--
  ==============================================================================

  Includes navigation, hero, and content tabs JSPs and components

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>

<cq:include path="globalnavcampaign" resourceType="/apps/dupont/phoenix/components/responsive/campaigns/globalnavcampaign"/>
<cq:include path="siteconfig" resourceType="dupont/phoenix/components/siteconfig"/>
<section class="hero-area-wrapper">
    <cq:include script="heroarea.jsp"/>
</section>