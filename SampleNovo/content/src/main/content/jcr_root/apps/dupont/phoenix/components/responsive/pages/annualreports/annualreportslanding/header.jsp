<%--
  ==============================================================================

  Includes navigation, hero, and content tabs JSPs and components

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>

<cq:include path="globalnav" resourceType="dupont/phoenix/components/responsive/campaigns/globalnavcampaign"/>


<cq:include path="siteconfig" resourceType="dupont/phoenix/components/siteconfig"/>
<section class="hero-area-wrapper">
    <cq:include script="heroarea.jsp"/>
</section>
<cq:include path="siblingnavigation" resourceType="dupont/phoenix/components/responsive/annualreports/siblingnavigation"/>
<cq:include path="fullbleedvideo" resourceType="dupont/phoenix/components/responsive/annualreports/fullbleedvideo"/>