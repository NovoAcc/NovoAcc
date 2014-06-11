<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.tools.bi.colortools.RecommendedColors,com.dupont.phoenix.commons.Scene7Image"%>
<%
RecommendedColors recommendedColors = new RecommendedColors(resource, currentPage, slingRequest);
pageContext.setAttribute("recommendedColors",recommendedColors);
%>

<c:if test="${not empty recommendedColors.recommendedColors || recommendedColors.edit}">
    <c:if test="${not empty recommendedColors.colorPageParent}">
        <div class="bi-color-tool">
            <div class="bicolor-hlm-top">
                <h2 id="RecommendedColorsTitle" class="bicolor-title row-title">${recommendedColors.recommendedColorsTitle}</h2>
                <div id="BIColorLinks">
                    <span id="RecommendedColorsLabel" class="bicolor-top-content">${recommendedColors.seeRelatedCollections}:</span>
                    <c:forEach var="collection" items="${recommendedColors.filterTags}">
                        <h4 id="collection"><a href="${recommendedColors.productPagePath}.html?collections=${collection.name}">${collection.title}</a></h4>
                        <span class="bicolor-top-content d1"> | </span>
                    </c:forEach>
                    <h4 id="allcolors">
                        <a href="${recommendedColors.productPagePath}.html">${recommendedColors.productTag}</a>
                    </h4>
                </div>
                <div class="clear"></div>
            </div>
            <c:if test="${not empty recommendedColors.recommendedColors}">
            <div class="bicolor-hlm-carousel">
                <ul id="recommendedColors" class="jcarousel-skin-bi-color">
                    <c:forEach var="color" items="${recommendedColors.recommendedColors}">
                        <li class="jcarousel-item">
                            <c:set var="image" value="${color.colorImage }"/>
                            <a class="color-link" href="${color.url}.html"><%((Scene7Image)pageContext.getAttribute("image")).draw(out); %></a>
                            ${color.href}
                        </li>
                    </c:forEach>
                </ul>
            </div>
            <div class="prev jcarousel-prev jcarousel-prev-horizontal">${recommendedColors.prev}</div>
            <div class="next jcarousel-next jcarousel-next-horizontal">${recommendedColors.next}</div>
            </c:if>
            <c:if test="${empty recommendedColors.recommendedColors && recommendedColors.edit}">
                Please make sure this page and color pages are tagged properly with the desired collection tag.
            </c:if>
        </div>
    </c:if>

    <c:if test="${empty recommendedColors.colorPageParent && recommendedColors.edit}">
        Edit Recommended Colors Here.
    </c:if>
</c:if>