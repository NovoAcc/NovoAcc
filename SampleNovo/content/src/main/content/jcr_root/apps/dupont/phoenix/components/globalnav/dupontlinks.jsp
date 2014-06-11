<c:forEach var="navPage" items="${mainnode.childPages }" varStatus="j">
	<c:choose>
		<c:when test="${navPage.landingPage }">
			<div class="landingPageLink">
				<a href="<c:out value="${navPage.linkURL }" escapeXml="true"/>.html" <c:if test="${navPage.newWindow}"> target="_blank"</c:if>><c:out value="${navPage.title }" escapeXml="true"/></a>
			</div>
		</c:when>
		<c:otherwise>
			
			<c:if test="${j.index == 0 }">
				<ul class="sub_menu">
			</c:if>

			<li>
				<a href="<c:out value="${navPage.linkURL }" escapeXml="true"/>" <c:if test="${navPage.newWindow}"> target="_blank"</c:if>><c:out value="${navPage.title }" escapeXml="true"/></a>
			</li>

			<c:if test="${mainnode.childPages[j.count].landingPage || j.count == fn:length(mainnode.childPages)}">
				</ul>
			</c:if>
			
		</c:otherwise>
	</c:choose>
</c:forEach>
