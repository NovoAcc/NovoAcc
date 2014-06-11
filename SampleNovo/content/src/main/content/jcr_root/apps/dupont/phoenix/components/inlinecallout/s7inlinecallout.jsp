<%--
    @Author: Avi Khatri
    @Description: Inline callout Component
--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page
    import="com.dupont.phoenix.commons.Scene7Image,
    com.dupont.phoenix.InlineCalloutConstants,
    org.apache.sling.api.resource.Resource,
    org.apache.sling.api.resource.ResourceResolver,
    com.day.cq.i18n.I18n,
    com.day.cq.wcm.foundation.Image,
    java.util.ResourceBundle,
    com.dupont.phoenix.Global,
    java.util.Iterator, 
    javax.jcr.Node,
    org.apache.commons.lang.StringUtils,
    javax.jcr.NodeIterator, 
    javax.jcr.PropertyIterator, 
    javax.jcr.Property, 
    org.apache.jackrabbit.commons.JcrUtils, 
    com.day.cq.wcm.api.WCMMode,
	com.day.cq.dam.api.Asset,
    com.dupont.phoenix.GlobalConstants"%>
    <%
    final I18n i18n = new I18n(slingRequest);
    String mediaType=null;
    String overLay=null;
    String viewMedia = Global.getTranslatedText(currentPage, slingRequest,"View Media");
    ResourceBundle resourceBundle = slingRequest.getResourceBundle(currentPage.getLanguage(true));

    if((properties.get("type",String.class) != null) && (properties.get("type",String.class) != ""))
    {
        mediaType=properties.get("type",String.class);
    }
    if((properties.get("overlay",String.class) != null) && (properties.get("overlay",String.class) != ""))
    {
        overLay=properties.get("overlay",String.class);
    }

    if(mediaType!=null && mediaType.equals("children"))
    {
        String imageSrc = null;
        String imageOrigSrc = null;
        String mediaTitle = null;
        String descText = "";
        String newMediaTitle = null;
        String linkUrl = null;
        String getTextLastWord = "";
        String getTextWithoutLastWord = "";
        Scene7Image image = null;
        if((properties.get("./image/fileReference",String.class) != null) && (properties.get("./image/fileReference",String.class) != ""))
        {
            imageOrigSrc = properties.get("./image/fileReference",String.class);
            
            ResourceResolver resolver = resource.getResourceResolver();
            Resource res = resolver.getResource(currentNode.getPath());
            try {
                image = new Scene7Image(res, "image", slingRequest);
                image.setSelector(".img");
                image.set(Image.PN_HTML_WIDTH, InlineCalloutConstants.WIDTH);
                image.set(Image.PN_HTML_HEIGHT, InlineCalloutConstants.HEIGHT);
                imageSrc = image.getScene7ImageSrc();
                image.addCssClass("inline_callout_image");
                if((properties.get("./image/alt",String.class) == null) || (properties.get("./image/alt",String.class) == ""))
                  {
                image.setAlt(mediaTitle);
                  }
            } catch(Exception e) {
                log.error(e.getMessage());
            }
        }
        else
        {
            imageOrigSrc = properties.get("./image/fileReference",String.class);
        }

            if((properties.get("mediaTitle",String.class) != null) && (properties.get("mediaTitle",String.class) != ""))
            {
                mediaTitle=properties.get("mediaTitle",String.class);
            }
            if((properties.get("linkURL",String.class) != null) && (properties.get("linkURL",String.class) != ""))
            {
                linkUrl=properties.get("linkURL",String.class);
            }
            if((properties.get("./image/jcr:description",String.class) != null) && (properties.get("./image/jcr:description",String.class) != ""))
            {
                descText = properties.get("./image/jcr:description",String.class);
            }
            
            %>
  
            <div class="inline_callout_module">
                <%
                        String newUrl="";

                        newMediaTitle = mediaTitle!=null ? Global.getTranslatedText(currentPage, slingRequest, mediaTitle) : "";
                        if(linkUrl != null)
                        {
                            newUrl=linkUrl+".html";
                        }
                        if(overLay != null)
                        {
                            if(imageSrc != null && !"".equalsIgnoreCase(imageSrc))
                            {
                                if(image!=null) { image.draw(out); }
                                %>
                                <div class ="inline-callout-details">
                                <%

                                if(StringUtils.isNotBlank(newMediaTitle)) {
                                    %>
                                    <h2 class="inline_callout_title"><%=newMediaTitle%></h2>
                                    <%
                                }

                                if(StringUtils.isNotBlank(descText)) {
                                    %>
                                    <div class="inline_callout_caption italic"><%=descText %></div>
                                    <%
                                }
                                %>  
                                    <div class="inline_callout_enlarge">
                                        <a data-caption="<%=descText %>" data-title="<%= newMediaTitle%>" title="<%= newMediaTitle%>" class="image-fancybox" rel="example-1" href="<%=imageOrigSrc%>">
                                            <span><%=viewMedia %></span>
                                        </a>
                                        <div id="lightbox-1" class="hidden lightbox_description">
                                            <h2><a href="#">Vestibulum tristique pharetra tincidunt.</a></h2>
                                            <p>The image caption is not restricted in its character count.</p>
                                        </div>
                                    </div>
                                </div>
                                <%

                            }
                            else if(imageOrigSrc != null && !"".equalsIgnoreCase(imageOrigSrc))
                            {
                            	if(image!=null) { image.draw(out); }
                                %>
                                <div class ="inline-callout-details">
                                    <h2 class="inline_callout_title"><%=newMediaTitle%></h2>
                                <%
                                if(StringUtils.isNotBlank(descText)) {
                                    %>
                                    <div class="inline_callout_caption italic"><%=descText %></div>
                                    <%
                                }
                                %>  
                                   <div class="inline_callout_enlarge">
                                        <a data-caption="<%=descText %>" data-title="<%= newMediaTitle%>" title="<%= newMediaTitle%>" class="image-fancybox" rel="example-1" href="<%=imageOrigSrc%>">
                                            <span><%=viewMedia %></span>
                                        </a>
                                        <div id="lightbox-1" class="hidden lightbox_description">
                                            <h2><a href="#">Vestibulum tristique pharetra tincidunt.</a></h2>
                                            <p>The image caption is not restricted in its character count.</p>
                                        </div> 
                                    </div>
                                </div>
                                <%
                            }
                            else
                            {
                                %>
                                <div class ="inline-callout-details">
                                <%
                                if(StringUtils.isNotBlank(newMediaTitle)) {
                                %>
                                    <h2 class="inline_callout_title"><%=newMediaTitle%></h2>
                                <%
                                }
                                if(StringUtils.isNotBlank(descText)) {
                                %>
                                    <div class="inline_callout_caption italic"><%=descText %></div>
                                <%
                                }
                                %>  
                                   <div class="inline_callout_enlarge">
                                        <div id="lightbox-1" class="hidden lightbox_description">
                                            <h2><a href="#">Vestibulum tristique pharetra tincidunt.</a></h2>
                                            <p>The image caption is not restricted in its character count.</p>
                                        </div>
                                    </div>
                                 </div>
                                <%
                            }

                        } 
                        else
                        {
                            getTextLastWord = (newMediaTitle!=null)? newMediaTitle.substring(newMediaTitle.lastIndexOf(" ")+1):"";
                            getTextWithoutLastWord = (newMediaTitle!=null && newMediaTitle.lastIndexOf(" ")!=-1)?newMediaTitle.substring(0,newMediaTitle.lastIndexOf(" ")):"";

                            if((imageSrc != null && !"".equalsIgnoreCase(imageSrc)) 
                                    || (imageOrigSrc != null && !"".equalsIgnoreCase(imageOrigSrc)))
                            {
                            	if(image!=null) { image.draw(out); }
                                %>
                                <div class ="inline-callout-details">
                                <%
                                if(StringUtils.isNotBlank(newMediaTitle)) {
                                %>
                              <%--  <h2 class="inline_callout_title"><a href="<%=newUrl %>" title="<%=newMediaTitle %>"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span></a></h2> --%>
                                    <h2 class="inline_callout_title"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%></span></h2>
                                <%
                                }
                                %>
                                    <div class="inline_callout_caption italic"><%=descText %></div>
                                </div>
                                <%

                            }
                            else if(descText != null && !"".equalsIgnoreCase(descText))
                            {
                                %>
                                <div class ="inline-callout-details">
                                <%
                                if(StringUtils.isNotBlank(newMediaTitle)) {
                                %>
                              <%--  <h2 class="inline_callout_title"><a href="<%=newUrl %>" title="<%=newMediaTitle %>"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span></a></h2>  --%>
                                    <h2 class="inline_callout_title"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%></span></h2>
                                <%
                                }
                                %>
                                    <div class="inline_callout_caption italic"><%=descText %></div>
                                </div>
                                <%
                            } else if(StringUtils.isNotBlank(newMediaTitle)) {
                            %>

                               <div class ="inline-callout-details">
                               <%-- <h2 class="inline_callout_title"><a href="<%=newUrl %>" title="<%=newMediaTitle %>"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span></a></h2> --%>
                                    <h2 class="inline_callout_title"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%></span></h2>
                               </div>
                               <%
                            }
                            %>  
                               <div class="inline_callout_enlarge">
                                    <div id="lightbox-1" class="hidden lightbox_description">
                                        <h2><a href="#">Vestibulum tristique pharetra tincidunt.</a></h2>
                                        <p>The image caption is not restricted in its character count.</p>
                                    </div> 
                                </div>

                            <%
                        }
                %>
            </div>
            <%
    }
    else if(mediaType !=null && (mediaType.equals("static") || mediaType.equals("contentpage")))
    {
        //String playerKey = "";
        //String playerID = "";
        //String videoID = "";
        Object videoShortDescObj= null;
    	String videoShortDesc="";
    	Object videoTitleObj= null;
    	String videoTitle="";
        String videoThumbnail = "";
        Object scene7FileNameObj = null;
        String scene7FileName = "";
		String s7SdkLink = "";
        String shortDesc = "";
        String calloutTitle = "";
        String videoPagePath = "";
        String thumbnailPath = "";
        String getTextLastWord = "";
        String getTextWithoutLastWord = "";
        Scene7Image image =null;

       /* The Video page to be rendered.*/
       try{
            String selectedContent = "";
            if(currentNode.hasProperty("selectedContent"))
            {
                 if(currentNode.getProperty("selectedContent").getString() != "" && currentNode.getProperty("selectedContent").getString() != null)
                 {
                    Value value = currentNode.getProperty("selectedContent").getValue();
                    selectedContent = value.getString(); 
                    
                    Page videoPage = pageManager.getPage(selectedContent);
                    
                    /* iterate through the child pages and gather properties */
                    if (videoPage != null) 
                    {   
                        videoPagePath = videoPage.getPath();
                        if(videoPagePath != null)
                        {
                            videoPagePath = Global.getNavigationURL(slingRequest,videoPagePath.substring(0, videoPagePath.length()), false);
                            videoPagePath = videoPagePath + ".html";
                        }
                        
                        Node videoPageNode = videoPage.adaptTo(Node.class);
                        Node jcrNode = videoPageNode.getNode("jcr:content");
                        
                        if(jcrNode.hasNode("videoplayer"))
                        {
                            Node videoplayerNode = jcrNode.getNode("videoplayer");

                            /* ********** Changes for s7SDK video light box ********** */

                   			if(videoplayerNode.hasProperty("dam:scene7File"))
                   			{
                       			String assetDamRef = videoplayerNode.getProperty("dam:scene7File").getString();
                                videoThumbnail = videoplayerNode.getProperty("fileReference").getString();
                        		// If file reference is not null
                        		if (videoThumbnail != null) {
                        			if(videoThumbnail.indexOf("/e2/") != -1) {
                        				videoThumbnail = StringUtils.replace(videoThumbnail, "/e2/","/is/image/");
                        			}
                        			// check for .null & .mp4
                                    if(StringUtils.contains(videoThumbnail, ".null") || StringUtils.contains(videoThumbnail, ".mp4"))
                                    {
                                    	videoThumbnail = StringUtils.substringBeforeLast(videoThumbnail,".");
                                    }
                        		}                        			 
                                //out.println(assetThumbPath);
                       			if(assetDamRef!=null){
                           			Resource assetResource = resourceResolver.getResource(assetDamRef);
                           			if (assetResource != null) {
                               			Asset asset = assetResource.adaptTo(Asset.class);
            				   			if (asset != null) {
                                   			scene7FileNameObj = asset.getMetadata("dam:scene7File");
              					   			if(scene7FileNameObj != null){
                                       			scene7FileName = scene7FileNameObj.toString();
									   			scene7FileName = scene7FileName.replace(" ","%20");
                                                //out.println(scene7FileName);
                                       			s7SdkLink = GlobalConstants.s7domain+"/s7viewers/html5/VideoViewer.html?asset="+scene7FileName;
                                                //out.println(s7SdkLink);
                                   			} 
                                            videoShortDescObj =asset.getMetadata("dc:description");
                   							if(videoShortDescObj != null){
                   							    if (videoShortDescObj instanceof Object[]) {
                   							        Object[] descriptionArray = (Object[]) videoShortDescObj;
                                                    videoShortDesc = (descriptionArray.length > 0) ? descriptionArray[0].toString() : "";
                                                } else {
                                                    videoShortDesc = videoTitleObj.toString();
                                                }
                   								//out.println(videoShortDesc);
                                            }
                   							videoTitleObj =asset.getMetadata("dc:title");
                   							if(videoTitleObj != null){
                   							    if (videoTitleObj instanceof Object[]) {
                   							        Object[] videoArray = (Object[]) videoTitleObj;
                   							        videoTitle = (videoArray.length > 0) ? videoArray[0].toString() : "";
                   							    } else {
                   								    videoTitle = videoTitleObj.toString();
                   								}
                                                //out.println(videoTitle);
                                            }
                                		}
                  					}		
                       			}
                   			}
                            /*if(videoplayerNode.hasProperty("videoPlayer"))
                            {
                                if(videoplayerNode.getProperty("videoPlayer").getString() != "" && videoplayerNode.getProperty("videoPlayer").getString() != null)
                                    videoID = videoplayerNode.getProperty("videoPlayer").getString();
                            }*/
                        }

                        if(mediaType.equals("contentpage")){
                            if(jcrNode.hasProperty("jcr:title"))
                            {
                                if(jcrNode.getProperty("jcr:title").getString() != "" && jcrNode.getProperty("jcr:title").getString() != null)
                                {
                                    calloutTitle = jcrNode.getProperty("jcr:title").getString();
                                    getTextLastWord = (calloutTitle!=null)? calloutTitle.substring(calloutTitle.lastIndexOf(" ")+1):"";
                                    getTextWithoutLastWord = (calloutTitle!=null && calloutTitle.lastIndexOf(" ")!=-1)?calloutTitle.substring(0,calloutTitle.lastIndexOf(" ")):"";
                                }
                            }
                            if(jcrNode.hasProperty("jcr:description"))
                            {
                                if(jcrNode.getProperty("jcr:description").getString() != "" && jcrNode.getProperty("jcr:description").getString() != null)
                                {
                                    shortDesc = jcrNode.getProperty("jcr:description").getString();
                                }
                            }

                        	if(jcrNode.hasNode("contentdetailheadline"))
                        	{
                       	      Node contentNode = jcrNode.getNode("contentdetailheadline");
                                if(contentNode.hasProperty("pageTitle"))
                                {
                                    if(contentNode.getProperty("pageTitle").getString() != "" && contentNode.getProperty("pageTitle").getString() != null)
                                    {
                                        calloutTitle = contentNode.getProperty("pageTitle").getString();
                                        getTextLastWord = (calloutTitle!=null)? calloutTitle.substring(calloutTitle.lastIndexOf(" ")+1):"";
                                        getTextWithoutLastWord = (calloutTitle!=null && calloutTitle.lastIndexOf(" ")!=-1)?calloutTitle.substring(0,calloutTitle.lastIndexOf(" ")):"";
                                    }
                                }
                            }
                        }

                        
                        if(currentNode.hasNode("video"))
                        {
                            Node contentNode = currentNode.getNode("video");
                            if(contentNode.hasProperty("jcr:title"))
                            {
                                if(contentNode.getProperty("jcr:title").getString() != "" && contentNode.getProperty("jcr:title").getString() != null)
                                {
                                    calloutTitle = contentNode.getProperty("jcr:title").getString();
                                    getTextLastWord = (calloutTitle!=null)? calloutTitle.substring(calloutTitle.lastIndexOf(" ")+1):"";
                                    getTextWithoutLastWord = (calloutTitle!=null && calloutTitle.lastIndexOf(" ")!=-1)?calloutTitle.substring(0,calloutTitle.lastIndexOf(" ")):"";
                                }
                            }

                            if(contentNode.hasProperty("jcr:description"))
                            {
                                if(contentNode.getProperty("jcr:description").getString() != "" && contentNode.getProperty("jcr:description").getString() != null)
                                {
                                    shortDesc = contentNode.getProperty("jcr:description").getString();
                                }
                            }
                        }
                        if(calloutTitle.isEmpty()&&shortDesc.isEmpty())
                        {
							calloutTitle = videoTitle;
                            getTextLastWord = ((calloutTitle!=null)&&(!(calloutTitle.equals(""))))? calloutTitle.substring(calloutTitle.lastIndexOf(" ")+1):"";
                            getTextWithoutLastWord = (calloutTitle!=null &&(!(calloutTitle.equals(""))) && calloutTitle.lastIndexOf(" ")!=-1)?calloutTitle.substring(0,calloutTitle.lastIndexOf(" ")):"";

                            shortDesc = videoShortDesc;

                        }

                        
                        if(jcrNode.hasNode("bodycopy"))
                        {
                            Node bodycopyNode = jcrNode.getNode("bodycopy");
                            if(bodycopyNode.hasNode("heroimage"))
                            {
                                ResourceResolver resolver = resource.getResourceResolver();
                                Resource res = resolver.getResource(bodycopyNode.getPath());
                                try {
                                    image = new Scene7Image(res, "heroimage");
                                    image.setSelector(".img");
                                    image.set(Image.PN_HTML_WIDTH, InlineCalloutConstants.WIDTH);
                                    image.set(Image.PN_HTML_HEIGHT, InlineCalloutConstants.HEIGHT);
                                    String imageSrc = image.getScene7ImageSrc();
                                    image.addCssClass("inline_callout_image");
                                } catch(Exception e) {
                                    log.error(e.getMessage());
                                }
                                Node imageNode = bodycopyNode.getNode("heroimage");             
                                if(imageNode.hasProperty("fileReference"))
                                {
                                    if(imageNode.getProperty("fileReference").getString() != "" && imageNode.getProperty("fileReference").getString() != null)
                                        thumbnailPath = imageNode.getProperty("fileReference").getString();
                                }
                            }
                        }
                        if("".equalsIgnoreCase(thumbnailPath) || thumbnailPath == null)
                        {
                            
                            if(jcrNode.hasNode("thumbnail"))
                            {
                            ResourceResolver resolver = resource.getResourceResolver();
                            Resource res = resolver.getResource(jcrNode.getPath());
                            try {
                                image = new Scene7Image(res, "thumbnail");
                                image.setSelector(".img");
                                image.set(Image.PN_HTML_WIDTH, InlineCalloutConstants.WIDTH);
                                image.set(Image.PN_HTML_HEIGHT, InlineCalloutConstants.HEIGHT);
                                String imageSrc = image.getScene7ImageSrc();
                                image.addCssClass("inline_callout_image");
                            } catch(Exception e) {
                                log.error(e.getMessage());
                            }
                                Node thumbnailNode = jcrNode.getNode("thumbnail");
                                if(thumbnailNode.hasProperty("fileReference"))
                                {
                                    if(thumbnailNode.getProperty("fileReference").getString() != "" && thumbnailNode.getProperty("fileReference").getString() != null)
                                        thumbnailPath = thumbnailNode.getProperty("fileReference").getString();
                                }
                            }
                        }
                        
                        /* ********** Changes for s7SDK Video Lightbox **********

                        if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId",String.class) != ""))
                        {
                            playerID = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class);
                        }
                        if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != ""))
                        {
                            playerKey = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class);
                        }*/
                        if(jcrNode.hasProperty("sling:resourceType"))
                        {
                             if(jcrNode.getProperty("sling:resourceType").getString() != "" && jcrNode.getProperty("sling:resourceType").getString() != null)
                             {
                                 if(!StringUtils.endsWith(jcrNode.getProperty("sling:resourceType").getString(), "videodetail"))
                                 {
                                    %>
                                   <div class="inline_callout_module">
                                        <%
                                 }
                                 else
                                 {
                                    %>
                                    <div class="inline_callout_module">
                                        <%
                                 }
                             }
                             else
                             {
                                %>
                                <div class="inline_callout_module">
                                    <%
                             }
                        }
                        else
                        {
                            %>
                            <div class="inline_callout_module">
                                <%
                        }
                            /*Check if the overlay is enabled*/
                               if(currentNode.hasProperty("overlay") && mediaType.equals("static"))
                               {
                                    // Create mobile video player here before the images
                                    %>
                                    <div class="s7inlineViewer inline" data-asset="<%=scene7FileName%>"></div>
                                    <script src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/inline-scene7-mobile.js"> </script>
                                    <%

                                    if(!"".equalsIgnoreCase(thumbnailPath) && thumbnailPath != null)
                                    {
                                    	if(image!=null) { image.draw(out); }
                                    }
                                   	else if(!"".equalsIgnoreCase(videoThumbnail) && videoThumbnail != null){%>

                                		<img src="<%=videoThumbnail%>" height="<%=InlineCalloutConstants.HEIGHT%>" width="<%=InlineCalloutConstants.WIDTH%>" class="inline_callout_image">

                                   <%}

                                    %>
                                   <div class ="inline-callout-details">
                                       <h2 class="inline_callout_title"><%=calloutTitle%></h2>
                                        <%
                                        if(shortDesc != null)
                                        {
                                            %><div class="inline_callout_caption italic"><%=shortDesc %></div><%
                                        }
                                        %>

                                        <div class="inline_callout_enlarge">
                                            <div class="s7-fancy-video fancy-inline" data-s7asset="<%=scene7FileName%>" data-title="<%=calloutTitle %>" data-caption="<%=shortDesc %>"><%=viewMedia %></div>
                                        </div>
                                    </div>
                                <%
                               }
                               else
                               {
                                    if(!"".equalsIgnoreCase(thumbnailPath) && thumbnailPath != null)
                                    {
                                    	if(image!=null) { image.draw(out); }
                                            %>
                                               <div class ="inline-callout-details">
                                               <h2 class="inline_callout_title"><a href="<%=videoPagePath %>" title="<%=calloutTitle %>"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span></a></h2>
                                               </div>
                                            <%
                                    }
                                   	else if(!"".equalsIgnoreCase(videoThumbnail) && videoThumbnail != null){%>

                                		<img src="<%=videoThumbnail%>" height="<%=InlineCalloutConstants.HEIGHT%>" width="<%=InlineCalloutConstants.WIDTH%>" class="inline_callout_image">
										<div class ="inline-callout-details">
										<h2 class="inline_callout_title"><a href="<%=videoPagePath %>" title="<%=calloutTitle %>"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span></a></h2>
                                        </div>
                                   <%	}
                                    else
                                    {
                                        %>
                                            <div class ="inline-callout-details">
                                           <h2 class="inline_callout_title"><a href="<%=videoPagePath %>" title="<%=calloutTitle %>"><%=getTextWithoutLastWord%> <span class="no-wrap"> <%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span></a></h2>
                                        <%
                                        if(shortDesc != null)
                                        {
                                            %><div class="inline_callout_caption"><%=shortDesc %></div><%
                                        }
                                        %>
                                        </div>
                                        <%
                                    }

                                   %> 
                                   <div class="inline_callout_enlarge">
                                        <div id="lightbox-1" class="hidden lightbox_description">
                                            <h2><a href="#">Vestibulum tristique pharetra tincidunt.</a></h2>
                                            <p>The image caption is not restricted in its character count.</p>
                                        </div>
                                    </div>
                                    <%
                               }
                                 %>
                          </div>  
                        <%
                    }
                    else
                    {
                        %>
                        <div class="row group">
                            <div class="author">Inline Call Out Module</div>
                        </div>
                        <%
                    }
                 }
                 else
                 {
                        %>
                        <div class="row group">
                            <div class="author">Inline Call Out Module</div>
                        </div>
                        <%
                 }
            }
            else
            {
                %>
                <div class="row group">
                    <div class="author">Inline Call Out Module</div>
                </div>
                <%
            }
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
            %>
            <div class="row group">
                <div class="author">Inline Call Out Module</div>
            </div>
            <%
        }
    %>

        <%
    }
    else if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
    {
        %>
        <div class="row group">
            <div class="author">Inline Call Out Module</div>
        </div>
        <%
    }
    %>
