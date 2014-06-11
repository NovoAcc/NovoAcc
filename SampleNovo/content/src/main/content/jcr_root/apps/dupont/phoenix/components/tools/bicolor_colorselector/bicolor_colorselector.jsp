<%--
  ==============================================================================

  Includes the scripts and css to be included in the head tag

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.Global,org.apache.commons.lang.StringUtils"%><% 
%><a name="aBackToTop"></a>
    <div id="BICarousel" data-countrycode="<%=StringUtils.lowerCase(Global.getLangCountryCode(currentPage))%>" data-product="${properties.productName }">
        <div class="resultsMainContent">
            <div class="resultsLeftCol">
                    <h3 class="label" id="ShowMe"></h3>
                    <div class="showme">
                        <a class="AllColors" href="javascript:void(0)"><div style="display: none;" class="collectionArrow"></div>
                        <h3 id="AllColors" style="text-transform: none; margin-top: -2px;" class="label selectedFacets"></h3></a>
                    </div>
                    <div class="showme">
                        <span id="Collections" class="showtop"></span>
                        <ul id="CollectionsList"></ul>
                    </div>
                </div>
            <!-- Top Pagination -->
            <div style="visibility:visible;" class="resultsRightCol top-pagination">
                    <div id="ColorsCount"></div>
                    <div class="page-item">
                            <div class="left-item">
                            <div id="Filter" class="label"></div>
                                    <div class="left-item1">
                            <select id="PriceGroupSelect"></select>
                                        </div>
                                     <div class="left-item2">
                                                        <select id="HuesSelect"></select>
                                        </div>
                                </div>
                            <div class="right-item">
                            <div id="Sort" class="label"></div>
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
                <span id="NoResultsMsg"></span>
                <a id="NoResultsMsgLink" class="AllColors" href="javascript:void(0);"> </a>.
            </div>
            <div id="ColorThumbnails" class="resultsRightCol"></div>
            <a id="backToTop" href="javascript:void(0);"><span id="backToTopText"></span>
                <img src="/etc/designs/dupont/tools/bicolor_colorselector/source/images/hidearrow.png">
            </a>
        </div>
    </div>
<cq:includeClientLib categories="apps.dupont.tools.colorselector"/>
<div style="clear:both"></div>