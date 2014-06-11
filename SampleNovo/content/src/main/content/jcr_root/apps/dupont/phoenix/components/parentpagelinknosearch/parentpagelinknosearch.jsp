<%--

  Parent Page Link Component component.

  Parent Page Link Component

--%>

<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%@ page import="java.util.Iterator,
        com.day.cq.wcm.api.PageFilter,
        com.day.cq.wcm.api.NameConstants,
        com.day.cq.wcm.api.Page,
        com.dupont.phoenix.Global" %>

<%
String backgroundColor = new String();
if (null != pageProperties.get("heroColor")) 
{
        backgroundColor = pageProperties.get("heroColor").toString();
}
String backgroundStyle = new String();

    if (!backgroundColor.isEmpty())
    {
        //out.println(backgroundColor);
        backgroundStyle = "background-color: #" + backgroundColor + ";";
        //out.println(backgroundStyle );
    }
%>
<div id="hero-parent-page-link" class="group" style = "<%=backgroundStyle%>">
   
    <%               
    long level =2; //content/site/homepage
    long endLevel =0; //currentPage  
    int currentLevel = currentPage.getDepth();

    while (level < currentLevel - endLevel)     
    {
        long finalLevel= currentLevel -level;
        if(finalLevel>1)
        {
            Page trail = currentPage.getAbsoluteParent((int) finalLevel);
            if (trail == null) 
            {
                break;
            }
            if (trail.isHideInNav() == false)
            { 
                String title = Global.getNavigationTitle(trail );
                String linkTarget = xssAPI.getValidHref(Global.getNavigationURL(slingRequest,trail,false )+".html");
                String linkTitle = xssAPI.encodeForHTML(title);
                %>
            
                <div class="hero-parent-page-link">
                    <%=Global.renderLink(linkTarget, null, linkTitle, null, null, null, false,false)%>
                    <%-- <a href="<%= xssAPI.getValidHref(Global.getNavigationURL(slingRequest,trail,false )+".html") %>">
                        <%=xssAPI.encodeForHTML(title)%> 
                    </a> --%>
                </div>
                <%break;
            }
        }
        level++;
    }%>
    
</div>