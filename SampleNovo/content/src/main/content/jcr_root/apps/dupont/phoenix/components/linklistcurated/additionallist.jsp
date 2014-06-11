<div class="vertical_list_module">
	<c:if test="${listTitle != null}">
		<div class="sidebar_title"><%=xssAPI.encodeForHTML(listTile_Lang)%></div>
	</c:if>
	<c:if test="${listTitle == null}">
		<div class="sidebar_title"><%=xssAPI.encodeForHTML(Global.getTranslatedText(currentPage, slingRequest, "Additional Links"))%></div>
	</c:if>
	<c:if test="${(shortDesc != null)&&(size <= 3)}">
		<p class="description">${shortDesc}</p>
	</c:if>
	<ul>
		<c:forEach var="linkItem" items="<%= list %>">
			<c:if test="${linkItem.newWindow == 'true'}">
				<c:set var="target" value="_blank"></c:set>
				<c:set var="imgClass" value="external-link"></c:set>
			</c:if>
			<c:if test="${linkItem.newWindow == 'false'}">
				<c:set var="target" value="_self"></c:set>
			</c:if>
			<li>

                        <h2>  
         <a href="${linkItem.linkURL}" target="${target}"><c:out value="${linkItem.linkTextWithoutLastWord}" escapeXml="true"/> 
						<span class="no-wrap"><c:out value="${linkItem.linkTextLastWord}" escapeXml="true"/><img
							class="cta-arrow"
							src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span>
					</a>
				</h2>
			</li>
		</c:forEach>
	</ul>
</div>

