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
	var stageWidth = 715, stageHeight;
	
    // Responsive lightbox only for higher breakpoints (1250 and 768)
	if ($(window).width() > 768) {
        if ($('.s7-fancy-video').length) {
            fancyInit('.s7-fancy-video');
        }
    } else if ($(window).width() <= 768 ) {
        if ($('div.s7-fancy-video.fancy-inline').length) {
            fancyInit('.fancy-inline');
        }
    } // If the screen is equal or less than 768, we do not want to init feature A since we want the actual video in it for 768.
	
/********************************************************************************
HELPER METHODS
********************************************************************************/
	
	// fancy box initialization
	function fancyInit(fancyDivId) { 
		
		$(fancyDivId).each( function() {
            var video=$(this);

			// data-s7asset must NOT be null. 
			var s7file = video.attr('data-s7asset');

			if ("" != s7file) {
			
				var strHTML = '', screenwidth;
			
				// get screen width
				screenWidth = $(window).width();
				
				// if screen size is >= 1250, stageWidth = 715, otherwise, width must be width of content container x 65%
				stageWidth = (screenWidth >= 1250) ? 715 : (screenWidth*.65625);
				
				// videos are expected to have an aspect ratio of 16:9; 
				stageHeight = stageWidth * (9 /16);

				strHTML = '\n'
					+ '\t<div id="s7_videoview"></div>\n'
					+ '\t<script type="text/javascript">\n'
					+ '\t var videoViewer = new s7viewers.VideoViewer();\n'
					+ '\tvideoViewer.setContainerId("s7_videoview");\n'
					+ '\tvideoViewer.setParam("serverurl", "'+s7domain+'/is/image/");\n'
					+ '\tvideoViewer.setParam("contenturl", "'+s7domain+'/skins/");\n'
					+ '\tvideoViewer.setParam("videoserverurl", "'+s7domain+'/is/content/");\n'
					+ '\tvideoViewer.setParam("asset", "' + s7file + '");\n'
					+ '\tvideoViewer.setParam("config", "Scene7SharedAssets/Universal_HTML5_Video");\n'
					+ '\tvideoViewer.setParam("stagesize", "' + stageWidth + ',' + stageHeight + '");\n'
                    + '\tif( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { videoViewer.setParam("playback","native,1"); }\n'
					+ '\tvideoViewer.onInitComplete = showControls;\n'	 
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
							return '<div class="video-lightbox-title">' + video.attr('data-title') + 
                                '</div><div class="video-lightbox-caption">' + video.attr('data-caption') + '</div>';
						}

				}, options = {};
				$.extend(options, defaults, opts);
				container.fancybox(options);
			}
		});
	}
	
	// reset stageHeight and stageWidth when browser - upon browser resize
	$(window).resize(function() {
		if ($(window).width() > 768) { // for higher breakpoints only
            if ($('.s7-fancy-video').length) {
                fancyInit('.s7-fancy-video');
            }
        } else if ($(window).width() <= 768 ) {
            if ($('div.s7-fancy-video.fancy-inline').length) {
                fancyInit('.fancy-inline');
            }
        }
        
	});
});

function showControls() {
    if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('#s7_videoview_controls').show();
    }
}