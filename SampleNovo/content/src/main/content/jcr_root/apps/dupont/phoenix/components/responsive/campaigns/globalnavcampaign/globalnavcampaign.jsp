<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<mgs:controller var="globalNav" cls="com.dupont.phoenix.campaigns.GlobalNavCampaignHelper" />
<c:set var="flag"  value="${(not empty properties['logolink'] ) and properties['logolink']}"/>
<header class="header-top-bar">
    <c:if test="${flag}">
        <c:choose>
         <c:when test="${not empty properties['logoLinkPath']}"><a href="${properties['logoLinkPath']}.html" ></c:when><c:otherwise><a href="${globalNav.homePageURL}"></c:otherwise>
        </c:choose>
        </c:if>
	   <div class="header-top-bar-logo">	
        </div>
        <c:if test="${flag}"></a></c:if>
    <!--  Global Navigation Links Start  -->
	<nav class="menu-dropdown">
    </nav>
   	<!--  Global Navigation Links End  -->
</header>
<div style="clear:both"></div>