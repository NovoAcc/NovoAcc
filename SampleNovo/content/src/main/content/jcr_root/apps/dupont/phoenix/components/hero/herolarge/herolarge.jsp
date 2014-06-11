<%@ page import="javax.jcr.Node" %>
<%@ page import="com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget, com.day.cq.wcm.foundation.Image" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@page import="com.day.cq.wcm.api.WCMMode,com.dupont.phoenix.commons.Scene7Image,
com.day.cq.commons.Doctype,com.dupont.phoenix.Global,
org.apache.commons.lang.StringUtils"%>

<%
    //Initialize
    String pageTitle= "";
    boolean hasImage = false;
    String heroColor = "9d3e04";        
            
    //Hero Image  jcr:content/heronormal/image -- Component Property    
    //Check if Image is available or not    
    Image heroImage = new Scene7Image (resource, slingRequest);
    heroImage.set(Image.PN_HTML_WIDTH, "1100");
    heroImage.set(Image.PN_HTML_HEIGHT,"328" );
    
    heroImage.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image");
    
    if (heroImage.hasContent()){
       hasImage = true;
    } else {
       hasImage= false;
    }
    
    // Read the heroColor
    if (null != pageProperties.get("heroColor")){
       heroColor = pageProperties.get("heroColor").toString();
    }
    
    //Read The page title
    if (null != currentPage.getTitle()){
       pageTitle= currentPage.getTitle();
    }
    

    //Declare the Divs
    String strDivMain = "hero-large";
    String strDivMainTitle ="hero-large-title";
    String strDivMainTitleBG ="hero-large-title-bg";
    
 
%>

<!-- Start Hero Large -->
<div id="<%= strDivMain %>" class="group"> 

   <% if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT || (WCMMode.fromRequest(slingRequest) != WCMMode.EDIT && hasImage) ){ %> 
       <div class="hero-image"> 
       <% heroImage.draw(out); %>
       </div>
   <% } %>
    <!--- cqinclude the site search component -->
    <cq:include path="SiteSearch" resourceType="/apps/dupont/phoenix/components/search" />


    <div id="<%= strDivMainTitle %>" class="group">
        <div class="solid padding-left">
            <h2 class="<%= StringUtils.lowerCase(Global.getCountryCode(currentPage)) %>"><%= pageTitle %> </h2>
            
            <!--- cqinclude the Social Media Chicklets component -->
            <cq:include path="socialchannels" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_header" />
                        
        </div>

        <div id="<%= strDivMainTitleBG %>" style="background-color:#<%= heroColor %>;">   </div>       
        
    </div>
</div>
<div style="clear:both"></div>
<!-- End Start Hero Large -->