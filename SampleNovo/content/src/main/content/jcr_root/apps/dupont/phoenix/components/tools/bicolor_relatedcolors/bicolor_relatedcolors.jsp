<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.Global,org.apache.commons.lang.StringUtils"%><% 
%>		
		<div class="bi-color-tool legacy">
			<div id="BICarousel" data-countrycode="<%=StringUtils.lowerCase(Global.getLangCountryCode(currentPage))%>" data-product="${properties.productName }"></div>
			<div class="bicolor-hlm-top">
				<h2 id="RelatedColorsTitle" class="bicolor-title"></h2>
				<div class="graydots">
					<a href="javascript:void(0)" page="1" class="selected"></a> 
					<a href="javascript:void(0)" page="2"></a> 
					<a href="javascript:void(0)" page="3"></a> 
				</div>
				<div id="BIColorLinks">
					<span id="RelatedHues" class="bicolor-top-content"></span>
					<h4 id="hue1"></h4>
					<span class="bicolor-top-content d1"> | </span>
					<h4 id="hue2"></h4>
					<span class="bicolor-top-content d2"> | </span>
					<h4 id="hue3"></h4>
					<span class="bicolor-top-content d3"> | </span>
					<h4 id="allcolors">
						<!--  <img class="cta-arrow" src="../../sites/all/themes/dpphoenix/images/right-arrow-action.png" alt="red arrow" /> -->
						<a href=""></a>
					</h4>
				</div>
				<div class="clear"></div>
			</div>
			<div class="bicolor-hlm-carousel">
				<ul id="RelatedColors" class="jcarousel-skin-bi-color"></ul>
			</div> 
			<div class="jcarousel-prev jcarousel-prev-horizontal"></div>
         	<div class="jcarousel-next jcarousel-next-horizontal"></div>
		</div>
		
<cq:includeClientLib categories="apps.dupont.tools.relatedcolors"/>