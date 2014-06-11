<%--

  Video Player component.

  A component to play a video on a page.

--%>
<%@ page
    import="com.day.cq.wcm.api.WCMMode,
            com.day.cq.wcm.api.Page,
            java.util.Date,
            java.text.DateFormat,
            java.text.SimpleDateFormat"%>
    
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%
String videoId = null;
String playerId = null;
String playerKey = null;
String pagePath = null;
String desc = "";
if((properties.get("videoPlayer",String.class) != null) || (properties.get("videoPlayer",String.class) != ""))
{
    videoId = properties.get("videoPlayer",String.class);
}
if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId",String.class) != ""))
{
    playerId = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerId", String.class);
}
if((currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class) != ""))
{
    playerKey = currentDesign.getStyle("siteconfig/videoplayer").get("videoPlayerKey", String.class);
}
if((properties.get("desc",String.class) != null) && (properties.get("desc",String.class) != ""))
{
    desc = properties.get("desc",String.class);
}

if(currentPage.getPath() != null)
{
    pagePath = request.getRequestURL().toString();
}
if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
{
    if(videoId ==null)
    {%>
        <h1>Add Video Player Component</h1> 
    <%}
    else if(playerId == null || playerKey == null)
  {%>
        <h1>Enter Video Player Detail in Site Config</h1>
    <%}
}

if(videoId != null && playerId != null && playerKey != null)
{
    %>
<div class="outer-container">
    <script language="JavaScript" type="text/javascript" src="https://sadmin.brightcove.com/js/BrightcoveExperiences.js"></script>
    <script type="text/javascript" src="https://sadmin.brightcove.com/js/APIModules_all.js"> </script>
    <script type="text/javascript" src="https://files.brightcove.com/bc-mapi.js"></script>
	 <div class="video_player">
        <object id="myExperience1" class="BrightcoveExperience">
            <param name="bgcolor" value="#FFFFFF" />
            <param name="playerID" value="<%=playerId%>" />
            <param name="@videoPlayer" value="<%=videoId %>" />
            <param name="isVid" value="true" />
            <param name="isUI" value="true" />
            <param name="playerKey" value="<%=playerKey%>" />
            <param name="wmode" value="transparent" />
             <param name="dynamicStreaming" value="true" />
        </object>
        <%
        if(desc != null && !"".equalsIgnoreCase(desc))
        {
            %>
                <div class="hero_image-caption"><%=desc %></div>
            <%
        }
        %>
	</div>
    <script type="text/javascript">brightcove.createExperiences();</script>
</div>
    <div class="video-print-msg"> 
        Video content is available on this web page at <a href="<%=pagePath%>"><%=pagePath%></a>
    </div>
<%}%>
<div style="clear:both"></div>
