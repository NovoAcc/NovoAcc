
    ( function(window, document, $, undefined) {
        
        // TODO: run this only for breakpoints lower than 768 AND user agent is mobile
        var expose = ( function(){
            
            // Basic variables
            var s7videoplayer, container, s7params;
            
            function initS7SDK() {
                // Only for lower breakpoints
            	

                if ($(window).width() <= 768) {
                    
                    /** Since the inline callout can be in the same page as video / MMG only include the libs when needed. **/
                    if (typeof s7sdk.Container === 'undefined') {
                        s7sdk.Util.lib.include('s7sdk.common.Container');
                    }
                
                    if (typeof s7sdk.Event === 'undefined') {
                        s7sdk.Util.lib.include('s7sdk.event.Event');
                    }
                
                    if (typeof s7sdk.video === 'undefined') {
                        s7sdk.Util.lib.include('s7sdk.video.VideoPlayer');
                    }
                    
                    s7sdk.Util.init();
                    s7params = new s7sdk.ParameterManager();
                    if ($(window).width() <= 600) {
                        s7params.addEventListener(s7sdk.Event.SDK_READY, function () {initViewer('.s7inlineViewer , .s7featuredViewer')}, false);
                    } else {
                        s7params.addEventListener(s7sdk.Event.SDK_READY,function () {initViewer('.s7featuredViewer')}, false);
                    }
                        
                    
                    s7params.init();
                }
                else {
                    $(document).ready( function (){
                    	$('.s7-fancy-video.fancy-inline').show();
                    });
                    return;
                }
                
            }
            
            /*
             * Init Viewer will take all inline callout that feature a S7 video and will add the correct and unique id for the S7 SDK to use.
             * Remember that there can be more than 1 inline callout in the page.
             */
            function initViewer(viewerID) {
            	$(viewerID).each(function (i, item) {
            		var type = $(item).hasClass('featured-a') ? 'featureda' : 'inline',
                   	    containerId = 's7' + type + 'video-mobile-' + i;
                    $(item).attr('id',containerId);
                    createContainer(containerId, type, item);
                    hideImageObject(type);
                });
                
            }
            
            
            /*
             * Creates the container and video player 
             */
            function createContainer (containerId, _type, item) {
                var imgSize = calculateStageSize(containerId, item),
                	asset = $(item).data('asset');
                
                s7params.push("serverurl", s7domain+"/is/image/");
                s7params.push("contenturl", s7domain+"/skins/");
                s7params.push("videoserverurl", s7domain+"/is/content/");
                s7params.params.asset = asset;
                s7params.push("autoplay", "0");
                s7params.push("iconeffect", "1,-1,0.3,0");
                s7params.push("config", "Scene7SharedAssets/Universal_HTML5_Video");
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                	s7params.push("playback", "native,1");
			    }
                s7params.params.stagesize = imgSize;
                //s7params.push("stagesize", imgSize);
    		    s7params.push("singleclick", "playPause");
                container = new s7sdk.Container(containerId, s7params, "s7-"+ _type +"-container");
                s7videoplayer = new s7sdk.video.VideoPlayer("s7-"+ _type +"-container",s7params,"s7viewer"+ _type);
            }
            
            
            /*
             * Calculate the stage size using the parent container of the item.
             */
            function calculateStageSize(containerId, item) {
                var tempSize;
                if($(item).hasClass('featured-a')) {
                    tempSize = $(item).width() + "," + Math.round((($(item).width() / 16) * 9));
                    
                } else {
                    tempSize = $('#'+containerId).parent().find('.inline_callout_image').width() + "," + $('#'+containerId).parent().find('.inline_callout_image').height()
                }
                return tempSize;
            }
            
            
            /*
             * Hide the image objects depending on type being worked on
             */
            function hideImageObject(type) {
                if (type == 'featureda') {
                    $('.s7-fancy-video img').hide();
                    $('.featurea-play-button-overlay').hide();
                } else {
                    $('.inline_callout_image').hide();
                }
            }

            return {
            	'initS7SDK':initS7SDK
            	};   
    
        })();
        
        if(typeof window.inlineS7Mobile === 'undefined' ){
        	window.inlineS7Mobile = expose;
	    	if (window.addEventListener) {
	            window.addEventListener('load', expose.initS7SDK, false);
	        } else if (window.attachEvent) {
	            window.attachEvent('onload', expose.initS7SDK);
	        }
        }
        
        
       
        
    })(window, document, jQuery);
    
