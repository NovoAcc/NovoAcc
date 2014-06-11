<%--
    @Author: Avi Khatri
    @Description: Utility Component to get the featured Content for other components to use.
    @Date Updated: Dec 21 2012
--%>
<%@include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="java.util.Iterator, 
    javax.jcr.Node, 
    javax.jcr.NodeIterator, 
    javax.jcr.PropertyIterator, 
    javax.jcr.Property, 
    com.dupont.phoenix.Global,
    org.apache.jackrabbit.commons.JcrUtils, 
    com.day.cq.wcm.api.WCMMode,
    org.apache.commons.lang.StringUtils,
    com.dupont.phoenix.commons.Scene7Image,
    com.day.cq.wcm.foundation.Image,
    com.day.cq.wcm.api.components.DropTarget,
    org.apache.sling.api.resource.ResourceResolver"%>
<%
        String playerKey = "";
        String playerID = "";
        String videoID = "";
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
               
               /* iterate through the child pages and gather properties */
               if (videoPage != null) 
               {   
                   videoPagePath = videoPage.getPath();    
                   if(videoPagePath != null)
                       videoPagePath = Global.getNavigationURL(slingRequest,videoPagePath.substring(0, videoPagePath.length()),false) + ".html";
                   
                   Node videoPageNode = videoPage.adaptTo(Node.class);
                   Node jcrNode = videoPageNode.getNode("jcr:content");
                   
                   if(jcrNode.hasNode("videoplayer"))
                   {
                       Node videoplayerNode = jcrNode.getNode("videoplayer");
                       if(videoplayerNode.hasProperty("videoPlayer"))
                       {
                           if(videoplayerNode.getProperty("videoPlayer").getString() != "" && videoplayerNode.getProperty("videoPlayer").getString() != null)
                               videoID = videoplayerNode.getProperty("videoPlayer").getString();
                       }
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
/*
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
*/

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
                   
                   if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId",String.class) != ""))
                   {
                       playerID = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class);
                   }
                   if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != ""))
                   {
                       playerKey = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class);
                   }

                       /*Check if the overlay is enabled*/
                          if(currentNode.hasProperty("overlay"))
                          {
                              if(!"".equalsIgnoreCase(thumbnailPath) && thumbnailPath != null)
                              {
                                    %>
                                        <a class="<%=Global.getEventTrackingClassName(resource)%>" seamlesstabbing="false" flashid="myExperience" playerkey="<%=playerKey %>" data-video-id="<%=videoID %>" playerid="<%=playerID %>" data-caption="<%=shortDescForOverlay %>" data-title="<%=calloutTitleForOverlay %>" title="<%=calloutTitleForOverlay %>" class="video video-fancybox" href="<%=videoPagePath %>">
                                            <img width="300" height="150" data-title-id="lightbox-1" src="<%=thumbnailPath %>">
                                       </a>
                                    <%
                              }
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


                                    image.addCssClass(DropTarget.CSS_CLASS_PREFIX + "image");
                                    image.draw(out);
                              }
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
