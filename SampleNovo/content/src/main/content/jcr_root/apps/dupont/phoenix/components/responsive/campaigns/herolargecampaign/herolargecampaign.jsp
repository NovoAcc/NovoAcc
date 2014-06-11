<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<mgs:controller var="heroLargeHelper" cls="com.dupont.phoenix.campaigns.HeroLargeCampaignHelper" />
<c:set var="heroLargeBean" scope="page" value="${heroLargeHelper.heroLargeBean}"/>
<div id=${heroLargeBean.strDivMain} class="group" ${heroLargeBean.heroColorClass} >
   <c:if test="${heroLargeBean.author || (not heroLargeBean.author && heroLargeBean.hasImage)}">
       <div class="hero-image">
           <c:out value="${heroLargeBean.markUp}" escapeXml="false"/>
       </div>
   </c:if>
    <div id=${heroLargeBean.strDivMainTitle} class="group">
            <h2 class=${heroLargeBean.conutryCode}> ${heroLargeBean.pageTitle} </h2>
            <!--- cqinclude the Social Media Chicklets component -->
            <cq:include path="socialchannels" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_header" />
        <div id=${heroLargeBean.strDivMainTitleBG} style=${heroLargeBean.heroColor}></div>
    </div>
</div>
<div style="clear:both"></div>