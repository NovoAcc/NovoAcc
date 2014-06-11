<%--

  Iframe  component.

  Iframe Component

--%>

<%@ page
    import="com.day.cq.wcm.api.WCMMode,
            com.dupont.phoenix.Global"%>
  
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%
String iframeSrc = null;
String currentPath = null;
String containsCurrentPath = "false";


Integer iframeWidth = null;
Integer iframeHeight = null;


if((properties.get("iframeSrc",String.class) != null)||(properties.get("iframeSrc",String.class) != ""))
{
    iframeSrc = properties.get("iframeSrc",String.class);
}

if((properties.get("iframewidth",String.class) != null)||(properties.get("iframewidth",String.class) != ""))
{
    iframeWidth = properties.get("iframewidth",Integer.class);
}

if((properties.get("iframeheight",String.class) != null)||(properties.get("iframeheight",String.class) != ""))
{
    iframeHeight = properties.get("iframeheight",Integer.class);
}
String width = "100%";
String height = "100%";
if(iframeWidth !=null) {
    width = iframeWidth.toString();
}
if(iframeHeight !=null) {
    height= iframeHeight.toString();
}


if(currentPage.getPath() != null)
{
    currentPath = currentPage.getPath();
}
if((iframeSrc!=null)&&((iframeSrc.contains(currentPath))||(iframeSrc.equals(currentPath))))
{
    containsCurrentPath = "true";
}
if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT))
{
    if((iframeSrc == null)||(containsCurrentPath == "true"))
    {%>
        <h1>Enter Iframe Source URL</h1> 
    <%}
}%>
<%



%>

<c:set var="iframeSrc" value="<%=iframeSrc%>"></c:set>
<c:set var="containsCurrentPath" value="<%=containsCurrentPath%>" ></c:set>
<c:if test="${iframeSrc != null}">
    <c:if test="${containsCurrentPath == 'false'}" >
        <c:set var="isExternalLink" value="<%=Global.isExternalLink(iframeSrc).toString()%>"></c:set>
        <c:choose>
            <c:when test="${isExternalLink == false}">
            <%-- <c:set var="iframeSrc" value="${iframeSrc}.html"></c:set> --%>
            <c:set var="iframeSrc" value="<%=(String.format("%s.html",Global.getNavigationURL(slingRequest, iframeSrc, false)))%>"></c:set>
            </c:when> 
            <c:otherwise>
                <c:set var="iframeSrc" value="${iframeSrc}"></c:set>
            </c:otherwise>
        </c:choose>
        <%if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT))
        {%>
            <h1>Click here to open the Iframe Dialog</h1>
        <%}%>
        <iframe src = "${iframeSrc}" width="<%=width%>" height="<%=height%>" frameset="0"></iframe>
     </c:if>
</c:if>
