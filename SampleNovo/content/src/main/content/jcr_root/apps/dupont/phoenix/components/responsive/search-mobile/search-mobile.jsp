<%
%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page contentType="text/html; charset=utf-8" import="com.day.cq.i18n.I18n"%>
<%@ page import="com.dupont.phoenix.commons.Search"%>
<% //final I18n i18n = new I18n(slingRequest); %>
<%  %>
<script>
    //remove Item from session storage for S&P and Fix for Forbidden 403 issue.
		sessionStorage.removeItem("PATH");
    </script>
<%
	Search searchmobile = new Search(slingRequest,currentPage,currentDesign);
	pageContext.setAttribute("searchmobile",searchmobile);
%>

<!-- Site Search for Mobile -->
<nav class="mobile-search-bar">
    <div class="search-container">
        <div class="mobile-search-wrapper">
        	<form id="HeaderSearchForm" action="${searchmobile.extSearchURL}.html" method="get" name="searchForm" onsubmit="return submitHeaderSearch();">
	            <input id="ss" name="ss" type="hidden" value=""/>
	            <input name="site" type="hidden" value="${searchmobile.siteCountry }" />
	            <input name="output" type="hidden" value="xml_no_dtd" />
	            <input type="text" class="mobile-search" value="${searchmobile.searchWatermark }" name="q" onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';">
	            <input class="mobile-search-button" id="SiteSearch_SiteSearch2Button" type="submit" value="" name="SiteSearch_SiteSearch2Button" />
            </form>
        </div>
        <br clear="all"/>
    </div>
</nav>
