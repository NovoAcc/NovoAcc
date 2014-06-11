//---------------------------------------------
//  featuredy JS
//---------------------------------------------
 Dupont.featuredy = {
    showHidePDFTitleDisc : function(field, value) {  

    var tabPanel = field.findParentByType('tabpanel');
    var dialog = field.findParentByType("dialog");  
    var content = dialog.form.findField("./contenttype").getValue();  
    var pdfTitleDisc = tabPanel.findByType('dialogfieldset')[0];  
    var pdfTitle = pdfTitleDisc.findByType('textfield')[0];
    var pdfDisc = pdfTitleDisc.findByType('textarea')[0];  

        pdfTitleDisc.hide();
        pdfTitle.allowBlank = true;  
        pdfDisc.allowBlank = true;  
       if (content=="pdf") {   
	        pdfTitleDisc.show();
            pdfTitle.allowBlank = false; 
            pdfDisc.allowBlank = false; 
	    }
		tabPanel.doLayout();  
    },
	
 validateFerturedyContent: function(field) {
       	var tabPanel = field.findParentByType('tabpanel');
        var contentTypeSelected = tabPanel.find('type','select')[0];  
        var show = contentTypeSelected.getValue();
        var pageSelected = field.getValue();
      
       if(pageSelected!=null && pageSelected!='') {    
			var contentTypeSelectedPage = Dupont.featuredy.isPageSelectedContentPage(pageSelected,show);
           if(!contentTypeSelectedPage) { 
       			    	//tabPanel.manageTabs('contentPath',false);        
			    	return(false, 'Content Path should be match with Content Type.'); 
			    }
       }
	    return(true);
    },

 initFeaturedy: function(field, rec, path) {
    	var panel = field.findParentByType('panel');
    	var tabPanel = field.findParentByType('tabpanel');
    	var contentTypeSelected = tabPanel.find('type','select')[0];	
 		var show = contentTypeSelected.getValue();
	    var pdfData = tabPanel.findByType('dialogfieldset')[0];
	    var pdfTitle = pdfData.findByType('textfield')[0];
        var pdfDisc = pdfData.findByType('textarea')[0]; 
    	var showTab = contentTypeSelected.getValue();
    	    pdfTitle.allowBlank = false; 
            pdfDisc.allowBlank = false;

        if(showTab != 'pdf'){
        	 pdfTitle.allowBlank = true; 
             pdfDisc.allowBlank = true; 
          pdfData.hide(); } 
   	      panel.doLayout();
    	  field.findParentByType('tabpanel').manageTabs(showTab,true);
    }, 
	
 isPageSelectedContentPage: function(page,contentType) {
		var isValidContentPage = false;
        var urlSuffix= page.substring(page.lastIndexOf('.') + 1, page.length);
    	try {
            
            var evalCmp = CQ.shared.HTTP.eval(page+'/jcr:content.0.json');
          
			for (prop in Object(evalCmp)) { 
				if(prop = 'sling:resourceType' ) { 
					console.log('resourceType:'+evalCmp[prop]);  
               
			  		if(evalCmp[prop] == 'dupont/phoenix/components/responsive/pages/mcvideodetail' &&contentType =='mediavideo') {
			  			isValidContentPage = true;  
			  		} 
                   else if(evalCmp[prop] == 'dupont/phoenix/components/responsive/pages/mcimagedetail' &&contentType =='mediaimage') {
			  			isValidContentPage = true;
			  		}
                    else if(evalCmp[prop] == 'dupont/phoenix/components/responsive/pages/mcaudiodetail' &&contentType =='mediaaudio') {
			  			isValidContentPage = true;  
			  		}  
                  
                     else if(contentType =='pdf' && urlSuffix=='pdf') {   
			  			isValidContentPage = true;  
			  		}  
			  	}	 
			}
		} catch(err) { }
		return isValidContentPage;
	}
};