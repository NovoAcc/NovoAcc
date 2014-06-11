<%@include file="/libs/foundation/global.jsp"%>
<%
String width = properties.get("width", String.class);
String height = properties.get("height", String.class);
if (height == null) {
    height = "100px";
}
if (width == null) {
    width = "100%";
}
%>
<script>
// To add image tag to the #banner
function createBanner(banners){
	
	if (banners[0].top) {
	    //do something
		 $("#banner").html(banners[0].top);
	}else{
	    var tempImgTag = "<p>Banner not available</p>";
		$("#banner").html(tempImgTag);
		}
	
}
</script>
<div id="banner" class="banner_cls" style="height:<%=height%>; width:<%=width%>">Search is currently not available.</br>Search & Promo Service is not configured.</div>
