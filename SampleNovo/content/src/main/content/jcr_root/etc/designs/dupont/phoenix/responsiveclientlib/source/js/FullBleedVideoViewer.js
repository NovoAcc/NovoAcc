( function(window, document, $, undefined) {

	var expose = ( function(){
			
		var assets, path, s7videoplayer, s7videotoolbar, s7closeButton, controls, fullscreenbutton, params,
			container, videoPath, videoPreview, playPauseButton, videoScrubber, videoTime, mutableVolume, params, trackingManager;		

		function initS7SDK(){

            
            // Avoid loading default CSS files
            s7sdk.Util.css.addDefaultCSS = function(){ }
			s7sdk.Util.lib.include('s7sdk.common.Button');
			s7sdk.Util.lib.include('s7sdk.common.Container');
			s7sdk.Util.lib.include('s7sdk.event.Event');
			s7sdk.Util.lib.include('s7sdk.video.VideoControls');
			s7sdk.Util.lib.include('s7sdk.video.VideoPlayer');
			
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			 //s7sdk.Util.lib.include('s7sdk.common.ControlBar');
			}
			else {
			    s7sdk.Util.lib.include('s7sdk.common.ControlBar');
			}
			
			
			s7sdk.Util.init();
			params = new s7sdk.ParameterManager();
	        params.addEventListener(s7sdk.Event.SDK_READY, function() {initSiteCatalyst(initViewer);}, false);
			params.init();
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

		
		function initViewer(){
			console.log("init viewer....");
		    params.push("serverurl",s7domain+"/is/image/");
		    params.push("contentroot", s7domain+"/skins/");
		    params.push("videoserverurl", s7domain+"/is/content/");
		    params.push("config", "Scene7SharedAssets/Universal_HTML5_Video");
		    params.push("asset", _scene7FileName);
		    params.push("autoplay", "0");
		    params.push("stagesize", "1091,668");
		    params.push("singleclick", "playPause");
		    params.push("iconeffect", "1,-1,0.3,0");
		    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		            params.push("playback", "native,1");
		    }
		
		    // Create a viewer container
		    container = new s7sdk.Container("videoplayerid", params, "cont");
		    container.addEventListener(s7sdk.event.ResizeEvent.COMPONENT_RESIZE,resizeViewer,false);
		    container.addEventListener(s7sdk.event.ResizeEvent.FULLSCREEN_RESIZE, fullScreenEnter,false);
		    
	        trackingManager = new s7sdk.TrackingManager();
		    s7videoplayer = new s7sdk.video.VideoPlayer("cont",params,"s7viewer");
		    trackingManager.attach(s7videoplayer);
		    
		    if(typeof s7sdk.common.ControlBar !== 'undefined'){

		    	s7videoplayer.addEventListener(s7sdk.event.CapabilityStateEvent.NOTF_VIDEO_CAPABILITY_STATE, onPlayPauseButtonSelectionChange, false);
			    s7videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_DURATION, onCurrentTimeFunc, false);
			    s7videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_CURRENT_TIME, onCurrentTimeFunc, false);
			    s7videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_LOAD_PROGRESS, onCurrentTimeFunc, false);
				    
			    controls = new s7sdk.common.ControlBar("cont", params, "controls");
			    controls.attachView(s7videoplayer);
			
			    //playPauseButton block
			    playPauseButton = new s7sdk.common.PlayPauseButton("controls", params, "playPauseBtn");
			    playPauseButton.addEventListener("click",function() {
			        if (!playPauseButton.isSelected()) {
			            s7videoplayer.play();
			        }
			        else {
			            s7videoplayer.pause();
			        }
			    });
			
			    //videoScrubber block
			    videoScrubber = new s7sdk.video.VideoScrubber("controls", params, "videoScrubber");
			    videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_DOWN, onScrubberSlide, false);
			    videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_MOVE, onScrubberSlide, false);
			    videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_UP, onScrubberSlide, false);
			
			    //videoTime block
			    videoTime = new s7sdk.VideoTime("controls", params, "videoTime");
			
			    //mutableVolume block
			    mutableVolume = new s7sdk.video.MutableVolume("controls", params, "mutableVolume");
			    mutableVolume.addEventListener("click",function() {
			        if (!mutableVolume.isSelected()) {
			            s7videoplayer.setVolume(mutableVolume.getPosition());
			        }
			        else {
			            s7videoplayer.setVolume(0);
			        }
			    });
			
			    mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_DOWN, onVolumeSlide, false);
			    mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_MOVE, onVolumeSlide, false);
			    mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_UP, onVolumeSlide, false);
			
			    //fullScreenButton block
			    fullScreenButton = new s7sdk.common.FullScreenButton("controls", params, "fullScreenBtn");
			    fullScreenButton.addEventListener("click",function() {
			        if (!container.isFullScreen()){
			            container.requestFullScreen();
			        }
			        else {
			            container.cancelFullScreen();
			        }
			    });
		    }
		    
		    $(window).on('resize',function(){
                if(!container.isFullScreen())
		             s7VideoPlayer.resizePlayer($('#videoplayerid').width(), $('#videoplayerid').height());
		    });
		    
		    $('.play-now').click(function (){
		    	
		    	s7videoplayer.play();
		    //	$('#playPauseBtn').triggerHandler('click');
	    	
		    });

		    
		    addEvent(window, 'orientationchange', function(){
		    	s7VideoPlayer.resizePlayer($('#videoplayerid').width(), $('#videoplayerid').height());
		    }, false);
		        
		    s7VideoPlayer.resizePlayer($('#videoplayerid').width(), $('#videoplayerid').height());
		
		}
		
		function onPlayPauseButtonSelectionChange(event) {
		    var cap = event.s7event.state;
		    if (cap.hasCapability(s7sdk.VideoCapabilityState.PAUSE)) {
		        playPauseButton.setSelected(false);
		    }
		    else if (cap.hasCapability(s7sdk.VideoCapabilityState.PLAY)) {
		        // pause or stop
		        playPauseButton.setSelected(true);
		    }
		}
		
		function onVolumeSlide(event) {
		    s7videoplayer.setVolume(mutableVolume.getPosition());
		}
		
		function onCurrentTimeFunc(event) {
		
		    if (event.s7event.type == s7sdk.VideoEvent.NOTF_CURRENT_TIME) {
		        videoTime.setPlayedTime(s7videoplayer.getCurrentTime());
		        videoScrubber.setPlayedTime(s7videoplayer.getCurrentTime());
		    }
		    else if (event.s7event.type == s7sdk.VideoEvent.NOTF_DURATION) {
		        videoTime.setDuration(s7videoplayer.getDuration());
		        if (s7videoplayer.getDuration() > 0)
		            videoScrubber.setDuration(s7videoplayer.getDuration());
		    }
		    else if (event.s7event.type == s7sdk.VideoEvent.NOTF_LOAD_PROGRESS) {
		        if (s7videoplayer.getDuration() > 0)
		            videoScrubber.setLoadedPosition(s7videoplayer.getLoadedPosition());
		    }
		}
		
		function onScrubberSlide(event) {
		    if (event.s7event.type == s7sdk.SliderEvent.NOTF_SLIDER_UP) {
		        s7videoplayer.seek(videoScrubber.getPosition() * s7videoplayer.getDuration());
		    }
		}
		
		function resizeViewer(event) {
		    s7videoplayer.resize(event.s7event.w, event.s7event.h );
		}
		
		function fullScreenEnter(event) {
		    console.log (event.s7event.type + ": width=" + event.s7event.w +"; height=" + event.s7event.h);
		    s7videoplayer.resize(event.s7event.w, event.s7event.h );   
		    fullScreenButton.setSelected(container.isFullScreen());
		}
		
		function resize(width, height){
            if ($('body').hasClass('ext-ie8')) {
                return;
            }
            s7videoplayer.resize(width,height);
			// resizing css of s7container to keep controls in on resize.
			$('#videoplayerid .s7container').css('width', width);
            $('#videoplayerid .s7container').css('height', height);
		}
        
        function addEvent(to, type, fn){
            if(document.addEventListener){
                to.addEventListener(type, fn, false);
            } else if(document.attachEvent){
                to.attachEvent('on'+type, fn);
            } else {
                to['on'+type] = fn;
            } 
        };
		

		 return {
			 resizePlayer : resize,
			 initPlayer : initS7SDK
		 }
		
	})();

	window.s7VideoPlayer = expose;
	
	if (window.addEventListener){
		  window.addEventListener('load', expose.initPlayer, false);
	}else if (window.attachEvent){
		  window.attachEvent('onload', expose.initPlayer); 
	}

})(window, document, jQuery);

