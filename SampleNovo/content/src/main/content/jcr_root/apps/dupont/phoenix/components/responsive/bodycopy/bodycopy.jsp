<%--

  Body Copy component.

  Body Copy Component

--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.dupont.phoenix.BodyCopy,
				com.dupont.phoenix.commons.Scene7Image"%>
<% 	BodyCopy bodyCopy = new BodyCopy(resource,slingRequest);
	pageContext.setAttribute("bodyCopy",bodyCopy); %>

<c:if test="${bodyCopy.author }">
	<c:if test="${empty bodyCopy.text }">
		<h1>Body copy components</h1>
	</c:if>
	<c:if test="${not bodyCopy.hideCopyImage}">
		<div class="content-hero-image">
			<figure>
		   	<cq:include path="heroimage" resourceType="foundation/components/image"/>
			<c:if test="${not empty bodyCopy.imageCaption }">
				<figcaption>
		    	<p class="hero_image-caption">
		            ${bodyCopy.imageCaption }
		        </p>
		        </figcaption>
		    </c:if>
		    </figure>
		</div>
		<div style="clear:both"></div>
	</c:if>
</c:if>

<c:if test="${not bodyCopy.author }">
	<c:if test="${bodyCopy.imageDataExist }">
		<c:if test="${not bodyCopy.hideCopyImage}">
			<div class="content-hero-image">
				<figure>
			   	<cq:include path="heroimage" resourceType="foundation/components/image"/>
				<c:if test="${not empty bodyCopy.imageCaption }">
					<figcaption>
			    	<p class="hero_image-caption">
			            ${bodyCopy.imageCaption }
			        </p>
			        </figcaption>
			    </c:if>
			    </figure>
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
	<c:if test="${not empty bodyCopy.firstParagraph }">
		${bodyCopy.firstParagraph }
	</c:if>
	<cq:include path="inlinecallout-1" resourceType="dupont/phoenix/components/inlinecallout"/>
    <cq:include path="inlinecallout-2" resourceType="dupont/phoenix/components/inlinecallout"/>
    <cq:include path="inlinecallout-3" resourceType="dupont/phoenix/components/inlinecallout"/>
    <c:if test="${not empty bodyCopy.text }">
		${bodyCopy.text }
	</c:if>
</div>
<div style="clear:both"></div>