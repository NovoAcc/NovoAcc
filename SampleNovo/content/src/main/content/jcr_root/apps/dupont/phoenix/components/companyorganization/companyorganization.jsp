<%--

  Company Organization component.

  Company Organization Component

--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode" %>

<%
String companyOrganization = null;
String companyCountry = null;

if((properties.get("companyOrganization",String.class) != null)||(properties.get("companyOrganization",String.class) != ""))
{
    companyOrganization = properties.get("companyOrganization",String.class);
}
if((properties.get("companyCountry",String.class) != null)||(properties.get("companyCountry",String.class) != ""))
{
    companyCountry = properties.get("companyCountry",String.class);
}
if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT) 
{
    if((properties.get("companyOrganization",String.class) == null) && (properties.get("companyCountry",String.class) == null))
    {%>
      <c:set var="display" value="Add Company Information"></c:set>  
    <%}
}
%>
<c:set var="companyOrganization" value="<%=companyOrganization%>"></c:set>
<c:set var="companyCountry" value="<%=companyCountry%>"></c:set>

<c:if test="${(companyOrganization != null)&& (companyCountry == null)}">
    <c:set var="display" value="${companyOrganization}"></c:set>
</c:if>

<c:if test="${(companyOrganization != null)&& (companyCountry != null)}">
    <c:set var="display" value="${companyOrganization}, ${companyCountry}"></c:set>
</c:if>

<c:if test="${(companyOrganization == null)&& (companyCountry != null)}">
    <%if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
    {%>
        <c:set var="display" value="Add Company Information"></c:set>
    <%}%>
</c:if>
<div class="content-date">
    ${display}
</div>