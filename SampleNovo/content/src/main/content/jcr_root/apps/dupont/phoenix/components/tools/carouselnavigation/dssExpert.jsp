<!--[if IE 7]>
	<style type="text/css">
    .general-info .panel1{
        height: 279px;
    }
    .dss .general-info .panel1{
		height: 282px !important;
    }
    </style>
 <![endif]-->
 <!--[if IE 8]>
	<style type="text/css">
    .expert-presentation{
        padding-left: 16px;
    }
    </style>
 <![endif]-->
<c:set var="dirImages" value="/etc/designs/dupont/tools/carouselnavigation/source/images/" />

<div class="grid-top">
	<p class="grid-title">${genericTool.toolTitle} </p>
	<div class="greydots">
        <a id="grid1" href="/" class=""></a>
        <a id="grid2" href="/" class="selected"></a>
	</div>

</div>

<div id="CarouselNavigationPane" class="dss">
	<div class="grid-container" id="Container">
		<div id="GridBox">
			<ul class="jcarousel-skin-dss-expert" id="indexCards">
			<c:set var="col" value="0" />
			<c:set var="posRow" value="2" />
			<c:set var="posRowBig" value="2" />
			<c:set var="jcarucelPos" value="0" />
			<c:set var="description" value="true" />

			<c:forEach var="index" items="${genericTool.indexCardList }" varStatus="j" >
				<c:set var="col" value="${col+1}" />
				<c:if test="${col == 1 }" >
				<li>
			 		<div class="expert-pane">
			 			<div class="consultant-grid-1" >

			 				<c:if test="${description}" >
								<div class="sqr-quote-grid-1">
										${genericTool.indexDescription}
									</div>
									<c:set var="description" value="false" />
									<c:set var="col" value="${col+1}" />
							</c:if>


				</c:if>
						<div class="col">
							<c:forEach  var="slide" items="${index.baseballCardList }" varStatus="i">
							<c:set var="jcarucelPos" value="${jcarucelPos + 1}" />
								<c:if test="${ fn:length(index.baseballCardList) == 1 }" >
									<%@include file="dssExpertIndex1.jsp" %>
								</c:if>
								<c:if test="${ fn:length(index.baseballCardList) == 3 }" >
									<%@include file="dssExpertIndex3.jsp" %>
								</c:if>
									
								
							</c:forEach>
						</div>

				<c:if test="${col == 4 }" >
					<c:set var="col" value="0" />
						</div>
					</div>	
				</li>
				</c:if>
			</c:forEach>
			</ul>
		</div>

		<div id="ExpertBox" class="expertDss">
			<ul class="jcarousel-skin-dss-expert" id="BaseballCards">
			<c:forEach var="index" items="${genericTool.indexCardList }" varStatus="j" >
				<c:forEach  var="slide" items="${index.baseballCardList }" varStatus="i">
				
				<li>
					<div class="expert-pane">
						<div class="solution-page">
							<div class="general-info xpt-1-sol">
								<div class="panel1">
									<h1 class="color-4">${slide.title}</h1>
									<p>${slide.shortDescription}</p>
								
									<c:if test="${!empty slide.links}" >
										<ul>
										<c:forEach var="links" items="${slide.links}" varStatus="z">
				                            <li class="last">
				                            	<c:if test="${links.newWindow}" >
												<a target="_blank" href="${links.linkURL}">${links.linkText}</a>
				                              	</c:if>
				                              	<c:if test="${!links.newWindow}" >
												<a href="${links.linkURL}">${links.linkText}</a>
				                              	</c:if>
				                            </li>
				                        </c:forEach>
				                        <c:if test="${slide.hasLinkedinArea}" >
										
											<li class="last linkedinLink">
												<a target="_blank" href="${slide.linkedinLink}">Join the conversation on LinkedIn LinkedIn <img alt="LinkedIn" src="${dirImages}linked-in-chicklet-gray.gif" class="linktedinimg" /> <br/>"${slide.linkedinLinkText}"</a>
											</li>
										
										</c:if>
										</ul>
									</c:if>
								</div>

								<c:if test="${slide.hasSubArea}" >
									<div class="expert-solution-bottom xpt-sol-bottom-1" style="background-color: #${slide.secondaryColor}">
										<a href="javascript:void(0);">
											<p class="related-expert-solution">Related Expert Solution</p>
											<img class="plus-icon" height="20px" width="20px" alt="plus icon, click to expand" src="${dirImages}plus-icon-2.png" />
											<p class="solution-title">${slide.subAreaTitle}</p>
											
										</a>
									</div>
									<div class="general-info-2">
										<div class="expert-solution-top-2 xpt-sol-bottom-2" style="background-color: #${slide.primaryColor}">
											<a href="javascript:void(0);">
												<p class="related-expert-solution">Related Expert Solution</p>
												<img class="plus-icon" height="20px" width="20px" alt="plus icon, click to expand" src="${dirImages}plus-icon-3.png" />
												<p class="solution-title">${slide.title}</p>
												
											</a>
										</div>
									</div>
									<div class="panel2">
										<h1 class="color-4">${slide.subAreaTitle}</h1>
										<p>${slide.subAreaDescription}</p>
										<c:if test="${!empty slide.subAreaLink}" >
											<ul>
					                            <li class="last">
													<a href="${slide.subAreaLink}">${slide.subAreaLinkText}</a>
					                            </li>
											</ul>	
										</c:if>                            		
									</div>
								</c:if>
							</div>
						

							<div class="expert-shot">

								<c:set var="image" value="${slide.baseballImage }"/>
								<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>

								
								<h3>${slide.expertName}</h3>
								<p>${slide.expertPosition} <br/> ${slide.expertOrganization }</p>
							</div>

							<div class="expert-info">
								<a class="menu slide-grid-down" id="menu1" href="javascript:void(0);" rel="nofollow">MENU</a>
								<h2>
								${slide.expertBioTitle}</h2>
								<p>${slide.expertBio}</p>
								<p><a class="fullbio" href="${slide.expertLink}">Read full bio</a></p>
								<c:if test="${fn:length(slide.expertPresentationTitle) > 0 }" >
									<div class="expert-presentation">
										<a href="${slide.expertPresentationLink}" target="_blank">${slide.expertPresentationTitle}<img class="bioImg" alt="right arrow graphic, click to navigate" src="${dirImages}right-arrow-grey.png" /></a>
										<p>${slide.expertPresentationDescription}</p>
									</div>
								</c:if>
							</div>
							
						</div> 
					</div>
				</li>
				
				</c:forEach>
			</c:forEach>
			</ul>
		</div>
        <div class="jcarousel-prev jcarousel-prev-horizontal" style="display: block;"></div>
        <div class="jcarousel-next jcarousel-next-horizontal" style="display: block;"></div>
	</div>
</div>
