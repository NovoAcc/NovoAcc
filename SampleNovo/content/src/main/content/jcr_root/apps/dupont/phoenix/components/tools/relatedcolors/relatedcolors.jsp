<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.tools.bi.colortools.RelatedColors,com.dupont.phoenix.commons.Scene7Image"%>
<%
RelatedColors relatedColors = new RelatedColors(resource, currentPage, slingRequest);
pageContext.setAttribute("relatedColors",relatedColors); %>

<c:if test="${not empty relatedColors.relatedColors || relatedColors.edit}">
    <div class="bi-color-tool">
        <div class="bicolor-hlm-top">
            <h2 id="RelatedColorsTitle" class="bicolor-title row-title">${relatedColors.relatedColorsTitle}</h2>
            <div id="BIColorLinks">
                <span id="RelatedHues" class="bicolor-top-content">${relatedColors.seeRelatedHues}:</span>
                <c:forEach var="hue" items="${relatedColors.filterTags}">
                    <h4 id="hue"><a href="${relatedColors.colorParentPage}.html?hues=${hue.name}">${hue.title}</a></h4>
                    <span class="bicolor-top-content d1"> | </span>
                </c:forEach>
                <h4 id="allcolors">
                    <a href="${relatedColors.colorParentPage}.html">${relatedColors.colorPageProductTag}</a>
                </h4>
            </div>
            <div class="clear"></div>
        </div>
        <c:if test="${not empty relatedColors.relatedColors}">
        <div class="bicolor-hlm-carousel">
            <ul id="RelatedColors" class="jcarousel-skin-bi-color">
                <c:forEach var="color" items="${relatedColors.relatedColors}">
                    <li class="jcarousel-item">
                        <c:set var="image" value="${color.colorImage }"/>
                        <a class="color-link" href="${color.url}.html"><%((Scene7Image)pageContext.getAttribute("image")).draw(out); %></a>
                        ${color.href}
                    </li>
                </c:forEach>
            </ul>
        </div>
        <div class="prev jcarousel-prev jcarousel-prev-horizontal">${relatedColors.prev}</div>
        <div class="next jcarousel-next jcarousel-next-horizontal">${relatedColors.next}</div>
        </c:if>
        <c:if test="${empty relatedColors.relatedColors && relatedColors.edit}">
            Please make sure page and sibling color pages are tagged properly. Tool will not be displayed in publish mode.
        </c:if>
    </div>
</c:if>
