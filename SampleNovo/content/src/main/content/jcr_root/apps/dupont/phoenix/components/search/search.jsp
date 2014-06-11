<%
%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %><%
%><%@ page contentType="text/html; charset=utf-8" import="com.day.cq.i18n.I18n"%>
<%@ page import="com.dupont.phoenix.commons.Search"%>
<% //final I18n i18n = new I18n(slingRequest); %>
    <script>
    //remove Item from session storage for S&P
		sessionStorage.removeItem("PATH");
    </script>
<%
	Search search = new Search(slingRequest,currentPage,currentDesign);
	pageContext.setAttribute("search",search);
%>

<!-- Site Search -->
<div id="site-search" class="group">
    <div class="site-search">
        <form id="HeaderSearchForm" action="${search.extSearchURL}.html" method="get" name="searchForm" onsubmit="return submitHeaderSearch();">
            <input id="ss" name="ss" type="hidden" value=""/>
            <input name="site" type="hidden" value="${search.siteCountry }" />
            <!--
            <input name="client" type="hidden" value="${search.searchCountryLangCombo }" />
			-->
            <input name="output" type="hidden" value="xml_no_dtd" />
            <!--
            <input name="proxystylesheet" type="hidden" value="${search.searchCountryLangCombo}" />
			-->
            <input class="site-search-box" type="text" value="${search.searchWatermark }"  name="q" onblur="if (this.value=='')this.value=this.defaultValue;" onfocus="if (this.value==this.defaultValue) this.value='';"  />
            <input id="SiteSearch_SiteSearch2Button" class="site-search-button" type="submit" value="" name="SiteSearch_SiteSearch2Button" />
        </form>
    </div>
</div>
