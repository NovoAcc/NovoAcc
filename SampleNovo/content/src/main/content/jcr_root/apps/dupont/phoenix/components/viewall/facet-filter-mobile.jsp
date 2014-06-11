<div id="image-lightbox" class="search-results">
	<div class="wrapper">
		<div class="image-container">
			<div class="lightbox">
				<a id="close" href="javascript:void(0)"></a>
				<span>${viewAll.selectYourFilterText}:</span>
<c:set var="taxonomyFacets" value="${viewAllBean.taxonomyFilters}" /> 
<c:forEach var="taxonomyFacet" items="${taxonomyFacets}">
            <select>
					<option>${taxonomyFacet.tagTitle}</option>
                        <c:if  test="${not empty taxonomyFacet.childTags}">
                        <c:forEach var="childTaxonomyFacet"
                        items="${taxonomyFacet.childTags}">
						<option id="mobile-${childTaxonomyFacet.taxonomyText}" class="${childTaxonomyFacet.contentType}" value="${childTaxonomyFacet.tagTitle}">${childTaxonomyFacet.tagTitle}</option>
                            <c:if test="${not empty childTaxonomyFacet.childTags}">
                                <c:forEach var="subchildTaxonomyFacet"
                                    items="${childTaxonomyFacet.childTags}">
                                        <option id="mobile-${subchildTaxonomyFacet.taxonomyText}" class="${subchildTaxonomyFacet.contentType}" parent="${childTaxonomyFacet.taxonomyText}" value="${subchildTaxonomyFacet.tagTitle}">-${subchildTaxonomyFacet.tagTitle}</option>
                                    </c:forEach>
                               
                            </c:if>
                                
                        </c:forEach>
                        </c:if>
               <!-- facet-container -->
			   </select>
        </c:forEach>
		</div>
	</div>
</div>
</div>
