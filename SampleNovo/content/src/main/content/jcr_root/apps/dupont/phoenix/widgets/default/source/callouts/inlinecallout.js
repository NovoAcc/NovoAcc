//------------------------------------------------------------------------------
//	Define all Inline Callout Methods and Listeners
//------------------------------------------------------------------------------
Dupont.inlineCallout = {
	
	isIntroPage : false,
	initDone : false,
	
	init : function() {
		if(!Dupont.inlineCallout.initDone) {
			Dupont.inlineCallout.isIntroPage = Dupont.inlineCallout.isItIntroBody(); 
			Dupont.inlineCallout.initDone = true;
		}
	},
	
	manageTabs: function(tab,tabPanel,noSwitch) {
		var tabs=['list','children','static'];
		var index=tabs.indexOf(tab);
		for(var i=1; i < tabs.length; i++) {
			if(index==i) {
				tabPanel.unhideTabStripItem(i);
			} else { 
				tabPanel.hideTabStripItem(i);
			}
		}
		tabPanel.doLayout();
		if(!noSwitch) {
			tabPanel.activate(index);
		}
	},
	
	isItIntroBody : function() {
		var isItIntro = false;
    	try {
    		var evalIntroBodyModule = CQ.shared.HTTP.eval(CQ.WCM.getPagePath() +'/jcr:content/introbodytext.0.json');
			for (property in Object(evalIntroBodyModule)) {
				if(property = 'sling:resourceType') {
			  		if(evalIntroBodyModule[property] == 'dupont/phoenix/components/introbodytext') {
			  			isItIntro = true;
			  			break;
			  		}
			  	}	
			}
    	} catch(err) {}
    	return isItIntro;
	},
	
	isPageVideoPage: function(page) {
		var isVideoPage = false;
    	try {
    		var evalCmp = CQ.shared.HTTP.eval(page+'/jcr:content.0.json');
			for (prop in Object(evalCmp)) {
				if(prop = 'sling:resourceType') {
					console.log('resourceType:'+evalCmp[prop]);
			  		if(evalCmp[prop] == '/apps/dupont/phoenix/components/pages/corporatevideodetail' ||
			  				evalCmp[prop] == 'dupont/phoenix/components/pages/corporatevideodetail' ||
			  				evalCmp[prop] == '/apps/dupont/phoenix/components/responsive/pages/corporatevideodetail' ||
			  				evalCmp[prop] == 'dupont/phoenix/components/responsive/pages/corporatevideodetail') {
			  			isVideoPage = true;
			  			break;
			  		} else if(evalCmp[prop] == '/apps/dupont/phoenix/components/pages/videodetail' ||
			  				evalCmp[prop] == 'dupont/phoenix/components/pages/videodetail' ||
			  				evalCmp[prop] == '/apps/dupont/phoenix/components/responsive/pages/videodetail' ||
			  				evalCmp[prop] == 'dupont/phoenix/components/responsive/pages/videodetail') {
			  			isVideoPage = true;
			  			break;
			  		}
			  	}	
			}
		} catch(err) { }
		return isVideoPage;
	},
	
    initInlineCallout: function(field, rec, path) {
    	var panel = field.findParentByType('panel');
    	var tabPanel = field.findParentByType('tabpanel');
    	var contentTypeSelected = tabPanel.find('type','select')[0];	
 		var show = contentTypeSelected.getValue();
	    var imageSet = tabPanel.findByType('dialogfieldset')[0];
	    var videoSet = tabPanel.findByType('dialogfieldset')[1];
	    var overlaySelected = tabPanel.find('type','checkbox')[0];			    
    	var showTab = contentTypeSelected.getValue();
    	Dupont.inlineCallout.init();
    	if(Dupont.inlineCallout.isIntroPage) {
    		contentTypeSelected.setOptions([{value:'',text:''},
    		                                {value:'children',text:'Image'},
    		                                {value:'static',text:'Video'},
    		                                ]);
    		contentTypeSelected.doLayout();
		}
        imageSet.hide();
        videoSet.hide();
    	overlaySelected.hide();
	    if (show == 'children') {
	        imageSet.show();
	        videoSet.hide();
	    	overlaySelected.show();
	    } else if (show == 'static'){
	        imageSet.hide();
	        videoSet.show();
	    	overlaySelected.show();
	    } else if (show == 'contentpage'){
	    	showTab = "static";
	        imageSet.hide();
	        videoSet.hide();
	    	overlaySelected.hide();
	    }
	    panel.doLayout();
    	field.findParentByType('tabpanel').manageTabs(showTab,true);
    },
    
    showHideCalloutOptions : function(field,value) {
    	var panel = field.findParentByType('panel');
    	var tabPanel = field.findParentByType('tabpanel');
    	var contentTypeSelected = tabPanel.find('type','select')[0];	
	    var imageSet = panel.findByType('dialogfieldset')[0];
	    var videoSet = panel.findByType('dialogfieldset')[1];
	    var showSet = field.getValue();
	    var overlaySelected = tabPanel.find('type','checkbox')[0];			    
        imageSet.hide();
        videoSet.hide();
    	overlaySelected.hide();
    	var showTab = field.getValue();
	    if (showSet == 'children') {
	        imageSet.show();
	        videoSet.hide();
	    	overlaySelected.show();
	    } else if (showSet == 'static'){
	        imageSet.hide();
	        videoSet.show();
	    	overlaySelected.show();
	    } else if (showSet == 'contentpage'){
	    	showTab = "static";
	        imageSet.hide();
	        videoSet.hide();
	    	overlaySelected.hide();
	    }	
	    tabPanel.doLayout();
    	field.findParentByType('tabpanel').manageTabs(showTab,true);
    },
    
    validateInlineContent: function(field) {
    	Dupont.inlineCallout.init();
 		var tabPanel = field.findParentByType('tabpanel');
 		var contentTypeSelected = tabPanel.find('type','select')[0];
 		var show = contentTypeSelected.getValue();
    	var pageSelected = field.getValue();
		if(pageSelected!=null && pageSelected!='') {
			var videoPage = Dupont.inlineCallout.isPageVideoPage(pageSelected);
			if (show == 'static') {
			    if(!videoPage) {
			    	tabPanel.manageTabs('static',false);
			    	return(false, 'Please select the Video Page');
			    }
			}
			if (show == 'contentpage') {
			    if(videoPage) {
			    	tabPanel.manageTabs('static',false);
			    	return(false, 'Please select Content Page');
			    }
			}
	    }
	    return(true);
    }    
};
