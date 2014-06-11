<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<c:set var="isMCLP"  value="${mcViewAllHelper.MCLP}"/>
 	<c:set var="taxonomyFacets" value="${viewAllBean.taxonomyFilters}" /> 

    <div class="facets taxonomy">
        <c:if test="${not empty taxonomyFacets}">
        <div class="help-container">
            <h3>${viewAll.filterByText}:</h3>
        </div>
        </c:if>
        <c:forEach var="taxonomyFacet" items="${taxonomyFacets}">
        <c:if  test="${not empty taxonomyFacet.childTags}">
            <div class="facet-container">
                <ul>
                    <h3>${taxonomyFacet.tagTitle}</h3>

                        
                        <c:forEach var="childTaxonomyFacet"
                        items="${taxonomyFacet.childTags}">
                            <c:choose>
                                <c:when test="${not empty childTaxonomyFacet.childTags}">
                                    <li class="parent-facet <c:out value='${childTaxonomyFacet.contentType}' />">
                                            <span class="expand" > </span>
                                </c:when>
                                <c:otherwise>
                                    <li class="parent-facet no-child <c:out value='${childTaxonomyFacet.contentType}' /> ">
                                </c:otherwise>
                            </c:choose>
                            <label> <input type="checkbox"
                                value="${childTaxonomyFacet.tagTitle}"
                                id="${childTaxonomyFacet.taxonomyText}">
                                <p>${childTaxonomyFacet.tagTitle}</p>
                            </label>
                            <c:if test="${not empty childTaxonomyFacet.childTags}">
                                <ul class="sub-facets">
                                    <c:forEach var="subchildTaxonomyFacet"
                                    items="${childTaxonomyFacet.childTags}">
                                        <li class="${subchildTaxonomyFacet.contentType}">
                                            <label><input type="checkbox"
                                            value="${subchildTaxonomyFacet.tagTitle}"
                                            id="${subchildTaxonomyFacet.taxonomyText}"
                                            parent="${childTaxonomyFacet.taxonomyText}">
                                            <p>${subchildTaxonomyFacet.tagTitle}</p></label></li>
                                    </c:forEach>
                                </ul>
                            </c:if>
                                </li>
                        </c:forEach>
                        
                </ul>
            <div class="expand-panel">
            	<a class="show-more-link" href="#" style="display: block;">${viewAll.showMoreText}</a><a class="show-less-link" href="#" style="display: none;">${viewAll.showLessText}</a>
            </div>
            </div></c:if>
            <!-- facet-container -->
        </c:forEach>
    </div>
    <!-- facets -->