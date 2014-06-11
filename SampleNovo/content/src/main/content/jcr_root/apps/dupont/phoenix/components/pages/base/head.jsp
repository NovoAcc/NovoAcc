<%--
  ==============================================================================

  Includes all the scripts used for head tag

  ==============================================================================

--%><%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%
%><%@ page
    import="com.day.cq.commons.Doctype,
            com.dupont.phoenix.Global,
            org.apache.commons.lang.StringUtils,
            com.day.cq.commons.Externalizer,
            com.day.cq.wcm.foundation.ELEvaluator,
            org.apache.commons.lang3.StringEscapeUtils, 
            java.util.List, 
            java.util.ArrayList, 
            java.util.Arrays,
            org.apache.commons.lang.ArrayUtils,
            com.day.cq.commons.Externalizer,
            com.dupont.phoenix.GlobalConstants"%>

  <%@ page import="com.day.cq.wcm.api.WCMMode" %>



<%
    String xs = Doctype.isXHTML(request) ? "/" : "";
    String favIcon = currentDesign.getPath() + "/favicon_0.ico";
    if (resourceResolver.getResource(favIcon) == null) {
        favIcon = null;
    }
    
    final Externalizer externalizer = resourceResolver.adaptTo(Externalizer.class);
    final String canonical = externalizer.absoluteLink(slingRequest,"http",String.format("%s.html",Global.getNavigationURL(slingRequest,currentPage,false)));
    
    // NO INDEX and NO FOLLOW
    Boolean noIndex= properties.get("noIndex", false);
    Boolean noFollow= properties.get("noFollow", false);

    String metaValue = StringUtils.EMPTY;
    if(noIndex && noFollow)
    {
        metaValue = "NOINDEX, NOFOLLOW";
    }else if(noIndex)
    {
        metaValue = "NOINDEX, FOLLOW";
    }
    else if(noFollow)
    {
        metaValue = "INDEX, NOFOLLOW";
    }

    String[] selector = slingRequest.getRequestPathInfo().getSelectors(); 

//out.println("Selector --> " +selector.length);
    if(selector.length >0)
    {
        if(selector[0].equals("view-all"))
        {
             metaValue = "NOINDEX, FOLLOW";
        }
    }
 // try to resolve the redirect target in order to the the title
    String location = properties.get("redirectTarget", "");
    // resolve variables in path
    location = ELEvaluator.evaluate(location, slingRequest, pageContext);
     
     if (location.length() > 0 && location.toLowerCase().startsWith("http://")) {
      Page target = pageManager.getPage(location);
        String title = target == null ? location : target.getTitle();
        response.setStatus(301);
        response.setHeader("Location", location);
        response.setHeader("Connection", "close"); 
   }
   else if (currentPage != null && !location.equals(currentPage.getPath()) && location.length() > 0 && location.toLowerCase().startsWith("/content")) {
            // check for absolute path
            final int protocolIndex = location.indexOf(":/");
            final int queryIndex = location.indexOf('?');
            final String redirectPath;
            if (  protocolIndex > -1 && (queryIndex == -1 || queryIndex > protocolIndex) ) {
                redirectPath = location;
            } else {
                redirectPath = request.getContextPath() + location;
            }
            //Added Sling mapping for removing '/content/...' from the ghost page URLs
            final String mappedPath = slingRequest.getResourceResolver().map(request, redirectPath) + ".html";
            
            response.setStatus(301);
            response.setHeader("Location", mappedPath);
            response.setHeader("Connection", "close"); 
        } 
%>
<head>
<% if(WCMMode.fromRequest(request) == WCMMode.DISABLED) {
    %>
    <cq:includeClientLib categories="jquery"/>
    <cq:includeClientLib categories="granite.jquery"/>
    <cq:includeClientLib categories="cq.jquery"/>   
    <cq:includeClientLib categories="personalization"/> 
<% } %>  

<meta http-equiv="content-type" content="text/html; charset=UTF-8"
    <%=xs%>>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<%
if(!properties.get("keywords", "").equals(""))
{%>
<meta name="keywords"
    content="<%= StringEscapeUtils.escapeHtml4(properties.get("keywords", "")) %>"
    <%=xs%>>
<%}
if(!properties.get("description", "").equals(""))
{
%> 
<meta name="description"
    content="<%= StringEscapeUtils.escapeHtml4(properties.get("description", "")) %>"
    <%=xs%>>
<% } else if(!properties.get("jcr:description", "").equals(""))
{
%>
<meta name="description"
    content="<%= StringEscapeUtils.escapeHtml4(properties.get("jcr:description", "")) %>"
    <%=xs%>>
<%}%>
<title><%= properties.get("title", "") != null && !properties.get("title", "").equals("") ? properties.get("title", "") : properties.get("jcr:title", "") %></title>

<link rel="canonical" href="<%= canonical %>" <%=xs%>>
<%
if(!metaValue.equals(""))   
{
%>
<meta name="ROBOTS" content="<%= metaValue %>" <%=xs%>>
<%
}
%>
<!--For  SKS7 Video Player  -->    
<cq:include script="s7libs.jsp"/>
<cq:include script="headlibs.jsp" />
<cq:include script="/libs/wcm/core/components/init/init.jsp" />

<% if (favIcon != null) { %>
<link rel="icon" type="image/vnd.microsoft.icon" href="<%= favIcon %>"
    <%=xs%>>
<link rel="shortcut icon" type="image/vnd.microsoft.icon"
    href="<%= favIcon %>" <%=xs%>>
<% } %>
<link rel="stylesheet" type="text/css" href="<%= currentDesign.getPath() %>/static.css" />
<cq:includeClientLib categories="apps.dupont.include"/> 
<!--script type="text/javascript" src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/modernizr.custom.10069.js"></script-->

<script type="text/javascript">var ie7 = false; var s7domain=document.location.protocol+"<%= GlobalConstants.s7domain %>";</script>
<!--[if lt IE 8]>
        <script type="text/javascript">ie7 = true;</script>
        <script type="text/javascript" src="/etc/designs/dupont/phoenix/clientlibs/source/js/selectivizr-min.js"></script>
        <link rel="stylesheet" type="text/css" href="/etc/designs/dupont/phoenix/clientlibs/source/css/ie7-overrides.css" />
    <![endif]-->
<!--[if lt IE 9]>
        <script type="text/javascript" src="/etc/designs/dupont/phoenix/clientlibs/source/js/selectivizr-min.js"></script>
        <link rel="stylesheet" type="text/css" href="/etc/designs/dupont/phoenix/clientlibs/source/css/ie8-overrides.css" />
    <![endif]-->
<!--[if IE 9]>
        <link rel="stylesheet" type="text/css" href="/etc/designs/dupont/phoenix/clientlibs/source/css/ie9-overrides.css" />
     <![endif]-->
</head>
