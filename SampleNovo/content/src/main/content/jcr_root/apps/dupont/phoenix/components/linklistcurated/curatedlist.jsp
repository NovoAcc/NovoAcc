<div class="quick_links">
	<c:if test="${listTitle != null}">
		<div class="sidebar_title"><%=xssAPI.encodeForHTML(listTile_Lang)%></div>
	</c:if>
	<c:if test="${listTitle == null}">
		<div class="sidebar_title"><%=xssAPI.encodeForHTML(Global.getTranslatedText(currentPage, slingRequest, "Curated Links"))%></div>
	</c:if>
	<c:if test="${(shortDesc != null)&&(size <= 3)}">
        <p class="description">${shortDesc}</p>
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
