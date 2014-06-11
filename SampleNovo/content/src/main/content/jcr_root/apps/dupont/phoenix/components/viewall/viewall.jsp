<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%

		ValueMap props = currentPage.getProperties();
		String template = props.get("cq:template", String.class);
 %>
<%
if(template.contains("responsive")){%>

<mgs:controller var="viewAllHelper"	cls="com.dupont.phoenix.hlm.viewall.ViewAllHelper" />
<c:set var="isMCLP" scope="page" value="${viewAllHelper.MCLP}" />
<c:set var="resource" scope="page" value="${viewAllHelper.resource}" />
<cq:includeClientLib categories="dupont.viewall"/>
<c:choose>
			<c:when test="${isMCLP}">
				<mgs:controller var="viewAll" cls="com.dupont.phoenix.mchlm.viewall.MCViewAllHelper" />
				<c:set var="viewAllBean" scope="page" value="${viewAll.mcViewAllBean}" />
				<script>
				    var contentTypeTags = ${viewAllBean.preFilterContentTypes};
				</script>
			</c:when>
			<c:otherwise>
			    <mgs:controller var="viewAll" cls="com.dupont.phoenix.hlm.viewall.ViewAll" />
				<c:set var="viewAllBean" scope="page" value="${viewAll.viewAllBean}" />
				<script>
				    var contentTypeTags = [];
				</script>
			</c:otherwise>
		</c:choose>
<script>
	var defaultPageResults = 30;
    var preloadImagePages = 3;
	var taxonomyTags = [];
</script>


<script>
    var sitecatVal = '${viewAllBean.sitecatalystValue}';
    var resourceType = '${resource.resourceType}';
    var ofText = '${viewAll.ofText}';
</script>
<section id="intro" class="group view-all search-results" >

    <%@ include file="facet-filter-mobile.jsp"%>
	<div id="media-center-index" class="search-results">
        <div class="mobile-search-results browse-by">
            <div>
                <c:if test="${isMCLP}">
                    <%@ include file="contenttype-filter-mobile.jsp"%>
                </c:if>
                <div id="launch-filter"><span>${viewAll.addFilterText}</span></div>
            </div>
        </div><!-- browse-by -->
        <div class="mobile-your-filters selected-facets"></div> 
		<c:if test="${isMCLP}">
        <div class="facets content-types">
                                  <%@ include file="contenttype-filter.jsp"%>
                           </div>
       </c:if>
		<div id="search-results-wrapper" class="grid">
			<div class="one-third column">
				<%@ include file="facet-filter.jsp"%>
			</div>
			<div class="two-thirds column">
				<section style="border-bottom: none;">
					<div class="showing-results">
						<div class="result-number">
							<span class="current-results">${viewAll.ofText}</span> <span
								class="total-results"></span> ${viewAll.resultsText}<a
								href="#" onclick="showAllResults(true,this)" class="pagination-show-all">${viewAll.showAllText}</a><a
								href="#" onclick="showAllResults(false,this)"
								style="display: none"  class="pagination-show-less">${viewAll.showLessText}</a>
						</div>
						<div class="pagination top ">
                            <div class="prev"></div>
                            <span style="color: #474747;">1</span> 2 3 4 5
                            <div class="next"></div>
                        </div>
						<div class="sort-wrapper">
							<div class="grid-list-wrapper">
								<label>${viewAll.viewText}:</label><a href="#">
								<!-- <div class="grid-list" onclick="toggleView(this)"></div> -->
									<div class="data-grid-view"></div>
	                                <div class="data-list-view"></div>
								</a>
							</div>
							<!-- grid-list-wrapper -->
						</div>
						<!-- sort-wrapper -->
						<br clear="all">
					</div><!-- showing-results -->
						<!-- <div class="hide-images"></div> -->
				</section>

				<div class="your-filters selected-facets"></div>
				<div class="mobile-results-list">
					<%@ include file="viewall-results.jsp" %>
				</div>
				<!-- mobile-results -->
                <div id="no-results-text">
                    ${viewAll.noResultsText}
                </div>
				<br clear="all">
				<div class="showing-results bottom">
					<div class="result-number">
						<span class="current-results">${viewAll.ofText}</span> <span
							class="total-results"></span> ${viewAll.resultsText}
                        	<a
								href="#" onclick="showAllResults(true,this)" class="pagination-show-all">${viewAll.showAllText}</a><a
								href="#" onclick="showAllResults(false,this)"
								style="display: none"  class="pagination-show-less">${viewAll.showLessText}</a>
					</div>
					<div class="pagination">
						<div class="prev"></div>
						<span style="color: #474747;">1</span> 2 3 4 5
						<div class="next"></div>
					</div>
					<!--<div class="mobile-pagination"></div>-->
					 <div class="mobile-bg-pagination">
                        <div class="mb-prev-image"></div>
                        <div class="select-style">
                          <select id="mobile-pagination-dropdown">
                           <option>1 to 10</option>
                            <option>10 to 20</option>
                            <option>20 to 30</option>
                            <option>30 to 40</option>
                            <option>40 to 50</option>
                          </select>
                        </div>
                        <div class="mb-next-image"></div>
                    </div>
				</div>
				<!-- showing-results bottom -->
			</div>
		</div>
	</div>
</section>

<%}else{%>
<%@ include file="viewall-legend.jsp"%>

<%}
%>
