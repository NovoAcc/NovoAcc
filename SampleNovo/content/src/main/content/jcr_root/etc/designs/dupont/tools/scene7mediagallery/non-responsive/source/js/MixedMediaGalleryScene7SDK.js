if (window.addEventListener){
	  window.addEventListener('load', initS7SDK, false);
}else if (window.attachEvent){
	  window.attachEvent('onload', initS7SDK); 
}

var assets, path,
	position = 0,
	isMobile = new Boolean(false),
	s7zoomview, s7swatches, s7videoplayer, s7videotoolbar, s7closeButton, controls, fullscreenbutton, trackingManager,
	container, mediaSet, videoPath, videoPreview, s7params, playPauseButton, videoScrubber, videoTime, mutableVolume; 

function initS7SDK() {

    
    // Avoid loading Default CSS from S7
    s7sdk.Util.css.addDefaultCSS = function(){ }
    
    //Include necessary components (Video, Swatches and Zoom View.)
    s7sdk.Util.lib.include('s7sdk.common.Button');
    s7sdk.Util.lib.include('s7sdk.common.Container');
    s7sdk.Util.lib.include('s7sdk.event.Event');
    s7sdk.Util.lib.include('s7sdk.video.VideoControls');
    s7sdk.Util.lib.include('s7sdk.video.VideoPlayer');
    s7sdk.Util.lib.include('s7sdk.set.MediaSet');
    s7sdk.Util.lib.include('s7sdk.set.Swatches');
    s7sdk.Util.lib.include('s7sdk.image.ZoomView');
    //if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
        s7sdk.Util.lib.include('s7sdk.common.ControlBar');
	//}
	
	
	// create ParameterManager instance that will handle modifiers
	s7sdk.Util.init();
    
    // Try basic Param Manager. This is called only once.
    //s7params = new s7sdk.ParameterManager();
	s7params = new s7sdk.ParameterManager(null, null, { "asset" : "MediaSet.asset" });
    
    // the ParameterManager will dispatch SDK_READY when all modifiers have been processed
    // and it is safe to initalize the viewer
	s7params.addEventListener(s7sdk.Event.SDK_READY, function() {initSiteCatalyst(initViewer);}, false);
    //s7params.addEventListener(s7sdk.Event.SDK_READY,initViewer,false);
    
    // now it is safe to process the modifiers, the callbacks have been defined
    // this will trigger the SDK_READY event
	 s7params.init();
		
	//Function for active link mixedmedia Tab menu
	$(document).ready(function () {
        
        if(!$('ul.mixedmedia li').hasClass('active')){
            $('ul.mixedmedia li').first().addClass('active');
        }
        
	    $(".mixedmedia li").click(function () {
	        $(".mixedmedia li").removeClass("active");
	        $(this).addClass("active");

	    });
	});

}

initSiteCatalyst = function(inCallback) {
    window.s7ComponentEvent = function s7ComponentEvent(objID, compClass, instName, timeStamp, eventData) {		    	
    	console.log("s7ComponentEvent(" + objID + ", " + compClass + ", " + instName + ", "	+ timeStamp + ", " + eventData + ")");		    	
        if (typeof s7track == "function") {
            s7track(eventData);
        }
    }
    var jsp_src = s7domain+'/s7viewers/s_code.jsp?company=eidupont';
    var elem = document.createElement("script");
    elem.setAttribute("language", "javascript");
    elem.setAttribute("type", "text/javascript");
    elem.setAttribute("src", jsp_src);
    var elems = document.getElementsByTagName("head");
    var self = this;
    elem.onload = elem.onerror = function() {
        if (!this.executed) {
            this.executed = true;
            if (typeof inCallback == "function") {
                inCallback();
            }
        }
    };
    elem.onreadystatechange = function() {
        var self = this;
        if (this.readyState == "complete" || this.readyState == "loaded") {
            setTimeout(function() {
                self.onload();
                self.onreadystatechange = null
            }, 0);
        }
    };
    elems[0].appendChild(elem);
};

/* Init viewer code */
function initViewer() {
    // hardcoded modifiers
    
    // Global for all viewers
    s7params.push("serverurl", s7domain+"/is/image/");
    s7params.push("asset", assets);
    
    // Video params
    s7params.push("contentroot", s7domain+"/skins/");
    s7params.push("videoserverurl", s7domain+"/is/content/");
    s7params.push("config", "Scene7SharedAssets/Universal_HTML5_Video");
    
    s7params.push("autoplay", "0");
    s7params.push("stagesize","630,355");
    //s7params.push("singleclick", "playPause");
    s7params.push("iconeffect", "1,-1,0.3,0");
    
    // Swatches params
    s7params.push("tmblayout", "0,4");
    s7params.push("scrollstep", "2,4");
    s7params.push("orientation", "1");
    s7params.push("fmt", "png");
    
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        s7params.push("playback", "native,1");
    }
    
    // Create a viwer container
    container = new s7sdk.Container("multimedia-container", s7params, "s7container");
    // container.addEventListener(s7sdk.ResizeEvent.COMPONENT_RESIZE, onResize, false);
    // not yet container.addEventListener(s7sdk.ResizeEvent.WINDOW_RESIZE, onResize, false);
    container.addEventListener(s7sdk.event.ResizeEvent.COMPONENT_RESIZE, resizeViewer, false);
    container.addEventListener(s7sdk.event.ResizeEvent.FULLSCREEN_RESIZE, fullScreenEnter, false);
    
    /********************** SWATCHES CODE ******************************/
    // Swatches variable 
    s7swatches = new s7sdk.Swatches("multimedia-container", s7params, "mixedMediaSwatch");
    s7swatches.addEventListener(s7sdk.AssetEvent.SWATCH_SELECTED_EVENT, swatchSelected, false);
    
    
    s7zoomview = null;
    s7videoplayer = null;
    trackingManager=null;
    controls=null;
    playPauseButton=null;
    videoScrubber=null;
    videoTime=null;
    mutableVolume=null;
    fullScreenButton=null;
    
    /************************** MEDIA SET CODE **********************************/
    
    // MediaSet does not require the first or last parameter
    mediaSet = new s7sdk.MediaSet(null, s7params, null);

    // The NOTF_SET_PARSED event will be sent each time a new asset is loaded.
    mediaSet.addEventListener(s7sdk.AssetEvent.NOTF_SET_PARSED, onSetParsed, false);
}
 

// change the image displayed in the main view every time the swatch selection changes
function swatchSelected(event) {
    var asset = event.s7event.asset;
    var type = asset.type;
    var ctrlElement = document.getElementById("controls");
    
    // Get the new asset via AJAX
    $.ajax({
        method: 'GET',
        url: '/bin/dupont/assets/metadata?assetName=' + asset + '&assetType=' + type + '&galleryName=' + assets + '&path=' + path,
        data: null,
        cache: false,
        dataType: 'json',
        success: function (result) {
            //          alert("success :: "+result.title);
            $('.heading').empty();
            $('#assetDesc').empty();
            $('.heading').html(result.title);
            $('#assetDesc').html(result.desc);          
        },
        error: function (result) {
            //alert("failure");
            //$("#result").html('There is error while submit');
        }
    });
    
    //pause video playback
    if (s7videoplayer)
        s7videoplayer.pause();
    
    // Hide all
    displayElement("s7ZoomView", false);
    displayElement("s7VideoView", false);
    
    if (type == 1) {
        // ImageSet
        if (s7zoomview == null) // Create the viewer on demand
            s7zoomview = new s7sdk.ZoomView("s7container", s7params, "s7ZoomView");
        s7zoomview.setItem(asset);
        displayElement("s7ZoomView", true);
        if (ctrlElement) {
            ctrlElement.style.display = 'none';
        }
        return;
    }
    if (type == 2) {
    	/********************** VIDEO PLAYER CODE **************************/
	   if (s7videoplayer == null) {
	    	s7videoplayer = new s7sdk.video.VideoPlayer("s7container", s7params, "s7VideoView");
	   }
        
        if (asset != null) {
            s7videoplayer.setAsset(asset.name,asset.swatch.image);
        }
        
	    console.log('videoplayer created');
	    if(trackingManager==null) {
	    	trackingManager = new s7sdk.TrackingManager();
	    }
	    trackingManager.attach(s7videoplayer);
	    
	    s7videoplayer.addEventListener(s7sdk.event.CapabilityStateEvent.NOTF_VIDEO_CAPABILITY_STATE, onPlayPauseButtonSelectionChange, false);
	    s7videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_DURATION, onCurrentTimeFunc, false);
	    s7videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_CURRENT_TIME, onCurrentTimeFunc, false);
	    s7videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_LOAD_PROGRESS, onCurrentTimeFunc, false);
	
	    if(controls==null) {
	    	controls = new s7sdk.common.ControlBar("s7container", s7params, "controls");
	    }
	    controls.attachView(s7videoplayer);
	
	    //playPauseButton block
	    if(playPauseButton==null) {
	    	playPauseButton = new s7sdk.common.PlayPauseButton("controls", s7params, "playpausebutton");
	    }
	    playPauseButton.addEventListener("click", function () {
	        if (!playPauseButton.isSelected()) {
	            s7videoplayer.play();
	        } else {
	            s7videoplayer.pause();
	        }
	    });
	    
	    /* Video Scrubber */
	    if(videoScrubber==null) {
	    	videoScrubber = new s7sdk.video.VideoScrubber("controls", s7params, "videoScrubber");
	    }
	    videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_DOWN, onScrubberSlide, false);
	    videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_MOVE, onScrubberSlide, false);
	    videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_UP, onScrubberSlide, false);
	    
	    //videoTime block
	    if(videoTime==null) {
	    	videoTime = new s7sdk.VideoTime("controls", s7params, "videoTime");
	    }
	    
	    //mutableVolume block
	    if(mutableVolume==null) {
	    	mutableVolume = new s7sdk.video.MutableVolume("controls", s7params, "mutableVolume");
	    }
	    mutableVolume.addEventListener("click", function () {
	        if (!mutableVolume.isSelected()) {
	            s7videoplayer.setVolume(mutableVolume.getPosition());
	        } else {
	            s7videoplayer.setVolume(0);
	        }
	    });
	    mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_DOWN, onVolumeSlide, false);
	    mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_MOVE, onVolumeSlide, false);
	    mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_UP, onVolumeSlide, false);
	    
	    //fullScreenButton block
	    if(fullScreenButton==null) {
	    	fullScreenButton = new s7sdk.common.FullScreenButton("controls", s7params, "fullScreenBtn");
	    }
	    fullScreenButton.addEventListener("click", function () {
	        // var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);
	        if (!container.isFullScreen()) {
	            container.requestFullScreen();
	        } else {
	            container.cancelFullScreen();
	        }
	    });

        // VideoSet
        if (s7videoplayer == null) {
            s7videoplayer = new s7sdk.video.VideoPlayer("s7container", s7params, "s7VideoView");
            controls.attachView(s7videoplayer);
        }
        s7videoplayer.setItem(asset);
        if(trackingManager==null) {
        	trackingManager = new s7sdk.TrackingManager();
        }
        trackingManager.attach(s7videoplayer);
        displayElement("s7VideoView", true);
        if (ctrlElement) {
            ctrlElement.style.display = 'block';
        }
        return;
    }
}


function onPlayPauseButtonSelectionChange(event) {

    var cap = event.s7event.state;
    if (cap.hasCapability(s7sdk.VideoCapabilityState.PAUSE)) {
        playPauseButton.setSelected(false);
    } else if (cap.hasCapability(s7sdk.VideoCapabilityState.PLAY)) {
        // pause or stop
        playPauseButton.setSelected(true);
    }
}

function onCurrentTimeFunc(event) {

    if (event.s7event.type == s7sdk.VideoEvent.NOTF_CURRENT_TIME) {
        videoTime.setPlayedTime(s7videoplayer.getCurrentTime());
        videoScrubber.setPlayedTime(s7videoplayer.getCurrentTime());
    } else if (event.s7event.type == s7sdk.VideoEvent.NOTF_DURATION) {
        videoTime.setDuration(s7videoplayer.getDuration());
        if (s7videoplayer.getDuration() > 0)
            videoScrubber.setDuration(s7videoplayer.getDuration());
    } else if (event.s7event.type == s7sdk.VideoEvent.NOTF_LOAD_PROGRESS) {
        if (s7videoplayer.getDuration() > 0)
            videoScrubber.setLoadedPosition(s7videoplayer.getLoadedPosition());
    }
}

function onVolumeSlide(event) {
    s7videoplayer.setVolume(mutableVolume.getPosition());
}

function onScrubberSlide(event) {
    if (event.s7event.type == s7sdk.SliderEvent.NOTF_SLIDER_UP) {
        s7videoplayer.seek(videoScrubber.getPosition() * s7videoplayer.getDuration());
    }
}

function resizeViewer(event) {
    s7videoplayer.resize(event.s7event.w, event.s7event.h);
}

function fullScreenEnter(event) {
    console.log(event.s7event.type + ": width=" + event.s7event.w + "; height=" + event.s7event.h);
    s7videoplayer.resize(event.s7event.w, event.s7event.h);
    fullScreenButton.setSelected(container.isFullScreen());
    $('.s7swatches').css('display', (container.isFullScreen()) ? 'none' : 'block');
}

function playVideo() {
    window.location.href = videoPath;
}

function centerPreview(obj) {
    obj.style.marginTop = -obj.clientHeight / 2 + 'px';
}

function displayElement(elementId, show) {
    //$('#' + elementId).css('display', (show) ? 'block' : 'none');
    
    var element = document.getElementById(elementId);
    if (element) {
        if (!show) {
            element.style.position = 'absolute';
            element.style.left = '-99999px';


        } else {
            element.style.left = '0px';

        }
        //element.style.display = show ? 'block' : 'none';
    }

}

function onResize(event) {
    var ctrlElement = document.getElementById("controls");
    if (!container.isFullScreen()) {
        fnReSize();
        ctrlElement.style.width = '42%';
        ctrlElement.style.left = '9.5%';
        if (document.body.offsetWidth > 600) {
            $('.s7swatches').css('display', 'block');

        }
    } else {
        ctrlElement.style.width = '65%';
        ctrlElement.style.left = '14.7%';
    }
}

function fnReSize() {

    var winW = 670,
        winH = 310;
    var offsetW = 0;
    offsetW = document.body.offsetWidth;
    winW = offsetW;
    container.resize(document.body.offsetWidth);
    var persents = 0.6;
    if (offsetW <= 600) {
        isMobile = true;
    } else if (offsetW > 600 && offsetW <= 768) {
        persents = 0.60;
        isMobile = false;
    } else {
        persents = 0.52;
        isMobile = false;
    }
    if (isMobile) {
        winW = winW - 90;
        //persents = 1;
    } else {
        winW = winW * persents;
    }
    winH = winW * 9 / 16;
    if (winH > 310) {
        winH = 310;
    }
    //    winH = document.getElementById('s7container').offsetHeight;
    //          s7swatches.resize(event.s7event.w - 2, s7swatches.size.height); // Exclude the border width (2px)
    if (s7zoomview)
        s7zoomview.resize(winW, winH);
    if (s7spinview)
        s7spinview.resize(winW, winH);
    if (s7videoplayer)
        s7videoplayer.resize(winW, winH);

}

function getWindowSize() {
    var winW = 630,
        winH = 460;
    if (document.body && document.body.offsetWidth) {
        winW = document.getElementById('s7container').offsetWidth;
        //    winH = document.getElementById('s7container').offsetHeight;


    }
    if (document.compatMode == 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {

        winW = document.getElementById('s7container').offsetWidth;
        //      winH = document.getElementById('s7container').offsetHeight;

    }
    //   if (window.innerWidth && window.innerHeight) {
    //           winW = window.innerWidth;
    //      winH = window.innerHeight;

    //         }

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
    s7swatches.selectSwatch(0, true);
    addDescriptions();
    fnSmallNavigation();
}

function addDescriptions() {
    $("#mmg-title-description").remove();
    $(".mixed-media-gallery-prev-next").remove();
    $("#multimedia-container").append("<div id='mmg-title-description'></div>");
    $("#mmg-title-description").append("<div class='heading'></div>");
    $("#mmg-title-description").append("<p id='assetDesc' class='paratext'></p>");
    $("#multimedia-container").append("<div class='mixed-media-gallery-prev-next'><ul></ul></div>");
    $(".mixed-media-gallery-prev-next ul").append("<li class='mixed-media-previous' onclick='fnPrev()'><span>Prev</span></li>");
    $(".mixed-media-gallery-prev-next ul").append("<li class='mixed-media-next' onclick='fnNext()'><span>Next</span></li>");
	
}

function fnSmallNavigation() {
    $('.mixed-media-previous').hide();
    swatchCount = ($('.s7thumb').length);
    
    // Creates the Div and put the number in it.
    if (swatchCount > 8) {
        $('#mixedMediaSwatch').last().after().append('<div class="totalItems">'+swatchCount + " " +_itemText+'</div>');     
    }
    
    if (swatchCount == 1) {
        $('.mixed-media-next').hide();
    } else if (swatchCount > 1) {
        $('.mixed-media-next').show();
    }
    fnDisplayCount(swatchCount);
}



function fnGalleryMenu(assetName, pagePath) {
    //s7sdk.Util.init();
    // create ParameterManager instance that will handle modifiers
    s7params= null;
    s7params = new s7sdk.ParameterManager(null, null, {
        "asset": "MediaSet.asset"
    });
    
    // Delete viewers
    clearBox('s7container');
    clearBox('mixedMediaSwatch');
    
    // Set the new asset
    assets = assetName;
    path = pagePath;
    
    // init the viewer once its ready
    s7params.addEventListener(s7sdk.Event.SDK_READY, initViewer, false);
    s7params.init();

}

function clearBox(elementID) {
    $(document.getElementById(elementID)).remove();
}

function fnPrev() {
    position = s7swatches.getFrame();
    var pos = position - 1;
    if (pos == 0) {
        $('.mixed-media-previous').hide();
    }
    if (pos + 1 < swatchCount) {
        $('.mixed-media-next').show();
    }
    s7swatches.selectSwatch(pos, true);
    fnDisplayCount(swatchCount);
}

function fnNext() {
    position = s7swatches.getFrame();
    var pos = position + 1;
    if (pos > 0) {
        $('.mixed-media-previous').show();
    }
    if (pos + 1 == swatchCount) {
        $('.mixed-media-next').hide();
    }
    s7swatches.selectSwatch(pos, true);
    //fnDisplayCount(swatchCount);
}

function fnDisplayCount(swatchCount) {
    var infoText;
    position = s7swatches.getFrame();
    //infoText = (position+1)+" of "+ swatchCount;
    //document.getElementById("pageinfo").innerHTML=infoText;
    //alert(infoText);
}

function fnDefault(defaultasset,pagePath) {
    assets = defaultasset;
	path = pagePath;
}




