(function ($) {

	$(document).ready(function() {

	/* IE7 Fixes... Last Resort Only
		- ie7 declared in header jsp */
	if (ie7 === true) {
		/* Content tabs - Adjust height of DIV and LIs to 100% */
		if ($('#nav-tabs-wrapper').length) {
			var contentTabsHeight = $('#nav-tabs-wrapper ul').height();
			console.log('the height is ' + contentTabsHeight);
			$('#nav-tabs-wrapper, #nav-tabs-wrapper ul li').height(contentTabsHeight);
		}
	}

	/* Show-Hide Functionality Section Landing Component for Utility Base template. */
    $(".show-hide").click(function(){
    	var showCat = $("#showCat")[0].value;
    	var hideCat = $("#hideCat")[0].value;
        if($(this).hasClass('hide')){
            $(this).parent().find(".col-container").show("slow");
            $(this).removeClass("hide");
            $(this).addClass("show");
            $(this).html(hideCat);
        }else{
            $(this).parent().find(".col-container").hide("slow");
            $(this).removeClass("show");
            $(this).addClass("hide");
            $(this).html(showCat);
        }
    });
     /* Cookie Alert */
    var cookieAlert = readCookie('cookieAlert');
    if(cookieAlert == null || cookieAlert =="") {
    	$('.cookiealert').toggle();
    }

    $('.cookieagree').click(function(event){
    	event.preventDefault();
    	$('.cookiealert').slideToggle('slow');

    	var exdate=new Date();
    	exdate.setDate(exdate.getDate() + 180);
    	document.cookie= "cookieAlert=hide ; expires="+exdate.toUTCString() + " ; path=/";
    });

    /* FANCY BOX */

	// Fancybox Image
	if ($('.image-fancybox').length) {
		var imgTitle = $(".image-fancybox").attr("data-title");
		var imgCaption = $(".image-fancybox").attr("data-caption");
		$(".image-fancybox").click(function() {
			var imgTitle = $(this).attr("data-title"),
				imgCaption = $(this).attr("data-caption");
		});
		function formatImageTitle(title) {
			return '<div id="my-fancybox-title">' + (imgTitle && imgTitle.length ? '<div class="my-image-title">' + imgTitle + '</div>' : '' ) + (imgCaption && imgCaption.length ? '<div class="my-image-caption">' + imgCaption + '</div>': '' ) + ' </div>';
		}
		$(".image-fancybox").fancybox({
			'padding' : 30,
			'prevEffect' : 'none',
            'nextEffect' : 'none',
            'titlePosition' : 'inside',
            'wrapCSS' : 'image-fancybox-wrap',
			'helpers' : {
				title : { type : 'inside' },
				buttons : {}
			},
			'showCloseButton' : true,
			'afterLoad' : function() {
					this.title = '<span class="lightbox_title">' + $(this.element).attr('data-title') + '</span> - ' + $(this.element).attr('data-caption');
            }
		});
    }

	/* Fancybox Video
		- we get parameters from html markup
		- strHtml - brightcove html starts here */
	if ($('.video-fancybox').length) {
		var videoTitle = $(".video-fancybox").attr("data-title");
		var videoCaption = $(".video-fancybox").attr("data-caption");
		var playerID= $(".video-fancybox").attr("playerID");
		var videoPlayer= $(".video-fancybox").attr("data-video-id");
		var playerKey = $(".video-fancybox").attr("playerKey");
		var strHtml = '';
		$(".video-fancybox").click(function() {
			videoTitle = $(this).attr("data-title");
			videoCaption = $(this).attr("data-caption");
			playerID= $(this).attr("playerID");
			videoPlayer= $(this).attr("data-video-id");
			playerKey = $(this).attr("playerKey");
		});
		strHtml = '<div class="views-field views-field-field-video">\n'
				+ '\t<div class="field-content">\n'
				+ '\t\t<!-- Start of Brightcove Player -->'
				+ '\t\t<div style="display:none"></div>'
				+ '\t\t<!--By use of this code snippet, I agree to the Brightcove Publisher T and C found at https://accounts.brightcove.com/en/terms-and-conditions/.-->'
				+ '\t\t\t<script language="JavaScript" type="text/javascript" src="http://admin.brightcove.com/js/BrightcoveExperiences_all.js"></script>'
				+ '\t\t\t<object id="myExperiencee{0}" class="BrightcoveExperience">'
				+ '\t\t\t\t<param name="bgcolor" value="#FFFFFF" />'
				+ '\t\t\t\t<param name="width" value="680px" />'
				+ '\t\t\t\t<param name="height" value="383px" />'
				+ '\t\t\t\t<param name="playerID" value="' + playerID + '" />'
				+ '\t\t\t\t<param name="playerKey" value="' + playerKey + '" />'
				+ '\t\t\t\t<param name="isVid" value="true" />'
				+ '\t\t\t\t<param name="isUI" value="true" />'
				+ '\t\t\t\t<param name="dynamicStreaming" value="true" />'
				+ '\t\t\t\t<param name="@videoPlayer" value="' + videoPlayer + '" />'
				+ '\t\t\t</object>'
				+ '\t\t\t<script type="text/javascript">brightcove.createExperiences();</script>'
				+ '\t\t<!-- End of Brightcove Player -->';
				+ '\t</div>\n'
				+ '</div>\n';
		$(".video-fancybox").fancybox({
			'padding'			: 30,
			'showCloseButton'	: true,
			'titlePosition'		: 'inside',
			'helpers'			: {
				title	: { type : 'inside' },
				buttons	: {}
			},
			'content'			: strHtml,
			'scrolling'			: 'no',
			'autoScale'			: true,
			'afterLoad'			: function() {
				this.title = '<span class="video-lightbox-title">' + $(this.element).attr('data-title') + '</span><span class="video-lightbox-caption">' + $(this.element).attr('data-caption') + '</span>';
			}
		});
	}

	/* Fancybox Iframe */
	if ($('.iframe-fancybox').length) {
		var iframeWidth = parseInt($(".iframe-fancybox").attr("width"), null);
		var iframeHeight = parseInt($(".iframe-fancybox").attr("height"), null);
		var iframeScrolling = $(".iframe-fancybox").attr("scrolling");

		$(".iframe-fancybox").click(function() {
			iframeWidth = parseInt($(this).attr("width"), null);
			iframeHeight = parseInt($(this).attr("height"), null);
			iframeScrolling = $(this).attr("scrolling");
		});

		$(".iframe-fancybox").fancybox({
			'padding' : 20,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'autoScale' : false,
			'type' : 'iframe',
			'width' : iframeWidth,
			'height' : iframeHeight,
			'scrolling' : iframeScrolling
		});
	}

	/* Megatrends Iframe */
	if ($('.megatrend-fancybox').length) {
		$(".megatrend-fancybox").fancybox({
			'padding' : 20,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'autoScale' : false,
			'autoDimensions' : false,
			'scrolling' : 'no',
			'type' : 'inline',
			'width' : 960,
			'height' : 600
		});
	}

	/* Fancybox Slide Share Section */
	if ($('.slideshare-fancybox').length) {
		var slideshareWidth = parseInt($(".slideshare-fancybox").attr("width"), null);
		var slideshareHeight = parseInt($(".slideshare-fancybox").attr("height"), null);
		var slideshareScrolling = $(".slideshare-fancybox").attr("scrolling");
		$(".slideshare-fancybox").click(function() {
			slideshareWidth = parseInt($(this).attr("width"), null);
			slideshareHeight = parseInt($(this).attr("height"), null);
			slideshareScrolling = $(this).attr("scrolling");
		});
		$(".slideshare-fancybox").fancybox({
			'padding' : 20,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'autoScale' : false,
			'type' : 'iframe',
			'width' : slideshareWidth,
			'height' : slideshareHeight,
			'scrolling' : slideshareScrolling
		});
	}

	/* Utility Functions */
	String.format = function() {
		var s = arguments[0];
		for (var i = 0; i < arguments.length - 1; i++) {
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			s = s.replace(reg, arguments[i + 1]);
		}
		return s;
	};

	/* Select Menu Styling
		- #HuesSelect is called in the color-selector.js for that tool */
	$('select:not(.page-item select, #HuesSelect)').selectmenu({ });


	/* Global Navigation - Toggle functionality */

    /* Too scared to delete.
	function addMega() {
		$('.menu-dropdown-content', this).show();
		$(this).addClass("hovering");
	}
	function removeMega() {
		$('.menu-dropdown-content', this).hide();
		$(this).removeClass("hovering");
	}
	var megaConfig = {
          interval: 1,
          sensitivity: 5,
          over: addMega,
          timeout: 1,
          out: removeMega
    }; */

	$('.header-top-bar-nav .navigation-item').click(function() {
	    $('.header-top-bar-nav .navigation-item').not(this).removeClass("hovering");
	    $(this).toggleClass("hovering");
	    $('.menu-dropdown-content',this).toggle(0, function () {
	        $('.menu-dropdown-content').not(this).hide();
	    });
	});


	/* Show More & Show Less - Product Information Module
		- See Example on T_4_1_0.html Template
		- prodInfoLists() - Grab all Product Info Lists and Show only Four */
	$('.prod-info').each(function(i) {
		prodInfoLists();
		var showMoreValue = $('.showall', this).text();
		$(".showall", this).toggle(function(i) {
			var thisParent = $(this).parents('.group');
			$('.prod-info ul li', thisParent).show();
			$(this).addClass('showless');
			$('span', this).text($("#showlessPI").val());

		}, function(i) {
			prodInfoLists();
			$('span', this).text(showMoreValue);
			$(this).removeClass('showless');
		});
	});
	function prodInfoLists() {
		$('.prod-info ul').each(function(index) {
			$('li:gt(3)', this).hide();
		});
	}
	
	$('.horizontal_list_module_2-3_col').each(function(i, item){
        jCarouselInit.init({
        	'carousel' : $(item).find('ul').first().parent(),
            'list' : $(item).find('ul').first(),
            'items' : $(item).find('ul').first().find('li'),            
            'itemsToShow' : 3,
            'wrapper' : true,
            'centerV' : false,
            'animation' : 'fast',
            'parent' : '.hlm-div-id',
            'leftMargin' : 70, 
            'leftPadding' : 0,
            'isStatic' : true,
            'calloutItems' : 2
        });
    });

    $('.horizontal_list_module_3_col').each(function(i, item){
        jCarouselInit.init({
            'carousel' : $(item).find('ul').first().parent(),
            'list' : $(item).find('ul').first(),
            'items' : $(item).find('ul').first().find('li'),           
            'itemsToShow' : 3,
            'wrapper' : true,
            'centerV' : false,
            'animation' : 'fast',
            'parent' : '.hlm-div-id',
            'leftMargin' : 70, 
            'leftPadding' : 0,
            'isStatic' : true,
            'calloutItems' : 2
        });
    });


    $('.horizontal_list_module_4_col').each(function(i, item){
        jCarouselInit.init({
	    	 'carousel' : $(item).find('ul').first().parent(),
	         'list' : $(item).find('ul').first(),
	         'items' : $(item).find('ul').first().find('li'),            
            'itemsToShow' : 4,
            'wrapper' : true,
            'centerV' : false,
            'animation' : 'fast',
            'parent' : '.hlm-div-id',
            'leftMargin' : 70, 
            'leftPadding' : 0,
            'isStatic' : true,
            'calloutItems' : 2
        });
    });
    
    if($('#RelatedColors').parent().parent().not('.legacy').length > 0 ){
	    var relatedColorScroll = ($('#RelatedColors').find('li').length > 3) ? 4 : $('#RelatedColors').find('li').length;
	    jCarouselInit.init({
	        'carousel' : $('#RelatedColors').parent(),
	        'list' : $('#RelatedColors'),
	        'items' : 'li',
	        'itemsToShow' : relatedColorScroll,
	        'hide' : false,
	        'centerV' : false,
	        'animation': 'fast',
	        'prev' : '.jcarousel-prev',
	        'next':  '.jcarousel-next',
	        'parent' : '.relatedcolors'
	    });
    }
    
    if($('#recommendedColors').parent().parent().not('.legacy').length > 0 ){
	    var recommendedColorScroll = ($('#recommendedColors').find('li').length > 3) ? 4 : $('#RelatedColors').find('li').length;
	    jCarouselInit.init({
	        'carousel' : $('#recommendedColors').parent(),
	        'list' : $('#recommendedColors'),
	        'items' : 'li',
	        'itemsToShow' : recommendedColorScroll,
	        'hide' : false,
	        'centerV' : false,
	        'animation': 'fast',
	        'prev' : '.jcarousel-prev',
	        'next':  '.jcarousel-next',
	        'parent' : '.recommendedcolors'
	    });
	}
    
   // var item = $('.static-hlm');
    
    $('.static-hlm').each(function(i, item){
    	
    	 var list = $(item).find('ul'),
	     	jCarouselScrollStatic = 4;
	
	 	if($(item).find('ul li').length < jCarouselScrollStatic){
	 		jCarouselScrollStatic = $(item).find('ul li').length;
	 	}
	 	
	    jCarouselInit.init({
	    	 'carousel' : $(item).find('ul').first().parent(),
	            'list' : $(item).find('ul').first(),
	            'items' : $(item).find('ul').first().find('li'),            
	        'itemsToShow' : jCarouselScrollStatic,
	        'wrapper' : true,
	        'centerV' : false,
	        'animation' : 'fast',
	        'parent' : '.hlm-div-id',
	        'leftMargin' : 70, 
	        'leftPadding' : 0,
	        'isStatic' : true,
	        'calloutItems' : 2
	    });
    });
    
    
    $('.featuredb').each(function(i, item){
        var featuredBList = $(item).find('ul').first(),
	    	jCarouselScrollFeaturedB = 4,
	    	featuredBCarousel = featuredBList.parent();
	
		if($(item).find('ul').first().find('li').length < jCarouselScrollFeaturedB){
		    jCarouselScrollFeaturedB = ($(item).find('ul').first().find('li').length >1) ? $(item).find('ul').first().find('li').length  : 2;
		}
		
		jCarouselInit.init({
	        'itemsToShow' : jCarouselScrollFeaturedB,
	        'carousel' : featuredBCarousel,
	        'list' :  featuredBList,
	        'items' : featuredBList.find('li'),
		    'prev' : '.prev',
		    'next' : '.next',
		    'removeBorder' : true,
		    'animation' : 'fast',
		    'wrapper' : true,
		    'centerV' : false,
		    'parent' : '.hlm-div-id',
		    'leftMargin' : 70, 
	        'leftPadding' : 0,
	        'isStatic' : true,
	        'calloutItems' : jCarouselScrollFeaturedB
		});
    	
    });
    
     jCarouselInit.init({
    	 'animation' : 'fast',
    	 'removeBorder' : true
     }); 

	/* Add row-color class to even HLM rows - Raghu */
	jQuery('.hlm-div-id:even').removeClass("row").addClass("row-color");
	/* First Gallery Add Selected Class */
	jQuery('#media-menu li:first-child').addClass('selected');
	/* Testing Scripts */
	$('.expansion-link-open').click(function() {
		$(this).parent('li').children('.show-categories').toggle();
	});

	/* Agnostic Footer - Social Links Icon Hover */
	$(function() {
		$('.social_links img[data-hover]').hover(function() {
			$(this).attr('tmp', $(this).attr('src')).attr('src', $(this).attr('data-hover')).attr('data-hover', $(this).attr('tmp')).removeAttr('tmp');
		}).each(function() {
			$('<img />').attr('src', $(this).attr('data-hover'));
		});
	});


	/* Share Button */
	$('#ShareLink').click(function() {
		$('.share-button').toggleClass('share-button-activated');
		$('.share-window').toggle();
	});
	/* Share Button - Close Activated Window */
	$('.share-window .window-close-button').click(function() {
		$('.share-button').toggleClass('share-button-activated');
		$('.share-window').hide();
	});
	/* Share Button Icon on Hover */
	$('.share-window ul li').hover(function() {
		$('img', this).attr('tmp', $('img', this).attr('src')).attr('src', $('img', this).attr('data-hover')).attr('data-hover', $('img', this).attr('tmp')).removeAttr('tmp');
	}).each(function() {
		$('<img />').attr('src', $('img', this).attr('data-hover'));
	});


	/* If Browser width is less than 1024, position HLM pagination arrows right up against module
		- Check on Load and on document.resize */
	if ($('.jcarousel-container-horizontal')[0] ) {
		function documentWidthCheck() {
			if ($(window).width() < 1024) {
				$('.jcarousel-container-horizontal').children('.prev').css('left','38px');
				$('.jcarousel-container-horizontal').children('.next').css('right','38px');
			} else {
				$('.jcarousel-container-horizontal').children('.prev').css('left','0');
				$('.jcarousel-container-horizontal').children('.next').css('right','0');
			}
		}
		documentWidthCheck();
		$(window).resize(function() {
		    documentWidthCheck();
		});
	}


	/* Media Gallery */

	/* Show only the first gallery set
		- grab the items class / id and add selected class
		- Click on a Tab and do the following */
	$('.gallery-row:gt(0)').hide();
    var currentVisibleTab = '.' + $('.gallery-row:visible:first').attr('id');
    $(currentVisibleTab).addClass('selected');
    $('#media-menu li').live('click', function() {
		// Var - this gallery set div id
		var selectedMediaGalleryString = '#' + $(this).attr('data-gallery');
		var selectedMediaGallery = selectedMediaGalleryString.replace('selected', '').replace('border-radius-left','').replace('border-radius-right','');
		// Fade out gallery sets and load in this selected one
		$('.gallery-row').fadeOut(0,function() {
			$(selectedMediaGallery).fadeIn(0);
		});
		// Remove selected class from previous item
		$(this).siblings().removeClass('selected');
		// Add it to this one
		$(this).addClass('selected');
		// Update Pagination Count
		var lastItemId = $(selectedMediaGallery + ' .imageset div:visible:last').index() + 1;
		$(selectedMediaGallery + ' .media-gallery-pagination-last').text(lastItemId);
		return false;
    });

	/* Media Gallery Loop */
	$('.gallery-thumbs').each(function() {
		var mediaGalleryId = '#' + $(this).parent('.gallery-row').attr('id'),
			totalThumbnails = $( mediaGalleryId + ' .imageset div').size(),
			firstThumbnail = $( mediaGalleryId + ' .imageset div:visible:first').index() + 1,
			lastThumbnail = $('.imageset div:visible:last', this).index() + 1;
		// Show only the first 10 images
		$('.imageset div:gt(9)', this).hide();
		// Update Total Thumbnail Count
		$('.media-gallery-pagination-total', this).text(totalThumbnails);
		// Check to see if there are Ten Images
		if (totalThumbnails <= 10){
			$(mediaGalleryId + ' .media-next').hide();
		}

		// Previous Button
		$('.media-previous', this).live('click', function() {
			var first = $(mediaGalleryId + ' .imageset').children('div:visible:first'),
				last = $( mediaGalleryId + ' .imageset').children('div:visible:last'),
				firstIndex = $(first).eq(0).index() + 1,
				lastIndex = $(last).eq(0).index() + 1;
			// Show the Previous hide the Current
			first.prevAll(':lt(10)').show();
			first.prev().nextAll().hide();
			// Update the Pagination Numbers
			$(mediaGalleryId + ' .media-gallery-pagination-first').text($(".imageset div:visible:first").index() + 1);
			$(mediaGalleryId + ' .media-gallery-pagination-last').text($(".imageset div:visible:last").index() + 1);
			// Check to see if we're on the First Page
			if ($( mediaGalleryId + ' .imageset div:visible:first').is(':first-child')) {
				$( mediaGalleryId + ' .media-previous').hide();
				$( mediaGalleryId + ' .media-next').show();
			} else {
				$( mediaGalleryId + ' .media-next').show();
			}
		});

		// Next button
		$('.media-next', this).live('click', function() {
			var first = $(mediaGalleryId + ' .imageset').children('div:visible:first'),
				last = $( mediaGalleryId + ' .imageset').children('div:visible:last'),
				firstIndex = $(first).eq(0).index() + 1,
				lastIndex = $(last).eq(0).index() + 1;
			// Show the Next hide the current
			last.next().prevAll().hide();
			last.nextAll(':lt(10)').show();
			// Update the Pagination Numbers
			$(mediaGalleryId + ' .media-gallery-pagination-first').text($(".imageset div:visible:first").index() + 1);
			$(mediaGalleryId + ' .media-gallery-pagination-last').text($(".imageset div:visible:last").index() + 1);
			// Check to see if we're on the Last Page
			if ($( mediaGalleryId + ' .imageset div:visible:last').is(':last-child')) {
				$( mediaGalleryId + ' .media-next').hide();
				$( mediaGalleryId + ' .media-previous').show();
			} else {
				$( mediaGalleryId + ' .media-previous').show();
			}
		});
	});

	// For each Image set, update the pagination count
	$('.imageset').each(function() {
		// Set Variables
		var mediaGalleryId = '#' + $(this).parent('div').parent('div').attr('id'),
			firstVisibleThumbId = $(".imageset div:visible:first").index() + 1,
			lastVisibleThumbId = $(".imageset div:visible:last").index() + 1;
		// Hide the Previous Button
		$('.media-previous').hide();
		// Replace Pagination first item number
		$(mediaGalleryId + ' .media-gallery-pagination-first').text(firstVisibleThumbId);
		// Replace Pagination last item number
		$(mediaGalleryId + ' .media-gallery-pagination-last').text(lastVisibleThumbId);
	});


	/* Article Sidebar Vertical List Module Add Margin to Bottom - Cross Browser Support Needed */
	$('.article-right-column > div:last-child').addClass('vertical-list-module-last');
	/* Article Sidebar Vertical List Module Add Background Color - Cross Browser Support Needed */
	$('.article-right-column > div:nth-child(odd)').addClass('vertical-list-module-odd');
	$('.article-right-column > div:nth-child(even)').addClass('vertical-list-module-even');


    /* Click on a thumbnail open image in main container
    	- Give all thumbs 100% opacity
    	- Give this item 50% opacity
    	- Swap out media shown with this thumbnail data */
    $(".gallery-thumbs .imageset div").live('click', function() {
		var thisMediaGallery = '#' + $(this).parent().parent().parent().attr('id'),
		image_src = $('img', this).attr('src'),
		image_title = $('h3', this).text(),
		image_description = $('p', this).text();
		$(".gallery-thumbs .imageset div").css('opacity','1');
		$(this).css('opacity','.5');
		$( thisMediaGallery + ' .media-shown img:first-child').attr('src', image_src);
		$( thisMediaGallery + ' .media-shown h2').text(image_title);
		$( thisMediaGallery + ' .media-shown p').text(image_description);
		return false;
    });

    /* Add Border-Radius to first and last galleries */
	$('#media-menu li:first-child').addClass('border-radius-left');
	$('#media-menu li:last-child').addClass('border-radius-right');


	/* Display loading icon for Brightcove Video Players
		- All instances of video galleries on a given page */
	if ($('.BrightcoveExperience').length > 0) {
		$('.BrightcoveExperience').each(function() {
			var playerParent = $(this).parent();
			playerParent.addClass('brightcoveLoader');
		});
	}

	/*  [JA] Display loading icon for Brightcove Video Players
		- get a reference to the Player
		- load modules and add event listener */
	var player, experience;
	function onTemplateLoaded(experienceID) {
		(function($) {
			player = brightcove.getExperience(experienceID);
			experience = player.getModule(APIModules.EXPERIENCE);
			experience.addEventListener(BCExperienceEvent.TEMPLATE_READY, onTemplateReady);
		})(jQuery);
	}
	function onTemplateReady(e) {
		(function($) {
			$('.brightcoveLoader').removeClass('brightcoveLoader');
		})(jQuery);
	}

	//Read cookies on the client side
	function readCookie(name) {
	    var nameEQ = escape(name) + "=";
	    var ca = document.cookie.split(';');
	    for (var i = 0; i < ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
	        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
	    }
	    return null;
	}


	// feature X height
	var featureHeight=0;
	var featureHeightMax=0;
	$('.grid-wrapper .featured_x').each(function(){
		featureHeight=$(this).height();
		if(featureHeight>featureHeightMax)
			featureHeightMax=featureHeight;
	});
	if(featureHeightMax>0){
		$('.grid-wrapper .featured_x').css("height",featureHeightMax+"px");
	}else{
		$('.grid-wrapper .featured_x').css("height","25px");
	}




});
}) (jQuery);

/* MSDSSearch */
function validateParameters(name, number, locale, msgNameNumber, msgCtyLang, msgProductKeywordDefault) {
    // check if text input is a number or a string
    var userInput = jQuery('input[name=UTFNAME]').val();
    // check if the country/language field is selected before we do anything
    if (locale.value === "none_none"){
        alert(msgCtyLang);
        jQuery('input[name=NAME]').val('');
        jQuery('input[name=NUMBER]').val('');
        return false;
    }

    if(parseInt(userInput, null)) {
        // user has entered a number value, set appropriate parameter
        jQuery('input[name=NUMBER]').val(encodeURI(userInput));
        // clear value of name input field
        jQuery('input[name=NAME]').val('');
        document.FormSearchInitial.submit();
    } else {
        // alert user to enter a value in the name field
        if (userInput === msgProductKeywordDefault || (userInput === "")) {
            // alert for name and number only if the country/language is selected
            if (locale.value !== "none_none") {
                alert(msgNameNumber);
            }
            // clean up values in name and number fields
            jQuery('input[name=NAME]').val('');
            jQuery('input[name=NUMBER]').val('');
            return false;
        } else {
            // clear value of NUMBER input field
            jQuery('input[name=NUMBER]').val('');
            document.FormSearchInitial.NAME.value = encodeURI(name.value);
            document.FormSearchInitial.submit();
        }
    }
}
function fnAddShortDesc(shortDesc){
	var appendedDiv = "<div id='short_description'>"+shortDesc+"</div>";
    var count = ($('#html5-elem-data-box').length);
    var newDivCount = ($('#short_description').length);
    //alert(appendedDiv);
    //alert(newDivCount);
    if(newDivCount == 0)
    {
    	$('#html5-elem-data-box').append(appendedDiv);
    }

}
