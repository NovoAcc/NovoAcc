<%--

  Homepage Hero Callout Component component.

  Homepage Hero Callout Component

--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.day.text.Text,java.util.Map"%>
<%@ page import="com.day.cq.wcm.foundation.Image"%>
<%@ page import="com.day.cq.commons.Doctype"%>
<%@ page import="com.day.cq.wcm.api.WCMMode"%>
<%@ page import="com.dupont.phoenix.Global,com.dupont.phoenix.commons.Scene7Image, com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget"%>

<%
    //Code Starts from Here
    String imageSource = "";
    String altText = "";
    String imgAlt = "";
    String urlToCalloutStory = new String();
    String heroHeadline = new String();
    String heroHeadlineWithoutLastWord = new String();
    String heroHeadlineLastWord = new String();
    String backgroundColor = new String();
    String shortDescription= new String();
    Image heroImage = new Scene7Image(resource,slingRequest);
    heroImage.set(Image.PN_HTML_WIDTH, "1250");
    heroImage.set(Image.PN_HTML_HEIGHT, "372");
    heroImage.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image"); 

    if (null != properties.get("fileReference")) {
        imageSource = properties.get("fileReference").toString();
    }
    if (null != properties.get("linkURL")) {
        urlToCalloutStory = String.format("%s.html",Global.getNavigationURL(slingRequest, properties.get("linkURL").toString(), false));
        //urlToCalloutStory = properties.get("linkURL").toString() + ".html";
        //String a = properties.get("linkURL").toString() + ".html";
    }

	  if (null != properties.get("heroAltHeadline")) {
        heroHeadline = properties.get("heroAltHeadline").toString();
	  }else{
		    if(null != pageProperties.get("jcr:title")) {
			    heroHeadline = pageProperties.get("jcr:title").toString();
		    }
	  }
    if (heroHeadline.length() > 96)
        heroHeadline = pageProperties.get("jcr:title").toString().substring(0, 96);

    if (heroHeadline.indexOf(' ') > 0) {
        //out.print("has space" + heroHeadline.indexOf(' '));
        heroHeadlineWithoutLastWord = heroHeadline.substring(0,heroHeadline.lastIndexOf(' '));
        heroHeadlineLastWord = heroHeadline.substring(heroHeadline.lastIndexOf(' '));
    } else {
         heroHeadlineWithoutLastWord = heroHeadline;
    }

    if (null != pageProperties.get("heroColor")) {
        backgroundColor = pageProperties.get("heroColor").toString();
    }

    if (null != pageProperties.get("jcr:description")) {
        //shortDescription= pageProperties.get("jcr:content/dupont:shortDesc").toString();
        shortDescription= pageProperties.get("jcr:description").toString();
        if (shortDescription.length() > 96)
            shortDescription = pageProperties.get("jcr:description").toString().substring(0, 96);
    }

    String backgroundStyle = new String();
    if (!backgroundColor.isEmpty())
        backgroundStyle = "style=\"background-color: #" + backgroundColor + ";\"";

//backgroundStyle = "style=\"background-color: #CD0529;\"";

    if (null != properties.get("alt")) {
        altText = "alt= \"" + properties.get("alt") + "\"";
        imgAlt = properties.get("alt").toString();
    }

    String calloutString = new String();
    /*
    Release 2.8 changes Start
    */

    if (!urlToCalloutStory.isEmpty() && !heroHeadline.isEmpty()) {
        if(heroHeadline.equals(heroHeadlineWithoutLastWord)) {
            calloutString = "<a href=\"" + urlToCalloutStory + "\">" +
                        "<span class=\"no-wrap\">" + heroHeadline + " <img src=\"/etc/designs/dupont/phoenix/clientlibs/source/images/white_arrow_right.png\"></span>" +
                    "</a>";
        } else {
            calloutString = "<a href=\"" + urlToCalloutStory + "\">" + heroHeadlineWithoutLastWord +
                        "<span class=\"no-wrap\">" + heroHeadlineLastWord + " <img src=\"/etc/designs/dupont/phoenix/clientlibs/source/images/white_arrow_right.png\"></span>" +
                    "</a>";
        }
    }else{
    	if(heroHeadline.equals(heroHeadlineWithoutLastWord)) {
            calloutString = "<span class=\"no-wrap\">" + heroHeadline + " </span>";
        } else {
            calloutString = heroHeadlineWithoutLastWord + "<span class=\"no-wrap\">" + heroHeadlineLastWord + "</span>";
        }
    	
    }
    /*Prepare output Structure*/
%>
    <div class="homepage-hero" class="group">
<%
        if((WCMMode.fromRequest(slingRequest) == WCMMode.EDIT) && imageSource.isEmpty() && calloutString.isEmpty()) {
%>
            Hero Tool Callout
            <cq:include path="search" resourceType="/apps/dupont/phoenix/components/search"/>
<%
        } else {
            if (!imageSource.isEmpty())
            {
            	/*heroImage.addCssClass("homepage-hero-image");
            	heroImage.set(Image.PN_ALT,altText);
            	heroImage.set(Image.PN_LINK_URL,"");
            	heroImage.draw(out);*/
            	String imgSrc = "";
            	String markUp = "";
                String imgClass = "";
           		if(null != properties.get("dam:scene7URL"))
           		{
           			imgSrc = properties.get("dam:scene7URL").toString();
           		}
           		else
           		{
           			imgSrc = imageSource;
           		}
                imgClass = DropTarget.CSS_CLASS_PREFIX + "image homepage-hero-image";
           		markUp = Global.picturefillMarkup(imgAlt, imgSrc, imgClass, "");
            	%>
            	<c:out value="<%=markUp%>" escapeXml="false"/>
            	<%
            }
%>
                <cq:include path="search" resourceType="/apps/dupont/phoenix/components/search"/>
<%
            if (!calloutString.isEmpty()) {
%>
                <div class="hero_callout_module" <%=backgroundStyle%> >
                    <h1 class="hero_callout_module-headline  country-container-title"><%=calloutString%></h1>
<%
                if (!shortDescription.isEmpty())
%>
                    <div class="hero_callout_module-short_desc"><%=shortDescription%></div>
                </div>
<%
            }
        }
/*imageSource=properties.get("dam:scene7URL").toString();
String str = "<img title=\"Roads_300x150\" alt=\"hula\" class=\"cq-dd-image homepage-hero-image\" src=\""+imageSource+"\">";*/
%>

    </div>
