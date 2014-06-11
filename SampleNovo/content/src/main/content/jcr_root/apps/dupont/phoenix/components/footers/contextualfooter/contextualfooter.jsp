<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<mgs:controller var="contextualFooter" cls="com.dupont.phoenix.footer.ContextualFooter" />
<div style="clear:both"></div>
<!--Helpful Links-->
<cq:include path="helpfullinks" resourceType="/apps/dupont/phoenix/components/helpfullinks" />
<!--END Helpful Links-->

<!--STARTS FOOTER-->
<%
String currentPagePath = currentPage.getPath();
%>
<c:set var="currentPagePath" value="<%=currentPagePath%>"/>
    <div class="footer-left-col group">
        <div class="breadcrumb group">
            <cq:include path="breadcrumb" resourceType="/apps/dupont/phoenix/components/breadcrumb" />
        </div>
        <c:if test="${contextualFooter.moreInEnabled}">
            <c:if test="${not empty contextualFooter.moreInItems}">
                <h4>${contextualFooter.moreInTranslatedText} ${contextualFooter.heroHeadline}</h4>
                <ul>
                    <c:forEach var="linkItem" items="${contextualFooter.moreInItems}">
                        <c:if test="${not fn:containsIgnoreCase(linkItem, currentPagePath)}">
                            <li>${linkItem}</li>
                        </c:if>   
                    </c:forEach>
                </ul>
            </c:if>
        </c:if>
    </div>
<!--ENDS FOOTER-->

<!-- Footer Corporate Links -->
<c:if test="${not empty contextualFooter.corporateLinks}">
    <div>
        <ul class="footer-corporate-links padding-left group">
            <c:forEach var="linkItem" items="${contextualFooter.corporateLinks}">
                <li>${linkItem}</li>
            </c:forEach>
        </ul>
    </div>
</c:if>
<!-- END Footer Corporate Links -->

<!-- Footer Utility Links -->
<c:if test="${not empty contextualFooter.utilityLinks}">
    <div>
        <ul class="sitemap-legal padding-left group">
            <c:set var="ipcText" value="${contextualFooter.IPCText}"></c:set>
        	<c:if test="${empty ipcText}">
            	<c:forEach var="linkItem" items="${contextualFooter.utilityLinks}" varStatus="index">
                	<li>${linkItem} ${!index.last ? '|' : ''}</li>
            	</c:forEach>
            </c:if>
        	<c:if test="${not empty ipcText}">
            	<c:forEach var="linkItem" items="${contextualFooter.utilityLinks}" varStatus="index">
                	<li>${linkItem} |</li>
            	</c:forEach>
            	<li class="icp-text">${ipcText}</li>
            </c:if>
        </ul>
    </div>
</c:if>
<!-- End Footer Utility Links -->

<!-- Copyright -->
<c:if test="${not empty contextualFooter.copyRightText}">
    <div>
        <p class="copyright padding-left">${contextualFooter.copyRightText}</p>
    </div>
</c:if>
<!-- End Copyright -->
