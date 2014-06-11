<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<mgs:controller var="disclaimerHelper" cls="com.dupont.phoenix.commons.helpers.DisclaimerHelper" />
<c:set var="disclaimer" scope="page" value="${disclaimerHelper.disclaimer}"/>
<c:set var="isEditMode" scope="page" value="${disclaimerHelper.editMode}"/>
<c:set var="style" scope="page" value="${disclaimerHelper.addStyle}"/>
<c:choose>
	<c:when test="${disclaimer != null}">
		<div class="mod-disclaimer ${style}">
		     <p>
                 ${disclaimer}
		     </p>
		</div>  
	</c:when>
	<c:otherwise>
		<c:if test="${isEditMode}">   
		     <div class="mod-disclaimer">
		           <p>Enter Disclaimer</p>
		     </div>
	    </c:if>
	</c:otherwise>
</c:choose>
<div style="clear:both"></div>