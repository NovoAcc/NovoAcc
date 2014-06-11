<div class="facets content-types">
	<div class="facet-container">
		<h3>${viewAll.onlyShowMeText}:</h3>
		<ul>
			<c:forEach var="contentTypeFacet"
				items="${viewAllBean.contentTypesFacets}">
				<li><label> <input type="checkbox"
						value="${contentTypeFacet.contentValue}"
						id="${contentTypeFacet.contentKey}" name="content-type">
						<p>${contentTypeFacet.contentValue}</p>
				</label></li>
			</c:forEach>
		</ul>
		<br clear="all">
	</div>
	<!-- facet-container -->
</div>