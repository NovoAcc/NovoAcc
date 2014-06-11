<%@ page import="javax.jcr.Node" %>
<%@ page import="com.day.cq.commons.Doctype,
    			 com.day.cq.wcm.api.components.DropTarget,
				 com.day.cq.wcm.foundation.Image,
				 com.dupont.phoenix.commons.Scene7Image" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode,
    			 com.dupont.phoenix.Global,
org.apache.commons.lang.StringUtils"%>

<%
    //Initialize
    String pageTitle= "";
    boolean hasImage = false;
    String heroColor = "9d3e04";
    String heroColorClass="";
	String imgClass = "";
	String imgAlt = "";
	String imgTitle = "";
	String imageSource = "";

    //Hero Image  jcr:content/heronormal/image -- Component Property
    //Check if Image is available or not
    Image heroImage = new Scene7Image(resource, slingRequest);
    heroImage.set(Image.PN_HTML_WIDTH, "1250");
    heroImage.set(Image.PN_HTML_HEIGHT,"328" );
    heroImage.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image");
	imgClass = DropTarget.CSS_CLASS_PREFIX + "image";

	if (null != properties.get("alt")) {
        imgAlt = properties.get("alt").toString();
    }

	if (null != properties.get("jcr:title")) {
        imgTitle = properties.get("jcr:title").toString();
    }

    if(null != properties.get("fileReference"))
    {
		imageSource = properties.get("fileReference").toString();
    }

    if (heroImage.hasContent()){
       hasImage = true;
    } else {
       hasImage= false;
    }

    // Read the heroColor
    if (null != pageProperties.get("heroColor")){
       heroColor = pageProperties.get("heroColor").toString();
       heroColor="background-color:#" + heroColor;
    }

    //Read The page title
    if (null != currentPage.getTitle()){
       pageTitle= currentPage.getTitle();
    }

	String strDivMain = "";
    String strDivMainTitle ="";
    String strDivMainTitleBG ="";

    //Declare the Divs
    if (hasImage){
    	strDivMain = "hero-large";
        strDivMainTitle ="hero-large-title";
        strDivMainTitleBG ="hero-large-title-bg";
    }
    else {
    	strDivMain = "hero-large-no-img";
        strDivMainTitle ="hero-large-title";
        strDivMainTitleBG ="hero-large-title-bg";
        heroColorClass = heroColor;
        heroColor="";
    }

%>

<div id="<%= strDivMain %>" class="group" <%=heroColorClass%>>
   <% if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT || (WCMMode.fromRequest(slingRequest) != WCMMode.EDIT && hasImage) ){ %>
       <div class="hero-image">
           <% //heroImage.draw(out);
        		String imgSrc = "";
            	String markUp = "";
           		if(null != properties.get("dam:scene7URL"))
           		{
           			imgSrc = properties.get("dam:scene7URL").toString();
           		}
           		else
           		{
           			imgSrc = imageSource;
           		}
           		markUp = Global.picturefillMarkup(imgAlt, imgSrc, imgClass, imgTitle);%>
           <c:out value="<%=markUp%>" escapeXml="false"/>
       </div>
   <% } %>
    <!--- cqinclude the site search component -->
    <cq:include path="SiteSearch" resourceType="/apps/dupont/phoenix/components/search" />
    <div id="<%= strDivMainTitle %>" class="group">
        <h2 class="<%= StringUtils.lowerCase(Global.getCountryCode(currentPage)) %>"><%= pageTitle %> </h2>
        <!--- cqinclude the Social Media Chicklets component -->
        <cq:include path="socialchannels" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_header" />
        <div id="<%= strDivMainTitleBG %>" style="<%=heroColor%>"></div>
    </div>
</div>
<div style="clear:both"></div>