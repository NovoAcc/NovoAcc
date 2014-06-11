
/*!************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/
if(typeof s7viewers == "undefined"){
	s7viewers = {};
}else if(typeof s7viewers != "object"){
	throw new Error("Cannot initialize a root 's7viewers' package. s7viewers is not an object");
}

if(!s7viewers.VideoViewer){

	s7viewers.VideoViewer = function () {
		this.sdkBasePath = '/s7sdk/2.5/';
		this.viewerFileName = "";
		this.cssSrcURL = "VideoViewer.css";
		this.utilsFilePath = "js/s7sdk/utils/Utils.js";
		this.containerId = null;
		this.params = {};
		this.onInitComplete = null;
		this.onInitFail = null;
		this.initializationComplete = false;
	};
	
	s7viewers.VideoViewer.cssClassName = "s7videoviewer";

	s7viewers.VideoViewer.prototype.setContainerId = function (inElemId) {
		this.containerId = inElemId || null;
	};

	s7viewers.VideoViewer.prototype.getContentUrl = function () {
		var viewerURL = this.getDomScriptTag(this.viewerFileName).getAttribute('src');
		var idx = viewerURL.indexOf('js/VideoViewer.js'); 
		var contentUrl = "";
		if (idx >= 0) {
			contentUrl = viewerURL.substring(0,idx);
		}
		if ((contentUrl != '') && (contentUrl.lastIndexOf('/') != contentUrl.length - 1)) {
			contentUrl += '/';
		}
		return contentUrl;
	};

	s7viewers.VideoViewer.prototype.includeViewer = function () {
		s7sdk.Util.require("s7sdk.common.Button");
		s7sdk.Util.require("s7sdk.common.Container");
		s7sdk.Util.require("s7sdk.event.Event");
		s7sdk.Util.require("s7sdk.video.VideoControls");
		s7sdk.Util.require("s7sdk.video.VideoPlayer");
		s7sdk.Util.require("s7sdk.common.ControlBar");
		s7sdk.Util.require("s7sdk.set.MediaSet");
		s7sdk.Util.require("s7sdk.share.Share");
		
		this.s7params = new s7sdk.ParameterManager(null, null, {"asset" : "MediaSet.asset" });
		this.s7params.setViewer("506,4.9.1");

		for(var prm in this.params){
			if (prm != "localizedTexts"){
				this.s7params.push(prm, this.params[prm]);
			}else{
				this.s7params.setLocalizedTexts(this.params[prm]);
			}
		}

		this.trackingManager = new s7sdk.TrackingManager();

		this.mediaSet = null;
		this.mediasetDesc = null; 
		this.container = null; 
		this.videoplayer = null;
		this.controls = null;
		this.playPauseButton = null;
		this.videoScrubber = null;
		this.videoTime = null;
		this.mutableVolume = null;
		this.fullScreenButton = null;
		this.closedCaptionButton = null
		
		this.socialShare = null;
		this.emailShare = null;
		this.embedShare = null;
		this.linkShare = null;
		this.twitterShare = null;
		this.facebookShare = null;
		this.captionButtonPosition = null;
		this.volumeButtonPosition = null;
		this.videoTimePosition = null;
		this.isCaption = true;
		this.storedCaptionEnabled = null;
		
		this.supportsInline = null;
		
		// Make sure the viewer container has a CSS class name above the basic videoplayer and SDK component names
		if (this.containerId != null){
			var containerDiv = document.getElementById(this.containerId);
			if (containerDiv){
				if (containerDiv.className != ""){
					if (containerDiv.className.indexOf(s7viewers.VideoViewer.cssClassName) != -1){
						//
					}else{
						containerDiv.className += " "+s7viewers.VideoViewer.cssClassName;
					}	
				}else{
					containerDiv.className = s7viewers.VideoViewer.cssClassName;
				}
			}
		}

		var self = this;

		function initViewer(){
			var containerDivID = self.containerId + "_cont";
			var controlsDivID = self.containerId + "_controls";
			self.s7params.push("autoplay", "0");
			self.s7params.push("singleclick", "playPause");
			self.s7params.push("iconeffect", "1,-1,0.3,0");
			self.s7params.push("bearing", "down");
			
			// Create MediaSet
			self.mediaSet = new s7sdk.MediaSet(null, self.s7params, self.containerId+"_mediaset");
			// Create a viewer Container
			self.container = new s7sdk.Container(self.containerId, self.s7params, containerDivID);
			// Create the VideoPlayer
			self.videoplayer = new s7sdk.video.VideoPlayer(containerDivID, self.s7params, self.containerId + "_videoPlayer");
			self.trackingManager.attach(self.videoplayer);
			// Create the ControlBar
			self.controls = new s7sdk.common.ControlBar(containerDivID, self.s7params, controlsDivID);
			self.controls.attachView(self.videoplayer);
			// Create the PlayPauseButton
			self.playPauseButton = new s7sdk.common.PlayPauseButton(controlsDivID, self.s7params, self.containerId + "_playPauseBtn");
			// Create the VideoScrubber
			self.videoScrubber = new s7sdk.video.VideoScrubber(controlsDivID, self.s7params, self.containerId + "_videoScrubber");
			// Create the VideoTime
			self.videoTime = new s7sdk.VideoTime(controlsDivID, self.s7params, self.containerId + "_videoTime");
			// Create the MutableVolume
			self.mutableVolume = new s7sdk.video.MutableVolume(controlsDivID, self.s7params, self.containerId + "_mutableVolume");
			// Create the FullScreenButton
			self.fullScreenButton = new s7sdk.common.FullScreenButton(controlsDivID, self.s7params, self.containerId + "_fullScreenBtn");
			// Create the ClosedCaptionButton
			self.closedCaptionButton = new s7sdk.common.ClosedCaptionButton(controlsDivID, self.s7params, self.containerId + "_closedCaptionBtn");
			self.closedCaptionButton.addEventListener("click", clickClosedCaptionButton);
			self.closedCaptionButton.setSelected(self.videoplayer.caption.enabled);
			self.videoplayer.setCaptionEnabled(self.videoplayer.caption.enabled);
			self.storedCaptionEnabled = self.videoplayer.caption.enabled;
			self.captionButtonPosition = getDeepCSS(self.closedCaptionButton.obj, "right");
			self.captionButtonPosition =  Number(self.captionButtonPosition.substring(0, self.captionButtonPosition.length - 2));
			self.volumeButtonPosition = getDeepCSS(self.mutableVolume.obj, "right");
			self.volumeButtonPosition =  Number(self.volumeButtonPosition.substring(0, self.volumeButtonPosition.length - 2));
			self.videoTimePosition = getDeepCSS(self.videoTime.obj, "right");
			self.videoTimePosition =  Number(self.videoTimePosition.substring(0, self.videoTimePosition.length - 2));
			if (!self.s7params.get("caption")) {
				self.isCaption = false;
			}
			// Create SocialShare
			if (s7sdk.browser.device.name != "iphone"){
				self.socialShare = new s7sdk.share.SocialShare(containerDivID, self.s7params, self.containerId + "_socialShare");
				self.controls.attach(self.socialShare);
				self.emailShare = new s7sdk.share.EmailShare(self.containerId + "_socialShare", self.s7params, self.containerId + "_emailShare");
				self.embedShare = new s7sdk.share.EmbedShare(self.containerId + "_socialShare", self.s7params, self.containerId + "_embedShare");
				self.linkShare = new s7sdk.share.LinkShare(self.containerId + "_socialShare", self.s7params, self.containerId + "_linkShare");
				self.twitterShare = new s7sdk.share.TwitterShare(self.containerId + "_socialShare", self.s7params, self.containerId + "_twitterShare");
				self.facebookShare = new s7sdk.share.FacebookShare(self.containerId + "_socialShare", self.s7params, self.containerId + "_facebookShare"); 
				/* This block is to disable auto-hide of socialShare panel if mouse cursor is over it.*/
				s7sdk.Event.addDOMListener(document, "mouseover", function(e){
					var trgt = e.target ? e.target : e.srcElement;
					self.controls.allowAutoHide(!(trgt == self.socialShare.socialbtn.obj || trgt == self.emailShare.obj || trgt == self.embedShare.obj || trgt == self.linkShare.obj || trgt == self.twitterShare.obj || trgt == self.facebookShare.obj));
				});
				// Pass parameters to Social elements
				self.linkShare.setContentUrl(document.URL); 
				self.emailShare.setOriginUrl(window.location.hostname);
				self.emailShare.setContentUrl(document.URL);
				self.supportsInline = self.videoplayer.supportsInline();
			}
			// ====================================== Event Listeners ====================================== //
			
			// Add MediaSet event listeners
			self.mediaSet.addEventListener(s7sdk.AssetEvent.NOTF_SET_PARSED, onSetParsed, false);
			// Add Container event listeners
			self.container.addEventListener(s7sdk.event.ResizeEvent.COMPONENT_RESIZE, onContainerResize,false);
			self.container.addEventListener(s7sdk.event.ResizeEvent.FULLSCREEN_RESIZE, onContainerFullScreen,false);
			// Add VideoPlayer event listeners
			self.videoplayer.addEventListener(s7sdk.event.CapabilityStateEvent.NOTF_VIDEO_CAPABILITY_STATE, onVideoCapabilityStateChange, false);
			self.videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_DURATION, onVideoDuration, false);
			self.videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_LOAD_PROGRESS, onVideoLoadProgress, false);
			self.videoplayer.addEventListener(s7sdk.event.VideoEvent.NOTF_CURRENT_TIME, onVideoCurrentTime, false);
			// Add PlayPauseButton event listeners
			self.playPauseButton.addEventListener("click", onPlayPauseButtonClick);
			// Add VideoScrubber event listeners
			//self.videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_DOWN, onNotifyScrubberEvent, false);
			//self.videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_MOVE, onNotifyScrubberEvent, false);
			self.videoScrubber.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_UP, onNotifyScrubberEvent, false);
			// Add MutableVolume event listeners
			self.mutableVolume.addEventListener("click", onMuteButtonClick);
			self.mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_DOWN, onVolumeDown, false);
			self.mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_MOVE, onVolumeMove, false);
			self.mutableVolume.addEventListener(s7sdk.SliderEvent.NOTF_SLIDER_UP, onVolumeMove, false);
			// Add FullScreenButton event listeners
			self.fullScreenButton.addEventListener("click", onFullScreenButtonClick);
			
			// ====================================== Event Handlers ====================================== //
			
			// MediaSet Event Handlers
			function onSetParsed(event) {
				self.mediasetDesc = event.s7event.asset;
				
				// just in case, check what is returned is of type MediaSetDesc
				if (self.mediasetDesc instanceof s7sdk.MediaSetDesc) {
					if (self.mediasetDesc.type == s7sdk.ItemDescType.VIDEO_SET) {
						// MBR set
						self.videoplayer.setItem(self.mediasetDesc);
					}
					else {
						// single video
						self.videoplayer.setItem(self.mediasetDesc.items[0]);
					}
				}
				else
					throw new Error("Failed to get meta data for video: " + event.s7event.asset);
				handleButtonsVisibility();
				if (self.emailShare) self.emailShare.setThumbnail(event.s7event.asset.name);
				if (self.embedShare) self.embedShare.setEmbedCode(getTemplateForViewer());
			}

			// Container Event Handlers
			function onContainerResize(event) {
				resizeViewer(event.s7event.w, event.s7event.h);
				self.fullScreenButton.setSelected(self.container.isFullScreen());
			}
			function onContainerFullScreen(event) {
				resizeViewer(event.s7event.w, event.s7event.h);
				self.fullScreenButton.setSelected(self.container.isFullScreen());
				//When viewer goes full screen, onFullScreenEnter call back should be executed; 
				//when viewer backs to normal mode, onFullScreenExit should be called.
				if (!self.container.isFullScreen()){
					self.onFullScreenExit(event);
				} else {
					self.onFullScreenEnter(event);
				}					
			}
			// VideoPlayer Event Handlers
			function onVideoCapabilityStateChange(event){
				//self.playPauseButton.setSelected(event.s7event.state.hasCapability(s7sdk.VideoCapabilityState.PLAY));	
				var cap = event.s7event.state;
				if (cap.hasCapability(s7sdk.VideoCapabilityState.PAUSE)) {
	 				self.playPauseButton.setSelected(false);
				}
				else if (cap.hasCapability(s7sdk.VideoCapabilityState.PLAY) || cap.hasCapability(s7sdk.VideoCapabilityState.REPLAY)) {
					// pause or stop
	 				self.playPauseButton.setSelected(true);
				}				
				self.playPauseButton.enableReplay(cap.hasCapability(s7sdk.VideoCapabilityState.REPLAY));
			}
			function onVideoDuration(event){
				self.videoTime.setDuration(event.s7event.data);					
				self.videoScrubber.setDuration(event.s7event.data);
			}
			function onVideoLoadProgress(event){
				self.videoScrubber.setLoadedPosition(event.s7event.data);
			}
			function onVideoCurrentTime(event){
				self.videoTime.setPlayedTime(event.s7event.data);
				self.videoScrubber.setPlayedTime(event.s7event.data);
			}
			// PlayPauseButton Event handlers
			function onPlayPauseButtonClick(event) { 
				if (!self.playPauseButton.isSelected()) {
					// IF the video is over, restart from the beginning
					var rem = self.videoplayer.getDuration() - self.videoplayer.getCurrentTime();	// Time remaining
					if (rem <= 1){
						self.videoplayer.seek(0);
					}
					self.videoplayer.play();
				}
				else {
					self.videoplayer.pause();
				}
			}
			// VideoScrubber Event Handlers
			function onNotifyScrubberEvent(event) {
				self.videoplayer.seek(event.s7event.position * self.videoplayer.getDuration());
			}
			// MutableVolume Event Handlers
			function onMuteButtonClick(event) {
				if(self.mutableVolume.isSelected()){
                    self.videoplayer.mute();
                }else{
                    self.videoplayer.unmute();
					self.videoplayer.setVolume(self.mutableVolume.getPosition());
                }
			}
			function onVolumeDown(event){
				self.videoplayer.unmute();	// Make sure the player isn't muted as soon as the user start to change volume
			}
			function onVolumeMove(event){
				self.videoplayer.setVolume(event.s7event.position);
			}
			// FullScreenButton Event Handlers
			function onFullScreenButtonClick(event) { 
				if (!self.container.isFullScreen()){
					self.container.requestFullScreen();
				}
				else {
					self.container.cancelFullScreen();
				}					
			}
            // Add ClosedCaption enable/disable feature.
            function clickClosedCaptionButton() {
                self.videoplayer.setCaptionEnabled(self.closedCaptionButton.isSelected());
            }			
			
			// Generate template for EmbedShare
			function getTemplateForViewer() {
				var tempStr = "";
				if (self.s7params.params.style !="" && self.s7params.params.style != undefined) tempStr = '    videoViewer.setParam("style", "'+ self.s7params.params.style +'"); \n';
				if (self.s7params.params.caption != "" && self.s7params.params.caption != undefined) tempStr += '    videoViewer.setParam("caption", "'+ self.s7params.params.caption+'"); \n';
                var config = "";
                if (self.s7params.params.config !="" && self.s7params.params.config != undefined) {
                    config = '    videoViewer.setParam("config", "'+ self.s7params.params.config +'"); \n';
                }
				var template =
							'<'+'script language="javascript" type="text/javascript" src="' +self.getDomScriptTag(self.viewerFileName).src+ '"><'+'/script> \n'+     
				  	        '<'+'div id="' +self.containerId+ '"><'+'/div> \n'+
				  	        '<'+'script type="text/javascript"> \n'+
				  	        '    var videoViewer = new s7viewers.VideoViewer(); \n'+
				  	      	'    videoViewer.setParam("videoserverurl", "' + makeAbsolutePath(self.videoplayer.videoServerUrl) + '"); \n'+
				  	      	'    videoViewer.setParam("serverurl", "'+ makeAbsolutePath(self.videoplayer.serverUrl) +'"); \n'+
				  	      	'    videoViewer.setParam("contenturl", "' + makeAbsolutePath(self.s7params.get("contenturl","/is/content")) + '"); \n'+
							tempStr +
							'    videoViewer.setAsset("' + self.mediaSet.asset + '"); \n'+
				  	      	'    videoViewer.setParam("stagesize", "$EMBED_WIDTH$,$EMBED_HEIGHT$"); \n'+
				  			'	 videoViewer.setParam("emailurl", "' + makeAbsolutePath(self.emailShare.emailurl) + '"); \n'+
                            config +
				  			'	 videoViewer.setContainerId("' +self.containerId+ '"); \n'+
				  			'	 videoViewer.init(); \n'+
				  	        '<'+'/script> \n';
				return template;
			}

            function makeAbsolutePath(url) {
                if (url && ((url.indexOf("http://") == 0) || (url.indexOf("https://") == 0))) {
                    return url;
                }

                var absUrl = document.location.protocol + "//" + document.location.host;

                if (!url || url.indexOf('/') != 0) {
                    absUrl += "/";
                }

                if (url) {
                    absUrl += url;
                }
                return absUrl;
            }

			// ====================================== UI Layout Helper Functions ====================================== //
			
			// UI Layout Helper Functions
			
			function resizeViewer(w,h){
				self.videoplayer.resize(w, h);
				updateControlsWidth(w);
			}
			function updateControlsWidth(w) {
				if (self.supportsInline != true){
					return;
				}
				console.log("W: " + w);
				var timeR = getDeepCSS(self.videoTime.obj, "right");
				timeR = Number(timeR.substring(0, timeR.length - 2));
				var timeW = getDeepCSS(self.videoTime.obj, "width");
				timeW = Number(timeW.substring(0, timeW.length - 2));
				var scrubL = getDeepCSS(self.videoScrubber.obj, "left");
				scrubL = Number(scrubL.substring(0, scrubL.length - 2));
				
				console.log("SCRUB L: " + scrubL);
				var scrubW = w - scrubL - (timeR + timeW) - 20;
				console.log("SCRUB W: " + scrubW);
				
				self.videoScrubber.obj.style.width = scrubW + "px";
				self.videoScrubber.track.style.width = scrubW + "px";
				self.videoScrubber.setPlayedTime(self.videoScrubber.getPlayedTime());	// Refresh the played time bar to be proportionate to the new track width 
				
				handleFullScreen();
				handleButtonsVisibility();
			}
			function handleFullScreen () {
				if (!self.container.hasCustomSize && !self.container.supportsNativeFullScreen()) {
					self.fullScreenButton.obj.style.display = "none";
				}
			}
			function handleButtonsVisibility () {

				var volFlag = self.videoplayer.supportsVolumeControl();
				var videoTimeRight;
				var conW = getDeepCSS(self.container.obj, "width");
				conW =  Number(conW.substring(0, conW.length - 2));
				if(!volFlag && !self.isCaption) {
					self.mutableVolume.obj.style.display = "none";

					self.closedCaptionButton.obj.style.display = "none";
					videoTimeRight = self.volumeButtonPosition;
				}
				else {
					if(!volFlag) {
						self.mutableVolume.obj.style.display = "none";
						videoTimeRight = self.captionButtonPosition;
						self.closedCaptionButton.obj.style.right = self.volumeButtonPosition + "px";
					}
					if(!self.isCaption) {
						self.closedCaptionButton.obj.style.display = "none";
						videoTimeRight = self.captionButtonPosition;
					}
					else {
						self.closedCaptionButton.obj.style.display = "block";
						if (!volFlag) {
							videoTimeRight = self.captionButtonPosition;
						}
						else {
							videoTimeRight = self.videoTimePosition;
						}
					}
				}
				self.videoTime.obj.style.right = videoTimeRight + "px";
				var timeW = getDeepCSS(self.videoTime.obj, "width");
				timeW = Number(timeW.substring(0, timeW.length - 2));
				var timeL = videoTimeRight + timeW;				
				var vsL = getDeepCSS(self.videoScrubber.obj, "left");
				vsL = Number(vsL.substring(0, vsL.length - 2));
				self.videoScrubber.obj.style.width = conW - vsL - timeL - 24 + "px";
				self.videoScrubber.track.style.width = conW - vsL - timeL - 24 + "px";
				self.videoScrubber.setPlayedTime(self.videoScrubber.getPlayedTime());	// Refresh the played time bar to be proportionate to the new track				
			}
			// Helper for getting computed CSS Styles
			function getDeepCSS (element, css){
				var dv, sty, val;
				if(element && element.style){
					css= css.toLowerCase();
					sty= css.replace(/\-([a-z])/g, function(a, b){
						return b.toUpperCase();
					});
					val= element.style[sty];
					if(!val){
						dv= document.defaultView || window;
						if(dv.getComputedStyle){
							val= dv.getComputedStyle(element,'').getPropertyValue(css);
						}
						else if(element.currentStyle){
							val= element.currentStyle[sty];
						}
					}
				}
				return val || '';
			}
			
			if(self.supportsInline){
				// If the platform supports inline playback (embedded on the page), update the controlbar layout.
				var cW = getDeepCSS(self.container.obj, "width");
				cW = Number(cW.substring(0, cW.length - 2));
				updateControlsWidth(cW);
			}
			else
			{
				// IF inline playback isn't available (iPhone, etc.), hide the controlbar.
				self.controls.obj.style.display = "none";
			}
			
			if ((self.onInitComplete != null) && (typeof self.onInitComplete == "function")){
				self.onInitComplete();
			}
		} // End initViewer()

		this.s7params.addEventListener(s7sdk.Event.SDK_READY, function(){ self.initSiteCatalyst(self.s7params,initViewer); },false);
		this.s7params.init();	
	};

	s7viewers.VideoViewer.prototype.setParam = function(key, def){
		this.params[key] = def;	
	};

	s7viewers.VideoViewer.prototype.getParam = function(key){
		return this.params[key];	
	};

	s7viewers.VideoViewer.prototype.setParams = function(inParams){
		var params = inParams.split("&");
		for (var i = 0; i < params.length; i++) {
			var pair = params[i].split("=");
			if (pair.length > 1) {
				this.setParam(pair[0],decodeURIComponent(params[i].split("=")[1]));
			}
		}
	};
	
	s7viewers.VideoViewer.prototype.s7sdkUtilsAvailable = function(){
		return (typeof s7sdk != "undefined");
	};
	
	s7viewers.VideoViewer.prototype.resize = function(w, h){
		this.container.resize(w, h);
	};
	
	s7viewers.VideoViewer.prototype.init = function(){
		
		if (this.initializationComplete) return;
		
		if (this.s7sdkUtilsAvailable()){
			s7sdk.Util.init(); 
			this.includeViewer();
			this.initializationComplete = true;  
		}else{
			var utilSrcPath = this.getDomain(this.getContentUrl()) + this.sdkBasePath + this.utilsFilePath;
			
			if (this.getDomScriptTag(utilSrcPath) != null) {
				var selfRef = this;
				var utilsWaitId = setInterval(
					function() {
						if (selfRef.s7sdkUtilsAvailable()) {
							clearInterval(utilsWaitId);
							s7sdk.Util.init(); 
							selfRef.includeViewer();  
						}
					}, 100
				);
			}else{
				var elem = document.createElement("script");
				elem.setAttribute("language", "javascript");
				elem.setAttribute("type", "text/javascript");
				elem.setAttribute("src", utilSrcPath);
	
				var elems = document.getElementsByTagName("head");
				var self = this;
				elem.onload = elem.onerror = function() {  
					if (!this.executed) { 
						this.executed = true;  
						if (self.s7sdkUtilsAvailable() && s7sdk.Util){
							s7sdk.Util.init(); 
							self.includeViewer();  
							self.initializationComplete = true;
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
			}
		}
	};

	s7viewers.VideoViewer.prototype.getDomScriptTag = function(jsFileNameOrPath){
		var scriptTags;
		if (document.scripts){
			scriptTags = document.scripts;
		}else{
			scriptTags = document.getElementsByTagName("script");
		}
		for (var i = 0; i < scriptTags.length; i++){ 
			if (scriptTags[i] && scriptTags[i].getAttribute("src") != null && scriptTags[i].getAttribute("src").indexOf(jsFileNameOrPath) != -1){
				return scriptTags[i];
				break;
			}
		}
		return null;
	};
	
	s7viewers.VideoViewer.prototype.getDomain = function(inUrl) {
		var res = /(^http[s]?:\/\/[^\/]+)/i.exec(inUrl);
		if (res == null) {
			return '';
		} else {
			return res[1];
		}
	};

	s7viewers.VideoViewer.prototype.setAsset = function(inAsset, inCaption) {
		if (this.mediaSet){
			this.mediaSet.setAsset(inAsset);
			if (inCaption){
				this.isCaption = true;
				this.videoplayer.setCaption(inCaption);
				this.videoplayer.setCaptionEnabled(this.storedCaptionEnabled);
			}
			else {
				this.isCaption = false;
				this.videoplayer.setCaptionEnabled(false);//disable caption because caption may be active from previous video
			}
			this.closedCaptionButton.setSelected(this.storedCaptionEnabled);
			if(this.emailShare) this.emailShare.setThumbnail(inAsset);			
		}else{
			this.setParam("asset", inAsset);
		}
	};
	
	s7viewers.VideoViewer.prototype.setLocalizedTexts = function(inText) {
		if (this.s7params){
			this.s7params.setLocalizedTexts(inText);
		}else{
			this.setParam("localizedTexts", inText);
		}
	};


	s7viewers.VideoViewer.prototype.initSiteCatalyst = function(params,inCallback) {
		// s7ComponentEvent function handles all the output from the SDK viewers.  The user can directly access
		// the tracking events if lower level control is desired - see UserEvent documentation.  
		//
		console.log("initializing site catalyst...");
		window.s7ComponentEvent = function s7ComponentEvent(objID, compClass, instName, timeStamp, eventData) {
			console.log("s7ComponentEvent(" + objID + ", " + compClass + ", " + instName + ", " + timeStamp + ", " + eventData + ")");
			// s7track() passes the eventData param to SiteCatalyst tracking through s_code.jsp
			if (typeof s7track == "function"){
				s7track(eventData);
			}
		}
		//integrate SiteCatalyst logging
		//strip modifier from asset and take the very first entry from the image list, and the first element in combination from that entry
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

	s7viewers.VideoViewer.prototype.onFullScreenEnter = function(event) {
	 //callback template
	};

	s7viewers.VideoViewer.prototype.onFullScreenExit = function(event) {
	 //callback template
	};

}
