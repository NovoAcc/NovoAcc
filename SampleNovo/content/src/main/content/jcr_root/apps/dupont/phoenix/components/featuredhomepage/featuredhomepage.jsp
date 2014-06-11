<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.featured.FeaturedHomePage"%>
<%  FeaturedHomePage featuredHomePage = new FeaturedHomePage(resource, slingRequest);
	pageContext.setAttribute("featuredHomePage",featuredHomePage);%>

<c:if test="${featuredHomePage.author }">
	<cq:includeClientLib categories="apps.dupont.widgets.custom"/>
</c:if>

<c:choose>
	<c:when test="${featuredHomePage.author && fn:length(featuredHomePage.links) == 0 }">
		<div>Add Featured Home Page Carousel</div>
	</c:when>
	<c:otherwise>
		<c:if test="${not empty featuredHomePage.links }">
			<div class="jcarousel-skin-article">
				<div class="featured_homepage_module jcarousel-container jcarousel-container-horizontal">
                    <div class="jcarousel-clip jcarousel-clip-horizontal" style="position: relative;">
                        <ul class="jcarousel-view--home-page-hlm-view--panel-pane-1">
                            <c:forEach var="link" items="${featuredHomePage.links }">
                                <li class="jcarousel-item" style="border-right:1px solid #eaeaea;">
                                    <h2 class="homepage-hlm-item">${link }</h2>
                                </li>
                            </c:forEach>
                        </ul>
                    </div>
                    <a href="/" class="prev" title="Previous" style="left: 38px;" disabled="disabled">prev</a>
                    <a href="/" class="next" title="Next" style="right: 38px;">next</a>
				</div>
			</div>
		</c:if>
	</c:otherwise>
</c:choose>
<div style="clear:both"></div>