<%@ page import="javax.jcr.Node"%>
<%@ page import="com.dupont.phoenix.hlm.HLMWrapper,com.dupont.phoenix.list.HListHelper"%>
<%@ page import="java.util.List" %>
<%@ page import="com.day.cq.commons.Doctype,com.day.cq.wcm.api.components.DropTarget,
				com.day.cq.wcm.foundation.Image,com.dupont.phoenix.commons.Scene7Image" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp" %>
<%@ page import="com.day.cq.wcm.api.WCMMode,
                 com.dupont.phoenix.Global,
org.apache.commons.lang.StringUtils"%>

<%

    //Properties  for the page....
    //Hero Title Text jcr:content/pageTitle -- Page Property
    //Hero Background Color jcr:content/heroColor -- Page Property ???? How this will be used ....

    //Initialize
    String pageTitle= "";
    boolean hasImage = false;
    boolean hasContentTabs = false;
    String heroColor = "";
    String heroColorClass="";
	String imgClass = "";
	String imgAlt = "";
	String imgTitle = "";
	String imageSource = "";

    //Hero Image  jcr:content/heronormal/image -- Component Property
    //Check if Image is available or not
    Image heroImage = new Scene7Image(resource, slingRequest);
    heroImage.set(Image.PN_HTML_WIDTH, "1250");
    heroImage.set(Image.PN_HTML_HEIGHT,"290" );
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
       heroColor="style=\"background-color:#"+heroColor+"\"";
    }


    //Read The page title
    if (null != currentPage.getTitle()){
       pageTitle= currentPage.getTitle();
    }

    // check if content tabs will be displayed
    //Read the content tabs to be displayed.
    HLMWrapper hlmWrapper = (HLMWrapper) request.getAttribute("hlmWrapper");
    if(hlmWrapper==null) {
        hlmWrapper = new HLMWrapper(slingRequest,currentPage);
        request.setAttribute("hlmWrapper", hlmWrapper);
    }

    List<HListHelper> hlmList = hlmWrapper.getCTHLMList();
    int noOfContentTabs=hlmList.size();
    if (noOfContentTabs>0){
        hasContentTabs=true;
    } else {
        hasContentTabs=false;
    }


    //Declare the Divs
    String strDivMain = "hero-normal";
    String strDivMainTitle ="hero-normal-title";
    String strDivMainTitleBG ="hero-normal-title-bg";

    // If there is a image to be displayed
   if (hasImage) {
       if (hasContentTabs){
           strDivMain = "hero-normal-img-tabs";
           strDivMainTitle = "hero-normal-img-tabs-title";
           strDivMainTitleBG = "hero-normal-img-tabs-title-bg";
     //      heroImage.set(Image.PN_HTML_HEIGHT,"290" );

       } else {
           strDivMain = "hero-normal-img";
           strDivMainTitle = "hero-normal-img-title";
           strDivMainTitleBG = "hero-normal-img-title-bg";
       //    heroImage.set(Image.PN_HTML_HEIGHT,"270" );
      }

   } else {

      if (hasContentTabs ){
           strDivMain = "hero-normal-tabs";
           strDivMainTitle = "hero-normal-tabs-title";
           strDivMainTitleBG = "hero-normal-tabs-title-bg";
           heroColorClass = heroColor;
           heroColor="";
        //   heroImage.set(Image.PN_HTML_HEIGHT,"290" );

       } else {
           strDivMain = "hero-normal-no-tabs-no-image";
           strDivMainTitle = "hero-normal-title";
           strDivMainTitleBG = "hero-normal-title-bg";
           heroColorClass = heroColor;
           heroColor="";
        //   heroImage.set(Image.PN_HTML_HEIGHT,"270" );
       }
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
        <h2 class="<%= StringUtils.lowerCase(Global.getCountryCode(currentPage)) %>"><%= pageTitle %></h2>
        <!--- cqinclude the Social Chicklets component -->
        <cq:include path="socialchannels" resourceType="/apps/dupont/phoenix/components/socialmedia/socialmediachiclets_header" />
        <div id="<%= strDivMainTitleBG %>" <%=heroColor%>></div>
    </div>
</div>
<div style="clear:both"></div>