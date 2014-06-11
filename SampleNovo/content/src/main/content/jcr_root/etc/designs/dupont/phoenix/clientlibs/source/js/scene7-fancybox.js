/*********************************************************************************
Notes:
This JavaScript file can be wrapped into the global JavaScript file or included as a 
separate file included within an existing clientlib.

Dependencies:
1. Fancybox 1.3.4 - DO NOT USE 2.1.1!
2. jQuery

*********************************************************************************/

$(document).ready(function() {

	// global variables
	var stageWidth = 630, stageHeight;
	
	if ($('.s7-fancy-video').length) {
		fancyInit();
	}
	
/********************************************************************************
HELPER METHODS
********************************************************************************/
	
	// fancy box initialization
	function fancyInit() { 
		
		$('.s7-fancy-video').each( function() {
			var video=$(this);

			// data-s7asset must NOT be null. 
			var s7file = video.attr('data-s7asset');

			if ("" != s7file) {
			
				var strHTML = '', screenwidth;
			
				// get screen width
				screenWidth = $(window).width();
				
				// if screen size is >= 1100, stageWidth = 630, otherwise, width must be width of content container x 65%
				stageWidth = (screenWidth >= 1100) ? 630 : (screenWidth*.65625);
				
				// videos are expected to have an aspect ratio of 16:9; 
				stageHeight = stageWidth * (9 /16);

				strHTML = '\n'
					+ '\t<div id="s7_videoview"></div>\n'
					+ '\t<script type="text/javascript">\n'
					+ '\tvar videoViewer = new s7viewers.VideoViewer();\n'
					+ '\tvideoViewer.setContainerId("s7_videoview");\n'
					+ '\tvideoViewer.setParam("serverurl", "'+s7domain+'/is/image/");\n'
					+ '\tvideoViewer.setParam("contenturl", "'+s7domain+'/skins/");\n'
					+ '\tvideoViewer.setParam("videoserverurl", "'+s7domain+'/is/content/");\n'
					+ '\tvideoViewer.setParam("asset", "' + s7file + '");\n'
					+ '\tvideoViewer.setParam("config", "Scene7SharedAssets/Universal_HTML5_Video");\n'
					+ '\tvideoViewer.setParam("stagesize", "' + stageWidth + ',' + stageHeight + '");\n'
					+ '\tvideoViewer.init();\n'
					+ '\t</script>\n';
				
				reInit($(this));

			}
			
			function reInit(container, opts){
				if(typeof s7sdk != 'undefined' && typeof s7sdk.events != 'undefined'){
					$('body').off(s7sdk.event.ResizeEvent.FULLSCREEN_RESIZE);
				}
				
					
				var defaults = {
						'padding'			: 15,
						'showCloseButton'	: true,
						'titlePosition'		: 'inside',
						'content'			: strHTML,
						'autoScale'			: false,
						'scrolling'			: 'no',
						'height'			: stageHeight,
						'width'				: stageWidth,
						'autoDimensions'	: false,
						'titleFormat'		: function() {
							return '<div class="video-lightbox-title">' + video.attr('data-title') + '</div><div class="video-lightbox-caption">' + video.attr('data-caption') + '</div>';
						},
						'onComplete'		: function() {
							
							return;
							//We're not using this, yet
							var viewportWidth = $(window).width();
					        var viewportHeight = $(window).height();
					        var fullscreen = true;
					        
							$('body').on(s7sdk.event.ResizeEvent.FULLSCREEN_RESIZE, function(){
								if(fullscreen) {
									//$('#fancybox-content, #fancybox-content > div').css({'overflow':'visible','width':viewportWidth,'height':viewportHeight});
					                fullscreen = false;
					            } else {
					            	//$('#fancybox-content, #fancybox-content > div').css({'overflow':'visible','width':stageWidth,'height':stageHeight});
					                fullscreen = true;
					            }
							});
						}
				}, options = {};
				
				$.extend(options, defaults, opts);
				
				container.fancybox(options);
			}


		});
		
		
        /*
        // Full Screen button event binding.
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        var fullscreen = false;
        
        var timerId = 0;

        timerId = setInterval(function () {
            if($('#s7_videoview_fullScreenBtn').length > 0){
               $('#s7_videoview_fullScreenBtn').click(function (e) {
            	   e.preventDefault();
                    if(fullscreen) {
                        $('#fancybox-content').css({'overflow':'visible','width':viewportWidth,'heigth':viewportHeight});
                        fullscreen = true;
                    } else {
                        $('#fancybox-content').css({'overflow':'visible','width':stageWidth,'heigth':stageHeight});
                        fullscreen = false;
                    }
                });
                clearInterval(timerId);
            }
        }, 500);
        */
	}
	
	// reset stageHeight and stageWidth when browser - upon browser resize
	$(window).resize(function() {
		if ($('.s7-fancy-video').length) {
			fancyInit();
		}
	});
});
