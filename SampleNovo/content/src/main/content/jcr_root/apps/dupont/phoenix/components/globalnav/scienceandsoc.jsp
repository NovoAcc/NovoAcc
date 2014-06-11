<c:set var="subMenuCounter" value="${0 }"/>
<c:set var="numberOfItems" value="${fn:length(mainnode.childPages)-1 }"/>
<c:set var="even" value = "${numberOfItems % 2 }"/>
<c:set var="itemsPerCol" value="${numberOfItems / 2 }"/>
<c:if test="${even != 0 }">
	<c:set var="itemsPerCol" value="${itemsPerCol + 0.5}"/>
</c:if>

<c:forEach var="navPage" items="${mainnode.childPages }" varStatus="j">

		<c:if test="${j.index == 0 }">
			<div class="science_society-col-1">
                <h3>${navPage.title }</h3>
                <ul class="sub_menu">
                    <c:forEach var="subPage" items="${navPage.childPages }">
                        <li><a href="<c:out value="${subPage.linkURL }" escapeXml="true"/>.html" <c:if test="${subPage.newWindow}"> target="_blank"</c:if>><c:out value="${subPage.title}" escapeXml="true"/></a></li>
                    </c:forEach>
                </ul>
			</div>
		</c:if>

		<c:if test="${j.index != 0 }">
            <c:if test="${j.index == 1 }">
                <div class="science_society-col-2">
            </c:if>

            <c:if test="${subMenuCounter == itemsPerCol }">
                </ul>
                <c:set var="subMenuCounter" value="${0}" />
            </c:if>

            <c:if test="${subMenuCounter == 0 }">
                <ul class="sub_menu">
            </c:if>

            <li <c:if test="${navPage.titleBold }">class="bold"</c:if>>
                <a href="<c:out value="${navPage.linkURL }" escapeXml="true"/>.html" <c:if test="${subPage.newWindow}"> target="_blank"</c:if>><c:out value="${navPage.title }" escapeXml="true"/></a>
            </li>
            <c:set var="subMenuCounter" value="${subMenuCounter +1 }" />


            <c:if test="${j.count == fn:length(mainnode.childPages)}">
                    </ul>
                </div>
            </c:if>
		</c:if>

</c:forEach>
