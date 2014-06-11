/*************************************************************************************

Omniture action tracking code for the BI Color Tool, including:
	- Navigation Tool: Corian and Zodiaq Product Detail pages
	- Related Colors (Custom Horizontal List Module): Color Sub-Product Detail Pages
	- Reccommened Colors (Custom Horizontal List Moule): Uses & Applications Pages
**************************************************************************************/

(function($) {

	$(function() {

		// only wire up Omniture tracking events if Omniture tracking code exists on the page, which ensures s, account name, etc. have been defined
		if (typeof( window['s_account']) != 'undefined') {
	
			var colorNavigation = $('.subproduct_navigation_tool');
	
			// Color Navigation Tool code
			
			if (colorNavigation.length > 0) {
						
				// Price Group, Hue, or Sort Filter Selected
				
				$('#subfilter1, #subfilter2, #SortBy').change(function () {
				
					// find id of clicked element, then get proper reporting name and value
					var elementID = $(this).attr('id');
					var selectedFilter =  $(this).attr("data-filtername");
					var filterValue = $(this).val();
					
					reportFilterApplied(selectedFilter, filterValue);
					
				});
				
				// Note: Collection Link click events are added in color-selector.js due to them being dynamically created and therefore clcik events cannot
				//       be assigned until afterward creation and insertion into the DOM
			
			}
		}
	});


	function reportFilterApplied(filterType, filterValue) {

		if (filterType==='Sort') {
			s.eVar38 = filterType + ': ' + filterValue;
			s.linkTrackVars='eVar38,events'; 
			s.linkTrackEvents='event26';
			s.events = 'event26';
		}
		else {
			s.eVar37 = filterType + ': ' + filterValue;
			s.linkTrackVars='eVar37,events'; 
			s.linkTrackEvents='event24';
			s.events = 'event24';
		}
						
		s.tl(this,'o', 'BI Color Tool');
	}
		
	function findFilterType(elementId) {
		var clickedElement="";
		
		if  (elementId === 'PriceGroupSelect') {
			clickedElement = 'Price Group';
		}
		else if (elementId === "HuesSelect") {
			clickedElement = 'Hue';
		}
		else if (elementId === 'SortBy') {
			clickedElement = 'Sort';
		}
		
		return clickedElement;		
	}
	
	
}) (jQuery);
