<%--

  Secondary Navigation(Hero Subnav) component.

  A component to display secondary navigation links for the current page. It lists all the child pages to the current page.

--%>
<%
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page
	import="java.util.*,com.dupont.phoenix.SubNavHelper,org.apache.commons.lang.StringUtils,com.dupont.phoenix.Global,
	com.day.cq.wcm.api.WCMMode,
	org.apache.commons.lang.StringUtils"%>
<%
%><%@page session="false"%>
<%
%>
<%
    SubNavHelper subNavHelper = new SubNavHelper(slingRequest, currentPage, resource);
    List<String> list = subNavHelper.getSubNavigationItems() ;
    int size = list.size();
    int firstColumnLength = (size/3)+((size%3)/2)+(size%3%2);
    int secondColumntLength = (size/3)+((size%3)/2);
    int thirdColumnLength = (size/3);
    int firstColumnStartIndex = 0;
    int firstColumnEndIndex = firstColumnLength - 1;
    int secondColumnStartIndex = firstColumnEndIndex + 1;
    int secondColumnEndIndex = secondColumnStartIndex  + secondColumntLength - 1 ;
    int thirdColumnStartIndex = secondColumnEndIndex + 1;
    int thirdColumnEndIndex = size - 1;
    String backgroundStyle = StringUtils.EMPTY;
    String heroColor = "9d3e04";
    String pageTitle= "";
    if (null != pageProperties.get("heroColor")) {
        heroColor = pageProperties.get("heroColor").toString();
    }
    backgroundStyle = "background-color: #" +heroColor  + ";";
	boolean editMode = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
    
    boolean ishiddenPages = subNavHelper.Ispageshidden();
    String pagesHidden = subNavHelper.PagesHidden();

    //Read The page title
    if (null != currentPage.getTitle()){
       pageTitle= currentPage.getTitle();
    }
%>
<c:set var="length" value="<%=size%>"></c:set>
<c:set var="firstColumnStartIndex" value="<%=firstColumnStartIndex %>"></c:set>
<c:set var="firstColumnEndIndex" value="<%=firstColumnEndIndex%>"></c:set>
<c:set var="secondColumnStartIndex" value="<%=secondColumnStartIndex%>"></c:set>
<c:set var="secondColumnEndIndex" value="<%=secondColumnEndIndex %>"></c:set>
<c:set var="thirdColumnStartIndex" value="<%=thirdColumnStartIndex%>"></c:set>
<c:set var="thirdColumnEndIndex" value="<%=thirdColumnEndIndex%>"></c:set>
<c:set var="lastItemCls" value="no-margin"></c:set>
<c:set var="bgStyle" value="<%=backgroundStyle %>"></c:set>

<c:set var="editMode" value="<%=editMode%>"></c:set>
<c:set var="ishiddenPages" value="<%=ishiddenPages %>"></c:set>
<c:set var="pagesHidden" value="<%=pagesHidden %>"></c:set>

<c:if test="${length > 0}">
	<section class="sub_navigation" style="${bgStyle}">
		<ul class="column first">
			<c:forEach var="linkItem" items="<%= list%>"
				begin="${firstColumnStartIndex}" end="${firstColumnEndIndex}"
				varStatus="index">

				<c:choose>
					<c:when test="${index.last}">
						<li class=${lastItemCls}>${linkItem}</li>
					</c:when>
					<c:otherwise>
						<li>${linkItem}</li>
					</c:otherwise>
				</c:choose>
			</c:forEach>
		</ul>
		<ul class="column">
			<c:forEach var="linkItem" items="<%= list%>"
				begin="${secondColumnStartIndex}" end="${secondColumnEndIndex}"
				varStatus="index">
				<c:choose>
					<c:when test="${index.last}">
						<li class=${lastItemCls}>${linkItem}</li>
					</c:when>
					<c:otherwise>
						<li>${linkItem}</li>
					</c:otherwise>
				</c:choose>
			</c:forEach>
		</ul>
		<ul class="column last">
			<c:forEach var="linkItem" items="<%= list%>"
				begin="${thirdColumnStartIndex}" end="${thirdColumnEndIndex}"
				varStatus="index">
				<c:choose>
					<c:when test="${index.last}">
						<li class=${lastItemCls}>${linkItem}</li>
					</c:when>
					<c:otherwise>
						<li>${linkItem}</li>
					</c:otherwise>
				</c:choose>
			</c:forEach>
		</ul>
		<ul class="column mobile">
			<li><a href="" id="view-all-categories"><%=Global.getTranslatedText(currentPage, slingRequest, "View All Product Categories")%></a></li>
		</ul>
	</section>

	<section class="sub_navigation_mobile">
		<div class="list">
			<div class="headline" style="${bgStyle}">
				<a class="back-categories" href="javascript:void(0)">&lt; <%=Global.getTranslatedText(currentPage, slingRequest, "back")%></a>
				<h1 class="<%= StringUtils.lowerCase(Global.getCountryCode(currentPage)) %>"><%= pageTitle %> </h1>
			</div>
			<div class="categories-container" style="${bgStyle}">
				<ul>
					<c:forEach var="linkItem" items="<%= list%>" begin="${firstColumnStartIndex}" 
					end="${firstColumnEndIndex}" varStatus="index">
						<li>${linkItem}</li>
					</c:forEach>
					<c:forEach var="linkItem" items="<%= list%>" begin="${secondColumnStartIndex}" 
					end="${secondColumnEndIndex}" varStatus="index">
						<li>${linkItem}</li>
					</c:forEach>
					<c:forEach var="linkItem" items="<%= list%>" begin="${thirdColumnStartIndex}" 
					end="${thirdColumnEndIndex}" varStatus="index">
						<li>${linkItem}</li>
					</c:forEach>
				</ul>
			</div>
		</div>
	</section>
	
</c:if>
