Dupont.contentTypes = {
              
    loadSelectionOptions : function(dialog) {
                // alert(dialog.form.findField('./contentType').getValue());
                // dialog.form.findField('./contentType').disable();
                // var locked = dialog.form.findField('./locked').getValue();
                // alert(locked);
                // if(locked==true) {
        // dialog.form.findField('./contentType').disable();
                // }
    },
    
    loadContentTypes: function(path, record) {
                // TODO: Define content types using Tempplate and Component
                // Nice to have...all these defined within
				// "/etc/dupont/phoenix/contenttypes"
                // and share by all components and templates...
                var options = [
                                                                                   {value:"industry",text:"Industries"},
                               {value:"subindustry",text:"Sub Industries"},
                               {value:"productcatgroup",text:"Product and Service Category Groups"},
                               {value:"productcat",text:"Product and Service Categories"},
                               {value:"brand",text:"Brands"},
                               {value:"subbrand",text:"Sub Brands"},
                               {value:"product",text:"Product and Service Details"},
                               {value:"subproduct",text:"Sub Product and Service Details"},
                               {value:"usesapplication",text:"Uses and Applications"},
                               {value:"article",text:"Articles"},
                               {value:"event",text:"Events"},
                               {value:"casestudy",text:"Case Studies"},
                               {value:"pressrelease",text:"Press Releases"},
                               {value:"video",text:"Videos"},
                               {value:"newsletter",text:"Newsletters"},
                               {value:"corporatecontent",text:"Corporate Content"},
                               {value:"corporatesubcontent",text:"Corporate Sub Content"},
                               {value:"corporatesubsubcontent",text:"Corporate Sub Sub Content"},
                               {value:"corporatecontentdetail",text:"Corporate Content Detail"},
                               {value:"corporatecontentvideodetail",text:"Corporate Content Video Detail"}];
                // return options;
                var ret = [];
                var recommendedContentType=null;
                var recommendedContentTypeField = this.findParentByType('form').find('name', './recommendedContentTypes')[0];
                if(recommendedContentTypeField!=null) {
                                recommendedContentType = recommendedContentTypeField.getValue();
                }
                if(recommendedContentType!=null && recommendedContentType!="") {
                                var cTypes = recommendedContentType.split(",");
                                for(var i=0; i < options.length; i++) {
                                                var option = options[i];
                                                for(var j=0; j < cTypes.length; j++) {
                                                                var rOption = cTypes[j];
                                                                if(option.value==rOption) {
                                                                                ret.push(option);
                                                                                break;
                                                                }
                                                }
                                }
                                return ret;
                } else {
                var locked = this.findParentByType('form').find('name', './locked')[0].getValue();             
                if(locked || locked=="true") {
                this.disable();
                }
                }
                return options;
    },

    loadMCContentTypes: function(path, record) {

                // TODO: Define content types using Tempplate and Component
                // Nice to have...all these defined within
				// "/etc/dupont/phoenix/contenttypes"
                // and share by all components and templates...
                var options = [
                               {value:"pressrelease",text:"Press Releases"},
                               {value:"presskit",text:"Press Kit"}, 
                               {value:"mcdailynews",text:"MC Daily News"}]; 
                // return options;
                var ret = [];
                var recommendedContentType=null;
                var recommendedContentTypeField = this.findParentByType('form').find('name', './recommendedContentTypes')[0];
                if(recommendedContentTypeField!=null) {
                                recommendedContentType = recommendedContentTypeField.getValue();
                }
                if(recommendedContentType!=null && recommendedContentType!="") {
                	var cTypes = recommendedContentType.split(",");
                    	for(var i=0; i < options.length; i++) {
                        	var option = options[i];
                            for(var j=0; j < cTypes.length; j++) {
                            	var rOption = cTypes[j];
                                if(option.value==rOption) {
                                	ret.push(option);
                                    break;
                                }
                            }
                        }
                    return ret;
                } else {
                var locked = this.findParentByType('form').find('name', './locked')[0].getValue();             
                if(locked || locked=="true") {
                this.disable();
                }
                }
                return options;
    },

    isPageLandingPage: function(page) {
    	// alert("isPageLandingPage"+page);
		var isLandingPage = false;
        try {
        	var evalPage = CQ.shared.HTTP.eval(page+'/jcr:content.0.json');
            // alert(evalPage.toString());
            for (prop in Object(evalPage))
            {
            	// alert(prop);
                if(prop == 'sling:resourceType')
                {
                	// alert(evalPage[prop]);
					console.log('resourceType:'+evalPage[prop]);
                   	if(evalPage[prop] == 'dupont/phoenix/components/responsive/pages/mcLandingPage')
                   	{
                     	isLandingPage = true;
                        break;
                   	}
               	}
            }

		} catch(err) { }
        return isLandingPage;
	},

    validateLPTemplate: function(field){
        // Dupont.contentTypes.init();
		var pageSelected = field.getValue();
		var tabPanel = field.findParentByType('tabpanel');
        if(pageSelected!=null && pageSelected!='') {
			var isLandingPage = Dupont.contentTypes.isPageLandingPage(pageSelected);
            //alert("validateLPTemplate"+isLandingPage);
            if(!isLandingPage) {
            	return(false, 'Please select a Media Center Landing Page');
			}

       	}
        //alert("MM");
	}
};
