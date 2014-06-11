<%--

  Media gallery menu component.

  A limitless list of
galleries. The list may wrap to the next line but each
list item should remain completely on a single line.

--%><%
%><%@include file="/libs/foundation/global.jsp"%><%
%><%@page session="false" %>
<%@ page import="com.dupont.phoenix.GlobalConstants"%>


                <head>
                    <link href="/apps/m/source/css/style.css" rel="stylesheet" type="text/css"/>
                    <script src="/etc/designs/dupont/phoenix/responsiveclientlib/source/js/jquery-1.8.2.min.js"></script>

                                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />                          
                                <meta name="viewport" content="user-scalable=no, height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
                                <!-- Hiding the Safari on iPhone OS UI components -->
                                <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
                                <meta name="apple-touch-fullscreen" content="YES" />
                                <!-- Specifying a per-page Home screen icon -->
                                <link rel="apple-touch-icon" href=""/>
                    <link rel="apple-touch-startup-image" href="" />
                                <title>Adobe Scene7 Mixed Media Component</title>

                                <script language="javascript" type="text/javascript" src="<%= GlobalConstants.s7domain %>/s7sdk/2.5/js/s7sdk/utils/Utils.js"></script>
                                <script language="javascript" type="text/javascript">
                                                // temporary lib path include, this restriction will likely be removed in future releases
                                                s7sdk.Util.lib.include('s7sdk.common.Container');
                                                s7sdk.Util.lib.include('s7sdk.common.Button');
                                                s7sdk.Util.lib.include('s7sdk.video.VideoControls');                                                                                         
                                                s7sdk.Util.lib.include('s7sdk.set.MediaSet');
                                                s7sdk.Util.lib.include('s7sdk.set.SpinView');
                                                s7sdk.Util.lib.include('s7sdk.set.Swatches');
                                                s7sdk.Util.lib.include('s7sdk.image.ZoomView');
                                                s7sdk.Util.lib.include('s7sdk.video.VideoPlayer');                                              
                                </script>


                                
                </head>




<%
%><%

String galleryType = null;
String[] mixedMediaGallery = null;
String[] mixedMediaGallerytitle = null;
String[] imageSetsGallery = null;
String[] imageSetsGallerytitle = null;
String m=null;
String asset = null;
String mixedgallerymobile=null;


// Mixed Media code - start

galleryType = properties.get("galleryType",String.class);



if(galleryType.equals("MIXED_MEDIA")){




%>
<style type="text/css">
.mixedmedia{
	display: block ;
}
.imageset{
	display: none ;
}
    </style>









<%








}

if(galleryType.equals("IMAGE_SET")){


    %>
<style type="text/css">
.mixedmedia{
	display: none ;
}
.imageset{
	display: block ;
}
    </style>
<%
}


    if((properties.get("mmg",null) != null)||(properties.get("mmg",null) != "")||(properties.get("mmgt",null) != null)||(properties.get("mmgt",null) != ""))
	{
 	   mixedMediaGallery = properties.get("mmg",String[].class);
	   mixedMediaGallerytitle = properties.get("mmgt",String[].class);
	}
%>


	<ul class="mixedmedia"> 

<%
	m=mixedMediaGallery[0];

	for(int i = 0; i < mixedMediaGallery.length; i+=1) {


	 asset = mixedMediaGallery[i];

%> <li class= "btn<%=i%>" onclick="fnMohit('<%=asset%>')">  
<%
	out.println(mixedMediaGallerytitle[i]);

%> </li>  
<%

}




%>
</ul>

<!-- Mobile dropdown display -->
<nav class="mobile-mixedmedia">

		<% 
        mixedgallerymobile=mixedMediaGallery[0];
		String mobileasset = null; %>
	<select style="width: 200px;" onchange="fnMohit(this.value)">
    <%    for(int j = 0; j < mixedMediaGallery.length; j+=1) {
	 mobileasset = mixedMediaGallery[j];

            if(j==0){
      %> 

        <option value="<%=mobileasset%>" selected="selected"><%=mixedMediaGallerytitle[j]%></option>


        <%}else{%>
	<option value="<%=mobileasset%>"><%=mixedMediaGallerytitle[j]%></option>
        <%}
	out.println(mobileasset);



} %>
        </select>
    </nav>



<br/><br/>

<div class="imageset"> 
<%
// Mixed Media code end

//Image Set code start


if((properties.get("isg",null) != null)||(properties.get("isg",null) != "")||(properties.get("isgt",null) != null)||(properties.get("isgt",null) != ""))
{
    imageSetsGallery = properties.get("isg",String[].class);
	imageSetsGallerytitle = properties.get("isgt",String[].class);
}


for(int i = 0; i < imageSetsGallery.length; i+=1) {

asset = imageSetsGallery[i];
 %> <button class= "btn<%=i%>" onclick="fnMohit('<%=asset%>')">  <%

out.println(imageSetsGallerytitle[i]);

     %> </button>  <%
}




%>


</div>

                                
<div id="unitTestController"></div>
<div id="toolbar"></div>



<script type="text/javascript" src="/apps/m/source/js/script.js"></script>


<script> 


    var assets='<%=m%>';

    var position = 0;

               s7sdk.Util.init();

                // create ParameterManager instance that will handle modifiers
                var s7params = new s7sdk.ParameterManager(null, null, { "asset" : "MediaSet.asset" });
                var s7zoomview, s7spinview, s7swatches, s7videoplayer;
                var container, mediaSet, videoPath, videoPreview;




    			// set up a function that will initialize the viewer
                function initViewer(){
                 

                                // hardcoded modifiers
                                s7params.push("serverurl", "http://s7d1.scene7.com/is/image");
                                s7params.push("videoserverurl", "http://s7d1.scene7.com/is/content/");
                                //s7params.push("asset", "Viewers/MediaSet-Sample-B");
                                s7params.push("asset", assets);
                                s7params.push("fmt", "png");
                                s7params.push("iconeffect", "1,-1,0.3,0");
                                s7params.push("autoplay", "false");
                                s7params.push("tmblayout", "0,1");

                                // Create a viwer container
								container = new s7sdk.Container(null, s7params, "s7container");
                                container.addEventListener(s7sdk.ResizeEvent.COMPONENT_RESIZE, onResize, false);
                                container.addEventListener(s7sdk.ResizeEvent.WINDOW_RESIZE, onResize, false);

								s7swatches = new s7sdk.Swatches("s7container", s7params, "testSwatches");
                                s7swatches.addEventListener(s7sdk.AssetEvent.SWATCH_SELECTED_EVENT, swatchSelected, false);
                                s7zoomview = null; 
                                s7spinview = null;
                                s7videoplayer = null;
                                videoPreview = null;

                                var size = getWindowSize();
                                container.resize(size.w, size.h);

                                // change the image displayed in the main view every time the swatch selection changes
                                function swatchSelected(event) {
                                                var asset = event.s7event.asset;
                                                var type = asset.type;
                                                var zmvw, spvw;
                                                //pause video playback
                                                if (s7videoplayer)
                                                                s7videoplayer.pause();
                                                // Hide all
                                                displayElement("testZoomView", false);
                                                displayElement("testSpinview", false);
                                                displayElement("testVideoView", false);
                                                
                                                if (type == 1) { // ImageSet
                                                                if (s7zoomview == null) // Create the viewer on demand
                                                                                s7zoomview = new s7sdk.ZoomView("s7container", s7params, "testZoomView");

                                                                s7zoomview.setItem(asset);
                                                                displayElement("testZoomView", true);
                                                                return;
                                                }

                                                if (type == 2) { // VideoSet
                
                                                                if (s7videoplayer == null){
                                s7videoplayer = new s7sdk.video.VideoPlayer("s7container",s7params,"testVideoView");                                                          
                                                                }
                                                                                
                                                                s7videoplayer.setItem(asset);

                                                                displayElement("testVideoView", true);
                                                                return;
                                                }
                                                
                                                if (type == 8) { // SpinView
                                                                if (s7spinview == null) { // Create the viewer on demand
                                                                                s7spinview = new s7sdk.SpinView("s7container", s7params, "testSpinview");
                                                                                s7spinview.setDragToSpin(true);
                                                                }

                                                                s7spinview.setMediaSet(asset, s7sdk.ItemDescType.VIDEO | s7sdk.ItemDescType.SPIN_SET);
                                                                displayElement("testSpinview", true);
                                                                return;
                                                }
                                }
                                // MediaSet does not require the first or last parameter
                                mediaSet = new s7sdk.MediaSet(null, s7params, null);

                                // The NOTF_SET_PARSED event will be sent each time a new asset is loaded.
                                mediaSet.addEventListener(s7sdk.AssetEvent.NOTF_SET_PARSED,onSetParsed, false);
                }
                // the ParameterManager will dispatch SDK_READY when all modifiers have been processed
                // and it is safe to initalize the viewer
                s7params.addEventListener(s7sdk.Event.SDK_READY,initViewer,false);

                // now it is safe to process the modifiers, the callbacks have been defined
                // this will trigger the SDK_READY event
                s7params.init();
                
                function playVideo() {
                                window.location.href = videoPath;
                }
                
                function centerPreview(obj) {
                                obj.style.marginTop = -obj.clientHeight / 2 + 'px';
                }
                
                function displayElement(elementId, show) {
                                var element = document.getElementById(elementId);
                                if (element) {
                                                if (!show){
                                                                element.style.position = 'absolute';
                                                                element.style.left = '-99999px';
                                                }else{
                                                                element.style.left = '0px';
                                                }
                                                //element.style.display = show ? 'block' : 'none';
                                }
                }
                                                
                function onResize(event) {
                                s7swatches.resize(event.s7event.w - 2, s7swatches.size.height); // Exclude the border width (2px)

                                if (s7zoomview)
                                                s7zoomview.resize(event.s7event.w, event.s7event.h);

                                if (s7spinview)
                                                s7spinview.resize(event.s7event.w, event.s7event.h);
                                                
                                if (s7videoplayer)
                                                s7videoplayer.resize(event.s7event.w, event.s7event.h);
                }

                function getWindowSize() {
                                var winW = 630, winH = 460;
                                if (document.body && document.body.offsetWidth) {
                                                winW = document.body.offsetWidth;
                                                winH = document.body.offsetHeight;
                                }
                                if (document.compatMode=='CSS1Compat' &&
                                                document.documentElement &&
                                                document.documentElement.offsetWidth ) {
                                                winW = document.documentElement.offsetWidth;
                                                winH = document.documentElement.offsetHeight;
                                }
                                if (window.innerWidth && window.innerHeight) {
                                                winW = window.innerWidth;
                                                winH = window.innerHeight;
                                }
                                
                                var size = new s7sdk.Point2D();
                                size.w = winW;
                                size.h = winH;
                                return size;
                }
                
                // once the set is parsed, assign it to the SpinView
                function onSetParsed(event) {
                                var asset = event.s7event.asset;

                                // set media set for Swatches to display
                                s7swatches.setMediaSet(asset);

                                // select the first swatch
                                s7swatches.selectSwatch(position, true);
                    			swatchCount = ($('.s7thumb').length);
                                fnDisplayCount(swatchCount);

                }



function fnMohit(m)
{

//s7sdk.Util.init();

                // create ParameterManager instance that will handle modifiers
    s7params = new s7sdk.ParameterManager(null, null, { "asset" : "MediaSet.asset" });
    clearBox('s7container');
    container = new s7sdk.Container(null, s7params, "s7container");
     s7swatches = new s7sdk.Swatches("s7container", s7params, "testSwatches");
    // s7swatches.addEventListener(s7sdk.AssetEvent.SWATCH_SELECTED_EVENT, swatchSelected, false);
    //                          s7zoomview = null; 
    //                          s7spinview = null;
    //                          s7videoplayer = null;
    //    videoPreview = null;




assets = m;
    // s7params.init();

    s7params.addEventListener(s7sdk.Event.SDK_READY,initViewer,false);
    s7params.init();
}


    /*
$('.mohit').html("");
//alert($('.mohit').html());
var i=0;
$(test.split(' ,')).each(function (index,character) {
   // alert(character);
    $('.mohit').append( "<a onclick=\"s7sdk.Util.init()\" id=\"anchor"+ i+"\">"+ character +"</a>" );

    $("#anchor"+i).click(function() {


});

i++;


});

*/
function clearBox(elementID)
{
    document.getElementById(elementID).remove();
}
   function fnPrev(){
position=s7swatches.getFrame();
	s7swatches.selectSwatch(position-1, true);
       fnDisplayCount(swatchCount);
    }
    function fnNext()
    {

		position=s7swatches.getFrame();
        s7swatches.selectSwatch(position+1, true);
        fnDisplayCount(swatchCount);
    }
function fnDisplayCount(swatchCount)
{
  	var infoText;
    position=s7swatches.getFrame();
    infoText = (position+1)+" of "+ swatchCount;
    document.getElementById("pageinfo").innerHTML=infoText;
    //alert(infoText);
    }

</script>
<div class="buttons">
	<button class= "prev" onclick="fnPrev()">Prev</button>
    <button class= "next" onclick="fnNext()">Next</button>
    <span id="pageinfo"></span>
</div>
