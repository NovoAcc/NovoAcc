
<%
%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%@ page import="com.dupont.phoenix.commons.helpers.HelpfulLinksHelper" %>
<mgs:controller var="helpfulLinksHelper" cls="com.dupont.phoenix.commons.helpers.HelpfulLinksHelper" />
<c:set var="helpfulLinksBean" scope="page" value="${helpfulLinksHelper.helpfulLinkBean}"/>

<c:if test="${helpfulLinksBean.isEdit}">
	<cq:includeClientLib categories="apps.dupont.widgets.custom"/>
 </c:if>
<c:choose>
    <c:when test="${not empty helpfulLinksBean.linkItems}">
		<nav class="footer-helpful-links" style="background-color:#${helpfulLinksBean.heroColor};">
        <h3>${helpfulLinksBean.helpfulLinkTitle}</h3>
        <ul>
            <c:set var="length" value="${helpfulLinksBean.listSize}" ></c:set>
            <c:forEach var="linkItem" items="${helpfulLinksBean.list}" varStatus="loop" >
                <li>
                    <c:choose>
                        <c:when test="${not linkItem.isExternalLink}">
                            <c:set var="linkURL" value="${linkItem.linkURL}.html"></c:set>
                        </c:when>
                        <c:otherwise>
                            <c:set var="linkURL" value="${linkItem.linkURL}"></c:set>
                        </c:otherwise>
                    </c:choose>
                    <a href="${linkURL}"> ${linkItem.linkText}</a>
                </li>
            <c:if test="${!loop.last}"><li>|</li></c:if>
            </c:forEach>
        </ul>
    </nav>
	</c:when>
	<c:otherwise>
	<c:if test="${helpfulLinksBean.isEdit}">
        <nav class="footer-helpful-links" style="background-color:#${helpfulLinksBean.heroColor};">
            <h3>${helpfulLinksBean.helpfulLinkTitle} Please curate helpful links.</h3>
        </nav>
	</c:if>
	</c:otherwise>
</c:choose>
<div style="clear:both"></div>
