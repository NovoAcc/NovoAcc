<%--

  Video Media Gallery component.

  A component to display and play a video playlist from Brightcove.

--%><%@ page
    import="com.day.cq.wcm.api.WCMMode,com.day.cq.wcm.api.components.DropTarget"%>
<%@ page
    import="org.apache.commons.lang.StringUtils,com.dupont.phoenix.Global "%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>

<%

String videoTitle= Global.getTranslatedText(currentPage, slingRequest,"Videos");
String[] videoPlaylistID = null;
String playerId = StringUtils.EMPTY;
String playerKey = StringUtils.EMPTY;
String playlistIDs = "";
int  maxNoOfPlaylist = 4;
int width = 956;
int height = 500;
if((currentDesign.getStyle("siteconfig/videogallery").get("galleryVideoPlayerId", String.class) != null) || (currentDesign.getStyle("siteconfig/videoplayer").get("galleryVideoPlayerId",String.class) != ""))
{
    playerId = currentDesign.getStyle("siteconfig/videogallery").get("galleryVideoPlayerId", String.class);
}
if((currentDesign.getStyle("siteconfig/videogallery").get("galleryVideoPlayerKey", String.class) != null) || (currentDesign.getStyle("siteconfig/videogallery").get("galleryVideoPlayerKey", String.class) != ""))
{
    playerKey = currentDesign.getStyle("siteconfig/videogallery").get("galleryVideoPlayerKey", String.class);
}
if(properties.get("videoPlaylistID",null)==null)
    {
    }
    else if(properties.get("videoPlaylistID",String[].class)!=null)
    {
        videoPlaylistID = properties.get("videoPlaylistID",String[].class);
        
        for(int index = 0; index < (videoPlaylistID.length<maxNoOfPlaylist?videoPlaylistID.length:maxNoOfPlaylist ); index++  )
        {
              playlistIDs = playlistIDs + videoPlaylistID[index] + "," ;     
        }
        playlistIDs = playlistIDs.substring(0,playlistIDs.lastIndexOf(','));
    }
if(!StringUtils.isEmpty(playerId) && !StringUtils.isEmpty(playerKey) && (playlistIDs != null && playlistIDs != ""))
{
%>
<script language="JavaScript" type="text/javascript"
    src="https://sadmin.brightcove.com/js/BrightcoveExperiences.js"></script>

<script type="text/javascript"
    src="https://sadmin.brightcove.com/js/APIModules_all.js"> </script>

<script type="text/javascript"
    src="https://files.brightcove.com/bc-mapi.js"></script>

<div class="row group hlm-div-id">
    <h2 class="row-title padding-left"><%= videoTitle %></h2>
    <div class="padding-left">
        <object id="myExperience1" class="BrightcoveExperience">
            <param name="bgcolor" value="#FFFFFF" />
            <param name="width" value="<%= width %>" />
            <param name="height" value="<%= height %>" />
            <param name="playerID" value="<%=playerId %>" />
            <param name="@playlistTabs" value="<%=playlistIDs%>" />
            <param name="playerKey" value="<%=playerKey %>" />
            <param name="isVid" value="true" />
            <param name="isUI" value="true" />
            <param name="dynamicStreaming" value="true" />
            <param name="wmode" value="transparent" />
        </object>

        <script type="text/javascript">brightcove.createExperiences();</script>
    </div>
</div>
<%}
else if(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT)
{

    if( videoPlaylistID!=null && (StringUtils.isEmpty(playerId) || StringUtils.isEmpty(playerKey)))
    {
        %>
<h2 class="row-title padding-left">Add Player Id and Player Key in Site Config</h2>
<%      
    }else
    {
%>
<h2 class="row-title padding-left">Add Video Media Gallery Component</h2>
<%}
}%>
<div style="clear: both"></div>