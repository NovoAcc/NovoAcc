<%--
  ==============================================================================

  Includes header, content, and footer jsps.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<div class="author">
	Index card. <br />
    Title : ${properties.indexCardTitle }<br/>
    <c:forEach var="i" begin="1" end="6">
            <cq:include path="baseballCard_${i}" resourceType="dupont/phoenix/components/tools/bi_generictool/baseballcard"/>
	</c:forEach>
</div>
