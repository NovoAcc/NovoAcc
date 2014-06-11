<!--[if IE 7]>
<style type="text/css">
</style>
<![endif]-->

<!--[if IE 8]>
<style type="text/css">
</style>
<![endif]-->

<!--[if IE 9]>
<style type="text/css">
</style>
<![endif]-->

<!--[if IE 8]>
<style type="text/css">
	.in .col .indexCardInfo img{
		right: -170px !important;
	}
</style>
<![endif]-->

<!--[if gte IE 9]>
<style type="text/css">
</style>
<![endif]-->


<c:set var="dirImages"
	value="/etc/designs/dupont/tools/carouselnavigation/source/images/" />

<!--[if IE 8]>
<style type="text/css">
	.in .menu-link{
    margin: 19px 20px !important;
    position:absolute;
    right: 0px;
    top: 0px;
}


</style>
<![endif]-->

<div class="grid-top">
	<p class="grid-title">${genericTool.toolTitle}</p>
	<div class="greydots">
        <a id="grid1" href="/" class="selected"></a>
        <a id="grid2" href="/" class=""></a>
	</div>

</div>

<div id="CarouselNavigationPane" class="in">
	<!-- this div (#DSSViewPane) only shows 1 index card or a baseball card-->
	<div class="grid-container" id="Container">
		<div id="GridBox">
			<div id="title"><p>${genericTool.indexDescription }</p></div>
			<ul class="jcarousel-skin-dss-expert" id="indexCards">
				<%@include file="inIndex.jsp"%>
			</ul>
		</div>
		<div id="ExpertBox">
			<ul class="jcarousel-skin-dss-expert" id="BaseballCards">
				<%@include file="inBB.jsp"%>
			</ul>

		</div>
         <div class="jcarousel-prev jcarousel-prev-horizontal" style="display: block;"></div>
         <div class="jcarousel-next jcarousel-next-horizontal" style="display: block;"></div>
	</div>
</div>
