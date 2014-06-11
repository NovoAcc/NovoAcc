<div class="quick_links corporate">
	<c:if test="${listTitle != null}">
		<h2><%=xssAPI.encodeForHTML(listTile_Lang)%></h2>
	</c:if>
	<c:if test="${listTitle == null}">
		<h2><%=xssAPI.encodeForHTML(Global.getTranslatedText(currentPage, slingRequest, "Quick Links"))%></h2>
	</c:if>
	<c:if test="${(shortDesc != null)&&(size <= 3)}">
		<h2 class="description">${shortDesc}</h2>
	</c:if>
	<ul>
		<c:forEach var="linkItem" items="<%= list %>">
			<c:if test="${linkItem.newWindow == 'true'}">
				<c:set var="target" value="_blank"></c:set>
			</c:if>
			<c:if test="${linkItem.newWindow == 'false'}">
				<c:set var="target" value="_self"></c:set>
			</c:if>
      <li>
      <a href="${linkItem.linkURL}" target="${target}"> <c:out value="${linkItem.linkText}" escapeXml="true"/> </a>

			</li>
		</c:forEach>
	</ul>
</div>
