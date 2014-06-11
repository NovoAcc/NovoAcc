<%--
        Product Finder Callout Component
--%>
<%@page import="com.day.cq.wcm.api.WCMMode"%>
<%@include file="/libs/foundation/global.jsp"%>
<%@page session="false"%>
<%@ page import="com.dupont.phoenix.callout.tools.ProductFinder"%>
<%
ProductFinder productFinder = new ProductFinder(resource, currentPage, slingRequest);
if (productFinder.validLink()){
%>
<div class="product-finder">
    <a href="<%=productFinder.getLink()%>" class="tool maroon <%= productFinder.getLowerCasePage() %>"> 
        <span class="pfh2"><%= productFinder.getHeaderText() %></span>    
        <span class="pfh3">
            <%= productFinder.getHeaderLast()%><%=" " %>

            <% if (productFinder.validLinkText()) { %>
                <span class="product-finger-text">
                    <%= productFinder.getLinkText() %> 
                </span>
                <span class="no-wrap product-finder-title"><%=productFinder.getLinkTextLast()%>
                    <img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png">
                </span>
            <% } else {%>
                <span class="no-wrap product-finder-title"><%=productFinder.getLinkText()%> 
                    <img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png">
                </span>
            <% } %>
        </span>
        <div style="clear:both"></div>
    </a>
</div>
<% } else if (WCMMode.fromRequest(request) == WCMMode.EDIT){ %>
    Add Product Finder Callout.
<% } %>