<%-- 

Draws the breadcrumb

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<mgs:controller var="breadcrumb" cls="com.dupont.phoenix.navigation.Breadcrumb" />
 <!-- Mobile Breadcrumbs -->
<nav class="breadcrumb mobile">
	<c:forEach var="breadcrumbPage" items="${breadcrumb.pagesInBreadcrumb }" varStatus="i">
		<c:if test="${i.index == 0 }">
			<a href="${breadcrumbPage.linkURL }.html">${breadcrumbPage.title }</a> <span class="breadcrumb-spacer"> &gt; </span> 
			<select	onchange="location = this.options[this.selectedIndex].value;" >
		</c:if>
		<c:if test="${i.index != 0 }">
			<option <c:if test="${fn:length(breadcrumb.pagesInBreadcrumb) == i.count }">selected = "selected"</c:if> value="${breadcrumbPage.linkURL }.html" >${breadcrumbPage.title }</option>
		</c:if>
	</c:forEach>
	</select>
</nav>

