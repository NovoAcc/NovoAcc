<%--

  Agnostic Footer component.

  A component to display agnostic footer in pages.

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<mgs:controller var="footerHelper" cls="com.dupont.phoenix.footer.FooterHelper" />
<c:set var="corpList" value="${footerHelper.corporateLinks}"/>
<c:set var="utilityList" value="${footerHelper.utilityLinks}"/>
<c:set var="lastItem" value="no-margin-right"/>

<footer class="footer footer_agnostic">
	<div class="footer-left-col">
		<!-- Corporate Links -->
		<c:set var="length" value="${fn:length(corpList)}"></c:set>
		<c:set var="lastItemCls" value="${lastItem}"></c:set>
		<c:if test="${length > 0}">
			<ul class="agnostic-footer-corporate-links">
				<c:forEach var="linkItem" items="${corpList}" varStatus="index">
					<c:choose>
						<c:when test="${index.last}">
							<li class=${lastItemCls}>${linkItem}</li>
						</c:when>
						<c:otherwise>
							<li>${linkItem}</li>
						</c:otherwise>
					</c:choose>
				</c:forEach>
		    <div style="clear:both"></div>
			</ul>
		</c:if>
		<!-- End Corporate Links -->

		<!-- Social Media Channels-->
		<cq:include path="socialchannels_footer" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_footer" />
		<!-- End Social Media Channels -->

		<!-- Utility Links -->
		<c:set var="length" value="${fn:length(utilityList)}"></c:set>
		<c:if test="${length > 0}">
            <c:set var="ipcText" value="${footerHelper.IPCText}"></c:set>
			<div class="agnostic-footer-utlity-links-wrap">
				<ul class="agnostic-footer-utility-links">
					<c:if test="${empty ipcText}" >
					<c:forEach var="linkItem" items="${utilityList}"
							varStatus="index">
							<li>${linkItem} ${!index.last ? '|' : ''}</li>
						</c:forEach>
					</c:if>
					<c:if test="${not empty ipcText}" >
					<c:forEach var="linkItem" items="${utilityList}"
							varStatus="index">
							<li>${linkItem} |</li>
						</c:forEach>
						<li class="icp-text">${ipcText}</li>
					</c:if>
				</ul>
			</div>
		</c:if>
		<!-- End Utility Links -->
        <c:set var="copyrightText" value="${footerHelper.copyRightText}"></c:set>
		<c:if test="${not empty copyrightText}">
			<!-- Copyright -->
			<div class="copyright">${copyrightText}</div>
			<!-- End Copyright -->
		</c:if>
	</div>
</footer>
