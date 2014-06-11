

(function($) {

  $(function () {

	// Color square hover
	$('.sq-hover').each(function() {
	var bgImage = $(this).css('background-image');
	var newPath = bgImage.substring(5, bgImage.length-6)+'-hover.jpg';
	var newbgImage = new Image();
	newbgImage.src = newPath;
	});

	// Portrait color hover
	$('.prl').each(function() {
	var imageSource = $(this).attr('src');
	var myImage = new Image();
	myImage.src = imageSource.substring(0, imageSource.length-4)+'-color.jpg'; 
	});

	/*$('#ExpertGrid').jcarousel({
		scroll: 1
	});
	
	$('#BaseballCards').jcarousel({
		scroll: 1,
		animation: 0,
		wrap: 'circular'
	});*/

      jCarouselInit.init({
        	'carousel' : '#GridBox',
        	'list' : '#ExpertGrid',
        	'items' : 'li',           
       		'itemsToShow' : 1,
        	'hide' : false,
            'centerV' : false,
            'animation': 'fast'
    	});


        jCarouselInit.init({
        	'carousel' : '#ExpertBox',
        	'list' : '#BaseballCards',
        	'items' : 'li',
            'next' : '.jcarousel-next',
            'prev' : '.jcarousel-prev',
       		'itemsToShow' : 1,
        	'hide' : false,
            'animation': 'fast',
            'wrap': 'circular',
            'centerV' : false
    	});

	
	
	var slidingPane = $('#Container');
	var baseballCards = $('#BaseballCards').parent();
	var baseballCarousel = $('#BaseballCards').parent().data('jcarousel');

	
	var expertGrid = $('#ExpertGrid').parent();
	$('#grid1').click(function() {
		expertGrid.jcarousel('scroll', 0);
		$('#grid1').addClass('selected');
		$('#grid2').removeClass('selected');
	});
	$('#grid2').click(function() {
		expertGrid.jcarousel('scroll', 1);
		$('#grid2').addClass('selected');
		$('#grid1').removeClass('selected');
	});
	
	// Show/Hide grey dots
	/*	
	$('#Expert1,.expert-2-solution-2,.expert-2-solution-1,#Expert3,#Expert4,#Expert5,#Expert6,#Expert7,').click(function() {
		$('.greydots').hide();
	});
	$('.menu').click(function() {
		$('.greydots').show();
		
	});
	*/

	$('.menu').click(function() {
		$('.xpt-1-sol,.xpt-2-sol,.xpt-3-sol,.xpt-4-sol,.xpt-5-sol,.xpt-6-sol').animate({'top':"0"});
	});	
	
	$('#Expert1').click(function() {
		baseballCards.jcarousel('scroll', 0);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
        /*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
	});
	
	// Expert with 2 different solutions on main grid CLICK	
	$('.expert-2-solution-1').click(function() {
		baseballCards.jcarousel('scroll', 1);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
		$('.xpt-1-sol').animate({'top':"0"});
	});
	$('.expert-2-solution-2').click(function() {
		baseballCards.jcarousel('scroll', 1);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
		$('.xpt-1-sol').animate({'top':"-361px"});
	});
// End of Expert with 2 different solutions on main grid CLICK	
	
	$('#Expert3').click(function() {
		baseballCards.jcarousel('scroll', 2);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
	});
	
	$('#Expert4').click(function() {
		baseballCards.jcarousel('scroll', 3);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
	});
	
	$('#Expert5').click(function() {
		baseballCards.jcarousel('scroll', 4);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
	});
	
	$('#Expert6').click(function() {
		baseballCards.jcarousel('scroll', 5);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
	});
	
	$('#Expert7').click(function() {
		baseballCards.jcarousel('scroll', 6);
		slidingPane.animate({ top: "-410px" }, function() { $('#ExpertGrid').css('visibility', 'hidden'); $('#DSSViewPane').css('overflow', 'visible'); });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'fast'
        });*/
	});
	
	
	$('.slide-grid-up').click(function() {
		slidingPane.animate({ top: "-410px" });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'none'
        });*/
	});
	$('.slide-grid-down').click(function() {
		$('#DSSViewPane').css('overflow', 'hidden');
		$('#ExpertGrid').css('visibility', 'visible');
		slidingPane.animate({ top: "0px" });
		/*jCarouselInit.reloadCarousel(baseballCarousel,{
            'animation': 'none'
        });*/
	});
	
	
	$('#Expert1').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/simon-herriot-color.jpg");
			  $(this).find('img.right-arrow').hide();			  
			  $('.sqr-1').addClass('sqr-1-hover');
                                }, function() {
              $(this).find('p').css('color', '#e5d1b5');
              // change image back to B&W version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/simon-herriot.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-1').removeClass('sqr-1-hover');
    });
	
	// Start Expert with 2 different solutions on main grid HOVER	
	$('.expert-2-solution-2').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
			  $(this).find('img.expert-2-img').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/robert-krzywicki-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-2').addClass('sqr-2-hover');
                                }, function() {
              $(this).find('p').css('color', '#e5d1b5');
              // change image back to B&W version here
			  $(this).find('img.expert-2-img').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/robert-krzywicki.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-2').removeClass('sqr-2-hover');
    });
	$('.expert-2-solution-1').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
			  $(this).find('img.expert-2-img').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/robert-krzywicki-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-3').addClass('sqr-3-hover');
                                }, function() {
              $(this).find('p').css('color', '#efceb6');
              // change image back to B&W version here
			  $(this).find('img.expert-2-img').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/robert-krzywicki.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-3').removeClass('sqr-3-hover');
    });
	$('#Expert2').hover( function() {
              // change image to color version here
              $(this).find('img.expert-2-img').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/robert-krzywicki-color.jpg");
                                }, function() {
              // change image back to B&W version here
              $(this).find('img.expert-2-img').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/robert-krzywicki.jpg");
    });
	// End of Expert with 2 different solutions on main grid HOVER	
	
	$('#Expert3').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/laurie-pankow-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-4').addClass('sqr-4-hover');
                                }, function() {
              $(this).find('p').css('color', '#e8c4b2');
              // change image back to B&W version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/laurie-pankow.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-4').removeClass('sqr-4-hover');
    });
	
	$('#Expert4').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/davide-vassallo-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-5').addClass('sqr-5-hover');
                                }, function() {
              $(this).find('p').css('color', '#c7bcb1');
              // change image back to B&W version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/davide-vassallo.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-5').removeClass('sqr-5-hover');
    });
	
	$('#Expert5').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
              $(this).find('img.sqr-xpt-1-special').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/srinivasan-ramabhadran-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-6').addClass('sqr-6-hover');
                                }, function() {
              $(this).find('p').css('color', '#efceb6');
              // change image back to B&W version here
              $(this).find('img.sqr-xpt-1-special').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/srinivasan-ramabhadran.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-6').removeClass('sqr-6-hover');
    });
	
	$('#Expert6').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/garrett-forsythe-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-7').addClass('sqr-7-hover');
                                }, function() {
              $(this).find('p').css('color', '#e5d1b5');
              // change image back to B&W version here
              $(this).find('img.sqr-xpt-1').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/garrett-forsythe.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-7').removeClass('sqr-7-hover');
    });
	
	$('#Expert7').hover( function() {
              $(this).find('p').css('color', '#FFFFFF');
              // change image to color version here
              $(this).find('img.sqr-xpt-2').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/christopher-smith-color.jpg");
			  $(this).find('img.right-arrow').hide();
			  $('.sqr-8').addClass('sqr-8-hover');
                                }, function() {
              $(this).find('p').css('color', '#e8c4b2');
              // change image back to B&W version here
              $(this).find('img.sqr-xpt-2').attr("src","../../sites/all/themes/dpphoenix/Tools/DSSExpert/images/christopher-smith.jpg");
			  $(this).find('img.right-arrow').show();
			  $('.sqr-8').removeClass('sqr-8-hover');
    });
	

	
	
	$('.xpt-1-sol-bottom-1').click(function() {
 		$('.xpt-1-sol').animate({'top':"-361px"});
	});
	$('.xpt-1-sol-bottom-2').click(function() {
 		$('.xpt-1-sol').animate({'top':"0"});
	});

	$('.xpt-2-sol-bottom-1').click(function() {
 		$('.xpt-2-sol').animate({'top':"-361px"});
	});
	$('.xpt-2-sol-bottom-2').click(function() {
 		$('.xpt-2-sol').animate({'top':"0"});
	});

	$('.xpt-3-sol-bottom-1').click(function() {
 		$('.xpt-3-sol').animate({'top':"-361px"});
	});
	$('.xpt-3-sol-bottom-2').click(function() {
 		$('.xpt-3-sol').animate({'top':"0"});
	});

	$('.xpt-4-sol-bottom-1').click(function() {
 		$('.xpt-4-sol').animate({'top':"-361px"});
	});
	$('.xpt-4-sol-bottom-2').click(function() {
 		$('.xpt-4-sol').animate({'top':"0"});
	});

	$('.xpt-5-sol-bottom-1').click(function() {
 		$('.xpt-5-sol').animate({'top':"-361px"});
	});
	$('.xpt-5-sol-bottom-2').click(function() {
 		$('.xpt-5-sol').animate({'top':"0"});
	});

	$('.xpt-6-sol-bottom-1').click(function() {
 		$('.xpt-6-sol').animate({'top':"-361px"});
	});
	$('.xpt-6-sol-bottom-2').click(function() {
 		$('.xpt-6-sol').animate({'top':"0"});
	});
	
  });

})(jQuery);
