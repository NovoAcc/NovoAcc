<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="com.dupont.phoenix.Global,org.apache.commons.lang.StringUtils"%><% 
%><div class="bi-color-tool legacy">
	
			<div id="BICarousel" data-countrycode="<%=StringUtils.lowerCase(Global.getLangCountryCode(currentPage))%>" data-product="${properties.productName }"></div>
		
			<div class="bicolor-hlm-top">
                <h2 id="RecommendedColorsTitle" class="bicolor-title"></h2>
                
                <div class="graydots">
					<a href="javascript:void(0)" page="1" class="selected"></a> 
					<a href="javascript:void(0)" page="2"></a> 
					<a href="javascript:void(0)" page="3"></a> 
				</div>

				<div id="BIColorLinks">
					<span id="RecommendedColorsLabel" class="bicolor-top-content"></span>
					<h4 id="collection1"></h4>
					<span class="bicolor-top-content d1"> | </span>
					<h4 id="allcolors">
						<a href=""></a>
					</h4>
				</div>
				<div class="clear"></div>
			</div>
			<div class="bicolor-hlm-carousel">
				<ul id="recommendedColors" class="jcarousel-skin-bi-color"> </ul>
			</div>
			
			<div class="jcarousel-prev jcarousel-prev-horizontal"></div>
         	<div class="jcarousel-next jcarousel-next-horizontal"></div>
		
		</div>



<cq:includeClientLib categories="apps.dupont.tools.recommendedcolors"/>