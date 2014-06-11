<span>${viewAll.onlyShowMeText}:</span>
		<select id="content-type">
        	<option id="mobile-all-content-type">${viewAll.allCotentTypesText}</option>
       <c:forEach var="contentTypeFacet" items="${viewAllBean.contentTypesFacets}">
            <option value="${contentTypeFacet.contentValue}" id="mobile-${contentTypeFacet.contentKey}">${contentTypeFacet.contentValue}</option>
        </c:forEach>    
       </select>
                                        
		

			
                                  