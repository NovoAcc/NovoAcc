<c:forEach var="navPage" items="${mainnode.childPages }" varStatus="i">
	<c:choose>
		<c:when test="${navPage.landingPage }">
			<div class="landingPageLink">
				<a href="<c:out value="${navPage.linkURL }" escapeXml="true"/>.html" <c:if test="${navPage.newWindow}"> target="_blank"</c:if>><c:out value="${navPage.title }" escapeXml="true"/></a>
			</div>
		</c:when>
		<c:otherwise>
			<div class="products_services-col-${i.count}">
				<h3>${navPage.title }</h3>
                <ul class="sub_menu">
                    <c:forEach var="subPage" items="${navPage.childPages }" varStatus="k">
                        <li><a href="<c:out value="${subPage.linkURL }" escapeXml="true"/>.html" <c:if test="${subPage.newWindow}"> target="_blank"</c:if>><c:out value="${subPage.title}" escapeXml="true"/></a></li>
                    </c:forEach>
                </ul>
			</div>
		</c:otherwise>
	</c:choose>
</c:forEach>