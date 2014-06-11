(function($) {

	var priceGroupFlag = false;
	var strAllColorPageName = "";
	var product, countrycode, xmlFile, dataURL, basePath;
  
	var url = window.location.pathname;
	var splitUrl = url.split('/');
	// baseDataPath: path to XML
	var baseDataPath='/etc/designs/dupont/tools/bicolor_colorselector/source/data/';


	// if required 
	basePath="";
	
	// get product from markup
	product = $('.bicolor_colorselector #BICarousel').attr('data-product');

    // get country code from markup
    countrycode = $('.bicolor_colorselector #BICarousel').attr('data-countrycode');
    	
    if (countrycode == '' || countrycode == undefined || product == '' || product == undefined) {
        // commented out because earlier versions of IE do not recognize console.log and throw an error
		// console.log('Missing country code in markup');
    }
    else {
            xmlFile = product + '_' + countrycode + '.xml';
    }

    // create data path
	dataURL = basePath + baseDataPath + xmlFile;

	$.ajax({
        type: "GET",
		url: dataURL,
		dataType: "xml",
		success: function(xml) {
		
  			var config = $(xml).children('data').children('Configuration');
 	 	    var collectionsNode = $(xml).children('data').children('Collections');
			var translationsNode = $(xml).children('data').children('Translations');
			priceGroupFlag = ($(config).children('PriceGroupsEnabled').text() == 'true') ? true : false;
			
			// get translated labels/text and add to UI
			var showMeLabel='', allColorsLabel='', collectionsLabel='', colorsCountLabel='', filterLabel='', sortLabel='', noResultsMsg='', noResultsLink='', backToTopLink='', colorString = '', allPriceReset='', hueReset='', sortReset='';
			
			if (translationsNode != undefined || translations != '') {
				showMeLabel = translationsNode.children('ShowMeLabel').attr('value');
				allColorsLabel = translationsNode.children('AllColorsLabel').attr('value');
				collectionsLabel = translationsNode.children('CollectionsLabel').attr('value');
				colorsCountLabel = translationsNode.children('ColorsCountLabel').attr('value');
				filterLabel = translationsNode.children('FilterLabel').attr('value');
				sortLabel = translationsNode.children('SortLabel').attr('value');
				noResultsMsg = translationsNode.children('NoResultsMsg').attr('value');
				noResultsLink = translationsNode.children('NoResultsLinkText').attr('value');
				backToTopLink = translationsNode.children('BackToTopLink').attr('value');
				colorString = translationsNode.children('ColorString').attr('value');
				allPriceReset = translationsNode.children('AllPriceReset').attr('value');
                hueReset = translationsNode.children('HueReset').attr('value');
                sortReset = translationsNode.children('SortReset').attr('value');
			}

			// add translated labels to UI
			(showMeLabel != '') ? $('.bicolor_colorselector #ShowMe').html(showMeLabel) : logMissingTranslationValue('ShowMeLabel'); 
			(allColorsLabel != '') ? $('.bicolor_colorselector #AllColors').html(allColorsLabel) : logMissingTranslationValue('allColorsLabel');
			(collectionsLabel != '') ? $('.bicolor_colorselector #Collections').html(collectionsLabel) : logMissingTranslationValue('collectionsLabel');
			(filterLabel != '') ? $('.bicolor_colorselector #Filter').html(filterLabel) : logMissingTranslationValue('filterLabel');
			(sortLabel != '') ? $('.bicolor_colorselector #Sort').html(sortLabel) : logMissingTranslationValue('sortLabel');
			(noResultsMsg != '') ? $('.bicolor_colorselector #NoResultsMsg').html(noResultsMsg) : logMissingTranslationValue('noResultsMsg');
			(noResultsLink != '') ? $('.bicolor_colorselector #NoResultsMsgLink').html(noResultsLink) : logMissingTranslationValue('noResultsLink');
			(backToTopLink != '') ? $('.bicolor_colorselector #backToTopText').html(backToTopLink) : logMissingTranslationValue('backToTopLink');

			
 			// populate the hues drop down / select menu 		
 			var huesList = '';
 			var optionsHtml = '<option value="{0}">{1}</option>\n';
			var huesNode = $(xml).children('data').children('Hues');
 			
 			huesNode.children('hue').each(function() {
 			
 				var hueSysName = $(this).attr('sysName');
 				var hueDisplayName = $(this).attr('displayName');
 				
 				if (hueDisplayName != null || hueDisplayName != '') {
 					// append <option> elements to select menu
 					huesList = huesList + String.format(optionsHtml, hueSysName, hueDisplayName);
				}
 				
 			});
 			
 			// inject HTML markup into the drop down
 			$('.bicolor_colorselector #HuesSelect').html(huesList);
 			
 			// If Price Groups are relevant for this country/language/product, perform logic to populate and display Price Group Drop Down

 			if(priceGroupFlag)
			{
 				// populate the price group drop down / select menu

 				var priceGroupList = '';
 				var priceOptionsHtml = '<option value="{0}">{1}</option>\n';

 				// var priceGroupNode = $(xml).children('data').children(strProductNode).children('PriceGroups');
				var priceGroupNode = $(xml).children('data').children('PriceGroups');
 				priceGroupNode.children('pricegroup').each(function() {

 					var pgSysName = $(this).attr('sysName');
 					var pgDisplayName = $(this).attr('displayName');

 					if(pgDisplayName != null || pgDisplayName != '') {
 						//priceGroupList = priceGroupList + String.format(priceOptionsHtml, pgSysName, pgDisplayName);
						//alert( "priceGroupList" +priceGroupList);
                       priceGroupList = priceGroupList + '<option value="'+pgSysName+'">'+pgDisplayName+'</option>\n';

 					}



 				});

                // inject HTML markup into the drop down

 				$('.bicolor_colorselector #PriceGroupSelect').html(priceGroupList);
 				// trigger jQuery select menu plugin now that values are written into the page
				$('.bicolor_colorselector #PriceGroupSelect').selectmenu({
					menuWidth:'140px', 
					width:'140px'
				});
			}
			// [JA] Hide the price group select, whether initialized or not
			$('.bicolor_colorselector #PriceGroupSelect').css('display', 'none');

			
				
			// Build Sort menu dynamically
			var sortOptionsList = '';
            var countrycode = $('.bicolor_colorselector #BICarousel').attr('data-countrycode');
			var sortOptionsHtml = '<option value="{0}">{1}</option>\n';
			var sortOptionsNode = $(xml).children('data').children('SortOptions');
			
			sortOptionsNode.children('sort').each(function() {
			
				var sortSysName = $(this).attr('sysName');
				var sortDisplayName = $(this).attr('displayName');
				
				if (sortDisplayName != '' || sortSysName != '') {
					sortOptionsList = sortOptionsList + String.format(sortOptionsHtml, sortSysName, sortDisplayName);
				}
			});
			
			// inject the Sort Options HTML into the Sort Drop Down
			$('.bicolor_colorselector #SortBy').html(sortOptionsList);
            if(priceGroupFlag){
			$('.bicolor_colorselector #SortBy').selectmenu({menuWidth:'115px', width:'140px'
                                    });}
            $('.bicolor_colorselector #SortBy').selectmenu({menuWidth:'115px', width:'200px'
                                    });

			//show top select menus now that select menu plugins have all been initialized
			$('.bicolor_colorselector .top-pagination').css('visibility', 'visible');
					
			// build out initial list of colors
			/*
				colorHtml variables
				{0} = CSS class added to every third item to overwrite right margin
				{1} = CSS classes representing hues
				{2} = CSS classes representing collections
				{3} = sortOrder property for this color
				{4} = color detail page URL
				{5} = color name
				{6} = color thumbnail image name
				{7} = priceGroup
				{8} = product name, stored in var strProductNode, e.g., 'Corian'
				{9} = Color/Colour string
			*/

            //added priceGroup
			//String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, priceGroup, strProductNode,  \Label.substring(0,(strColorLabel.length - 1)));
            
            var colorHtml = 
				'<div class="color-box {0} {1} {2}" data-sortOrder="{3}" data-sortName="{5}" data-priceGroup="{7}">\n' +
                    '<a class="color-link" href="'+ basePath + '{4}">\n' +
                        '<img alt="{8} {9} {5}, click to view detailed product information" src="'+ basePath + '{6}" />\n' +
                    '</a>\n' +
					'<a class="cta-arrow-link color-link" href="'+ basePath + '{4}">{5}</a>\n' +
                '</div>';
		    

            //get node list of all colors
            // var colors = $(xml).children('data').children(strProductNode).children(strProductColorsNode);
			var colors = $(xml).children('data').children('Colors');
           
            var colorsList = '', count=1;
            
            colors.children('color').each(function() {
            	
            	var huesList = '', collectionsList = '';
				var colorDetailURL = $(config).children('ColorPageBasePath').text() + $(this).attr('productUrl');
            	var sortOrder = $(this).attr('sortOrder');
            	var colorName = $(this).attr('name');
            	var colorImage = $(config).children('ImageBasePath').text() + $(this).attr('image');
            	var priceGroup = $(this).attr('priceGroup') || "";
 	
            	$(this).children('collections').children('collection').each(function () {
            		// get the id, then look it up in the collections list
            		var cID = $(this).attr('id');
            		if (cID != null || cID != '') {
            			collectionsNode.children('collection').each(function() {
            				if ($(this).attr('id') === cID) {
            					collectionsList = collectionsList + $(this).attr('sysName') + ' ';
            					return;
            				}
            			});
            		}
            	});
            	
            	$(this).children('hues').children('hue').each(function () {
            		// get the id, then look it up in the collections list
            		var cID = $(this).attr('id');
            		if (cID != null || cID != '') {
            			huesNode.children('hue').each(function() {
            				if($(this).attr('id') === cID) {
            					huesList = huesList + $(this).attr('sysName') + ' ';
            					return;
            				}
            			});
            		}
            	});
            	
		
				// added priceGroup           	
            	if (count%3 === 0) {
            		colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, priceGroup, product, colorString);
            	}
            	else {
            		colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, priceGroup, product, colorString);
            	}   	
            	
            	// increment count
            	count++;

            });

			$(".bicolor_colorselector .AllColors").children('h3').css("margin-top", "-2px");
            
            // write color thumbnails into the page
            $('.bicolor_colorselector #ColorThumbnails').html(colorsList);
			
			// sort thumbnails
			$('.bicolor_colorselector #ColorThumbnails').children('div').sortElements(function(a, b){
				return parseInt($(a).attr("data-sortOrder")) > parseInt($(b).attr("data-sortOrder")) ? 1 : -1;
			});
			
			// apply last - again?
			count = 1;
			$(".bicolor_colorselector #ColorThumbnails").children('div').each(function() {
				$(this).removeClass('last');
            	if (count%3 === 0) {
            		$(this).addClass('last');
            	}
            	// increment count
            	count++;
            });
			
			// create list of collections
			var collectionsList = '';
 			listItemHtml = '<li style="background: transparent;" ><div class="collectionArrow"></div><a href="javascript:void(0)" class="collections-link" data-collection="{0}" data-descriptionTitle="{2}" data-description="{3}">{1} ({4})</a></li>\n';
 			
 			collectionsNode.children('collection').each(function() {
 				
 				var collectionSysName = $(this).attr('sysName');
 				var collectionDisplayName = $(this).attr('displayName');
				var collectionDescriptionTitle = $(this).attr('descriptionTitle');
 				var collectionDescription = $(this).attr('description');
 				var showCount = $('.bicolor_colorselector #ColorThumbnails .' + collectionSysName).length;
								
 				if (collectionDisplayName != null || collectionDisplayName != '') {
 					// append an <li> to the list
 					collectionsList = collectionsList + String.format(listItemHtml, collectionSysName, collectionDisplayName, collectionDescriptionTitle, collectionDescription, showCount);
 				}
 			
 			});
 			
 			// inject Collections HTML markup into the list
 			$('.bicolor_colorselector #CollectionsList').html(collectionsList);
			
			// parse for any query string params, set up filters as appropriate
			var huesQuery = getUrlVars()["hue"];
			var collectionQuery = getUrlVars()["collection"];
			
			/* Scott Meyers - March 29 2013 */
			if(huesQuery == null) {
                if(priceGroupFlag){
                    $('.bicolor_colorselector #HuesSelect').selectmenu({menuWidth:'120px', width:'140px' });}
                	$('.bicolor_colorselector #HuesSelect').selectmenu({menuWidth:'120px', width:'200px' });
			}			

			if(huesQuery != null) {
				var count = 0;
				$('.bicolor_colorselector #HuesSelect > option').each(function() {     
           
            		if ($(this).val() == huesQuery) {

            			/* Scott Meyers ~ March 28 2013 */            			
            			var hueSelectValueIndex = $(this).index();            								
						$('.bicolor_colorselector #HuesSelect').attr('selectedIndex', count);												
						$('.bicolor_colorselector #HuesSelect option:eq(' + hueSelectValueIndex + ')').attr('selected','selected');						
						$('.bicolor_colorselector #HuesSelect').selectmenu({menuWidth:'120px', width:'95px', "z-index":"1000" });
    					// scroll page to tool top
						scrollToToolTop();

						// hide all colors while list is rebuilt
						HideThumbnails();
						
						// Clean up hidden and last classes on all colors
						CleanColors();
						
						applyFilters();
						
						// calculate 'last'
						CalculateLast();
						
						// show thumbnails again
						ShowThumbnails();
						
            		}
					count++;
            	});
			} else if(collectionQuery != null && collectionQuery != '') {
				var collectionLink;
				selectedCollection = collectionQuery;
				$(".bicolor_colorselector .AllColors").children('h3').css("font-weight", "normal");
				$(".bicolor_colorselector .AllColors").children('h3').css("margin-top", "-14px");
				$(".bicolor_colorselector .AllColors").children('.collectionArrow').css("display", "inline-block");
				
				$('.bicolor_colorselector .collections-link').css('font-weight', 'normal');
				$(".bicolor_colorselector .collections-link").parent().children('.collectionArrow').css("display", "inline-block");
				
				$('.bicolor_colorselector .collections-link').each(function(index, element) {
                    if($(this).attr('data-collection') == collectionQuery)
					{
						collectionLink = $(this);
						$(this).css('font-weight', 'bold');
						$(this).parent().children('.collectionArrow').css("display", "none");
					}
                });
                
				if(collectionLink != null) {
					// get name of collection clicked
            		var collection = $(collectionLink).attr('data-collection');
					var descriptionTitle = $(collectionLink).attr('data-descriptionTitle');
					var description = $(collectionLink).attr('data-description');
            	
					if(description != null && description != "" && description != "undefined")
					{
						$(".bicolor_colorselector #descriptionTitle").html(descriptionTitle);
						$(".bicolor_colorselector #description").html(description);
						$(".bicolor_colorselector #collectionDescription").css('display', "block"); 
					}
					else
					{
						$(".bicolor_colorselector #collectionDescription").css('display', "none"); 
					}
				
					// scroll page to tool top
					scrollToToolTop();
				
            		// hide thumbnails while list is rebuilt
            		HideThumbnails();
            	            	
            		CleanColors();
            	
            		// iterate through colors and hide all that are not a part of this collection
            		applyCollectionFilter();
            		            
            		// calculate 'last'
            		CalculateLast();
            		
            		// now show thumbnails 
            		ShowThumbnails();
				}
			}
			
			// set anchor to keep page from jumping when select menu clicked
			//$('.ui-selectmenu').attr('href', '#aBackToTop');
			// $('.ui-selectmenu').attr('href', 'javascript:void(0)');

			
			// wire up click event on Back to Top link
			$('.bicolor_colorselector #backToTop').click(function() {
				scrollToToolTop();
			});
				
			// now set up color count
			ShowVisibleColorsCount(colorsCountLabel);
					
            
            // EVENT HANDLERS
            
            // wire up click event to collections clicks
            $('.bicolor_colorselector .collections-link').click(function() {
            
            	// get name of collection clicked
            	// var collection = $(this).attr('data-collection');
				var descriptionTitle = $(this).attr('data-descriptionTitle');
				var description = $(this).attr('data-description');
            	selectedCollection = $(this).attr('data-collection');
				
				$(".bicolor_colorselector .AllColors").children('h3').css("font-weight", "normal");
				$(".bicolor_colorselector .AllColors").children('h3').css("margin-top", "-14px");
				$(".bicolor_colorselector .AllColors").children('.collectionArrow').css("display", "inline-block");
				
				$('.bicolor_colorselector .collections-link').css('font-weight', 'normal');
				$(".bicolor_colorselector .collections-link").parent().children('.collectionArrow').css("display", "inline-block");
				
				$(this).css('font-weight', 'bold');
				$(this).parent().children('.collectionArrow').css("display", "none");
				
				if(description != null && description != "" && description != "undefined")
				{
					$(".bicolor_colorselector #descriptionTitle").html(descriptionTitle);
					$(".bicolor_colorselector #description").html(description);
					$(".bicolor_colorselector #collectionDescription").css('display', "block"); 
				}
				else
				{
					$(".bicolor_colorselector #collectionDescription").css('display', "none"); 
				}
				
            	// hide thumbnails while list is rebuilt
            	HideThumbnails();
            	            	
            	CleanColors(true);
            	
            	// iterate through colors and hide all that are not a part of this collection
            	applyCollectionFilter();
				
				// apply hue and price group filters
				applyFilters(priceGroupFlag);
			
					
				ShowVisibleColorsCount(colorsCountLabel);
            
            	// calculate 'last'
            	CalculateLast();
            	
            	// now show thumbnails 
            	ShowThumbnails();
            	
            	//redraw if IE7 or IE8
            	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                	var ieVersion = new Number(RegExp.$1);
                	if (ieVersion <= 8) {

            			redraw();
            			
            			// also add click even tto back to top link to fix IE7
            			$('#backToTop').click(function() {
            				scrollToToolTop();
            			});
            			
            		}
            	}
            });
			
            // wire up All Colors click
            $('.bicolor_colorselector .AllColors').click(function() {
				selectedCollection = "All";
				$(".bicolor_colorselector .AllColors").children('h3').css("font-weight", "bold");
				$(".bicolor_colorselector .AllColors").children('h3').css("margin-top", "-2px");
				$(".bicolor_colorselector .AllColors").children('.collectionArrow').css("display", "none");
				
				$('.bicolor_colorselector .collections-link').css('font-weight', 'normal');
				$(".bicolor_colorselector .collections-link").parent().children('.collectionArrow').css("display", "inline-block");
			
            	// hide all colors while list is rebuilt
            	HideThumbnails();

            	// hide collection description if shown
            	$('.bicolor_colorselector #collectionDescription').css('display','none');

            	// Clean up hidden and last classes on all colors
            	CleanColors();


                $('.bicolor_colorselector #PriceGroupSelect option').html('All Price Groups');
				$('.bicolor_colorselector #PriceGroupSelect').val("all-prices");
				$('.bicolor_colorselector .left-item1 button span.ui-button-text').html('All Price Groups');
				$('.bicolor_colorselector #HuesSelect-button span').html('All Hues');
				$('.bicolor_colorselector #HuesSelect').val('all-hues'); //fixed Hues dropdown
                $('.bicolor_colorselector .left-item2 button span.ui-button-text').html(hueReset);
				$('.bicolor_colorselector #SortBy-button span').html('Light To Dark');
				$('.bicolor_colorselector #SortBy').val("light-dark");
                $('.bicolor_colorselector .right-item button span.ui-button-text').html(sortReset);

				$('.bicolor_colorselector #ColorThumbnails').children('div').sortElements(function(a, b){
					return parseInt($(a).attr("data-sortOrder")) > parseInt($(b).attr("data-sortOrder")) ? 1 : -1;
				});						
		
				ShowVisibleColorsCount(colorsCountLabel);

            	// calculate 'last'
            	CalculateLast();
            	
            	// show thumbnails again
            	ShowThumbnails();      	            
            });
     

			$('.bicolor_colorselector #SortBy').change(function() {
            	// hide all colors while list is rebuilt
            	HideThumbnails();
				
            	// Clean up hidden and last classes on all colors
            	CleanColors(false);
				
				if($(this).val() == "light-dark")
					SortThumbnails("ascending");
				if($(this).val() == "dark-light")
					SortThumbnails("descending");
				if($(this).val() == "alpha")
					SortThumbnails("alphabetical");
            	
            	// calculate 'last'
            	CalculateLast();

            	// show thumbnails again
            	ShowThumbnails();
            
            });
			
			$('.bicolor_colorselector #HuesSelect').change(function() {
            	// hide all colors while list is rebuilt
            	HideThumbnails();
            	// Clean up hidden and last classes on all colors
            	CleanColors(true);
				if(selectedCollection != "All") {
					applyCollectionFilter();
            	}
				applyFilters(priceGroupFlag);
				ShowVisibleColorsCount(colorsCountLabel);
            	// calculate 'last'
            	CalculateLast();
            	// show thumbnails again
            	ShowThumbnails();
            });
						

			$('.bicolor_colorselector #PriceGroupSelect').change(function() {
            	// hide all colors while list is rebuilt
            	HideThumbnails();
            	// Clean up hidden and last classes on all colors
            	CleanColors(true);
            	if(selectedCollection != "All") {
					applyCollectionFilter();
				}
				// FilterByPriceGroup($(this).val());
				applyFilters(priceGroupFlag);
				ShowVisibleColorsCount(colorsCountLabel);
            	// calculate 'last'
            	CalculateLast();
            	// show thumbnails again
            	ShowThumbnails();
            });


		},
		complete: function() {
			$('.bicolor_colorselector .top-pagination').css('visibility', 'visible');
			
			// Set min-height for error message to align nicely with bottom of collections list on left
			$('.bicolor_colorselector #noResults').css('minHeight', parseInt($('#CollectionsList').height())+75);

			// wire up event handler for omniture events on code generated markup
      		$('.bicolor_colorselector a.collections-link').click(function() {
					// send value of link text
					
					s.eVar37 = 'Collection: ' + $(this).text();
					s.eVar38 = '';
					s.events = 'event24';
										
					s.tl(this,'o', 'BI Color Tool');

			});


			
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                var ieVersion = new Number(RegExp.$1);
                if (ieVersion <= 8) {

                	// only do this for IE7 and IE8, force browser to redraw

					window.onload = function() {
	
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
      		
		}, 
		error: function (jqXHR, textStatus) {
			// uncomment to debug, commenting out since earlier versions of IE do not recognize console.log
			// console.log('Request Failed: ' + textStatus);
		}
	});



var selectedCollection = "All";

// Utility Functions
String.format = function() { 
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {        
    var reg = new RegExp("\\{" + i + "\\}", "gm");              
    s = s.replace(reg, arguments[i + 1]); 
  } 
  return s; 
} 

function HideThumbnails() {

	// hide thumbnails while list is rebuilt
    $('.bicolor_colorselector #ColorThumbnails').hide();
}

function ShowThumbnails() {

	// show thumbnails now that list is rebuilt
    $('.bicolor_colorselector #ColorThumbnails').show();
}

function SortThumbnails(sortBy) {
	if(sortBy == "ascending") {
	    $('.bicolor_colorselector #ColorThumbnails').children('div').sortElements(function(a, b){
	    	return parseInt($(a).attr("data-sortOrder")) > parseInt($(b).attr("data-sortOrder")) ? 1 : -1;
		});
	} else if(sortBy == "descending") {
		$('.bicolor_colorselector #ColorThumbnails').children('div').sortElements(function(a, b){
    		return parseInt($(a).attr("data-sortOrder"))  < parseInt($(b).attr("data-sortOrder")) ? 1 : -1;	
		});
	} else {
		$('.bicolor_colorselector #ColorThumbnails').children('div').sortElements(function(a, b){
    		return $(a).attr("data-sortName") > $(b).attr("data-sortName") ? 1 : -1;
		});
	}
}


function CleanColors(removeHidden) {

	// remove hidden and last class from all elements 
	if(removeHidden != false) {
    	$('.bicolor_colorselector .color-box').each(function() { 
    		$(this).removeClass('hidden').removeClass('last');
    	});
	} else {
		$('.bicolor_colorselector .color-box').each(function() { 
    		$(this).removeClass('last');
    	});	
	}

}

function ShowVisibleColorsCount(countLabel) {

	var visibleColors = $('.color-box').not('.hidden').length;
    if (visibleColors === 0) {
    	// ensure collections text is hidden
    	$('.bicolor_colorselector #collectionDescription').css('display','none');
    	// show no results message
    	ShowNoResults();
    } else {
    	// make sure error message is hidden
    	HideNoResults();
    }

    // update count of visible colors in UI
    $(".bicolor_colorselector #ColorsCount").html(String.format(countLabel, visibleColors));
}

function ShowNoResults(){	
	$(".bicolor_colorselector #noResults").css('display', "block");
}

function HideNoResults(){
	$(".bicolor_colorselector #noResults").css('display', "none"); 
}

function CalculateLast() {

	// iterate through and add the CSS class 'last' to every third item
    var visibleCount = 1;
    $('.bicolor_colorselector .color-box').each(function() {	
		if (!$(this).hasClass('hidden')) {
        	if (visibleCount%3 === 0) {
            	$(this).addClass('last');
            }
        	visibleCount++;        
        } 	
	});
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function scrollToToolTop() {
	var tool_top = $('.bicolor_colorselector #BICarousel').offset();
	// alert('tool_top.top: ' + tool_top.top);
	window.scrollTo(tool_top.left, tool_top.top - 15);

}

function applyCollectionFilter() {

	$('.bicolor_colorselector .color-box').each(function() {
		// hide any color that does not belong to currently selected collection
		if (!$(this).hasClass(selectedCollection)) {
        	$(this).addClass('hidden');            		
        }
        $(this).removeClass('last');
	});
}

function applyFilters(priceGroupFlag) {
	
	var hue = $('.bicolor_colorselector #HuesSelect').val();
	var pg = $('.bicolor_colorselector #PriceGroupSelect').val();

	var hueSelected = (hue != "all-hues") ? true : false;
	var priceGroupSelected = (priceGroupFlag && pg != 'all-prices') ? true : false;				
			
	if (hueSelected && !priceGroupSelected) {
		$('.bicolor_colorselector .color-box').each(function() {
        	if (!$(this).hasClass(hue)) {
            	$(this).addClass('hidden');            		
            }

            $(this).removeClass('last');
		});
	}
	else if (!hueSelected && priceGroupSelected) {
		$('.bicolor_colorselector .color-box').each(function() {
			if ($(this).attr('data-pricegroup') != pg) {
				$(this).addClass('hidden');            		
            }

            $(this).removeClass('last');
       });
	}
	else if (hueSelected && priceGroupSelected) {
    	$('.bicolor_colorselector .color-box').each(function() {
    		if ( $(this).attr('data-pricegroup') == pg && $(this).hasClass(hue)) {
            	// do nothing, leave these color visible		
        	}
        	else {
            	$(this).addClass('hidden');
        	}
        	$(this).removeClass('last');
		});
	}
}

function redraw() {

	// only do this for IE7 and IE8, force browser to redraw
	
    var rightCol, leftCol;
	rightCol = $('.bicolor_colorselector .resultsRightCol');
	leftCol = $('.bicolor_colorselector .resultsLeftCol');
			
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
})(jQuery);

// Storing filter disabling logic in case business asks for it back
				// Disable filters: Hue, Sort By and Price Group (if relevant)
				
				//$('#HuesSelect').attr("disabled", "disabled"); 
				//$('#HuesSelect').attr('selectedIndex', 0);
				//$('#HuesSelect-button').css('opacity', '0.4');
				//$('#HuesSelect').selectmenu({menuWidth:'120px', width:'100px'});
				
				//$('#SortBy').attr("disabled", "disabled"); 
				//$('#SortBy-button').css('opacity', '0.4');
				//$('#SortBy').attr('selectedIndex', 0);

				/*
				if ($(config).children('PriceGroupsEnabled').text() === 'false') {
					$('#PriceGroupSelect-button').css('display', "none");
				}
				else
				{
					$('#PriceGroupSelect').attr("disabled", "disabled"); 
					$('#PriceGroupSelect-button').css('opacity', '0.4');
					$('#PriceGroupSelect').attr('selectedIndex', 0);
				}
				*/