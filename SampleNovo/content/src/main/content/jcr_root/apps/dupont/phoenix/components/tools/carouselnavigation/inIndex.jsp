<c:set var="col" value="0" />
<c:set var="jcarucelPos" value="0" />

<c:forEach var="index" items="${genericTool.indexCardList}" varStatus="j" >
	<c:set var="col" value="${col+1}" />
	<c:set var="jcarucelPos" value="${jcarucelPos+1}" />
	<c:if test="${col == 1 }" >
		<li>
			<div class="expert-pane">
				<div class="consultant-grid-1" >
	</c:if>		
	<div class="col">
		<c:forEach var="slide" items="${index.baseballCardList }">
			<c:set var="thumbnail" value="${slide.thumbnail }"/>
			<%((Scene7Image)pageContext.getAttribute("thumbnail")).draw(out); %>

			<div class="indexCardInfo">
				<div class="iicolor" style="background-color: #${slide.color}"></div>
				<div class="iitext">
					<c:set var="whiteicon" value="${slide.whiteicon }"/>
					<%((Scene7Image)pageContext.getAttribute("whiteicon")).draw(out); %>
					${slide.indexTitle} <br />
					<a href="javascript:void(0)" class="indexItem challenge-iii"  data-baseCard="${jcarucelPos}"><%=Global.getTranslatedText(currentPage, slingRequest, "CHALLENGE") %>&nbsp;&nbsp;&nbsp;&#62;</a> 
					<c:if test="${slide.scienceEnabled }" >
						<c:set var="jcarucelPos" value="${jcarucelPos+1}" />
						<a href="javascript:void(0)" class="indexItem science-iii"  data-baseCard="${jcarucelPos}"><%=Global.getTranslatedText(currentPage, slingRequest, "SCIENCE") %>&nbsp;&nbsp;&nbsp;&#62;</a>
					</c:if>
					
				</div>
			</div>	
		</c:forEach>
	</div>

	<c:if test="${col == 4 }" >
		<c:set var="col" value="0" />
				</div>
			</div>
		</li>
	</c:if>
</c:forEach>
