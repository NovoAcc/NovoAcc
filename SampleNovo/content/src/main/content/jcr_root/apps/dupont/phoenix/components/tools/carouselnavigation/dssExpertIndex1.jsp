<div class="big indexItem" data-baseCard="${jcarucelPos}">
	<c:choose>
	    <c:when test="${posRowBig==2}">
	    	<c:set var="image" value="${slide.thumbnail }"/>
			<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
			
			<div class="sqr-4 sq-hover" style="clear:both; background-color: #${slide.primaryColor}">
				<p class="sqr-p">${slide.title}</p>
				<p><img alt="Arrow graphic, click to navigate" class="up-arrow arrow" src="${dirImages}up-arrow.png" /></p>
			</div>
			<c:set var="posRowBig" value="1" />
	    </c:when>
	    <c:when test="${posRowBig==1}">
	    	<div class="sqr-5 sq-hover" style="background-color: #${slide.primaryColor}">
				<p class="sqr-p">${slide.title}</p>
				<p><img alt="Arrow graphic, click to navigate" class="down-arrow arrow" src="${dirImages}down-arrow.png" /></p>
			</div>	
			<c:set var="image" value="${slide.thumbnail }"/>
			<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
			<c:set var="posRowBig" value="2" />
	    </c:when>
	</c:choose>
</div>