(function ($) {
    
    function format() {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    }
    
    //TODO: Add on resize event to fire the Calculate Last method for breakpoints.
    
    var colorCountString = $('#SubProductCount').html();
    var selectedFilter = "All";
    $('.AllSubProducts').addClass('selected-filter');
    

    /* sort thumbnails */
    $('#SubProductThumbnails')
        .children('div.subproduct-box')
        .sortElements(
            function (a, b) {
                return parseInt($(a).attr(
                    "data-sortOrder")) > parseInt($(
                    b).attr("data-sortOrder")) ? 1 : -1;
            });
    
    
    CalculateLast();
    
    // now set up color count
    ShowVisibleColorsCount(colorCountString);
    CountPrimaryFilterItems();

    // EVENT HANDLERS

    // wire up click event to collections clicks
    $('.primary-filter-link').click(
        function () {
            
            // Remove selected css from all others
            $('.primary-filter-link').removeClass('selected-filter');
            
            // Remove it from the all products links too
            $('.AllSubProducts').removeClass('selected-filter');
            
            //Add the selected css to the current filter.
            $(this).addClass('selected-filter');
            
            // Get the descriptive information of the primary filter
            var descriptionTitle = $(this).attr(
                'data-descriptiontitle');
            var description = $(this).attr(
                'data-description');
            
            // get name of filter clicked
            selectedFilter = $(this).attr(
                'data-filter');

            if (description != null && description != "" && description != "undefined") {
                $("#descriptionTitle").html(
                    descriptionTitle);
                $("#description").html(description);
                $("#primaryFilterDescription").css('display',
                    "block");
            } else {
                $("#primaryFilterDescription").removeAttr('style');
            }

            // hide thumbnails while list is rebuilt
            HideThumbnails();

            CleanColors(true);

            // iterate through colors and hide all that are
            // not a part of this collection
            applyPrimaryFilter();

            // apply hue and price group filters
            applyFilters();

            ShowVisibleColorsCount(colorCountString);

            // calculate 'last'
            CalculateLast();

            // now show thumbnails
            ShowThumbnails();

            // redraw if IE7 or IE8
            if (/MSIE (\d+\.\d+);/
                .test(navigator.userAgent)) {
                var ieVersion = new Number(RegExp.$1);
                if (ieVersion <= 8) {

                    redraw();

                    // also add click even tto back to top
                    // link to fix IE7
                    $('#backToTop').click(function () {
                        scrollToToolTop();
                    });

                }
            }
        });

    // wire up All Colors click
    $('.AllSubProducts')
        .click(
            function () {
                selectedFilter = "All";
                
                // Remove the selected from any other filter
                $('.primary-filter-link').removeClass('selected-filter');
                
                // Add the selected style to the current item
                $(this).addClass('selected-filter');
                
                // hide all colors while list is rebuilt
                HideThumbnails();

                // hide collection description if there is one showing
                $('#primaryFilterDescription').removeAttr('style');

                // Clean up hidden and last classes
                CleanColors();
                
                // Reset dropdown filters to default values.
                $('#subfilter1').val("subfilter1-default");
                $('#subfilter2').val("subfilter2-default");
                $('#SortBy').val("ascending");
                
                // Reset the mobile dropdown in case you are in responsive
                $('#primary-filter-select').val("All");
                    

                $('#SubProductThumbnails')
                    .children('div')
                    .sortElements(
                        function (a, b) {
                            return parseInt($(a)
                                .attr(
                                    "data-sortOrder")) > parseInt($(
                                    b)
                                .attr(
                                    "data-sortOrder")) ? 1 : -1;
                        });

                ShowVisibleColorsCount(colorCountString);
                initPagination();

                // calculate 'last'
                CalculateLast();

                // show thumbnails again
                ShowThumbnails();
            });

    $('#SortBy').change(function () {
        // hide all colors while list is rebuilt
        HideThumbnails();

        // Clean up hidden and last classes on all colors
        CleanColors(false);

        if ($(this).val() == "ascending")
            SortThumbnails("ascending");
        if ($(this).val() == "descending")
            SortThumbnails("descending");
        if ($(this).val() == "alpha")
            SortThumbnails("alphabetical");

        // calculate 'last'
        CalculateLast();

        // show thumbnails again
        ShowThumbnails();

    });

    $('#subfilter1').change(function () {
        // hide all colors while list is rebuilt
        HideThumbnails();
        // Clean up hidden and last classes on all colors
        CleanColors(true);
        if (selectedFilter != "All") {
            applyPrimaryFilter();
        }
        applyFilters();
        ShowVisibleColorsCount(colorCountString);
        // calculate 'last'
        CalculateLast();
        // show thumbnails again
        ShowThumbnails();
    });

    $('#subfilter2').change(function () {
        // hide all colors while list is rebuilt
        HideThumbnails();
        // Clean up hidden and last classes on all colors
        CleanColors(true);
        if (selectedFilter != "All") {
            applyPrimaryFilter();
        }
        // FilterByPriceGroup($(this).val());
        applyFilters();
        ShowVisibleColorsCount(colorCountString);
        // calculate 'last'
        CalculateLast();
        // show thumbnails again
        ShowThumbnails();
    });
    
    //Responsive Select for primary filter
    $('#primary-filter-select').change(function () {
        var selectedOption = $(this).val();
        $('.primary-filter-link').each(function () {
            if($(this).attr('data-filter') == selectedOption) {
                $(this).triggerHandler('click');
            }
        });
    });
    
    // wire up event handler for omniture events on code
    // generated markup 
    
    $('li.primary-filter-link').click(function () {
        // send value of link text
    	if (typeof( window['s_account']) != 'undefined') {
	        s.eVar37 = 'Collection: ' + $(this).text();
	        s.eVar38 = '';
	        s.events = 'event24';
	
	        s.tl(this, 'o', 'BI Color Tool');
    	}

    });
    
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var ieVersion = new Number(RegExp.$1);
        if (ieVersion <= 8) {

            // only do this for IE7 and IE8, force browser to
            // redraw

            window.onload = function () {

                var rightCol, leftCol;
                rightCol = $('.resultsRightCol');
                leftCol = $('.resultsLeftCol');

                rightCol.css('display', 'none');
                leftCol.css('display', 'none');

                var x = rightCol.offsetHeight;
                var y = leftCol.offsetheight;

                rightCol.css('display', 'block');
                leftCol.css('display', 'block');

            }

        }
    }


    initPagination();
    filterFromURL();

    function HideThumbnails() {

        // hide thumbnails while list is rebuilt
        $('#SubProductThumbnails').hide();
    }

    function ShowThumbnails() {

        // show thumbnails now that list is rebuilt
        $('#SubProductThumbnails').show();
    }

    function SortThumbnails(sortBy) {
        if (sortBy == "ascending") {
            $('#SubProductThumbnails')
                .children('div.subproduct-box')
                .sortElements(
                    function (a, b) {
                        return parseInt($(a).attr("data-sortOrder")) > parseInt($(
                            b).attr("data-sortOrder")) ? 1 : -1;
                    });
        } else if (sortBy == "descending") {
            $('#SubProductThumbnails')
                .children('div.subproduct-box')
                .sortElements(
                    function (a, b) {
                        return parseInt($(a).attr("data-sortOrder")) < parseInt($(
                            b).attr("data-sortOrder")) ? 1 : -1;
                    });
        } else {
            $('#SubProductThumbnails').children('div.subproduct-box').sortElements(
                function (a, b) {
                    return $(a).attr("data-sortName") > $(b).attr(
                        "data-sortName") ? 1 : -1;
                });
        }
    }

    function CleanColors(removeHidden) {

        // remove hidden and last class from all elements
        if (removeHidden != false) {
            $('.subproduct-box').each(function () {
                $(this).removeClass('hidden filtered last');
            });
        } else {
            $('.subproduct-box').each(function () {
                $(this).removeClass('last');
            });
        }

    }

    function ShowVisibleColorsCount(countLabel) {

        var visibleColors = $('.subproduct-box').not('.filtered').length;
        if (visibleColors === 0) {
            // ensure collections text is hidden
            $('#primaryFilterDescription').css('display', 'none');
            // show no results message
            ShowNoResults();
        } else {
            // make sure error message is hidden
            HideNoResults();
        }

        // update count of visible colors in UI
        //$("#SubProductCount").html(String.format(countLabel, visibleColors));
        $(".totalCount").html(visibleColors);
    }
    
    // May cause overhead. need to optimize?
    function CountPrimaryFilterItems() {
        $('.primary-filter-link').each(function () {
            var formattedString = "";
            var filterString = $(this).find('p').html();
            var filter = $(this).attr('data-filter');
            var numberOfItems = function () {
                var counter = 0;
                $('.subproduct-box').each(function () {
                    if ($(this).hasClass(filter)) {
                       counter++;
                    }   
                });
                return counter;
            }
            formattedString = format(filterString,numberOfItems());
            $(this).find('p').html(formattedString);
            
        });
        
        //Do the same for the mobile dropdown
        $('.mobile-filter-option').each(function () {
            var formattedString = "";
            var filterString = $(this).html();
            var filter = $(this).val();
            var numberOfItems = function () {
                var counter = 0;
                $('.subproduct-box').each(function () {
                    if ($(this).hasClass(filter)) {
                       counter++;
                    }   
                });
                return counter;
            }
            formattedString = format(filterString,numberOfItems());
            $(this).html(formattedString);     
        });
        
    }
    
    function filterFromURL() {
        /* get filtered state from url for the Color tool */
    
        // parse for any query string params, set up filters as appropriate
        var collectionQuery = getUrlVars()["collections"];
        var huesQuery = getUrlVars()["hues"];
        
        
        if (collectionQuery != null && collectionQuery !== "") {
            
            // We also need to update the mobile primary filter!
            $("[data-mobilefiltername='collections'] option").each( function () {
                if ($(this).val() == collectionQuery) {
                    $("[data-mobilefiltername='collections']").val(collectionQuery);
                }          
            });
            
            // Lets assume collections is always primary filter on SPN for color.
            $("[data-filtername='collections'] li").each( function () {
                if ($(this).attr('data-filter') == collectionQuery) {
                    selectedFilter = collectionQuery;
                    $(this).triggerHandler("click");
                }          
            });
            
            
            
        }
        
        if (huesQuery != null && huesQuery !== "") {
            // Lets also asume that hues is on a select always :3
            $("[data-filtername='hues'] option").each( function () {
                if ($(this).val() == huesQuery) {
                    $("[data-filtername='hues']").val(huesQuery).change();
                }          
            });
        }
    }
    
    

    function ShowNoResults() {
        $("#noResults").css('display', "block");
    }

    function HideNoResults() {
        $("#noResults").css('display', "none");
    }

    function CalculateLast() {

        // iterate through and add the CSS class 'last' to every third item
        var visibleCount = 1, itemsPerRow;
        if ($(window).width() > 768 ) {
            itemsPerRow = 3;
        } else if ($(window).width() > 480){
            itemsPerRow = 2;
        } else {
            // No need to add the "last" class. They are all Last. Clear all remainings of last class and return.
            CleanColors(false);
            return;
        }   
        
        $('.subproduct-box').each(function () {
            if (!$(this).hasClass('hidden filtered')) {
                if (visibleCount % itemsPerRow === 0) {
                    $(this).addClass('last');
                }
                visibleCount++;
            }
        });
    }

    function getUrlVars() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(
            window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function scrollToToolTop() {
        var tool_top = $('.subproduct_navigation_tool').offset();
        // alert('tool_top.top: ' + tool_top.top);
        window.scrollTo(tool_top.left, tool_top.top - 15);

    }

    function applyPrimaryFilter() {

        $('.subproduct-box').each(function () {
            // hide any color that does not belong to currently selected
            // collection
            if (!$(this).hasClass(selectedFilter)) {
                $(this).addClass('hidden filtered');
            }
            $(this).removeClass('last');
        });
    }

    function applyFilters() {
        var subfilter1, subfilter2;
        
        // Verify filters exist before working with them
        if ($('#subfilter1').length > 0) {
            subfilter1 = $('#subfilter1').val();
        }
        
        if ($('#subfilter2').length > 0) {
            subfilter2 = $('#subfilter2').val();
        }
        
        var subfilter1Selected = (subfilter1 != "subfilter1-default" && typeof(subfilter1) !== 'undefined') ? true : false;
        var subfilter2Selected = (subfilter2 != 'subfilter2-default' && typeof(subfilter2) !== 'undefined') ? true : false;

        if (subfilter1Selected) {
            $('.subproduct-box').each(function () {
                if (!$(this).hasClass(subfilter1)) {
                    $(this).addClass('hidden filtered');
                }
                $(this).removeClass('last');
            });
            
        }
        
        // And filter 2
        if (subfilter2Selected) {
            $('.subproduct-box').each(function () {
                if (!$(this).hasClass(subfilter2)) {
                    $(this).addClass('hidden filtered');
                }
                $(this).removeClass('last');
            });
            
        }
        
        initPagination();
    }

    function redraw() {

        // only do this for IE7 and IE8, force browser to redraw

        var rightCol, leftCol;
        rightCol = $('.resultsRightCol');
        leftCol = $('.resultsLeftCol');

        rightCol.css('display', 'none');
        leftCol.css('display', 'none');

        var x = rightCol.offsetHeight;
        var y = leftCol.offsetheight;

        rightCol.css('display', 'block');
        leftCol.css('display', 'block');

    }

    function logMissingTranslationValue(label) {
        console.log('Missing translation value for the ' + label + ' node');
    }


    var visibleItems, itemsPerPage, totalPages, totalItems, currentPage, nextButton,
        prevButton,activeClass = 'pagination-visible-item-';

    function initPagination() {
        nextButton = $('<a class="pagination_next_btn" href="/">Next</a>');
        prevButton = $('<a class="pagination_prev_btn" href="/">Prev</a>');
        itemsPerPage = 30;
        currentPage = 0;
        visibleItems = $('.subproduct-box:not(.filtered)');
        totalItems = $('.subproduct-box:not(.filtered)').length;
        totalPages = Math.ceil(totalItems / itemsPerPage);
    	
        //disable previous button since it is the first page
    
			$('.pagination_prev_btn').addClass('disabled'); 		 
			
    	//disable next button if currentPage is last page
		if (currentPage == totalPages - 1)
			{
				$('.pagination_next_btn').addClass('disabled'); 		 
			}

 
        attachPager();
        attachInteraction();
        move('', currentPage); 
        $('.pagination-results').addClass('ready');
    }

    function attachPager() {

        var pagerExists = ($('ul.pager').length > 0),
            pager = pagerExists ? $('ul.pager') : $('<ul class="pager"></ul>');
        pager.empty();

        for (i = 0; i < totalPages; i++) {
            pager.append('<li data-page="' + i + '"><a href="/">' + (i + 1) + '</a></li>');
        }

        if (!pagerExists) {
            $('.pagination-holder').append(pager);
            pager.before(prevButton);
            pager.after(nextButton);
            $('.page-information').before(prevButton.clone());
            $('.page-information').after(nextButton.clone());
        }
        
        if(pager.children().length == 0){
        	$('.pagination-results, .top-separator, .interval').hide();
        }else{
        	$('.pagination-results, .top-separator, .interval').show();
        }
    }

    function attachInteraction() {
    	if($('.pagination-results').hasClass('ready'))
    		return;
    	
        $('ul.pager').bind('click', function (e) {
            e.preventDefault();
            var page = $(e.target).parent().data('page');
            move('', page);
        });

        $('.pagination_next_btn').bind('click', function (e) {
            e.preventDefault();
            move('right');
        });

        $('.pagination_prev_btn').bind('click', function (e) {
            e.preventDefault();
            move('left');
        });
        
        $('#SortBy').change(function () {move("",currentPage);});
        $('#subfilter1').change(function () {move("",currentPage);});
        $('#subfilter2').change(function () {move("",currentPage);});
        $('#primary-filter-select').change(function () {move("",currentPage);});
        $('.primary-filter-link').click(function () {move("",currentPage);});
        $('.AllSubProducts').click(function () {move("",currentPage);});
    }

    function move(direction, to) {
    	
    	
        if ((currentPage == 0 && direction === 'left') || (currentPage == totalPages - 1 && direction === 'right') || ((typeof to !== 'undefined') && (to >= totalPages || to < 0)))
            return;
        
        var nextPage = (typeof to !== 'undefined') ? to : ((direction === 'left') ? currentPage - 1 : currentPage + 1);
        getPageInterval(nextPage);
        currentPage = nextPage;
        
      //disable previous button if currentPage is the first page
    	if (currentPage == 0)
    		{
    			$('.pagination_prev_btn').addClass('disabled'); 		 
    		}
    	else
    		{
    			$('.pagination_prev_btn').removeClass('disabled');
    		}
    	
    	//disable next button if currentPage is the last page
    	if (currentPage == totalPages - 1)
			{
				$('.pagination_next_btn').addClass('disabled'); 		 
			}
    	else 
			{
	    		$('.pagination_next_btn').removeClass('disabled');
			}
        scrollToToolTop();
    }

    function showRequestedItems(start, end) {
        $('.subproduct-box').addClass('hidden');
        $('.subproduct-box:not(.filtered)').slice(start, end).removeClass('hidden');        
    }

    function getPageInterval(page) {
    	$('.pager li').removeClass('active_page');
        var start = page * itemsPerPage;
        	end = start + itemsPerPage,
        	interval = (start+1) + '-' + (( $('.subproduct-box').not('.filtered').length < end && page == totalPages - 1) ? $('.subproduct-box').not('.filtered').length : end );
        	
        showRequestedItems(start, end);
        $('span.interval').html(interval);
        $(".totalCount").html($('.subproduct-box').not('.filtered').length);
        $('.pager li[data-page='+ page +']').addClass('active_page');
        ($('.total-pages').length == 0)? $('.mobile-pagination span.separator').after('<span class="total-pages">' + totalPages + '</span>') : $('.total-pages').html(totalPages);
		($('.current-page').length == 0)? $('.mobile-pagination span.separator').before('<span class="current-page">' + (page+1) + '</span>') : $('.current-page').html(page+1);
    }
})(jQuery);

// Storing filter disabling logic in case business asks for it back
// Disable filters: Hue, Sort By and Price Group (if relevant)

// $('#HuesSelect').attr("disabled", "disabled");
// $('#HuesSelect').attr('selectedIndex', 0);
// $('#HuesSelect-button').css('opacity', '0.4');
// $('#HuesSelect').selectmenu({menuWidth:'120px', width:'100px'});

// $('#SortBy').attr("disabled", "disabled");
// $('#SortBy-button').css('opacity', '0.4');
// $('#SortBy').attr('selectedIndex', 0);

/*
 * if ($(config).children('PriceGroupsEnabled').text() === 'false') {
 * $('#PriceGroupSelect-button').css('display', "none"); } else {
 * $('#PriceGroupSelect').attr("disabled", "disabled");
 * $('#PriceGroupSelect-button').css('opacity', '0.4');
 * $('#PriceGroupSelect').attr('selectedIndex', 0); }
 */