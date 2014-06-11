<%--

  SDKS7 Video Detail component.


--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="org.apache.sling.api.resource.Resource,com.dupont.phoenix.GlobalConstants,com.dupont.phoenix.video.VideoPlayer,com.day.cq.wcm.foundation.Image,com.dupont.phoenix.commons.Scene7Image,org.apache.sling.api.resource.ValueMap"%>

<%
//Initialize
	boolean hasImage = false;
	String imageSource = "";
	String imgSrc = ""; 
	String titleText = "";
	Image image = null;
	ValueMap imageProps = null;

   VideoPlayer videoPlayer = new VideoPlayer(resource, currentPage, slingRequest);
   pageContext.setAttribute("videoPlayer",videoPlayer);
   
   Resource imageResource = (resource.getChild("image"));
   
   
   
   if(imageResource!=null)
   {
	  image = new Scene7Image(imageResource, slingRequest);
	  imageProps = imageResource.adaptTo(ValueMap.class);
      

	   if(null != imageProps.get("fileReference"))
	   {
			imageSource = imageProps.get("fileReference").toString();
	   }
		   
	   if (image.hasContent() ){
	      hasImage = true;
	   } else {
	      hasImage= false;
	   }
   }


	if (null != properties.get("titleText")) {
       titleText = properties.get("titleText").toString();
   }
	
	if(hasImage)
	{
		if(imageProps!=null && null != imageProps.get("dam:scene7URL"))
   		{
   			imgSrc = imageProps.get("dam:scene7URL").toString();
   		}
   		else
   		{
   			imgSrc = imageSource;
   		}
		%>
				
			<img class="hero-video-img" src="<%=imgSrc %>"/>
            <div class="hero-description-box" style="background:#CD0628;">
                <h2 class="hero-title"><%=titleText %></h2>
                <div class="play-now">
                    <div class="play-button"></div>
                    <span>Play Now</span>
                </div>
            </div>
            <script type="text/javascript">
                $('.hero-description-box').on("click", function(){
                    //$('.hero-description-box, .hero-video-img').fadeOut(500);
                    $('.hero-description-box, .hero-video-img').animate({opacity:0}, 500, function () { $(this).css("visibility","hidden")});
                });
            </script>
		<%
	}

%>
<c:choose>
    <c:when test="${(videoPlayer.scene7FileStatus == 'PublishComplete') && ( not empty videoPlayer.fileReference)}">
        <div class="parbase video-detail">

             <%-- Added SDKS7 Video player JS to display the Video . --%>
            <script src="<%= GlobalConstants.s7domain %>/s7sdk/2.5/js/s7sdk/utils/Utils.js"></script>
            <script>
                var _scene7FileName = "${videoPlayer.scene7FileName}";
            </script>
            <script src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/FullBleedVideoViewer.js"></script>


            <div id="videoplayerid"></div>
       <%-- <div id="video_detail_Title">${videoPlayer.videoTitle}</div> --%>
            <div id="video_detail_desc">${videoPlayer.shortDesc}</div>

            <c:if test="${videoPlayer.shouldShowDetail}">  
                <div id="video_subdesc_wrap">
                    <div id="video_subdesc">
                        <span class="video_subdesc_italic">Specifications: </span>
                    </div>
                    <br>
                    <br>

                    <div id="video_subdesc">
                        <span class="video_subdesc_italic">Video Type</span><br>
                        <span class="video_subdesc_bold">${videoPlayer.fileFormat}</span>
                    </div>
                    <div id="video_subdesc">
                        <span class="video_subdesc_italic">Date</span><br>
                        <span class="video_subdesc_bold">${videoPlayer.lastModified}</span>
                    </div>
                    <div id="video_subdesc">
                        <span class="video_subdesc_italic">File Size</span><br>
                        <span class="video_subdesc_bold">${videoPlayer.size}</span>
                    </div>
                    <div id="video_subdesc">
                        <span class="video_subdesc_italic">Dimension</span><br>
                        <span class="video_subdesc_bold"> 600 x 350 </span>
                    </div>
                </div>
            </c:if>
        </div>
    </c:when>
    <c:otherwise>
        <c:if test="${videoPlayer.author}">
            <c:choose>
                <c:when test="${empty videoPlayer.fileReference}">
                    Please enter Video Path
                </c:when>
                <c:otherwise>
                    Please publish video to Scene 7
                </c:otherwise>
            </c:choose>
        </c:if>
    </c:otherwise>
</c:choose>
<div style="clear:both"></div>
