<%--

  Body Copy component.

  Body Copy Component

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.BodyCopy,
				com.dupont.phoenix.commons.Scene7Image"%>
<% 	BodyCopy bodyCopy = new BodyCopy(resource,slingRequest);

pageContext.setAttribute("imageCaption",bodyCopy.getImageCaption());

pageContext.setAttribute("firstParagraph",xssAPI.filterHTML(bodyCopy.getFirstParagraph()));
pageContext.setAttribute("text",xssAPI.filterHTML(bodyCopy.getText()));


	pageContext.setAttribute("bodyCopy",bodyCopy); %>

<c:if test="${bodyCopy.author }">
	<c:if test="${empty bodyCopy.text }">
		<h1>Body copy components</h1>
	</c:if>
	<c:if test="${not bodyCopy.hideCopyImage}">
		<div class="content-hero-image">
		   	<cq:include path="heroimage" resourceType="foundation/components/image"/>
			<c:if test="${not empty bodyCopy.imageCaption }">
		    	<div class="hero_image-caption">
		            ${imageCaption }
		        </div>
		    </c:if>
		</div>
		<div style="clear:both"></div>
	</c:if>
</c:if>

<c:if test="${not bodyCopy.author }">
	<c:if test="${bodyCopy.imageDataExist }">
		<c:if test="${not bodyCopy.hideCopyImage}">
			<div class="content-hero-image">
			   	<cq:include path="heroimage" resourceType="foundation/components/image"/>
				<c:if test="${not empty bodyCopy.imageCaption }">
			    	<div class="hero_image-caption">
			            ${imageCaption }
			        </div>
			    </c:if>
			</div>
			<div style="clear:both"></div>
		</c:if>
	</c:if>
</c:if>

<c:if test="${bodyCopy.showByline}">
    <cq:include path="byline" resourceType="dupont/phoenix/components/byline"/>
    <div style="clear:both"></div>
</c:if>

<div class="content-body">
	<c:if test="${not empty firstParagraph }">
		${firstParagraph }
	</c:if>
	
	<cq:include path="inlinecallout-1" resourceType="dupont/phoenix/components/inlinecallout"/>
	<cq:include path="inlinecallout-2" resourceType="dupont/phoenix/components/inlinecallout"/>
	<cq:include path="inlinecallout-3" resourceType="dupont/phoenix/components/inlinecallout"/>

    <c:if test="${not empty text }">
    	<div class="afterInlineCallOut">${text }</div>
	</c:if>
</div>
<div style="clear:both"></div>
