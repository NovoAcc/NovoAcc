

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
	
	
	/*$('#BaseballCards').jcarousel({
		scroll: 1,
		animation: 0,
		wrap: 'circular'
	});*/


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
	

	
	// Show/Hide grey dots
	/*	
	$('#Expert1,.expert-2-solution-2,.expert-2-solution-1,#Expert3,#Expert4,#Expert5,#Expert6,#Expert7,').click(function() {
		$('.greydots').hide();
	});
	$('.menu').click(function() {
		$('.greydots').show();
		
	});
	*/

    // Wire up menu button display towards the basebaball cards and the grid
	$('.menu').click(function() {
		$('.xpt-1-sol,.xpt-2-sol,.xpt-3-sol,.xpt-4-sol,.xpt-5-sol,.xpt-6-sol').animate({'top':"0"});
	});	
	
	// Wire up experts click, scroll to expert solution and reveal baseball card carousel, slide expert grid up
	$('#bathroom-get-inspired-link').click(function() {
		baseballCards.jcarousel('scroll', 2);
		slidingPane.animate({ top: "-360px" }, function() { $('#GridBoxList').css('visibility', 'hidden'); $('#ToolViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
		return false;
	});
	$('#bathroom-make-a-plan-link').click(function() {
		baseballCards.jcarousel('scroll', 3);
		slidingPane.animate({ top: "-360px" }, function() { $('#GridBoxList').css('visibility', 'hidden'); $('#ToolViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
		return false;
	});
	$('#kitchen-get-inspired-link').click(function() {
		baseballCards.jcarousel('scroll', 4);
		slidingPane.animate({ top: "-360px" }, function() { $('#GridBoxList').css('visibility', 'hidden'); $('#ToolViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
		return false;
	});
	$('#kitchen-make-a-plan-link').click(function() {
		baseballCards.jcarousel('scroll', 5);
		slidingPane.animate({ top: "-360px" }, function() { $('#GridBoxList').css('visibility', 'hidden'); $('#ToolViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
		return false;
	});
	$('#buying-and-installing-link').click(function() {
		baseballCards.jcarousel('scroll', 6);
		slidingPane.animate({ top: "-360px" }, function() { $('#GridBoxList').css('visibility', 'hidden'); $('#ToolViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
		return false;
	});
	$('#caring-countertops-link').click(function() {
		baseballCards.jcarousel('scroll', 7);
		slidingPane.animate({ top: "-360px" }, function() { $('#GridBoxList').css('visibility', 'hidden'); $('#ToolViewPane').css('overflow', 'visible'); } );
		//baseballCarousel.options.animation = 'fast';
		return false;
	});
		
	$('.menu-text').click(function() {
		$('#ToolViewPane').css('overflow', 'hidden');
		$('#GridBoxList').css('visibility', 'visible');
		slidingPane.animate({ top: "0px" });
		//$('#BaseballCards').data('jcarousel').options.animation = 0;
		return false;
	});
	
  });

})(jQuery);
