// Omniture action tracking code
(function($) {

	$(document).ready(function() {

		
		

	
	// only wire up Omniture tracking events if Omniture tracking code exists on the page
	if (typeof( window['s_account']) != 'undefined') {
		s.prop70="D=User-Agent";
		// include campaign tracking code here
		//The following line may be un-commented. It is for campaign tracking
		//The 'source' part specifies the query string parameter that contains the campaign flag
		s.campaign=s.getQueryParam('src');
		
		//If the campaign variable has been set, then store it in a session cookie
		if(s.campaign){s.c_w('campaignname', s.campaign, 0);}
		
		//If the cookie has a value, then store it in an sprop along with pagename
		if(s.c_r('campaignname')){
			s.prop1=s.c_r('campaignname') + ":"
			//If the page has been assigned a pagename, concatenate the pagename
			if(s.pageName){
				s.prop1=s.prop1 + s.pageName;
			}else{
				//If no pagename, then use the url
				s.prop1=s.prop1 + document.location;
			}
		}
	
		/* Search
		$('#SiteSearch_SiteSearch2Button').click(function() {
			s.linkTrackVars='eVar2,eVar3,eVar4,eVar6,eVar8,eVar9,eVar11,eVar13,eVar14,eVar15,eVar18,eVar33,eVar35,eVar16,events';
			s.linkTrackEvents='event19';
			s.events='event19';
			s.eVar16 = $('.site-search-box').val();
			s.tl(this,'o','Search');
		});
		*/
		// Annual Reports – PDF Download
		if ($('.downloads a.track-downloads').length) {
		                $('.track-downloads').click(function () {
		                	var temp = "PDF: " + $('.track-downloads').attr('data-pdfTitle');
		                               s.eVar20 = temp;  // Type and Title of PDF download
		                               s.linkTrackVars='eVar20,events';
		                               s.linkTrackEvents='event2';
		                               s.events='event2';
		                               s.tl(this,'o','Annual Reports PDF Download');
		                	
		                                });
		}
		
		
		
		// Share Links
		$('.share-window > ul > li > a').click(function() {
			s.eVar21 = $(this).text();
			s.linkTrackVars = 'eVar21,events';
			s.linkTrackEvents='event20';
			s.events='event20';
			s.tl(this,'o','Share');
		});
		
		// Contact Us Button Click
		// NOT REQUIRED FOR CROP
		/*
			$('.contact-button a').click(function() {
				s.linkTrackVars='eVar2,eVar3,eVar4,eVar6,eVar8,eVar9,eVar11,eVar13,eVar14,eVar15,eVar18,eVar33,eVar35,events';
				s.linkTrackEvents='event14';
				s.tl(this,'o');
			});
		*/
		
		// Featured Module Callout and curated Featured content in the modules section
		$('.a-featureda, .a-featuredb, .a-featuredx').click(function() {
			s.linkTrackVars='eVar2,eVar3,eVar4,eVar6,eVar8,eVar9,eVar11,eVar13,eVar14,eVar15,eVar18,eVar33,eVar35,events';
			s.linkTrackEvents='event5';
			s.events='event5';
			var evar35 = s.eVar35;
			var pre;
			
			// get last segment of URL to identify target content
			var href = $(this).attr('href');
			if ('' != evar35) {
				pre = evar35;
			}
			s.eVar35 = href.substr(href.lastIndexOf(String.fromCharCode(47)) + 1);
			s.tl(this,'o','Feature');
			if ('' != evar35) {
				s.eVar35 = pre;
			}
		});
		
		// Tool Callout
		if ($('.a-touttool').length > 0) {
			$('.a-touttool').each(function() {
				$(this).click(function() {
					s.eVar49 = $(this).text();
					s.linkTrackVars='eVar49,events';
					s.linkTrackEvents='event38';
					s.events='event38';
					s.tl(this,'o','Tool');
				});
			});
		}
		
		// Product Information Module
		if ($('.product_information_group').length > 0) {
			$('.product_information_group a').click(function () {
				s.eVar20 = $(this).attr('href'); // Link URL of Technical Spec clicked
				s.linkTrackVars='eVar20,events';
				s.linkTrackEvents='event12';
				s.events='event12';
				s.tl(this,'o','Product Information');
			});
		}
		
		// Home Page Callout
		if ($('.hero_callout_module-headline a').length > 0) {
			$('.hero_callout_module-headline a').click(function () {
				s.eVar45 = $('.hero_callout_module-headline a').text(); // Home Page Hero Story Ttile
				s.linkTrackVars='eVar45,events';
				s.linkTrackEvents='event34';
				s.events='event34';
				s.tl(this,'o','Home Page Hero Story');
			});
		}
		
		// DSS Expert Tool Click
		if ($('#DSSViewPane').length > 0) {
			$('#DSSViewPane').one('click', function() {
				s.eVar51 = $('.solid h2').text(); // Page title of current page hosting expert module taken from Hero Title
				s.linkTrackVars='eVar51,events';
				s.linkTrackEvents='event39';
				s.events='event39';
				s.tl(this,'o','DSS Ask the Expert');
			});
		}
		
		// [JA 2/6/2013 :: Uncomment when the following tools are migrated
		// BI Residential Tool Click
		
		if ($('.jcarousel-skin-dss-expert').length > 0) {
			$('.ls-link,.slide-link').click( function() {
				s.eVar51 = $(this).attr('href'); // URL of the link clicked
				s.linkTrackVars='eVar51,events';
				s.linkTrackEvents='event39';
				s.events='event39';
				s.tl(this,'o','BI Residential Tool');
			});
		}
		
		/*
		if ($('.jcarousel-skin-bi-residential').length > 0) {
			$('.detail-link,.detail-image-link').click( function() {
				s.eVar51 = $(this).attr('href'); // URL of the link clicked
				s.linkTrackVars='eVar51,events';
				s.linkTrackEvents='event39';
				s.events='event39';
				s.tl(this,'o','BI Residential Tool');
			});
		}
		
		// BI Room Designer
		if ($('#RoomDesignerToolLink').length > 0) {
			$('#RoomDesignerToolLink').click(function() {
				s.eVar54 = "Room Designer" // Specified String
				s.linkTrackVars='eVar54,events';
				s.linkTrackEvents='event42';
				s.events='event42';
				s.tl(this,'o','BI Room Designer');
			});
		}
		
		// BI Price Estimator
		if ($('#PriceEstimatorToolLink').length > 0) {
			$('#PriceEstimatorToolLink').click(function() {
				s.eVar55 = "Price Estimator" // Specified String
				s.linkTrackVars='eVar55,events';
				s.linkTrackEvents='event43';
				s.events='event43';
				s.tl(this,'o','BI Price Estimator');
			});
		}
		*/
		
		
	}
	});
})(jQuery);
