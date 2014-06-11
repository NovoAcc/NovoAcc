<script type="text/javascript">
    $(document).ready(function() {
        $('.products_services-col').each(function(i) {
            i = i+1;
            $(this).addClass('column-' + i);
        });

        if (!$('.products_services-col').hasClass("column-2") && !$('.products_services-col').hasClass("column-3")) {
			$('.column-1').addClass('first-column');
			$('.products_services-col.column-2').removeClass('column-padding');
            $('.products_services-col.column-3').removeClass('column-padding');
        } else {
			$('.column-1').removeClass('first-column');
        }

        if($('.products_services-col').hasClass("column-2") && $('.products_services-col').hasClass("column-3")) {
			$('.products_services-col.column-2').addClass('column-padding');
            $('.products_services-col.column-3').addClass('column-padding');
        }

        if($('.landingPageLink').parent().hasClass('column-padding')) {
			$('.products_services-col.column-2').removeClass('column-padding');
            $('.products_services-col.column-3').removeClass('column-padding');
        }
    });
</script>
<c:forEach var="navPage" items="${mainnode.childPages }" varStatus="i">
	<c:choose>
		<c:when test="${navPage.landingPage }">
			<div class="landingPageLink">
				<a href="<c:out value="${navPage.linkURL }" escapeXml="true"/>.html" <c:if test="${navPage.newWindow}"> target="_blank"</c:if>><c:out value="${navPage.title }" escapeXml="true"/></a>
			</div>
		</c:when>
		<c:otherwise>

                <div class="products_services-col">
						<c:if test="${not empty navPage.linkURL}">
                            <div class="landingPageLink noborder">
                                <a href="<c:out value="${navPage.linkURL }" escapeXml="true"/>.html">${navPage.title}</a>
                            </div>
                            <h3 class="country-container-menutitle">${navPage.featuredText }</h3>
    					</c:if>

                    <ul class="sub_menu">
                        <c:forEach var="subPage" items="${navPage.childPages }" varStatus="k">
                            <li><a href="<c:out value="${subPage.linkURL }" escapeXml="true"/>.html" <c:if test="${subPage.newWindow}"> target="_blank"</c:if>><c:out value="${subPage.title}" escapeXml="true"/></a></li>
                        </c:forEach>
                    </ul>
                </div>

		</c:otherwise>
	</c:choose>
</c:forEach>