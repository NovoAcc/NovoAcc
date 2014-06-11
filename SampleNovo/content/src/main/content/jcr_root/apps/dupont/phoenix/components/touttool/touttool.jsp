<%--
  @description : Tool Call Out
--%>
<%@page import="com.day.cq.wcm.api.WCMMode"%>
<%@page import="java.util.StringTokenizer"%>
<%@include file="/libs/foundation/global.jsp"%>
<%@ page import="java.util.Iterator, 
    javax.jcr.Node, 
    javax.jcr.NodeIterator, 
    javax.jcr.PropertyIterator,
    com.day.cq.wcm.foundation.Image,
    com.dupont.phoenix.commons.Scene7Image,
    org.apache.sling.api.resource.Resource, 
    javax.jcr.Property, 
    com.day.cq.wcm.api.components.DropTarget,
    org.apache.jackrabbit.commons.JcrUtils, 
    com.day.cq.wcm.api.WCMMode"%>
<%@ page import="org.apache.commons.lang.StringUtils,com.dupont.phoenix.Global"%>
    <%
    String hrefTarget=""; 
    String linkTitle= properties.get("titleTout", "");
    String link = properties.get("linkURLTout", "");
    String openInNewWindow= properties.get("openInNewWindow", "");
    if(openInNewWindow.equals(true)||(StringUtils.isNotEmpty(openInNewWindow)) ){hrefTarget="blank";} 
    Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT); 

    if (!StringUtils.isEmpty(link) && !StringUtils.isEmpty(linkTitle)) 
    {
        String imageSrc = "";
        String selectedContent = "";
        String shortDesc = "";
        if(currentNode.hasProperty("linkURLTout"))
        {
             if(currentNode.getProperty("linkURLTout").getString() != "" && currentNode.getProperty("linkURLTout").getString() != null)
             {
                Value value = currentNode.getProperty("linkURLTout").getValue();
                selectedContent = value.getString(); 
                
                Page toutPage = pageManager.getPage(selectedContent);
                
                /* iterate through the child pages and gather properties */
                if (toutPage != null) 
                {   
                    String toutPagePath = toutPage.getPath();    
                    if(toutPagePath != null)
                        toutPagePath = toutPagePath.substring(0, toutPagePath.length()) + ".html";
                    
                    Node toutPageNode = toutPage.adaptTo(Node.class);
                    Node jcrNode = toutPageNode.getNode("jcr:content");

                    if(jcrNode.hasProperty("jcr:description"))
                    {
                        if(jcrNode.getProperty("jcr:description").getString() != "" && jcrNode.getProperty("jcr:description").getString() != null)
                        {
                            shortDesc = jcrNode.getProperty("jcr:description").getString();
                        }
                    }
                }
            }
        }
        String title = Global.getTranslatedText(currentPage, slingRequest,linkTitle);
        String titleTextWithoutLastWord = Global.getTextWithoutLastWord(title);
        String titleLastWord = Global.getTextLastWord(title);
        
        link = Global.isExternalLink(link) ? link : (String.format("%s.html",Global.getNavigationURL(slingRequest, link, false)));
        if((properties.get("./bImage",String.class) != null) && (properties.get("./bImage",String.class) != ""))
        {
            if((properties.get("./image/fileReference",String.class) != null) && (properties.get("./image/fileReference",String.class) != ""))
            {
                imageSrc = properties.get("./image/fileReference",String.class);
                Resource imgResource = resource.getResourceResolver().getResource(resource,"image");
                Image toolImage = new Scene7Image(imgResource,slingRequest);
                toolImage.set(Image.PN_HTML_WIDTH, "300");
                toolImage.set(Image.PN_HTML_HEIGHT, "150");
                toolImage.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image");                
                %>
                <div class="row-callout">
                    <div class="tool-callout-image">
                        <a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=link%>" target="<%=hrefTarget%>">
                          <% toolImage.draw(out); %>
                        </a>
                        <h2><a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=link%>" target="<%=hrefTarget%>"><%=titleTextWithoutLastWord %> <span class="no-wrap"><%= titleLastWord + " " %><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a></h2>
                    </div>
                </div>
               <%
            }
            else 
            {
                %>
                // No Image is present
                <%
            }
        }
        else
        {
            %>
            <div class="row-callout">
	            <div class="tool-callout">
	                <a class="<%=Global.getEventTrackingClassName(resource)%> <%= StringUtils.lowerCase(Global.getCountryCode(currentPage)) %>" href="<%=link%>" target="<%=hrefTarget%>"><%=titleTextWithoutLastWord %> <span class="no-wrap"><%= titleLastWord + " " %><img src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" class="cta-arrow"></span></a>
	            </div>
            </div>
            <% 
        }
    } 
    else if(isEdit )
    {
        %>
            Add Tool Callout.
        <%
    }
    %>
    <div style="clear:both"></div>
    
