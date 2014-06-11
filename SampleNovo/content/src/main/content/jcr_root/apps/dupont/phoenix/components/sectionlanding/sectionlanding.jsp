<%--

  Section Landing Component component.

  Section Landing Component

--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%><%
%><%@ page import="java.util.Iterator,
        com.day.cq.wcm.api.PageFilter,
        com.day.cq.wcm.api.Page,
        com.day.cq.wcm.api.WCMMode,
        com.day.cq.wcm.foundation.Image, com.dupont.phoenix.commons.Scene7Image" %>
<%@ page import="com.dupont.phoenix.*"%>


<%
String externalIconPath="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png" ;
String externalIconCSSClass="cta-arrow";
String root = properties.get("rootlandingpage","");
String sectionLandingCount = "odd";

boolean showIcon = properties.get("childicon",false);
boolean showDescription = properties.get("childdescription",false);
boolean showHideFunctionality = properties.get("showhide",false);
boolean showHideFunctionalityChild = false;

// Get the root page using the page manager.
Page rootPage = pageManager.getPage(root);

// Check the page is not null
if (rootPage != null) {

    // Get the child pages from the rootPage.
    Iterator<Page> children = rootPage.listChildren(new PageFilter(request));
    if(children.hasNext()) {

        // If there are any childs then go thru them.
        while (children.hasNext()) {
             showHideFunctionalityChild=false;
            // Get the page node. 
            Page child = children.next();
            
            /* TITLE */
            // Get the name and the url of the page for the Global render link method.
            String linkText=child.getTitle();
            String linkURL =child.getPath() + ".html";
            
            // Insert some funky html
            %>
            
            <%

            if ( root.indexOf( "industries" ) > -1 ) {%>

                    <div class="sectionlanding-item <%if (showIcon){%>icon<%}%> <%=sectionLandingCount%>"<%

            } else { %>
              <div class="sectionlanding-item" style="min-height: 75px"<%
            }

            %>

            <% if ("odd".equals(sectionLandingCount)) { sectionLandingCount = "even"; } else { sectionLandingCount = "odd"; } %>

            <% if(showDescription) {%><%}%>>
                <ul class="sectionlanding-item-area">
            <%
            /* ICON */
            if (showIcon) {
                Image icon = new Scene7Image(child.getContentResource(),"iconimage", slingRequest);
                if (icon.hasContent() || WCMMode.fromRequest(request) == WCMMode.EDIT) {
                    icon.setSelector(".img");
                    %><li class="icon"><div class="page-icon">
                    <% icon.draw(out); %>
                    </div></li><%
                }
            }
            %>
            <li class="details"><div class="header"><%= Global.renderLink( linkURL ,null,linkText,null,externalIconPath,externalIconCSSClass,false,false) %></div>
            <%

            /* DESCRIPTION */          
            if(showDescription) {
                %>
                <p><%=child.getProperties().get("jcr:description","Set the description in the referenced page.")%></p>
                <%
            }
            
            /* SUBPAGES */
            // Check if there are any subpages for that child.
            Iterator<Page> subchildren = child.listChildren(new PageFilter(request));
             
            // Same logic as before.
            if(subchildren.hasNext()) {
                String right = "";
                String left = "";
                int index =0;
                // Go thru the childrens
                while (subchildren.hasNext()) {
                    Page p2 = subchildren.next();
                    showHideFunctionalityChild=true;
                    if(index % 2 == 0) {
                        left += "<li><a href ='" + p2.getPath() +".html'>" + p2.getTitle() + "</a></li>\n";
                    }
                    else {
                        right += "<li><a href ='" + p2.getPath() +".html'>" + p2.getTitle() + "</a></li>\n";
                    }
                    index++;
                    
                }// End inner while.
                %>
                <div class="col-container" style="display: none;">
                <ul class="sectionlanding-col">
                    <%=left%>
                </ul>
                <ul class="sectionlanding-col right">
                    <%=right%>
                </ul>
                </div>
                <%
            } // End if
            
            /* SHOW-HIDE Funch */
            String showCat = Global.getTranslatedText(currentPage,slingRequest,"Show categories in this group");
            String hideCat = Global.getTranslatedText(currentPage,slingRequest,"Hide categories in this group");
            if (showHideFunctionality && showHideFunctionalityChild) {
                // Show hide implementation here.
                %><div style="clear:both;"></div>
                <input type="hidden" id="showCat" value="<%=showCat%>"/>
                  <input type="hidden" id="hideCat" value="<%=hideCat%>"/>
                <a class="show-hide hide" href="javascript:void(0)">
                   <%=showCat%></a>
	   <%}
            %></div></li></ul>
            
            <%
           
        } // End outside while
    } // End if
   
} else { // Root page null
	if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)){%>
	     Edit the sitelanding component here. 
	<%}
}
%>
<div style="clear:both;"></div>
    
    
