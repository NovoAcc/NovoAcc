<%--

  SDKS7 Video Detail component.


--%>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%>
<%@ page import="com.dupont.phoenix.video.VideoPlayer"%>
<%
   VideoPlayer videoPlayer = new VideoPlayer(resource, currentPage, slingRequest);
   pageContext.setAttribute("videoPlayer",videoPlayer);
%>
<c:choose>
    <c:when test="${(videoPlayer.scene7FileStatus == 'PublishComplete') && ( not empty videoPlayer.fileReference)}">
        <div class="parbase video-detail">
            <cq:includeClientLib categories="apps.dupont.tool.scene7video"/>

            <div id="videoplayerid" data-s7videoPath="${videoPlayer.scene7FileName}" data-s7imagePath="${videoPlayer.customThumbnailPath}"></div>
            <div id="video_detail_desc">${videoPlayer.shortDesc}</div>

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
