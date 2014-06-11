<%@ page import="com.dupont.phoenix.Global"%>
<!--[if IE 7]>

<style type="text/css">

.menu-link {
/*background: url("../images/menu.gif") no-repeat scroll 46px 3px #000000;*/
    color: #808080;
    float: right;
    font: bold 12px ff-meta-web-pro,"Myriad Pro",Arial,Sans-Serif;
    height: 24px;
                margin: 30px -36px;
    opacity: 0.5;
    padding: 6px 0 0 5px;
    text-align: right;
    text-decoration: none;
    text-transform: uppercase;
                position:relative;
    top:-30px;
                left:-38px;
    z-indx:999;
                filter:alpha(opacity=50);
}

</style>

<![endif]-->

<!--[if IE 8]>
<style type="text/css">

.menu-link {
/*background: url("../images/menu.gif") no-repeat scroll 46px 3px #000000;*/
    color: #808080;
    float: right;
    font: bold 12px ff-meta-web-pro,"Myriad Pro",Arial,Sans-Serif;
    height: 24px;
                margin: 30px -36px;
    opacity: 0.5;
    padding: 6px 0 0 5px;
    text-align: right;
    text-decoration: none;
    text-transform: uppercase;
                position:relative;
    top:-30px;
                left:-38px;
    z-indx:999;
                filter:alpha(opacity=50);
}

.detail-image-text{
	width: 190px;
}
.detail-image-links{
	width: 216px;
}
.detail-image-link-item{
	width: 224px;
	background-position-x: 198px;
}
</style>
<![endif]-->

<!--[if IE 9]>

<style type="text/css">
.menu-link {
/*background: url("../images/menu.gif") no-repeat scroll 46px 3px #000000;*/
    color: #808080;
    float: right;
    font: bold 12px ff-meta-web-pro,"Myriad Pro",Arial,Sans-Serif;
    height: 24px;
                margin: 30px -36px;
    opacity: 0.5;
    padding: 6px 0 0 5px;
    text-align: right;
    text-decoration: none;
    text-transform: uppercase;
                position:relative;
    top:-30px;
                left:-38px;
    z-indx:999;
                filter:alpha(opacity=50);
}
</style>
<![endif]-->

<!--[if gte IE 9]>
<style type="text/css">
.menu-link {
/*background: url("../images/menu.gif") no-repeat scroll 46px 3px #000000;*/
    color: #808080;
    float: right;
    font: bold 12px ff-meta-web-pro,"Myriad Pro",Arial,Sans-Serif;
    height: 24px;
                margin: 30px -36px;
    opacity: 0.5;
    padding: 6px 0 0 5px;
    text-align: right;
    text-decoration: none;
    text-transform: uppercase;
                position:relative;
    top:-30px;
                left:-38px;
    z-indx:999;
                filter:alpha(opacity=50);
}
</style>
<![endif]-->


<c:set var="dirImages"
	value="/etc/designs/dupont/tools/carouselnavigation/source/images/" />

<div class="grid-top">
	<p class="grid-title">${genericTool.toolTitle}</p>
	<div class="greydots">
        <a id="grid1" href="/" class="selected"></a>
        <a id="grid2" href="/" class=""></a>
	</div>

</div>

<div id="CarouselNavigationPane" class="bi">
	<!-- this div (#DSSViewPane) only shows 1 index card or a baseball card-->
	<div class="grid-container" id="Container">
		<div id="GridBox">
			<ul class="jcarousel-skin-dss-expert" id="indexCards">
				<%@include file="biIndex.jsp"%>
			</ul>
		</div>
		<div id="ExpertBox">

			<ul class="jcarousel-skin-dss-expert" id="BaseballCards">
				<c:forEach var="index" items="${genericTool.indexCardList }"
					varStatus="j">
					<c:forEach var="slide" items="${index.baseballCardList }"
						varStatus="i">
						<li>
							<div class="expert-pane">
								<div class="solution-page">
									<div class="general-info xpt-1-sol">
										<div class="panel1">
											<h1 class="color-4">${slide.title}</h1>
											<p>${slide.shortDescription}</p>

											<c:if test="${!empty slide.links}">
												<ul>
													<c:forEach var="links" items="${slide.links}" varStatus="z">
														<li class="last"><c:if test="${links.newWindow}">
																<a class="slide-link" target="_blank" href="${links.linkURL}">${links.linkText}</a>
															</c:if> <c:if test="${!links.newWindow}">
																<a href="${links.linkURL}">${links.linkText}</a>
															</c:if></li>
													</c:forEach>
												</ul>
											</c:if>

										</div>

									</div>
									<div class="residential-shot">

										<c:set var="image" value="${slide.baseballImage }" />
										<%((Scene7Image)pageContext.getAttribute("image")).draw(out); %>
										<div class="menu-link">
											<a class="menu-text slide-grid-down menu" id="menu1"
												href="javascript:void(0);" rel="nofollow"><%=Global.getTranslatedText(currentPage, slingRequest, "MENU")%></a>
										</div>
										<div class="detail-image-content">
											<div class="detail-image-text">${slide.overImageText }
											</div>
											<div class="detail-image-links">
												<c:if test="${!empty slide.links}">
													<ul>
														<c:forEach var="links" items="${slide.imageLinks}"
															varStatus="z">
															<li class="detail-image-link-item"><c:if
																	test="${links.newWindow}">
																	<a target="_blank" href="${links.linkURL}">${links.linkText}</a>
																</c:if> <c:if test="${!links.newWindow}">
																	<a href="${links.linkURL}">${links.linkText}</a>
																</c:if></li>
														</c:forEach>
													</ul>
												</c:if>
											</div>
										</div>

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
