<c:set var="jcarucelPos" value="0" />
<c:forEach var="index" items="${genericTool.indexCardList }" varStatus="j">
	<c:forEach var="slide" items="${index.baseballCardList }" varStatus="i">
		<c:set var="jcarucelPos" value="${jcarucelPos+1}" />
		<li>
			<div class="expert-pane">
				<div class="solution-page">
					<div class="general-info xpt-1-sol">
						<div class="ii-icon">
							<c:set var="icon" value="${slide.icon }"/>
							<%((Scene7Image)pageContext.getAttribute("icon")).draw(out); %>
						</div>

						<div class="panel1">
							<div class="ii-panel">
								<h2><%=Global.getTranslatedText(currentPage, slingRequest, "CHALLENGE") %></h2>
								<h1 class="color-4">${slide.title}</h1>
								<p>${slide.shortDescription}</p>

								<c:if test="${slide.scienceEnabled }" >
									<c:set var="jcarucelPos" value="${jcarucelPos+1}" />
									<a href="javascript:void(0)" class="bbItem indexItem"  data-baseCard="${jcarucelPos}"><%=Global.getTranslatedText(currentPage, slingRequest, "THE_SCIENCE") %> &#62;</a>
								</c:if>
							</div>
						</div>

					</div>
					<div class="ii-shot">
						<c:set var="image" value="${slide.baseballImage }" />
						<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
						
						<c:set var="image" value="${slide.scienceImage }" />
                                                <%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
                                                
						<div class="menu-link">
							<a class="menu-text slide-grid-down menu" id="menu1"
								href="javascript:void(0);" rel="nofollow"></a>
						</div>
					</div>
				</div>
			</div>
		</li>

		<c:if test="${slide.scienceEnabled }">
		<li>
			<div class="expert-pane">
				<div class="solution-page">
					<div class="general-info xpt-1-sol">
						<div class="ii-icon">
							<c:set var="icon" value="${slide.icon }"/>
							<%((Scene7Image)pageContext.getAttribute("icon")).draw(out); %>
						</div>

						<div class="panel1">
							<div class="ii-panel">
								<h2><%=Global.getTranslatedText(currentPage, slingRequest, "SCIENCE") %></h2>
								<h1 class="color-4">${slide.scienceTitle}</h1>
								<p class="piisience">${slide.scienceDescription}</p>

								<c:if test="${!empty slide.links}" >
									<ul>
									<c:set var="countLinks" value="0" />
									<c:forEach var="links" items="${slide.links}" varStatus="z">
										<c:set var="countLinks" value="${countLinks+1}" />
										<c:if test="${countLinks<=2}" >
				                            <li class="last">
				                            	<c:if test="${links.newWindow}" >
												<a target="_blank" href="${links.linkURL}">${links.linkText}</a>
				                              	</c:if>
				                              	<c:if test="${!links.newWindow}" >
												<a href="${links.linkURL}">${links.linkText}</a>
				                              	</c:if>
				                            </li>
				                        </c:if>
			                        </c:forEach>
									</ul>
								</c:if>
								
							</div>
						</div>

					</div>
					<div class="ii-shot">
						<div class="ii-science-image">
							<c:set var="image" value="${slide.baseballImage }" />
							<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>

							<c:set var="image" value="${slide.scienceImage }" />
							<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>

						</div>
						<div class="menu-link menu-link-science">
							<a class="menu-text slide-grid-down menu" id="menu1"
								href="javascript:void(0);" rel="nofollow"></a>
						</div>
					</div>
				</div>
			</div>
		</li>



		</c:if>

	</c:forEach>
</c:forEach>
