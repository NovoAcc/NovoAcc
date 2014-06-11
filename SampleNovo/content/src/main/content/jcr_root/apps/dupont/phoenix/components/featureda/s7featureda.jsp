<%--
    @Author: Avi Khatri
    @Description: Utility Component to get the featured Content for other components to use.
    @Date Updated: Dec 21 2012
--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="
    com.dupont.phoenix.Global,
	java.util.Iterator, 
    javax.jcr.Node, 
    javax.jcr.NodeIterator, 
    javax.jcr.PropertyIterator, 
    javax.jcr.Property, 
    org.apache.jackrabbit.commons.JcrUtils, 
    com.day.cq.wcm.api.WCMMode,
    org.apache.commons.lang.StringUtils,
    com.dupont.phoenix.commons.Scene7Image,
    com.day.cq.wcm.foundation.Image,
    com.day.cq.wcm.api.components.DropTarget,
    org.apache.sling.api.resource.ResourceResolver,
  com.day.cq.dam.api.Asset,
  com.dupont.phoenix.GlobalConstants"%>
<%
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
        String shortDescForOverlay = "";
        String calloutTitleForOverlay = "";
        String videoPagePath = "";
        String thumbnailPath = "";
        String getTextLastWord = "";
        String getTextWithoutLastWord = "";  

        if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
        {
            %>
            <div class="row group">
                <div class="author">Featured Module A</div>
            </div>
            <%
        }

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
            if (videoPage != null) 
            {
               videoPagePath = videoPage.getPath();
               if(videoPagePath != null)
                   videoPagePath = Global.getNavigationURL(slingRequest,videoPagePath.substring(0, videoPagePath.length()),false) + ".html";

               Node videoPageNode = videoPage.adaptTo(Node.class);
               Node jcrNode = videoPageNode.getNode("jcr:content");

               if(jcrNode.hasNode("videoplayer"))
               {
            	   
            	   //out.println("Hello world!");
                   Node videoplayerNode = jcrNode.getNode("videoplayer");

                   /* ********** Changes for s7SDK video light box ********** */

                   if(videoplayerNode.hasProperty("fileReference"))
                   {
                       String assetDamRef = videoplayerNode.getProperty("dam:scene7File").getString();
                       videoThumbnail = videoplayerNode.getProperty("fileReference").getString();
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
                      //out.println(videoThumbnail);
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
                                       s7SdkLink = GlobalConstants.s7domain+"/s7viewers/html5/VideoViewer.html?stageSize=630,355&asset="+scene7FileName;
                                      //out.println(s7SdkLink);
                                   }
                                     videoShortDescObj =asset.getMetadata("dc:description");
                                     if( videoShortDescObj != null){
                                         if( videoShortDescObj instanceof Object[]) {

         									Object[] descriptionArray = (Object[]) videoShortDescObj;
                                              videoShortDesc = ( descriptionArray.length > 0) ? descriptionArray[0].toString() : "";
                                         } else {
                                             videoShortDesc = videoShortDescObj.toString();
                                         }
                                              //out.println(videoShortDesc);
                                      }



                                      videoTitleObj =asset.getMetadata("dc:title");
                                      if(videoTitleObj != null){

                                          if(videoTitleObj instanceof Object[]) {
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

        //Content Detail headline condition omitted as Featured A must equal as Featured B and display only Short Headline.

                /*if(jcrNode.hasNode("contentdetailheadline"))
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
                       }*/

                   if(currentNode.hasNode("video"))
                   {
                       Node contentNode = currentNode.getNode("video");
                       if(contentNode.hasProperty("jcr:title"))
                       {
                           if(contentNode.getProperty("jcr:title").getString() != "" && contentNode.getProperty("jcr:title").getString() != null)
                           {
                               calloutTitleForOverlay = contentNode.getProperty("jcr:title").getString();
                           }
                       }
                       if(contentNode.hasProperty("jcr:description"))
                       {
                           if(contentNode.getProperty("jcr:description").getString() != "" && contentNode.getProperty("jcr:description").getString() != null)
                           {
                                shortDescForOverlay = contentNode.getProperty("jcr:description").getString();
                           }
                       }
                   }
                if(calloutTitleForOverlay.isEmpty()&&shortDescForOverlay.isEmpty())
                {
          calloutTitleForOverlay = videoTitle;
                    shortDescForOverlay = videoShortDesc;
                }

                   
                   if(jcrNode.hasNode("bodycopy"))
                   {
                       Node bodycopyNode = jcrNode.getNode("bodycopy");
                       if(bodycopyNode.hasNode("heroimage"))
                       {
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
                           Node thumbnailNode = jcrNode.getNode("thumbnail");
                           if(thumbnailNode.hasProperty("fileReference"))
                           {
                               if(thumbnailNode.getProperty("fileReference").getString() != "" && thumbnailNode.getProperty("fileReference").getString() != null)
                                   thumbnailPath = thumbnailNode.getProperty("fileReference").getString();
                           }

                       }


                   }

                /*  ********** Changes for s7SDK video light box ********** 
                   if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId",String.class) != ""))
                   {
                       playerID = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class);
                   }
                   if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != ""))
                   {
                       playerKey = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class);
                   }*/
                   
                   %>
                   <div class="s7featuredViewer featured-a"  data-asset="<%=scene7FileName%>"></div>
                   <script src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/inline-scene7-mobile.js"> </script>
                   <%

                       /*Check if the overlay is enabled*/
                          if(currentNode.hasProperty("overlay"))
                          {
                              if(!"".equalsIgnoreCase(thumbnailPath) && thumbnailPath != null)
                              {%>
                                <div class="s7-fancy-video fancy-featureda" data-s7asset="<%=scene7FileName%>" data-width="630" data-height="355" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>" >
                                  <a class="s7-fancy-video" data-s7asset="<%=scene7FileName%>" data-width="630" data-height="355" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>" href="#">
                                  <img width="300" height="150" src="<%=thumbnailPath %>">
                                  </a>
                                </div>
                               <%
                              }
                              else if(!"".equalsIgnoreCase(videoThumbnail) && videoThumbnail != null){%>
								<div class="s7-fancy-video fancy-featureda" data-s7asset="<%=scene7FileName%>" data-width="630" data-height="355" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>">
                  <a class="s7-fancy-video" data-s7asset="<%=scene7FileName%>" data-width="630" data-height="355" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>" href="#">
                  <img width="300" height="150" src="<%=videoThumbnail %>">
                  </a>
                  <span class="featurea-play-button-overlay"></span></div>
                			<%}%>
                                <a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=videoPagePath %>">
                                  <h2><%=getTextWithoutLastWord%> 
                                       <span class="no-wrap"><%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span>
                                   </h2>
                                </a>
                                <% if(StringUtils.isEmpty(videoThumbnail )){ %>
                                   <p><%=shortDesc %></p>
                                <%}%>  
                                <div style="display:none;" class="hidden lightbox_description" id="lightbox-1">
                                    <h4><%=shortDescForOverlay %></h4>
                                    <p>The image caption is not restricted in its character count.</p>
                                </div>
                            <%
                          }
                          else
                          {
                              if(!"".equalsIgnoreCase(thumbnailPath) && thumbnailPath != null)
                              {
                                    ResourceResolver resolver = resource.getResourceResolver();
                                    Resource res = resolver !=null ? resolver.getResource(selectedContent + "/jcr:content") : null;

                                    Scene7Image image = new Scene7Image(res,"thumbnail",slingRequest);
                                    image.set(Image.PN_HTML_WIDTH, "300");
                                    image.set(Image.PN_HTML_HEIGHT, "150");
                                    image.setSelector("img");

%><a data-s7asset="<%=scene7FileName%>" data-width="630" data-height="355" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>" href="<%=videoPagePath%>"><%
                                    image.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image");
                                    image.draw(out);
                                    %></a><%
                              }
                              else if(!"".equalsIgnoreCase(videoThumbnail) && videoThumbnail != null)
                              {
                           
                                    String cssClass = DropTarget.CSS_CLASS_PREFIX + "image";%>
                            <a data-s7asset="<%=scene7FileName%>" data-width="630" data-height="355" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>" href="<%=videoPagePath%>">
                  				   <img width="300" height="150" class="<%=cssClass%> " src="<%=videoThumbnail %>">
                            </a>
                              <%}
                              %>
                                <a class="<%=Global.getEventTrackingClassName(resource)%>" href="<%=videoPagePath %>">
                                  <h2><%=getTextWithoutLastWord%> 
                                       <span class="no-wrap"><%=getTextLastWord%><img class="cta-arrow" src="/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png"></span>
                                   </h2>
                                </a>
                                <% if(StringUtils.isEmpty(thumbnailPath )){ %>
                                   <p><%=shortDesc %></p>
                                <%}%>  
                                <div style="display:none;" class="hidden lightbox_description" id="lightbox-1">
                                <h4><%=shortDesc %></h4>
                                <p>The image caption is not restricted in its character count.</p>
                                </div>
                              <%                            
                          }
               }
         }
       }
    }
    catch(Exception ex)
    {
        ex.printStackTrace();
    }
%>
