<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<mgs:controller var="contextualFooter" cls="com.dupont.phoenix.footer.ContextualFooter" />
<div style="clear:both"></div>
<!--Helpful Links-->
<cq:include path="helpfullinks" resourceType="/apps/dupont/phoenix/components/responsive/helpfullinks" />
<!--END Helpful Links-->

<!--STARTS FOOTER-->
<%
String currentPagePath = currentPage.getPath();
%>
<c:set var="currentPagePath" value="<%=currentPagePath%>" />
<footer class="footer footer_contextual">
    <div class="footer-left-col">
        <div class="group">
            <cq:include path="breadcrumb" resourceType="/apps/dupont/phoenix/components/breadcrumb" />
            <cq:include path="breadcrumb-mobile" resourceType="/apps/dupont/phoenix/components/responsive/breadcrumb-mobile" /> 
        </div>
        <c:if test="${contextualFooter.moreInEnabled}">
            <c:if test="${ not empty contextualFooter.moreInItems}">
                <div class="footer-more-in">
                    <h4>${contextualFooter.moreInTranslatedText} ${contextualFooter.heroHeadline}</h4>
                    <ul>
                        <c:forEach var="linkItem" items="${contextualFooter.moreInItems}">
                            <c:if test="${not fn:containsIgnoreCase(linkItem, currentPagePath)}">
                                <li>${linkItem}</li>
                            </c:if>
                        </c:forEach>
                    </ul>
                </div>
            </c:if>
            <!-- Responsive ~ More In for mobile... -->
            <cq:include script="moreinlinks-mobile.jsp"/>
            <!-- End Responsive ~ More In for mobile... -->
        </c:if>
    </div>
    <div style="clear:both"></div>
</footer>

<!-- Footer Corporate Links -->
<c:if test="${not empty contextualFooter.corporateLinks}">
    <ul class="footer-corporate-links group">
        <c:forEach var="linkItem" items="${contextualFooter.corporateLinks}">
            <li>${linkItem}</li>
        </c:forEach>
    </ul>
</c:if>
<!-- END Footer Corporate Links -->

<!-- Footer Utility Links -->
<c:if test="${not empty contextualFooter.utilityLinks}">
   <c:set var="ipcText" value="${contextualFooter.IPCText}"></c:set>
    <ul class="sitemap-legal group">
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
</c:if>
<!-- End Footer Utility Links -->

<!-- Copyright -->
<c:if test="${not empty contextualFooter.copyRightText}">
    <p class="copyright">${contextualFooter.copyRightText}</p>
</c:if>
<!-- End Copyright -->
