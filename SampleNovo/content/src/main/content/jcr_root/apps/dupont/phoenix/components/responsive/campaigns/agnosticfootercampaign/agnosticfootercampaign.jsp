<%--

  Agnostic Footer component.

  A component to display agnostic footer in pages.

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<mgs:controller var="footerHelper" cls="com.dupont.phoenix.campaigns.FooterCampaignHelper" />
<footer class="footer footer_agnostic">
	<div class="footer-left-col">
		<c:if test="${not empty footerHelper.copyRightText}">
			<!-- Copyright -->
			<div class="copyright">${footerHelper.copyRightText}</div>
			<!-- End Copyright -->
		</c:if>
	</div>
</footer>