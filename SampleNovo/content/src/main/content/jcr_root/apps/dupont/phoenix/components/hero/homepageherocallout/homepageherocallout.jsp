<%--

  Homepage Hero Callout Component component.

  Homepage Hero Callout Component

--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.hero.HomePageHeroCallout,com.day.cq.wcm.api.WCMMode,
com.day.cq.wcm.api.components.DropTarget,com.day.cq.wcm.foundation.Image,
com.dupont.phoenix.commons.Scene7Image"%>

<% HomePageHeroCallout hohc = new HomePageHeroCallout(resource, currentPage, slingRequest);
   pageContext.setAttribute("hohc",hohc); 
   
   boolean hasImage = false;
   
   Image heroImage = new Scene7Image(resource, slingRequest);
   heroImage.set(Image.PN_HTML_WIDTH, "1250");
   heroImage.set(Image.PN_HTML_HEIGHT,"425" );
   heroImage.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image"); 
   heroImage.addCssClass("homepage-hero-image"); 
   
   if (heroImage.hasContent()){
       hasImage = true;
    } else {
       hasImage = false;
    }
%>
   
<div class="homepage-hero" class="group">
	<% if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT && ! hasImage){ %>
	        Hero Tool Callout
	        <cq:include path="search" resourceType="/apps/dupont/phoenix/components/search"/>   
			 <% } else if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT || (WCMMode.fromRequest(slingRequest) != WCMMode.EDIT && hasImage) ){ 
					heroImage.draw(out); %>
	            <cq:include path="search" resourceType="/apps/dupont/phoenix/components/search"/>	  
				<c:if test="${not empty hohc.linkHTML }">
					<div class="hero_callout_module" style="background-color:#${hohc.heroColor };" >
						<h1 class="hero_callout_module-headline country-container-title">${hohc.linkHTML }</h1>
						<c:if test="${not empty hohc.shortDescription }">
							<div class="hero_callout_module-short_desc">${hohc.shortDescription }</div>
						</c:if>
					</div>
	    	</c:if>
	   	 <% } %>
</div>
