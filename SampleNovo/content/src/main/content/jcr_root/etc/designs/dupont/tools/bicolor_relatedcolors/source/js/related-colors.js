(function($) {  
   
  var product, countrycode, xmlFile, dataURL, basePath;  
 
    // var dataURL = "", basePath = "", slash = String.fromCharCode(47);
  	// var prodSegment = "", product = "", strProductColorsNode = "";
    // var corianSegemnt="bi", zodiaqSegment="dbi", country = "", xmlFile = "";
    var url = window.location.pathname;
    var splitUrl = url.split('/');
    // var baseDataPath = 'sites/all/themes/dpphoenix/Tools/BIColor/Data/';
	var baseDataPath='/etc/designs/dupont/tools/bicolor_relatedcolors/source/data/';
	//order sample link
	var page = splitUrl[splitUrl.length-1];
	var colorname = page.substring(0, page.lastIndexOf('.'));
	var qsParam = '?PROD_NAME=' + colorname;
		
	$('.legacy .BIOrderLink').each( function() {
		var sampleLink = $(this).attr('href');	
		$(this).attr('href', sampleLink + qsParam);
	});
	//console.log($('#BIOrderLink'));

    // get product from second segment (DEV and AUTH) or third segment (Staging or PROD)
	/*
    if (splitUrl[2] == corianSegemnt || splitUrl[3] == corianSegemnt) {
        product = "corian";
    }
    else if (splitUrl[2] == zodiaqSegment || splitUrl[3] == zodiaqSegment) {
        product = "zodiaq";
    } */
	
	// get product from markup
	product = $('.legacy #BICarousel').attr('data-product');

    // get country code from markup
    countrycode = $('.legacy #BICarousel').attr('data-countrycode');

    if (countrycode == '' || countrycode == undefined || product == '' || product == undefined) {
        // console.log('Missing countrycode code in markup');
    }
    else {
        xmlFile = product + '_' + countrycode + '.xml';
    }
	
    // base path for images, other pages and links
    // basePath = Drupal.settings.basePath;
	basePath= "";
	
	/*
    if (!(basePath.indexOf(splitUrl[1]) != -1)) {
        // Staging or PROD environment
		basePath = slash + splitUrl[1] + basePath; 
    }
	*/

    // create data path
	dataURL = basePath + baseDataPath + xmlFile;
    	    	
    // set up localization variables
	/*
    if (countrycode == 'en-gb') {
    	strColorLabel = 'Colours';
    	colorString = product + '-all-colours.html';
    }
    else if (countrycode == 'en-us') {
    	strColorLabel = 'Colors';
    	colorString = product + '-all-colors.html';
    }
	*/
    	
    // Capitalize product name for display later
    product = product.substring(0,1).toUpperCase() + product.substring(1, product.length);
    // strProductColorsNode = product + 'Colors';
								
/*
	console.log('colorString = ' + colorString);
	console.log("strColorLabel= " + strColorLabel); 
	console.log("strProduct = " + strProduct);
	console.log("product = " + product);
	console.log("strProductColorsNode = " + strProductColorsNode);
	console.log("basePath = " + basePath);	
	console.log("dataURL = " + dataURL);
*/	
  var time,XMLDATA;

	$.ajax({
        type: "GET",
		url: dataURL,
		dataType: "xml",
		success: function(xml) {
			XMLDATA=xml;
			time=setTimeout(function(){
				if(typeof jCarouselInit != 'undefined'){
					clearInterval(time);
					writeList();

					var el = $('.legacy .bicolor-hlm-carousel');
		 			el.css('display', 'none');
		 			el.offsetHeight;
		 			el.css('display', 'block');
		 			
		 			// wire up event handler for omniture events on code generated markup
					$('.legacy #RelatedColors a').click(function() {
						var colorName = $(this).text();
						
						if ($(this).children('img.bi-cta-arrow').length === 0) {
							// image was clicked, get name from sibling link
							colorName = $(this).next().text();
						}
					
						s.eVar41 = 'Related Color Product Clicked: ' + colorName;
						s.linkTrackVars='eVar41,events'; 
						s.linkTrackEvents='event30';
						s.events = 'event30';
											
						s.tl(this,'o', 'BI Color Tool');
					
					});

				}
            },250);
 		},
 		complete: function() {
 			// force redraw
 			
 			
 			
 		}
 		
 	});

    function writeList(){
    		xml=XMLDATA;
					// set global vars
			var config = $(xml).children('data').children('Configuration');
			// var product = config.children('ProductType').text();
			var allColorPagePath = config.children('AllColorPageBasePath').text();
			var allColorPageName = config.children('AllColorPageName').text();
			var imageBasePath = config.children('ImageBasePath').text();
			
			// Get Translations
			var translationsNode = $(xml).children('data').children('Translations');
			var RelatedColorsTitle = '', relatedHuesLabel = '', allColorsLinkText='', colorString = '';
			
			if (translationsNode != undefined || translations != '') {
				RelatedColorsTitle = translationsNode.children('RelatedColorsTitle').attr('value');
				relatedHuesLabel = translationsNode.children('RelatedHuesLabel').attr('value');
				allColorsLinkText = translationsNode.children('AllColorsPageLinkText').attr('value');
				colorString = translationsNode.children('ColorString').attr('value');
			}
			
			(RelatedColorsTitle != '') ? $('.legacy #RelatedColorsTitle').html(RelatedColorsTitle) : logMissingTranslationValue('RelatedColorsTitle'); 
			(relatedHuesLabel != '') ? $('.legacy #RelatedHues').html(relatedHuesLabel) : logMissingTranslationValue('relatedHuesLabel'); 

			// get currently featured color based on page name
			var url = window.location.pathname;   
 	        var colorDetailPage = url.substring(url.lastIndexOf('/') + 1);
 	        // console.log('Page Name: ' + colorDetailPage); 	        
			
			// get first three hues associated with current color
			var hues = new Array();
			// var hue1, hue2, hue3;
			
			// get node list of all colors
            // var colors = $(xml).children('data').children(product).children(product+'Colors');
			var colors = $(xml).children('data').children('Colors');
            var currentColor;
            //console.log(colorDetailPage)

            // find color node of current color
            $(colors).children('color').each(function() {
                //console.log($(this).attr('productUrl'));
            	if($(this).attr('productUrl') === colorDetailPage) {
            		currentColor = $(this);
            		// console.log('found color: ' + $(this).attr('name'));
            		return;
            	}
            });
            
            var count = 0;

            $(currentColor).children('hues').children('hue').each(function() {
            	hues[count] = $(this).attr('id');
            	count++;
            });
            
            // console.log('hues[0]: ' + hues[0]);
						
			var huesColorsList = [];
			var selectedLocation;
			// console.log(colors);
			var huesNode = $(xml).children('data').children('Hues');

			$(huesNode).children('hue').each(function(index, element) {
							// JA: removing CTA arrow from Collection Link, per PSD COMPS
                            // var hueHtml = '<a href="{0}">{1}<img class="bi-cta-arrow" src="'+ basePath + 'sites/all/themes/dpphoenix/images/right-arrow-action.png" alt="red arrow" /></a>';
                            
                            var hueHtml = '<a href="{0}">{1}</a>';
							if($(this).attr('id') === hues[0])
								$('.legacy #hue3').html(String.format(hueHtml, basePath + allColorPagePath + allColorPageName + '?hue=' + $(this).attr('sysName'), $(this).attr('displayName'))); 
							if($(this).attr('id') === hues[1])
								$('.legacy #hue2').html(String.format(hueHtml, basePath + allColorPagePath + allColorPageName + '?hue=' + $(this).attr('sysName'), $(this).attr('displayName')));
							if($(this).attr('id') === hues[2])
								$('.legacy #hue1').html(String.format(hueHtml, basePath + allColorPagePath + allColorPageName + '?hue=' + $(this).attr('sysName'), $(this).attr('displayName')));
                        });
			
			//overwrite HLM all colors link and labels
			$('.legacy #allcolors a').html(allColorsLinkText).attr('href', basePath + allColorPagePath + allColorPageName);
			// $('.bicolor-title').html('RELATED ' + strColorLabel.toUpperCase());

			cCount = 0;
            $(colors).children('color').each(function() {
            	
            	// iterate through Hue collection for each color
            	var add = false;

            	$(this).children('hues').children('hue').each(function() {
            	
            		var hueId = $(this).attr('id');

            		// look for matching hues
            		if (hueId === hues[0] || hueId === hues[1] || hueId == hues[2]) {
						// add color to list
            			add = true;
            			// exit this loop on any one match, don't add this same color twice
            			return;
            		}
            	
            	});
				
				if(add === true)
				{
					
					if($(currentColor).attr('name') === $(this).attr('name'))
					{
						selectedLocation = 	cCount;
						// console.log('selected sortOrder: ' + $(this).attr('sortOrder'));
					}
					//if(selectedLocation !=	cCount)
						huesColorsList[cCount] = $(this);
					cCount++;
				}
            
            });
			
			if(hues[1] === '' || hues[1] === undefined) {
				$('.legacy .d2').css('display', 'none');
			}
			if(hues[2] === '' || hues[2] === undefined) {
				$('.legacy .d1').css('display', 'none');
			}
			
			
			var selectedColors = [];
			var selectedColorsCount = 0;
			if($(huesColorsList).length >= 13)
			{
				// console.log('selected location: ' + selectedLocation);
				if(selectedLocation < 7)
				{
					var tempCount = 0;
					$(huesColorsList).each(function() {
                        if(tempCount < selectedLocation)
						{
							// console.log('Colors before selected. color: ' + $(this).attr('name') + ', sortOrder:' + $(this).attr('sortOrder'));
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						else if(tempCount > selectedLocation && tempCount <= selectedLocation +6)
						{
							// console.log('Colors after selected. color: ' + $(this).attr('name') + ', sortOrder:' + $(this).attr('sortOrder'));
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						
						if(tempCount >= $(huesColorsList).length - (6 - selectedLocation))
						{
							// console.log('Flling with colors from the end. color: ' + $(this).attr('name') + ', sortOrder:' + $(this).attr('sortOrder'));
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						tempCount ++;
                    });
				} else if(selectedLocation > $(huesColorsList).length - 7) {
					var tempCount = 0;
					$(huesColorsList).each(function() {
						if(tempCount <= ($(huesColorsList).length - selectedLocation))
						{
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						
                        if(tempCount >= selectedLocation - 6 && tempCount < selectedLocation)
						{
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						else if(tempCount > selectedLocation)
						{
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						tempCount ++;
                    });
				} else {
					var tempCount = 0;
					$(huesColorsList).each(function() {
                        if(tempCount >= selectedLocation - 6 && tempCount < selectedLocation)
						{
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						else if(tempCount > selectedLocation && tempCount <= selectedLocation +6)
						{
							selectedColors[selectedColorsCount] = $(this);
							selectedColorsCount ++;
						}
						tempCount ++;
                    });
				}
			}
			else
			{
				 huesColorsList.splice(selectedLocation, 1);
				selectedColors = huesColorsList;
				$(huesColorsList).each(function() {
					selectedColorsCount ++;
				});
			}
			
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
				{7} = CSS for 3/less or 4/more colors
				{8} = Color ID
				{9} = product name, stored in var product, e.g., 'Corian' 
				{10} = Color/Colour string
			*/
						            			
            //add product as {9}, Color/Colour as {10}
            //String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', colorId, product, colorString); 
            var colorHtml = 
			'<li>\n' +
				'<div class="{7} {0} {1} {2}" data-sortOrder="{3}" data-sortName="{5}" colorId="{8}" style="display: none;">\n' +
                    '<a class="color-link" href="'+ basePath + '{4}">\n' +
                        '<img alt="{9} {10} {5}, click to view detailed product information" src="'+ basePath + '{6}" />\n' +
                    '</a>\n' +
                    '<a class="cta-arrow-link color-link" href="'+ basePath + '{4}">{5}\n' +
                         '<img src="'+ basePath + imageBasePath + 'right-arrow-action.png" alt="{9} {10} {1}, click to view detailed product information" class="bi-cta-arrow" /></a>\n' +
                 '</div>\n' +
			'</li>';

            // get node list of all colors
            colorsList = '';
			var count=1;
            
			$(colors).children('color').each(function() {
            	
            	var huesList = '', collectionsList = '';
				var colorDetailURL = $(config).children('ColorPageBasePath').text() + $(this).attr('productUrl');
            	var sortOrder = $(this).attr('sortOrder');
            	var colorName = $(this).attr('name');
				var colorId = $(this).attr('id');
            	var colorImage = imageBasePath + $(this).attr('image');
				var collectionsNode = $(xml).children('data').children('Collections');
				var huesNode = $(xml).children('data').children('Hues');

            	            	
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
            	
				if(selectedColorsCount < 4) {
					if (count%3 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', colorId, product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', colorId, product, colorString);
					}
				}
				else if(selectedColorsCount == 4) {
					if (count%4 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', colorId, product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', colorId, product, colorString);
					}
				}
				else if(selectedColorsCount <=9)
				{
					if (count%3 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', colorId, product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', colorId, product, colorString);
					}
				}
				else{
					if (count%4 === 0) {
							//last
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', colorId, product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', colorId, product, colorString);
					}
				}
				            	
            	// increment count
            	count++;
            
            });
			$('.legacy #RelatedColors').html(colorsList);
			$('.legacy #RelatedColors').children('li').sortElements(function(a, b){
				return parseInt($(a).children("div").attr("sortOrder")) > parseInt($(b).children("div").attr("sortOrder")) ? 1 : -1;
			});
			$('.legacy #RelatedColors').children('li').each(function() {
				var li = $(this);
				var remove = true;
                $(selectedColors).each(function() {
                    if($(li).children('div').attr('colorId') === $(this).attr('id'))
					{
						$(li).children("div").css('display', 'block');
						remove = false;
					}
                });
				if(remove === true)
					$(this).remove();
            });
			
			/*if(selectedColorsCount < 4) {
				$('#RelatedColors').jcarousel({
					visible: 4,
					size: selectedColorsCount,
					itemFallbackDimension:218,
					initCallback: mycarousel_initCallback,
					buttonNextHTML: null,
					buttonPrevHTML: null
				});
				jCarouselInit.init({
		        	'carousel' : $('#RelatedColors').parent(),
		        	'list' : $('#RelatedColors'),
		        	'items' : 'li',           
		       		'itemsToShow' : 4,
		        	'hide' : false,
		            'centerV' : false,
		            'animation': 'fast',
		            'initCallback': mycarousel_initCallback
		    	});
			}
			else if(selectedColorsCount == 4) {
				$('#RelatedColors').jcarousel({
					visible: 4,
					size: selectedColorsCount,
					itemFallbackDimension:218,
					initCallback: mycarousel_initCallback,
					buttonNextHTML: null,
					buttonPrevHTML: null
				});
				jCarouselInit.init({
		        	'carousel' : $('#RelatedColors').parent(),
		        	'list' : $('#RelatedColors'),
		        	'items' : 'li',           
		       		'itemsToShow' : 4,
		        	'hide' : false,
		            'centerV' : false,
		            'animation': 'fast',
		            'initCallback': mycarousel_initCallback
		    	});
			} else {
				$('#RelatedColors').jcarousel({
			    	scroll: 4,
			    	visible: 4,
			    	itemFallbackDimension:218,
					size: selectedColorsCount,
					initCallback: mycarousel_initCallback
				});
				jCarouselInit.init({
		        	'carousel' : $('#RelatedColors').parent(),
		        	'list' : $('#RelatedColors'),
		        	'items' : 'li',           
		       		'itemsToShow' : 4,
		        	'hide' : false,
		            'centerV' : false,
		            'animation': 'fast',
		            'initCallback': mycarousel_initCallback
		    	});
			}*/



            jCarouselInit.init({
		        	'carousel' : $('.legacy #RelatedColors').parent(),
		        	'list' : $('.legacy #RelatedColors'),
		        	'items' : 'li',           
		       		'itemsToShow' : 4,
		        	'hide' : false,
		            'centerV' : false,
		            'animation': 'fast',
		            /*'prev' : '.jcarousel-prev',
		            'next':  '.jcarousel-next',
		            'parent' : '.bi-color-tool.legacy',*/
		            'initCallback': mycarousel_initCallback
		    	});
			//var relatedColors = $('#RelatedColors').data('jcarousel');

    }
 	
 function mycarousel_initCallback(carousel, scrollInterval) {
	var graydots = $('.legacy .graydots a');
	var colorCount = $('.legacy #RelatedColors > .jcarousel-item').length;
	var twoPage = (colorCount > 3 && colorCount < 7) ? true : false;
	$('.bi-color-tool.legacy .jcarousel-next-horizontal, .bi-color-tool.legacy .jcarousel-prev-horizontal').css('display','block');
	// hide uneeded dots, if any
	if(colorCount < 5) {
		// hide entire DIV, not just dots, to force links to align flush right
		$('.legacy .graydots').hide();
	}
	else if (colorCount <= 6) {
		// hide the last gray dot
		$(graydots[2]).hide();
	}
	
	// wire up carousel scrolling via pagination dots
	$(graydots[0]).click(function() {
		//carousel.scroll((carousel.options.scroll*0)+1);
        $('.legacy #RelatedColors').parent().jcarousel('scroll', 0);
		graydots.removeClass('selected');
		$(this).addClass('selected');
	});
	$(graydots[1]).click(function() {
		//carousel.scroll((carousel.options.scroll*1)+1);
        $('.legacy #RelatedColors').parent().jcarousel('scroll', 4);
		graydots.removeClass('selected');
		$(this).addClass('selected');

	});
	if (!twoPage) {
		$(graydots[2]).click(function() {
            $('.legacy #RelatedColors').parent().jcarousel('scroll', 8);
			//carousel.scroll((carousel.options.scroll*2)+1);
			graydots.removeClass('selected');
			$(this).addClass('selected');
		});
	}
    
    // wire up pagination dots selected and unselected states when carousel arrows are used to scroll
    $('.legacy #RelatedColors').parent().parent().find('.jcarousel-prev').bind('click', function() {


        graydots.removeClass('selected');
        
        if (carousel.visible().hasClass('last'))  {
        	if (!twoPage) {
        		$(graydots[1]).addClass('selected');
           	} else {
           		$(graydots[0]).addClass('selected');
           	}
 		} else {
				$(graydots[0]).addClass('selected');
		}
        carousel.scroll('-='+scrollInterval);
        return false;
    });
    
    $('.legacy #RelatedColors').parent().parent().find('.jcarousel-next').bind('click', function(e) {

        graydots.removeClass('selected');

		if (carousel.visible().hasClass('first')) {
        		$(graydots[1]).addClass('selected');
               	if (!twoPage) {
        	    	$(graydots[2]).removeClass('selected');
               	}
		} else {
			// will only ever hit this condition if there are more than two pages
			if (!twoPage) {
        	    $(graydots[2]).addClass('selected');
            }
		}
        carousel.scroll('+='+scrollInterval);
        return false;
    });
};
 	
 	
// Utility Functions
String.format = function() { 
  var s = arguments[0]; 
  for (var i = 0; i < arguments.length - 1; i++) {        
    var reg = new RegExp("\\{" + i + "\\}", "gm");              
    s = s.replace(reg, arguments[i + 1]); 
  } 
 
  return s; 
} 

function logMissingTranslationValue(label) {
	console.log('Missing translation value for the ' + label + ' node');
}

})(jQuery);