<%--
  Copyright 1997-2008 Day Management AG
  Barfuesserplatz 6, 4001 Basel, Switzerland
  All Rights Reserved.

  This software is the confidential and proprietary information of
  Day Management AG, ("Confidential Information"). You shall not
  disclose such Confidential Information and shall use it only in
  accordance with the terms of the license agreement you entered into
  with Day.

  ==============================================================================

  Breadcrumb component

  Draws the breadcrumb

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<mgs:controller var="breadcrumb" cls="com.dupont.phoenix.navigation.Breadcrumb" />
<c:set var="pagesCount" value="${fn:length(breadcrumb.pagesInBreadcrumb)}"/>
	<c:forEach var="breadcrumbPage" items="${breadcrumb.pagesInBreadcrumb }" varStatus="i">
		<a <c:if test="${pagesCount == i.count }">class="bold" </c:if> href="${breadcrumbPage.linkURL }.html">${breadcrumbPage.title }</a>
	<c:if test="${pagesCount != i.count }"><span class="breadcrumb-spacer"> &gt; </span></c:if>
	</c:forEach>
