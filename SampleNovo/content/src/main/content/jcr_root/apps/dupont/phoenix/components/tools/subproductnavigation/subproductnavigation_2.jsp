<%--

  BI Color test tool component.

  Testing the CQ driven version of the sub product navigation

--%><%
 
%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.Global, com.dupont.phoenix.tools.SubProductNavigation.*"%>

<%


SubProductList list = new SubProductList(resource, currentPage, slingRequest);
pageContext.setAttribute("colorList", list);


%>

<a name="aBackToTop"></a>
    <div id="BICarousel" data-countrycode="en_us" data-product="corian">
        <div class="resultsMainContent">
            <div class="resultsLeftCol">
                    <h3 class="label" id="ShowMe">Show me:</h3>
                    <div class="showme">
                        <a class="AllColors" href="javascript:void(0)"><div style="display: none;" class="collectionArrow"></div>
                        <h3 id="AllColors" style="text-transform: none; margin-top: -2px;" class="label selectedFacets">All Colors</h3></a>
                    </div>
                    <div class="showme">
                        <span id="Collections" class="showtop">Collections</span>
                        <ul id="CollectionsList">
							<c:forEach var="filter" items="${colorList.primaryFilter}" >
				            	<li>
				            		<div class="collectionArrow"></div>
				                    <a href="javascript:void(0)" class="collections-link" data-collection="${filter.properties.key}" data-descriptiontitle="${filter.title}" data-description="${filter.description}"><c:out value="${filter.properties.value}" /></a>
				                </li>
			                </c:forEach>
                        </ul>
                    </div>
                </div>
            <!-- Top Pagination -->
            <div style="visibility:visible;" class="resultsRightCol top-pagination">
                    <div id="ColorsCount"></div>
                    <div class="page-item">
                            <div class="left-item">
                            <div id="Filter" class="label"> Filter By:</div>
                            	<div class="left-item1">
                            <select id="PriceGroupSelect">
                            	<option value="all-prices">All Price Groups</option>
                            	<c:forEach var="filter" items="${colorList.secondaryFilter2}" >
					            	<option value="${filter.properties.key}">
					                    <c:out value="${filter.properties.value}" />
					                </option>
				                </c:forEach>
                            </select>
                        		</div>
                             	<div class="left-item2">
								<select id="HuesSelect">
									<option value="all-hues">All Hues</option> 
									<c:forEach var="filter" items="${colorList.secondaryFilter1}" >
						            	<option value="${filter.properties.key}">
					                    	<c:out value="${filter.properties.value}" />
						                </option>
					                </c:forEach>
				               	</select>
                        		</div>
                        	</div>
                            <div class="right-item">
                            <div id="Sort" class="label">Sort By:</div>
                            <select id="SortBy"></select>
                        </div>
                        </div> <!-- End top-pagination -->  
                    <div class="clear"> </div>       
                </div>
            <div id="collectionDescription">
                <span id="descriptionTitle"></span><br>
                <span id="description"></span>
            </div>
            <div id="noResults" style="display: none; min-height: 218px;">
                <span id="NoResultsMsg">There are no colors matching the filters you've selected. Please try a different filter combination or view </span>
                <a id="NoResultsMsgLink" class="AllColors" href="javascript:void(0);">All Colors</a>.
            </div>
            <div id="ColorThumbnails" class="resultsRightCol">
            	<c:forEach var="color" items="${colorList.subproducts}" >
	            	<div class="color-box ${color.tags}" data-sortOrder="${color.sortOrder}" data-sortName="${color.name}" data-priceGroup="{7}">
	                    <a class="color-link" href="${color.url}">
	                        <%
								SubProduct myVariable = (SubProduct)pageContext.getAttribute("color");
								if(myVariable.getThumbnail() != null){
									myVariable.getThumbnail().draw(out);
					            }
							%>
	                    </a>
						<a class="cta-arrow-link color-link" href="${color.url}"><c:out value="${color.name}" /></a>
	                </div>
                </c:forEach>
            </div>
            <a id="backToTop" href="javascript:void(0);"><span id="backToTopText">Back To Top</span>
                <img src="/etc/designs/dupont/tools/bicolor_colorselector/source/images/hidearrow.png">
            </a>
        </div>
    </div>
<cq:includeClientLib categories="apps.dupont.tools.colorselector"/>
<div style="clear:both"></div>
