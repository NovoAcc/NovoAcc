<%--
  ==============================================================================

  Includes header, content, and footer jsps.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<div class="author" style="border:2px solid green; margin-bottom: 15px; width: 700px">
    <c:forEach var="i" begin="1" end="${properties.experts}">
		<cq:include path="baseballCard_${i}" resourceType="dupont/phoenix/components/tools/dss_generictool/baseballcard"/>
	</c:forEach>
</div>