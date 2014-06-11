<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>

<%@ page import="com.day.cq.wcm.api.Page" %>
<%@ page import="com.dupont.phoenix.Global"%>


<%
    String nodeName  =  request.getAttribute("nodeName").toString();
    String nodePath  =  request.getAttribute("nodePath").toString();
    String index  =  request.getAttribute("navItemIndex").toString();
    request.setAttribute("colsToDivideBy", 4);
    // Read the page reference to the node
    Page nodePage = currentPage.getPageManager().getPage(nodePath);
    if (nodePage != null){
        request.setAttribute("nodePage",nodePage);
        // Write out the Title and Navigation Path
        String nodePageTitle = Global.getNavigationTitle(nodePage);
        String nodePageURL= Global.getNavigationURL(slingRequest, nodePage, false);
%>

        <li class="navigation-item n<%=index%>">
            <a class="global-mega-link" href="<%=nodePageURL%>.html"> <%= nodePageTitle %> </a>
            <div style="display: none;" class="menu-dropdown-content">
                <% if (nodeName.equals("prodservicesnode")){ %>
                    <cq:include script="navlistnodes_prodservices.jsp"/>
                <% } else { %>
                    <cq:include script="navlistnodes.jsp"/>
                <% } %>
            </div>
        </li>

    <% } else { %>

        <li class="navigation-item">
            <a class="global-mega-link" href="#">No Menu Defined</a>
        </li>

    <% } %>