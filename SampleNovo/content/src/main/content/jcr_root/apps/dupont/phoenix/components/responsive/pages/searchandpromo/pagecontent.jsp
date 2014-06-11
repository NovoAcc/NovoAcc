<%--
  ==============================================================================

  All Segment Templates should provide row content within pagecontent.jsp file.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%
    boolean isOnlyMeON = false;
	boolean isFacetON = false;
	boolean isBreadcrumbsON = false;

%>

        <div id="main-container">
            <div id="errorMsg"></div>

            <!-- Search and Promote -->

            <section class="search-results">
				<!--S&P Serachbox component -->
                <div class="search-header">
                           <cq:include path="searchbox" resourceType="dupont/phoenix/components/responsive/searchpromo/searchbox" />
                </div>
                <!--S&P Serachbox component -->
                <%if(isOnlyMeON){%>
                <div class="search-only-show-me">
                    <div class="search-section-title">Only Show Me:</div>
                    <ul>
                        <li><input name="example" value="example-value" type="checkbox"><label>Information &amp; Ideas</label></li>
                        <li><input name="example" value="example-value" type="checkbox"><label>Case Studies</label></li>
                        <li><input name="example" value="example-value" type="checkbox"><label>Uses &amp; Applications</label></li>
                        <li><input name="example" value="example-value" type="checkbox"><label>New Releases</label></li>
                        <li><input name="example" value="example-value" type="checkbox"><label>Multimedia</label></li>
                        <li><input name="example" value="example-value" type="checkbox"><label>Project Specs &amp; Publications</label></li>
                    </ul>
                </div>
                <%}if(isFacetON){%>
<div class="search-left-col">
                    <div class="search-left-col-title">Filter your results:</div>
                    <div class="search-left-col-filter">
                        <div class="search-section-title">Industries</div>
                        <ul>
                            <li><input name="example" value="example-value" type="checkbox"><label>Industry A (124)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Industry E (82)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Industry C (61)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Industry B (29)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Industry D (10)</label></li>
                        </ul>
                    </div>

                    <div class="search-left-col-filter">
                        <div class="search-section-title">Product &amp; Service Categories</div>
                        <ul>
                            <li class="search-dropdown">
                                <input name="example" value="example-value" type="checkbox">
                                <label>Product &amp; Service (124)</label>
                                <ul>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service 1 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service 2 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service 3 (29)</label>
                                    </li>
                                </ul>
                            </li>
                            <li class="search-dropdown">
                                <input name="example" value="example-value" type="checkbox">
                                <label>Product &amp; Service Category B (82)</label>
                                <ul>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service B1 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service B2 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service B3 (29)</label>
                                    </li>
                                </ul>
                            </li>
                            <li class="search-dropdown">
                                <input name="example" value="example-value" type="checkbox">
                                <label>Product &amp; Service Category C (61)</label>
                                <ul>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service C1 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service C2 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service C3 (29)</label>
                                    </li>
                                </ul>
                            </li>
                            <li class="search-dropdown">
                                <input name="example" value="example-value" type="checkbox">
                                <label>Product &amp; Service Category D (29)</label>
                                <ul>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service D1 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service D2 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service D3 (29)</label>
                                    </li>
                                </ul>
                            </li>
                            <li class="search-dropdown">
                                <input name="example" value="example-value" type="checkbox">
                                <label>Product &amp; Service Category E (10)</label>
                                <ul>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service E1 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service E2 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service E3 (29)</label>
                                    </li>
                                </ul>
                            </li>
                            <li class="search-dropdown">
                                <input name="example" value="example-value" type="checkbox">
                                <label>Product &amp; Service Category F (1700)</label>
                                <ul>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service F1 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service F2 (29)</label>
                                    </li>
                                    <li>
                                        <input name="example" value="example-value" type="checkbox">
                                        <label>Product &amp; Service F3 (29)</label>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div class="search-left-col-filter">
                        <div class="search-section-title">Brands</div>
                        <ul>
                            <li><input name="example" value="example-value" type="checkbox"><label>Brand A (124)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Brand B (82)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Brand C (61)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Brand D (29)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Brand E (10)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Brand F (1700)</label></li>
                        </ul>
                    </div>

                    <div class="search-left-col-filter">
                        <div class="search-section-title">Products &amp; Services</div>
                        <ul>
                            <li><input name="example" value="example-value" type="checkbox"><label>Products &amp; Service A (124)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Products &amp; Service B (82)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Products &amp; Service C (61)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Products &amp; Service D (29)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Products &amp; Service E (10)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Products &amp; Service F (1700)</label></li>
                        </ul>
                    </div>

                    <div class="search-left-col-filter">
                        <div class="search-section-title">Products &amp; Services</div>
                        <ul>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge A (124)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge B (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge C (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge D (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge E (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge F (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge G (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge H (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge I (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge J (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge K (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge L (1700)</label></li>
                            <li><input name="example" value="example-value" type="checkbox"><label>Global Challenge M (1700)</label></li>
                        </ul>
                        <div class="show-more">Show More</div>
                    </div>

                </div>
                <%}%>
                <div class="search-right-col">

                    <!-- Search Results ~ Right Column Header-->


                    <cq:include path="sp-pagination" resourceType="dupont/phoenix/components/responsive/searchpromo/menus"/>


                    <span class="p"></span>
                    <!-- End Search Results ~ Right Column Header -->

                    <!-- Search Results ~ Search Filters -->
                    <%if(isBreadcrumbsON){%>
                    <div class="search-filters">
                        <div class="filter">Product &amp; Service Line E3 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png"></div>
                        <div class="filter">Product &amp; Service Line E2 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Brand H <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Product &amp; Service Line E3 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Product &amp; Service Line E2 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Brand H <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Product &amp; Service Line E3 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Product &amp; Service Line E2 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Brand H <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Product &amp; Service Line E3 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Product &amp; Service Line E2 <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                        <div class="filter">Brand H <img src="/apps/mdi-searchpromo/widgets/images/close-white.png""></div>
                    </div>
					<%}%>
                    <!-- End Search Results ~ Search Filters -->

                    <!-- Search Results -->
                    <cq:include path="searchResults" resourceType="dupont/phoenix/components/responsive/searchpromo/searchresults"/>

						<cq:include path="pagination" resourceType="dupont/phoenix/components/responsive/searchpromo/pagination"/>


					<!-- End Search Results -->
                    <!-- Search Results ~ Pagination -->


					
                    <!-- End Search Results ~ Pagination -->

                </div>

            </section>

            <!-- End Search and Promote -->

        </div>
        <!-- End Main container -->
