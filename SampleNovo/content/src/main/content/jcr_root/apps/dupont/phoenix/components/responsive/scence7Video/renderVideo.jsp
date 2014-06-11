<%@ page session="false" %>
<div id="scene7_video"></div>

<script type="text/javascript">
    var areawidth = $(window).width();
    if(areawidth>768)
    {
        document.getElementById("scene7_video").style.height="315px";
        document.getElementById("scene7_video").style.width="630px";
    }
    else if(areawidth>600 && areawidth <=768)
    {
        document.getElementById("scene7_video").style.height="194px";
        document.getElementById("scene7_video").style.width="388px";
    }else if(areawidth>480 && areawidth <=600)
    {
        document.getElementById("scene7_video").style.height="150px";
        document.getElementById("scene7_video").style.width="300px";
    }
	else if(areawidth <=480)
	{
        document.getElementById("scene7_video").style.height="120px";
        document.getElementById("scene7_video").style.width="240px";		
	}
    CQ.scene7.videoViewer.initJS("<%=domain%>");
    CQ.scene7.videoViewer.initializeViewer("scene7_video", "<%=assetPath%>", "<%=universalPreset%>");
</script>