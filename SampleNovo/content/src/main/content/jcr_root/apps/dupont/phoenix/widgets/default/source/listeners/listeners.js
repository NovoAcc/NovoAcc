//------------------------------------------------------------------------------
//	Define all Dialog Listener here....
//------------------------------------------------------------------------------
var cloneSourcePath="";
Dupont.listeners = {
		
    showHideHLMRowCallout : function(field, value, checked) {
    	var tabPanel = field.findParentByType('tabpanel');
		if (checked) {
			tabPanel.hideTabStripItem(1);
			tabPanel.hideTabStripItem(2);
			tabPanel.hideTabStripItem(3);
	    } else {
	    	tabPanel.unhideTabStripItem(1);
			tabPanel.unhideTabStripItem(2);
			tabPanel.unhideTabStripItem(3);
	    }
		tabPanel.doLayout();
    },
    
    validateHLMRowCallout : function(dialog) {
        var showHideRowCallout = dialog.form.findField('./showHideRowCallout').getValue();
        if(showHideRowCallout==null || showHideRowCallout=="" || !showHideRowCallout) {
            //var linkText = dialog.form.findField('./linkText').getValue();
            //var linkURL = dialog.form.findField('./linkURL').getValue();
            var selectedTool = dialog.form.findField('./selectedTool').getValue();
            if(selectedTool==null || selectedTool=="") {
            	//dialog.form.findField('./linkText').markInvalid("");
                //dialog.form.findField('./linkURL').markInvalid("");
                //dialog.form.findField('./selectedTool').markInvalid("");
            	CQ.Ext.MessageBox.alert("Error", "Please select a Tool.");
            	var tabPanel = dialog.form.findField('./selectedTool').findParentByType('tabpanel');
            	tabPanel.activate(tabPanel.items.get(1));
            	return false;
            }
        }
        return true;
    },
    cloneSource: function(dialog){
        cloneSourcePath=dialog.getValue();
    },
    cloneTags : function(dialog) {

        // Get the source tag.
        var sourcePath = dialog.getValue();

        // Get the parent dialog.
        var parent = dialog.findParentByType('dialog');

        // Search for the tags field.
        var tagfield = parent.form.findField('./cq:tags');

        // Get the tags from the source page and add them to the tagfield.
        CQ.Ext.Ajax.request({
            url: sourcePath + '/jcr:content/cq:tags.json',
            async: true,
            success: function(response){
                var json = CQ.Ext.util.JSON.decode(response.responseText)

                // Get the tags from the tagfield, if any.
                var tagsarray = tagfield.getTags();
                var tagDef = [];

                if(json["cq:tags"].length > 0)
                {
                    /* Remove the current tags*/
                    for (var i = 0; i < tagsarray.length; i++) { 
                        tagfield.removeTag(tagsarray[i]);
                    }                
                    // Get the tags definitions
                    for (var i = 0; i < json["cq:tags"].length; i++) { 
                        tagDef[i] = tagfield.getTagDefinition(json["cq:tags"][i]);
                    }
                    // Add the tags.
                    for (var i = 0; i < tagDef.length; i++) { 
                        tagfield.addTag(tagDef[i],true,true);
                    }
                }
                else
                { 
                    CQ.Ext.MessageBox.alert("Warning", "No tags found on selected page");
                    dialog.setValue(cloneSourcePath);
                }
            },
            failure: function(response){
                var tagsarray = tagfield.getTags();
                for (var i = 0; i < tagsarray.length; i++) { 
                        tagfield.removeTag(tagsarray[i]);
                }
                CQ.Ext.MessageBox.alert("Warning", "No tags found on selected page");
                dialog.setValue(cloneSourcePath);
            }
            }); 
            return false;
    },
    
    updateDAMAssetRef : function(field) {
        var dialog = field.findParentByType("dialog");
        var fileRef = dialog.form.findField("./fileReference");
        var damAssetRef = dialog.form.findField("./assetDamRef");
        if(fileRef != null && damAssetRef != null) {
        	damAssetRef.setValue(fileRef.getValue());
        }
    },
    
    showHideDialogFieldSet :function(field, value, checked) {

    	var panel = field.findParentByType('panel');
		var countrySiteFieldSet = panel.findByType('dialogfieldset')[0];
        var countryContainerFieldSet = panel.findByType('dialogfieldset')[2];

		if (checked) {

			countryContainerFieldSet.show();
			panel.doLayout();

            countrySiteFieldSet.hide();


	    } else {

            countrySiteFieldSet.show();
            panel.doLayout();

            countryContainerFieldSet.hide();
            

	    }

    }
/*
    manageTabsBaseballCard: function(tabpanel,path) {
        var dialog = tabpanel.findParentByType('tabpanel');
        dialog.hideTabStripItem(0);
        dialog.activate(dialog.items.get(1));
         // Get the template.
        CQ.Ext.Ajax.request({
            url: path + '/jcr:content/cq:template.json',
            async: true,
            success: function(response){
                var json = CQ.Ext.util.JSON.decode(response.responseText);
                if(json["cq:template"].indexOf("dssexpert") != -1)
                {
                    dialog.unhideTabStripItem(5);
                    dialog.hideTabStripItem(2);
                    dialog.unhideTabStripItem(3);
                    dialog.unhideTabStripItem(6);
                    dialog.unhideTabStripItem(7);
        //    		dialog.items.get(1).items.get(1).enable();
                }
                else if(json["cq:template"].indexOf("biresidential") != -1)     
                {
                    dialog.unhideTabStripItem(2);
                    dialog.hideTabStripItem(3);
                    dialog.hideTabStripItem(5);
                    dialog.hideTabStripItem(6);
                    dialog.hideTabStripItem(7);
          //          dialog.items.get(1).items.get(1).disable();
                } if(json["cq:template"].indexOf("inclusiveInnovation") != -1)     
                {
                    dialog.hideTabStripItem(2);
                    dialog.hideTabStripItem(5);
                    dialog.hideTabStripItem(6);
                    dialog.hideTabStripItem(7);
          //          dialog.items.get(1).items.get(1).disable();
                }
            },
            failure: function(response){
                CQ.Ext.MessageBox.alert("Warning", "No template found on selected page");
            }
            }); 
    }
*/
};
