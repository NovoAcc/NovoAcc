
<c:choose>
    <c:when test="${posRow==2}">
       <div class="indexItem pos1" id="element${jcarucelPos}" data-baseCard="${jcarucelPos}">
			<div class="sqr-1 sq-hover" style="background-color: #${slide.primaryColor}">
				<p class="sqr-p">${slide.title}</p>
				
				<p><img alt="Arrow graphic, click to navigate" class="right-arrow arrow" src="${dirImages}right-arrow.png" /></p>
			</div>

			<c:set var="image" value="${slide.thumbnail}"/>
			<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
		</div>
		<c:set var="posRow" value="1" />
    </c:when>
    <c:when test="${posRow==1}">



        <div class="indexItem pos2" id="element${jcarucelPos}"  data-baseCard="${jcarucelPos}" >
        	
			<c:set var="image" value="${slide.thumbnail }"/>
			<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
			<div class="sqr-2 sq-hover" style="background-color: #${slide.primaryColor}">
				<p class="sqr-p">${slide.title}</p>
				<p><img alt="Arrow graphic, click to navigate" class="left-arrow arrow" src="${dirImages}left-arrow.png" /></p>
			</div>
			<c:set var="posRow" value="2" />

		</div>

    </c:when>
</c:choose>