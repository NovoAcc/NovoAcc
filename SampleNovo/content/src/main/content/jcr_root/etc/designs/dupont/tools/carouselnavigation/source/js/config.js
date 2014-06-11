var indexCard=1;
(function ($) {

    jQuery(function () {
    	var baseballOptions = {
            	'carousel' : '#ExpertBox',
            	'list' : '#BaseballCards',
            	'items' : 'li',
                'next' : '.jcarousel-next',
                'prev' : '.jcarousel-prev',
           		'itemsToShow' : 1,
            	'hide' : false,
                'animation': null,
                'wrap': 'circular',
                'centerV' : false
        	};

        jCarouselInit.init({
        	'carousel' : '#GridBox',
        	'list' : '#indexCards',
        	'items' : 'li',           
       		'itemsToShow' : 1,
        	'hide' : false,
            'centerV' : false,
            'animation': 'fast'
    	});


        jCarouselInit.init(baseballOptions);


        var slidingPane = jQuery('#Container'),
            baseballCards = jQuery('#BaseballCards').parent(),
            baseballCarousel = jQuery('#BaseballCards').parent().data('jcarousel'),
            indexCardsCount=jQuery('#indexCards li').size(),
            indexCards = jQuery('#indexCards').parent(),
            arrows=  $('.greydots').html();

        // check if there are 2 or more index cards
        // if there is 1 index card, the gray cards will disappear
        // if there are 2 or more index cards the gray cards will show
        if(indexCardsCount==1){
            $('.greydots').html('');
        }else{
            $('.greydots').show();
        }

        // link the gray cards to dom 
        //this is for ie 7
        grayArrows(indexCardsCount,indexCards);

        // Show/Hide grey dots
        // add functionality to each index cards to show theirs baseball card
        jQuery('#indexCards *').click(function (e) {
           // $('.greydots').html('');
        });

        // show or hide gray arrow index cards
        jQuery('.menu').click(function () {
            if(indexCardsCount==1){
                $('.greydots').html(''); // this is for ie 7 issue
            }else{
                $('.greydots').html(arrows);
                grayArrows(indexCardsCount,indexCards);
            }
            $("#title").css('visibility', 'visible');
        });

        // Wire up menu button display towards the basebaball cards and the grid ************
        jQuery('.menu').click(function () {
            jQuery('#BaseballCards').animate({'top': "0"});
        });

        // function to hide the index cards and show a specific baseball card
         jQuery('.indexItem').click(function () {

            if (jQuery(this).attr("data-baseCard")==undefined) {
                scrollIndex=1;
            }else{
                scrollIndex=parseInt(jQuery(this).attr("data-baseCard"));    
            }
            $('.greydots').html('');
            $("#title").css('visibility', 'hidden');

            if(slidingPane.css("top")=="0px")
                jQuery('#GridBox .jcarousel-skin-dss-expert').css('overflow', 'visible');
            
            baseballCards.find('ul:first li.jcarousel-item').each(function(){ 
            	if($(this).data('jcarousel-index') == scrollIndex-1){ 
            		scrollIndex = $(this).index();
            		baseballCards.jcarousel('scroll',scrollIndex );
            		return false;
            	} 
            });
            
           
            slidingPane.css({"position": "relative"});  // chrone fixed

            if ( jQuery( ".in" ).length ) {
                var top = "-360px";
            }else{
                var top = "-365px";
            }


            slidingPane.animate({
                top: top
            }, function () {
                jQuery('#indexCards').css('visibility', 'hidden');
                jQuery('#CarouselNavigationPane').css('overflow', 'visible');
                jQuery('#GridBox .jcarousel-skin-dss-expert').css('overflow', 'hidden');
            });

            //baseballCarousel.options.animation = 'fast';
            //baseballCards.jcarousel('reload', $.extend(baseballOptions, { 'animation': 'fast' }));
            
            jCarouselInit.init($.extend(baseballOptions, { 'animation': 'fast' }));
            
        });

        // animation index cards function, to hide then ******************************
        jQuery('.slide-grid-down').click(function () {
            jQuery('#CarouselNavigationPane').css('overflow', 'hidden');
            jQuery('#indexCards').css('visibility', 'visible');
            slidingPane.animate({
                top: "0px"
            });
            jCarouselInit.init($.extend(baseballOptions, { 'animation': null }));
           /*jCarouselInit.reloadCarousel(baseballCards,{
                'animation': 'none'
            });*/
        });



        // this is a dss expert functionality
        // show or hide sub areas
        jQuery('.xpt-sol-bottom-1').click(function () {
            var parent = jQuery(this).parent();
            jQuery(parent).animate({
                'top': "-411px" 
            }, 150);
        });
        // this is a dss expert functionality
        // show or hide sub areas
        jQuery('.xpt-sol-bottom-2').click(function () {
            var parent=jQuery(this).parent().parent();
            jQuery(parent).animate({
                'top': "0"
            }, 150);
        });
        
        //fix the z-index issue that makes jcarousel overlap other elements in the page        
        carouselFix();

        


    });

})(jQuery);
// function to link the gray arrow to dom 
// this is for ie 7 issue

function grayArrows(indexCardsCount, indexCards){
    jQuery('#grid1').click(function (e) {
        e.preventDefault();
        if(indexCard>1){
            indexCard--;
            indexCards.jcarousel('scroll', indexCard-1);
            grayArrowSelected(indexCardsCount, indexCards);
        }
    });
    jQuery('#grid2').click(function (e) {
        e.preventDefault();
        if(indexCardsCount>indexCard){
            indexCard++;
            indexCards.jcarousel('scroll', indexCard-1);
            grayArrowSelected(indexCardsCount, indexCards);
        }
    });
    
}

function grayArrowSelected(indexCardsCount, indexCards){
    jQuery('#grid2').addClass('selected');
    jQuery('#grid1').addClass('selected');
    if(indexCard==1){
        jQuery('#grid1').removeClass('selected');
    }
    if(indexCard==indexCardsCount){
        jQuery('#grid2').removeClass('selected');
    }
}

function carouselFix( container, carouselIdentifier ){
	var cont = container || '#main-container',
	    carousel = carouselIdentifier || '#CarouselNavigationPane';	

	$(cont).children().each(function(i, item){ 						// Iterate though all the elements under the main container 
		if($(this).find(carousel).length == 0){ 
			var val = $('#intro').get(0);
			if (this!== val) { 
				$(item).css({'position':'relative', 'z-index': '1'});            // if the element doesn't contain a carousel add the z-index
			}
		}
	});
}

