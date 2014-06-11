<%--

  Press Releases Component component.

  Press Releases Component

--%>
<%@ page
    import="com.day.cq.wcm.api.WCMMode,
            com.dupont.phoenix.Global"%>
    
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%
String iframeUrl = null;
String path = null;

if(properties.get("iframeSourceURL", String.class) != null || properties.get("iframeSourceURL", String.class) != "")
{
    iframeUrl = properties.get("iframeSourceURL", String.class);
}
if(currentPage.getPath() != null)
{
    path = currentPage.getPath();
}

if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
{
    if(iframeUrl == null)
    {%>
        <h1>Add Press Release Content</h1>
    <%}
}

if(iframeUrl != null)
{
    if(path != null)
    {
        if(!(iframeUrl.contains(path) || iframeUrl.equals(path)))
        {/*out.println(path);*/%>
            <c:set var="iframeUrl" value="<%=iframeUrl%>"></c:set>
            <c:set var="isExternalLink" value="<%=Global.isExternalLink(iframeUrl).toString()%>"></c:set>
            <c:choose>
                <c:when test="${isExternalLink == false}">
                    <c:set var="iframeUrl" value="<%=String.format("%s.html", Global.getNavigationURL(slingRequest,iframeUrl,false))%>"></c:set>
                </c:when>
                <c:otherwise>
                    <c:set var="iframeUrl" value="${iframeUrl}"></c:set>
                </c:otherwise>
            </c:choose>
            <div class="frame">
            <div class="panel-pane pane-views pane-iframe" >
            <div class="pane-content">
            <div class="view view-iframe view-id-iframe view-display-id-block view-dom-id-2">
                <%if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT))
                {%>
                    <h1>Click here to open the Press Releases Dialog</h1>
                <%}%>
                <iframe src = "${iframeUrl}" width="100%" height="100%" frameborder ="0"></iframe>
            </div>
            </div>
            </div>
            </div>
        <%}
        else
        {
            if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
            {%>
                <h1>Add Press Release Content</h1>
            <%}
        } 
    }
}
%>
<div style="clear: both"></div>