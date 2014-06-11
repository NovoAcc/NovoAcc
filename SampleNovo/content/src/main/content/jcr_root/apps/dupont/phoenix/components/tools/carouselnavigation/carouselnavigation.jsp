<%--
  ==============================================================================

  Includes the scripts and css to be included in the head tag

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page
	import="com.dupont.phoenix.tools.GenericTool,
					com.day.cq.wcm.api.WCMMode,
					com.dupont.phoenix.commons.Scene7Image,
					com.dupont.phoenix.Global"%>
<%	GenericTool genericTool = new GenericTool(slingRequest, currentPage, resource);
		pageContext.setAttribute("genericTool",genericTool);
		pageContext.setAttribute("dssTemplateName",GenericTool.DSS_EXPERT);
		pageContext.setAttribute("biTemplateName",GenericTool.BI_RESIDENTIAL);
		pageContext.setAttribute("iiTemplateName",GenericTool.INCLUSIVE_INNOVATIONS);
	%>
<cq:includeClientLib categories="apps.dupont.tool.generictool" />


<c:if test="${genericTool.validTemplate }">
	
	<c:if test="${genericTool.templateName == dssTemplateName}">
		<%@include file="dssExpert.jsp"%>
	</c:if>
	
	<c:if test="${genericTool.templateName == biTemplateName}">
		<%@include file="biResidential.jsp"%>
	</c:if>
	
	<c:if test="${genericTool.templateName == iiTemplateName }">
		<%@include file="innovation.jsp"%>
	</c:if>

</c:if>
<c:if test="${genericTool.isEdit }">
	<c:if test="${not genericTool.validTemplate }">
		<h1>Please select a valid template for the carousel navigation tool.'</h1>
	</c:if>
</c:if>