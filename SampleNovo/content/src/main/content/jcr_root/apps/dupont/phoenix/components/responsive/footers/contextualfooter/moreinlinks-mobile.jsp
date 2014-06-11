<%-- 

Draws the more in links dropdown.

--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.navigation.MoreInLinks,
				com.dupont.phoenix.Global"%>

<% MoreInLinks moreinlinks = new MoreInLinks(slingRequest, currentPage, resource);
   pageContext.setAttribute("moreinlinks",moreinlinks);
   pageContext.setAttribute("showMoreinlinks",moreinlinks.exitisMoreLinks());
%>

<div class="mobile-footer-more-in">
	<c:if test="${showMoreinlinks}" >
		<h4><%=Global.getTranslatedText(currentPage, slingRequest,"More in")%>
			${moreinlinks.heroHeadline}
		</h4>
		<select onchange="location = this.options[this.selectedIndex].value;">
			<option value="#"><%=Global.getTranslatedText(currentPage, slingRequest, "Choose") %></option>
			<c:forEach var="navpage" items="${moreinlinks.moreInPages }">
				<option value="${navpage.linkURL }.html">${navpage.title}</option>
			</c:forEach>
		</select>
	</c:if>
</div>
