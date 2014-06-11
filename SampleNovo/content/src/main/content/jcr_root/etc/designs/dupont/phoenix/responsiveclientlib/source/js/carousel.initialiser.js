(function (window, document, $, undefined) {
    var defaults = {
        'carousel': '.featured_homepage_module .jcarousel-clip',
        'list': '.jcarousel-view--home-page-hlm-view--panel-pane-1',
        'items': '.jcarousel-item',
        'prev': '.prev',
        'next': '.next',
        'itemsToShow': 3,
        'hide': true,
        'animation': null,
        'wrap': null,
        'centerV': true,
        'removeBorder': true,
        'wrapper': false,
        'mobile': false,
        'visibleItem': 'fullyvisible',
        'initCallback': null,
        'parent': '',
        'isStatic': false,
        'calloutItems': 2,
        'hlmItemWidth': { 
        	'4' : 22.65625,
        	'3' : 31.25,
        	'2' : 48.4375,
        	'1' : 100
        },
        'hlmMargin' : 3.125
    },
        options = {},
        debug = false,
        context = null,
        version = 2,
        api = (function () {

            function init(opts) {
                options = {};
                $.extend(options, defaults, opts);
                if ($(options.carousel).length == 0)
                    return;

                context = (options.parent !== '') ? $(options.carousel).closest(options.parent) : $(options.carousel).parent();
                addWrapper();
                setAttrs();

                if (!$(options.carousel).data('jcarousel')) {
                    $(options.carousel).on('createend.jcarousel', function (event, carousel) {
                        $(this).jcarousel('scroll', 0, false); // Ensuring it'll always load in the first item
                        if (typeof options.initCallback === 'function') {
                            options.initCallback(carousel, options.itemsToShow);
                        }
                    }).jcarousel(options);
                }

                carouselResize();
                setItemsToShow();
                bindEvents();
                swipeEvents();
                verticalAlign();
                hideArrows();
                removeNthBorder();
                showArrows();


                logMsg('Carousel initialised.', $(options.carousel));

            }

            function manageNavigationVisibility(carousel, next, prev, method) {                
            	if (elementIsFullyVisible(carousel, 'first', method)) {
	                $(prev, context).removeClass('jcarousel-prev-enabled').addClass('jcarousel-prev-disabled jcarousel-prev-disabled-horizontal');
	                $(prev, context).attr("disabled", true);
	            } else {
	                $(prev, context).removeClass('jcarousel-prev-disabled jcarousel-prev-disabled-horizontal').addClass('jcarousel-prev-enabled');;
	                $(prev, context).attr("disabled", false);
	            }
	
	            if (elementIsFullyVisible(carousel, 'last', method)) {
	                $(next, context).removeClass('jcarousel-next-enabled').addClass('jcarousel-next-disabled jcarousel-next-disabled-horizontal');
	                $(next, context).attr("disabled", true);
	            } else {
	                $(next, context).removeClass('jcarousel-next-disabled jcarousel-next-disabled-horizontal').addClass('jcarousel-next-enabled');
	                $(next, context).attr("disabled", false);
	            }
	        }


            function elementIsFullyVisible(carousel, elementClass, method) {
                var fully = carousel.jcarousel(method),
                    visible = false;
                $(fully).each(function (i, item) {
                    visible |= ($(item).hasClass(elementClass)) ? true : false;
                });
                return visible;
            }
            
            function determineThumbnailSize(item){
            	var thumbClass = '',
            		totalItems = ($(options.items).length < options.itemsToShow )? $(options.items).length : options.itemsToShow;
            		hasTool = $(context).find('.selectedtool').length > 0;
            	
            	$(item).removeClass('small-thumb').removeClass('medium-thumb').removeClass('large-thumb').removeClass('large-thumb no-max-width');
            	
            	if(totalItems >= 4){
            		thumbClass = 'small-thumb';
            	} else if(totalItems == 3 || (totalItems == 2 && hasTool)) {
            		thumbClass = 'medium-thumb';
            	} else if(totalItems == 2 ){
            		thumbClass = 'large-thumb';
            	} else {           
            		thumbClass = 'large-thumb no-max-width'
            	}
            	
            	$(item).addClass(thumbClass);            	
            }


            function setAttrs() {

                if (options.isStatic && context.find('.row-callout').length > 0) {
                    options.itemsToShow = options.calloutItems;
                    var hlm = $(options.carousel).closest('.horizontal_list_module_3_col, .horizontal_list_module_4_col, .featuredb .hlm-div-id, .static-hlm');
                    hlm.removeClass('horizontal_list_module_3_col horizontal_list_module_4_col').addClass('horizontal_list_module_2-3_col');
                    $(options.list).removeClass('row-4col row-2col').addClass('row-3col');
                } else if (options.isStatic && context.find('.row-callout').length == 0) {
                    var hlm = $(options.carousel).closest('.horizontal_list_module_2-3_col');
                    hlm.removeClass('horizontal_list_module_2-3_col').addClass('horizontal_list_module_3_col');

                    hlm = $(options.carousel).closest('.featuredb .hlm-div-id');
                    hlm.addClass('horizontal_list_module_' + options.itemsToShow + '_col');
                    hlm.find('ul').removeClass('row-4col row-2col row-3col').addClass('row-' + options.itemsToShow + 'col');
                    
                    hlm = $(options.carousel).closest('.static-hlm');
                    hlm.addClass('horizontal_list_module_' + options.itemsToShow + '_col');
                    hlm.find('ul').removeClass('row-4col row-2col row-3col').addClass('row-' + options.itemsToShow + 'col');
                }


                var width = $(options.items, $(options.carousel)).outerWidth(true) * ($(options.items, $(options.carousel)).length);
                $(options.list, $(options.carousel)).css('width', width + 100);
                $(options.carousel).addClass('carousel-init');
                if ($.isNumeric(options.leftPadding) && $.isNumeric(options.leftMargin)) {
                    $(options.list).parent().css('margin-left', options.leftMargin);
                    $(options.list).parent().css('padding-left', options.leftPadding);
                }



                $(options.list).children().each(function (i, item) {
                    if (i == 0)
                        $(item).addClass('first');
                    if (i == ($(options.items, $(options.carousel)).length) - 1)
                        $(item).addClass('last');

                    if (!$.isNumeric($(item).data('jcarousel-index'))) {
                        $(item).addClass('jcarousel-item').data('jcarousel-index', i)
                    }
                });
                (options.items.jquery) ? options.items.addClass('jcarousel-item') : options.items += '.jcarousel-item';

            }

            function addWrapper() {
                if (!options.wrapper)
                    return;

                $(options.list).parent().addClass('jcarousel-clip jcarousel-clip-horizontal');
            }

            function hideArrows() {
                if (options.hide || $(options.item).size() <= options.itemsToShow) {
                    $(options.prev, context).hide();
                    $(options.next, context).hide();
                }
            }

            function showArrows() {
                if ($(options.items).length > options.itemsToShow) {
                    $(options.prev, context).show();
                    $(options.next, context).show();
                }
            }

            function unbind(prev, next) {
                $(prev, context).off('click');
                $(next, context).off('click');
            }

            function bindClicks(prev, next, carousel, items, method) {
                $(prev, context).click(function (e) {
                    e.preventDefault();
                    $(carousel).jcarousel('scroll', '-=' + items);
                    manageNavigationVisibility(carousel, next, prev, method);
                });

                $(next, context).click(function (e) {
                    e.preventDefault();
                    $(carousel).jcarousel('scroll', '+=' + items);
                    manageNavigationVisibility(carousel, next, prev, method);
                });
            }

            function setItemsToShow() {
                var carousel = $(options.carousel),
                    items = options.itemsToShow,
                    prev = $(options.prev, context),
                    next = $(options.next, context),
                    method = options.visibleItem;

                unbind(prev, next);
                bindClicks(prev, next, carousel, items, method);
                manageNavigationVisibility(carousel, next, prev, method);

                logMsg('Binding next and prev navigation events.');
            }

            function bindEvents() {
                if (!options.removeBorder)
                    return;

                $(options.carousel).on('scrollend.jcarousel', function (event, carousel) {
                    removeNthBorder(carousel);
                });
                $(options.carousel).on('createend.jcarousel', function (event, carousel) {
                    removeNthBorder(carousel);
                });

                logMsg('Binding scroll-end and create-end events.');
            }

            function verticalAlign() {
                if (!options.centerV)
                    return;

                $(options.items, $(options.carousel).parent()).each(function (i) {
                    var ah = $(this).height(),
                        ph = $(this).parent().height(),
                        mh = Math.ceil((ph - ah) / 2);
                    $(this).css('margin-top', mh);
                });

                logMsg('Vertically centering elements.');
            }

            function removeNthBorder(carousel) {
                if (!options.removeBorder)
                    return;

                var item = (carousel) ? $(carousel._last) : $($(options.items)[options.itemsToShow - 1]);
                $(options.items, $(options.carousel)).removeClass('no-border-right');
                item.addClass('no-border-right');
            }

            function carouselResize() {
                /* Handling responsive changes */

                var width = $(options.carousel).width(),
                    total = $(options.items).length,
                    pctg = options.hlmItemWidth[(options.itemsToShow > total) ? total : options.itemsToShow],
                    px = (width * (pctg / 100)),
                    margin = (width * (options.hlmMargin / 100));

                $(options.items).each(function (i, item) {
                	determineThumbnailSize(item);
                	$(item).css('margin-right', margin);
                	$(item).width(px);
                });
                setAttrs();
                logMsg(options);

                $(options.carousel).jcarousel('reload', options);

            }

            function logMsg(msg) {
                if (debug) {
                    console.log('CAROUSEL INIT - DEBUG MODE: ', msg);
                }
            }

            function swipeEvents() {
                /* Heavily dependent on Hammer.js */

                if (typeof Hammer === 'undefined')
                    return;

                var carousel = $(options.carousel),
                    element = carousel.parent(),
                    items = options.itemsToShow;

                Hammer(element).on("swipeleft", function (event) {
                    $(carousel).jcarousel('scroll', '+=' + items);
                    logMsg('swipe-left event triggered.');
                });

                Hammer(element).on("swiperight", function (event) {
                    $(carousel).jcarousel('scroll', '-=' + items);
                    logMsg('swipe-right event triggered.');
                });
            }

            return {
                init: init
            }
        })();

    window.jCarouselInit = api;

})(window, document, jQuery);