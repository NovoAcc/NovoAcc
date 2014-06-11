<%--
  ==============================================================================

  Includes the scripts and css to be included in the head tag

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.tools.SubProductNavigation.*,com.dupont.phoenix.commons.Scene7Image"%>

<%
SubProductNavigation spn = new SubProductNavigation(resource, currentPage, slingRequest);
pageContext.setAttribute("spn",spn);
%>
<c:if test="${not empty spn.subProductPageList || spn.edit}">
<div class="subproduct_navigation_tool">

    <div class = "mobile-resultsLeftCol">
        <h3>${spn.showMe}</h3>
        <select id="primary-filter-select" data-mobilefiltername="${spn.primaryFilter.name}">
            <option value="All">
            <c:choose>
                <c:when test="${not empty spn.properties.alternateproductslabel}">
                   ${spn.all} ${spn.properties.alternateproductslabel}
                </c:when>
                <c:otherwise>
                   All Products
                </c:otherwise>
            </c:choose>
            </option>
            <c:forEach var="primaryOption" items="${spn.primaryFilter.children}">
                <option class="mobile-filter-option" value="${primaryOption.name}" data-descriptiontitle="${primaryOption.title} " data-description="${primaryOption.description}">
                    ${primaryOption.title} ({0})
                </option>
            </c:forEach>
        </select>
    </div>



    <div class="resultsLeftCol">
        <h3>${spn.showMe}</h3>
        <div class="showme">
            <ul>
                <li class="subproductArrow AllSubProducts">
                    <label><p>
                    <c:choose>
                       <c:when test="${not empty spn.properties.alternateproductslabel}">
                           ${spn.all} ${spn.properties.alternateproductslabel}
                       </c:when>
                       <c:otherwise>
                           All Products
                       </c:otherwise>
                   </c:choose>
                   </p></label>
                </li>
            </ul>
        </div>

        <div class="showme">
            <c:if test="${not empty spn.primaryFilter}">
            <ul data-filtername="${spn.primaryFilter.name}"">
                <h3 class="showtop">${spn.primaryFilter.title}</h3>

                <c:forEach var="primaryOption" items="${spn.primaryFilter.children}">
                    <li class="primary-filter-link subproductArrow" data-filter="${primaryOption.name}" data-descriptiontitle="${primaryOption.title} " data-description="${primaryOption.description}">
                        <label><p>${primaryOption.title} ({0})</p></label>
                    </li>
                </c:forEach>
            </ul>
            </c:if>
            <c:if test="${empty spn.primaryFilter}">
                <h3> No main filter set. Please edit tool and set a primary filter. Otherwise tool will not render in publish mode. </h3>
            </c:if>
        </div>
    </div>


    <div class="resultsRightCol top-pagination">
        <div class="page-item">

            <div id="SubProductCount"><span class="interval"></span> <span class="top-separator">${spn.of}</span> <span class="totalCount">{0}</span> ${not empty spn.properties.alternateproductslabel ? spn.properties.alternateproductslabel : 'Products' }</div>
            <c:if test="${not empty spn.subfilter1 || spn.properties.enablesort}">
                <div class="filters-wrapper">
                <c:if test="${not empty spn.subfilter1}">
                <div class="filters-left">
                    <span>${not empty spn.properties.filterslabel ? spn.properties.filterslabel : 'Filter By'}: </span>
                    <label class="subfilter1">
                        <select id="subfilter1" data-filtername="${spn.subfilter1.name}">
                            <option value="subfilter1-default">${spn.subfilter1.props.subfilter1defaultdropdowntext}</option>
                            <c:forEach var="option" items="${spn.subfilter1.children}">
                                <option value="${option.name}">${option.title}</option>
                            </c:forEach>
                        </select>
                    </label>
                    <c:if test="${not empty spn.subfilter2}">
                        <label class="subfilter2">
                            <select id="subfilter2" data-filtername="${spn.subfilter2.name}">
                                <option value="subfilter2-default">${spn.subfilter2.props.subfilter2defaultdropdowntext}</option>
                                <c:forEach var="option" items="${spn.subfilter2.children}">
                                    <option value="${option.name}">${option.title}</option>
                                </c:forEach>
                            </select>
                        </label>
                    </c:if>
                </div>
                </c:if>
                <c:if test="${spn.properties.enablesort}">
                    <div class="filters-right">
                        <span>${not empty spn.properties.sortlabel ? spn.properties.sortlabel : 'Sort By'}: </span>
                        <label class="sortby">
                            <select id="SortBy" data-filtername="Sort">
                                <option value="ascending">${not empty spn.properties.ascendingLabel ? spn.properties.ascendingLabel : 'Ascending'}</option>
                                <option value="descending">${not empty spn.properties.descendingLabel ? spn.properties.descendingLabel : 'Descending'}</option>
                                <option value="alpha">${spn.alphabetic}</option>
                            </select>
                        </label>
                    </div>
                </c:if>
                </div>
            </c:if>
            <c:if test="${empty spn.subfilter1 && spn.edit}">
                <div style="float: left;">If you want to add more filters you may do so by adding tags to the filters tag field on the configuration dialog.</div>
            </c:if>
            <div style="clear:both"></div>
        </div>

        <div id="SubProductThumbnails">

            <div id="primaryFilterDescription">
                <h2 id="descriptionTitle"></h2>
                <p id="description"></p>
            </div>

            <div id="noResults" style="display: none; min-height: 218px;">
                <span id="NoResultsMsg">${empty spn.properties.noproductsmessage ? "No products for the selected filter. " : spn.properties.noproductsmessage }
                    <a id="NoResultsMsgLink" class="AllSubProducts" href="javascript:void(0);">
                        <c:choose>
                            <c:when test="${not empty spn.properties.alternateproductslabel}">
                                ${spn.all} ${spn.properties.alternateproductslabel}
                            </c:when>
                            <c:otherwise>
                                All Products
                            </c:otherwise>
                        </c:choose>
                    </a>
                </span>
            </div>

            <c:forEach var="subProduct" items="${spn.subProductPageList}" varStatus="i">
                <div class="subproduct-box <c:forEach var="filter" items="${subProduct.pageFilterTags}">${filter.name} </c:forEach>" data-sortorder="${i.count}" data-sortName="${subProduct.name}">
                    <c:set var="image" value="${subProduct.subProductImage }"/>
                    <a class="color-link" href="${subProduct.url}.html"><%((Scene7Image)pageContext.getAttribute("image")).draw(out); %></a>
                    ${subProduct.href}
                </div>
            </c:forEach>
            <div style="clear:both"></div>
        </div>
        
        <div class="pagination-results">
        	<div class="result-number"><span class="interval"></span> ${spn.of} <span class="totalCount">{0}</span> ${not empty spn.properties.alternateproductslabel ? spn.properties.alternateproductslabel : 'Products' }</div>
	        	<div class="pagination-holder">															
				</div>
			<div class="mobile-pagination">
				<span class="page-information"> <span class="separator"> ${spn.of} </span> </span>
			</div>
        </div>
    </div>
    <cq:includeClientLib js="apps.dupont.tools.subproductnavigation"/>
    <div style="clear:both"></div>
</div>
</c:if>

