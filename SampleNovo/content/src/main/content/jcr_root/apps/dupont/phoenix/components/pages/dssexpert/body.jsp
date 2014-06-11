<%--
  ==============================================================================

  Includes header, content, and footer jsps.

  ==============================================================================

--%><%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<div style="width:700px;">
<div class="author" style="margin:30px 0;">
Index Description: <br/>
<cq:include path="indexDescription" resourceType="foundation/components/text"/>
</div>
<cq:include path="indexPar" resourceType="foundation/components/parsys"/>
</div>