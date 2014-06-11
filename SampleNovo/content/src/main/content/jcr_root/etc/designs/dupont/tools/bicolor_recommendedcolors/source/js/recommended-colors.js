(function($) {

  // var strColorLabel = "Colours";
  // var strAllColorPageName = "";
  
  var product, countrycode, xmlFile, dataURL, basePath;
  
  // var dataURL = "", basePath = "", slash = String.fromCharCode(47);
  // var prodSegment = "", strProductNode = "", strProductColorsNode = "";
  // var corianSegemnt="bi", zodiaqSegment="dbi", country = "", xmlFile = "";
  var url = window.location.pathname;
  var splitUrl = url.split('/');
  var baseDataPath = '/etc/designs/dupont/tools/bicolor_recommendedcolors/source/data/';
  					
  /*

    	// get product from second segment (DEV and AUTH) or third segment (Staging or PROD)
    	if (splitUrl[2] == corianSegemnt || splitUrl[3] == corianSegemnt) {
        	strProductNode = "corian";
    	}
    	else if (splitUrl[2] == zodiaqSegment || splitUrl[3] == zodiaqSegment) {
        	strProductNode = "zodiaq";
    	}
  */
  
  // get product from markup
  product = $('.legacy #BICarousel').attr('data-product');
  
  // get country code from markup
  countrycode = $('.legacy #BICarousel').attr('data-countrycode');

  if (countrycode == '' || countrycode == undefined || product == '' || product == undefined) {
	//console.log('Missing country code in markup');
  }
  else {
         xmlFile = product + '_' + countrycode + '.xml';
  }
	
  // base path for images, other pages and links
  // basePath = Drupal.settings.basePath;
  basePath = "";

  /*
    	if (!(basePath.indexOf(splitUrl[1]) != -1)) {
        	// Staging or PROD environment
			basePath = '/' + splitUrl[1] + basePath; 
    	}
  */
  
  // create data path
  dataURL = basePath + baseDataPath + xmlFile;

  /*  
    	// set up localization variables
    	if (country == 'en-gb') {
    		strColorLabel = 'Colours';
    		strAllColorPageName = strProductNode + '-all-colours.html';
    	}
    	else if (country == 'en-us') {
    		strColorLabel = 'Colors';
    		strAllColorPageName = strProductNode + '-all-colors.html';
    	}
    	
    	// set up XML nodes / path segments based on product
    	strProductNode = strProductNode = strProductNode.substring(0,1).toUpperCase() + strProductNode.substring(1, strProductNode.length);
    	strProductColorsNode = strProductNode + 'Colors';
  */
  
  // Capitalize product name for display later
    product = product.substring(0,1).toUpperCase() + product.substring(1, product.length);
var time;
var XMLData;
	$.ajax({
        type: "GET",
		url: dataURL,
		dataType: "xml",
		success: function(xml) {
			XMLData=xml;
			 
            time=setInterval(function(){

            	if( typeof jCarouselInit != 'undefined')
            	{
            		
            		clearInterval(time);
					writeList();
					var el = $('.legacy .bicolor-hlm-carousel');
 					el.css('display', 'none');
 					el.offsetHeight;
 					el.css('display', 'block');
 				}
            },250);

 		},
 		complete: function() {
 			// force redraw
 			
 		}

 	});

	
	function writeList(){
			xml=XMLData;
        // set global vars
			var config = $(xml).children('data').children('Configuration');
			// var product = config.children('ProductType').text();
			var allColorPagePath = config.children('AllColorPageBasePath').text();
			var allColorPageName = config.children('AllColorPageName').text();
			// console.log('product: ' + product)
			
			// Get Translations
			var translationsNode = $(xml).children('data').children('Translations');
			var recommendedColorsTitle = '', recommendedColorsLabel = '', allColorsLinkText='', colorString = '';
			
			if (translationsNode != undefined || translations != '') {
				recommendedColorsTitle = translationsNode.children('RecommendedColorsTitle').attr('value');
				recommendedColorsLabel = translationsNode.children('RecommendedColorsLabel').attr('value');
				allColorsLinkText = translationsNode.children('AllColorsPageLinkText').attr('value');
				colorString = translationsNode.children('ColorString').attr('value');
			}
			
			(recommendedColorsTitle != '') ? $('#RecommendedColorsTitle').html(recommendedColorsTitle) : logMissingTranslationValue('recommendedColorsLabel'); 
			(recommendedColorsLabel != '') ? $('#RecommendedColorsLabel').html(recommendedColorsLabel) : logMissingTranslationValue('recommendedColorsLabel'); 
			
			// get currently featured color based on page name
			var url = window.location.pathname;   
 	        var unaDetailPage = url.substring(url.lastIndexOf('/') + 1);
 	        // console.log('Page Name: ' + unaDetailPage); 	        
			
			// get node list of all colors
            var colors = $(xml).children('data').children('Colors');
			var collections = $(xml).children('data').children("collections");
			var una = $(xml).children('data').children("UsesAndApplications");
			var currentUna;
			var selectedColors = [];
            
            // find una node of current una
            $(una).children('ua').each(function() {
            	if($(this).attr('pageURL') === unaDetailPage) {
            		currentUna = $(this);
            		// console.log('found UNA: ' + $(this).attr('displayName'));
            		return;
            	}
            });
            
           // select the colors part of the current una
		   var tCount = 0;
            $(colors).children('color').each(function() {
				var currentColor = $(this);
				$(this).children('usesandapplications').children('ua').each(function() {
					if($(this).attr("id") === $(currentUna).attr("id"))
					{
						selectedColors[tCount] = currentColor;
						tCount++;
					}
				});
            });
            
			var randomColors = [];
            var rCount = 0;
			while($(randomColors).length < 12 && $(selectedColors).length >= 1)
			{
				var rand = $.randomBetween(0, $(selectedColors).length - 1);
				randomColors[rCount] = selectedColors[rand];
				selectedColors.splice(rand, 1);
				rCount ++;
			}
			
			if($(randomColors).length <=4)
			{
				$('.legacy a.1').css('display', 'none');
				$('.legacy a.5').css('display', 'none');
				$('.legacy a.9').css('display', 'none');
			}
			else if($(randomColors).length <=8 && $(randomColors).length > 4)
				$('.legacy a.9').css('display', 'none');
			
			var colId = $(currentUna).attr('collectionId');
			// JA: removing CTA arrow from Collection Link, per PSD COMPS
			// var collectionHtml = '<a href="{0}">{1}<img class="bi-cta-arrow" src="'+ basePath + 'sites/all/themes/dpphoenix/images/right-arrow-action.png" alt="red arrow" /></a>';
			var collectionHtml = '<a href="{0}">{1}</a>';
			var foundCollection = false;
			$(collections).children('collection').each(function(index, element) {
							if($(this).attr('id') === colId)
							{
								//$('#collection1').html(String.format(collectionHtml, basePath + allColorPagePath + 'corian-all-colours.html?collection=' + $(this).attr('sysName'), $(this).attr('displayName')));
								$('#collection1').html(String.format(collectionHtml, basePath + allColorPagePath + allColorPageName + '?collection=' + $(this).attr('sysName'), $(this).attr('displayName')));
								foundCollection = true;
								}
                        });
			
			
			if(foundCollection === false)
			{
				$(".legacy .d1").css("display", "none");
				$('.legacy #collection1').css("display", "none");
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
				{8} = product name, stored in var strProductNode, e.g., 'Corian'
				{9} = Color/Colour string
			*/

            //add strProductNode as {8}, Color/Colour string as {9}
            //String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', strProductNode, strColorLabel.substring(0,(strColorLabel.length - 1)));
  			var colorHtml = 
			'<li>' +
				'<div class="{7} {0} {1} {2}" data-sortOrder="{3}" data-sortName="{5}">\n' +
                    '<a class="color-link" href="'+ basePath + '{4}">\n' +
                        '<img alt="{8} {9} {5}, click to view detailed product information" src="'+ basePath + '{6}" />\n' +
                    '</a>\n' +
                    '<a class="cta-arrow-link color-link" href="'+ basePath + '{4}">{5}\n' +
                         '<img src="/etc/designs/dupont/tools/bicolor_recommendedcolors/source/images/right-arrow-action.png" alt="{8} {9} {1}, click to view detailed product information" class="bi-cta-arrow" /></a>\n' +
                 '</div>' +
			'</li>';
          
            //overwrite HLM all colors link and labels
			$('.legacy #allcolors a').html(allColorsLinkText).attr('href', basePath + allColorPagePath + allColorPageName);
			// $('.bicolor-title').html('RECOMMENDED ' + strColorLabel.toUpperCase());
  
            // get node list of all colors
            var colors = $(xml).children('data').children('Colors');

            colorsList = '';
			var count=1;
            
			$(randomColors).each(function() {
            	
            	var huesList = '', collectionsList = '';
				var colorDetailURL = $(config).children('ColorPageBasePath').text() + $(this).attr('productUrl');
            	var sortOrder = $(this).attr('sortOrder');
            	var colorName = $(this).attr('name');
            	var colorImage = $(config).children('ImageBasePath').text() + $(this).attr('image');
				var collectionsNode = $(xml).children('data').children(product).children('Collections'); 
				var huesNode = $(xml).children('data').children(product).children('Hues'); 

           	
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
            	
				
				if($(randomColors).length < 4) {
					if (count%3 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', product, colorString);
					}
				}
				else if($(randomColors).length == 4) {
					if (count%4 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', product, colorString);
					}
				}
				else if($(randomColors).length <=9)
				{
					if (count%3 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'three', product, colorString);
					}
				}
				else{
					if (count%4 === 0) {
							colorsList = colorsList + String.format(colorHtml, 'last', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', product, colorString);
					}
					else {
							colorsList = colorsList + String.format(colorHtml, '', huesList, collectionsList, sortOrder, colorDetailURL, colorName, colorImage, 'four', product, colorString);
					}
				}
            	// increment count
            	count++;
            
            });

			//var recommendedColors = $('#recommendedColors').data('jcarousel');

		// write list into the page			
		$('.legacy #recommendedColors').html(colorsList);
		// instantiate carousel
		if($(randomColors).length < 4) {
			// create carousel instance with no navigation arrows
			/*$('#recommendedColors').jcarousel({
				scroll: 3,
				itemFallbackDimension:300,
				initCallback: mycarousel_initCallback,
				buttonNextHTML: null,
				buttonPrevHTML: null
			});*/
	        jCarouselInit.init({
	        	'carousel' : $('.legacy #recommendedColors').parent(),
	        	'list' : $('.legacy #recommendedColors'),
	        	'items' : 'li',           
	       		'itemsToShow' : 3,
	        	'hide' : false,
	            'centerV' : false,
	            'animation': 'fast',
	            /*'prev' : '.jcarousel-prev',
	            'next':  '.jcarousel-next',
	            'parent' : '.bi-color-tool.legacy',*/
	            'initCallback': mycarousel_initCallback
	    	});
			
		} else if($(randomColors).length == 4) {
			/*$('#recommendedColors').jcarousel({
				scroll: 4,
				itemFallbackDimension:218,
				initCallback: mycarousel_initCallback,
				buttonNextHTML: null,
				buttonPrevHTML: null
			});*/
	        jCarouselInit.init({
	        	'carousel' : $('.legacy #recommendedColors').parent(),
	        	'list' : $('.legacy #recommendedColors'),
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
			
		} else if($(randomColors).length <=9) {
			/*$('#recommendedColors').jcarousel({
				scroll: 3,
				itemFallbackDimension:300,
				initCallback: mycarousel_initCallback
			});*/
	        jCarouselInit.init({
	        	'carousel' : $('.legacy #recommendedColors').parent(),
	        	'list' : $('.legacy #recommendedColors'),
	        	'items' : 'li',           
	       		'itemsToShow' : 3,
	        	'hide' : false,
	            'centerV' : false,
	            'animation': 'fast',
	            /*'prev' : '.jcarousel-prev',
	            'next':  '.jcarousel-next',
	            'parent' : '.bi-color-tool.legacy',*/
	            'initCallback': mycarousel_initCallback
	    	});
			
		} else {
			/*$('#recommendedColors').jcarousel({
				scroll: 4,
				itemFallbackDimension:218,
				visible:4,
				initCallback: mycarousel_initCallback
			});*/
	        jCarouselInit.init({
	        	'carousel' : $('.legacy #recommendedColors').parent(),
	        	'list' : $('.legacy #recommendedColors'),
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

		}
    }
 	

 function mycarousel_initCallback(carousel, scrollInterval) {
	var graydots = $('.legacy .graydots a');
	var colorCount = $('.legacy #recommendedColors > .jcarousel-item').length;
	var twoPage = (colorCount > 3 && colorCount < 7) ? true : false;
	$('.bi-color-tool.legacy .jcarousel-next-horizontal, .bi-color-tool.legacy .jcarousel-prev-horizontal').css('display','block');
	// hide uneeded dots, if any
	if(colorCount < 5) {
		graydots.hide();
	} else if (colorCount <= 6) {
		$(graydots[2]).remove();
	}	
	
	// wire up carousel scrolling via pagination dots
	$(graydots[0]).click(function() {
		//carousel.scroll((carousel.options.scroll*0)+1, true);
        $('.legacy #recommendedColors').parent().jcarousel('scroll', 0);
		graydots.removeClass('selected');
		$(this).addClass('selected');
	});
	$(graydots[1]).click(function() {
		//carousel.scroll((carousel.options.scroll*1)+1, true);
        $('.legacy #recommendedColors').parent().jcarousel('scroll', 4);
		graydots.removeClass('selected');
		$(this).addClass('selected');

	});
	if (!twoPage) {
		$(graydots[2]).click(function() {
			//carousel.scroll((carousel.options.scroll*2)+1, true);
            $('.legacy #recommendedColors').parent().jcarousel('scroll', 8);
			graydots.removeClass('selected');
			$(this).addClass('selected');
		});
	}
    
    // wire up pagination dots selected and unselected states when carousel arrows are used to scroll
    
    
    $('.legacy #recommendedColors').parent().parent().find('.jcarousel-prev').bind('click', function() {


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

    $('.legacy #recommendedColors').parent().parent().find('.jcarousel-next').bind('click', function(e) {

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
/*
function mycarousel_itemVisibleInCallbackAfterAnimation(carousel, item, idx, state) {
    $(".graydots a").removeClass('selected');
	var page = idx / carousel.options.scroll;
	$(".graydots").children().each(function(){
		if($(this).attr('page') === page)
			$(this).addClass('selected');
	});
};
*/	
	
// Utility Functions
String.format = function() { 
  var s = arguments[0]; 
  for (var i = 0; i < arguments.length - 1; i++) {        
    var reg = new RegExp("\\{" + i + "\\}", "gm");              
    s = s.replace(reg, arguments[i + 1]); 
  } 
 
  return s; 
} 

})(jQuery);
