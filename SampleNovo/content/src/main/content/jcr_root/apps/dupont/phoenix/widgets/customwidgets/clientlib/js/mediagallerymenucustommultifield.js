/**
* @class CQ.Ext.ux.CustomPathFieldWidget
* @extends CQ.form.CompositeField
* This is a custom path field with link text and target
* @param {Object} config the config object
*/
/**
* @class Ejst.CustomWidget
* @extends CQ.form.CompositeField
* This is a custom widget based on {@link CQ.form.CompositeField}.
* @constructor
* Creates a new Media Gallery Menu Custom Multifield.
* @param {Object} config The config object
*/

CQ.Ext.ux.CustomPathFieldWidget = CQ.Ext.extend(CQ.form.CompositeField, {
    
    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    hiddenField: null,
    
    /**
    * @private
    * @type CQ.Ext.form.FormPanel
    */
    formPanel: null,
    
    /**
    * @private
    * @type CQ.Ext.form.Pathfield
    */
    mediaSetPath: null,

    /**
    * @private
    * @type CQ.Ext.form.TextField
    */
    mediaSetTitle: null,

    /**
    * @private
    * @type CQ.Ext.form.ComboBox
    */
    mediaSetLink: null,

    /** private widget variables **/
    /** DAM S7 Target configured folder **/
    targetFolder : null,
    
    /** S7 configuration path **/
    scene7Path : null,
    
    /** S7 root folder **/
    rootFolder : null,
    
    /**
    * @constructor
    * Call : fnSetScene7Path,fnSetTargetAndRoot
    */

    constructor: function (config) {
        this.fnSetScene7Path();
        this.fnSetTargetAndRoot();
        config = config || {};
        var defaults = {
            "border": true,
            "labelWidth": 130,
            "layout": "form"
        };        
        config = CQ.Util.applyDefaults(config, defaults);
        CQ.Ext.ux.CustomPathFieldWidget.superclass.constructor.call(this, config);
    },

    //overriding CQ.Ext.Component#initComponent
    initComponent: function () {
        CQ.Ext.ux.CustomPathFieldWidget.superclass.initComponent.call(this);
        
        this.hiddenField = new CQ.Ext.form.Hidden({
            name: this.name
        });
        this.add(this.hiddenField);

        /* media set pathfield */
        this.mediaSetPath = new CQ.form.PathField({
            cls: "customwidget-3",
            rootPath: this.fnGetTarget(),
            fieldLabel: "Media Gallery Path",
            allowBlank: false,
            editable: false,
            layout:'anchor',
            anchor: '50%',
            listeners: {
                change: {scope: this, fn: this.updateHidden},
                dialogclose : {scope: this, fn: this.pushStoreData}
            }
        });
        this.add(this.mediaSetPath);
        
        /* Media title textfield. */
        this.mediaSetTitle = new CQ.Ext.form.TextField({
            cls: "customwidget-1",
            fieldLabel: "Media Set Title",    
            allowBlank: false,
            layout:'anchor',
            anchor: '50%',
            listeners: {
                change: {scope: this, fn: this.updateHidden}
            }
        });
        this.add(this.mediaSetTitle);

        /* Media set select dropdown */
        this.mediaSetLink = new CQ.Ext.form.ComboBox({
            typeAhead:true,
            allowBlank:false,
            editable: false,
            forceSelection:true,
            triggerAction:'all',
            lastQuery: '',
            cls: "customwidget-2",
            fieldLabel: "Media Set",
            layout:'anchor',
            anchor: '50%',
            mode: 'local',
            store: this.createStore(),
            displayField: 'name',
            valueField: 'name',
            listeners: {
                focus: {scope: this, fn: this.pushStoreData},
                select: {scope: this, fn: this.updateHidden}
            }
        });
        this.add(this.mediaSetLink);
    },
    
    createStore: function () {
        var store = new CQ.Ext.data.JsonStore({
            root: 'hits',
            fields: ['name','path']
        });
        return store;     
    },
    
    pushStoreData: function () {
        var store = this.mediaSetLink.store;
        if (store.data.items.length == 0) {
            var jsondata = this.fnSetOptions();
            this.mediaSetLink.store.loadData(jsondata);
        }  
    },

    processInit: function (path, record) {
        this.mediaSetPath.processInit(path, record);
        this.mediaSetTitle.processInit(path, record);
        this.mediaSetLink.processInit(path, record);
    },

    setValue: function (value) {
        var link = JSON.parse(value);
        this.mediaSetPath.setValue(link.mediaSetPath);
        this.mediaSetTitle.setValue(link.mediaSetTitle);
        this.mediaSetLink.setValue(link.mediaSetLink);
        this.hiddenField.setValue(value);
    },
    
    getValue: function () {
        return this.getRawValue();
    }, 

    getRawValue: function () {
        var link = {
        "mediaSetPath": this.mediaSetPath.getValue(),
        "mediaSetTitle": this.mediaSetTitle.getValue(),
        "mediaSetLink": this.mediaSetLink.getValue()
        };    

        return JSON.stringify(link);
    },
    
    updateHidden: function () {
       this.hiddenField.setValue(this.getValue());
    },

    updateField :function() {
        this.hiddenField.setValue(this.getValue());
        
        // No validation needed since dropdown don't take no text.
        this.fnValidateGallery();
    },

    /**
    * @function	:	fnLoadGallery
    * @info	:	populate list on load of dialog
    * call	:	fnGetGalleryResult,mediaSetLink.setOptions
    * Return	: 	none
    */
    fnLoadGallery : function(galleryPath){
        if(galleryPath != null){
            this.fnGetGalleryResult();
        }
    },
    
    /**
    * @function	:	fnGetMediaSet
    * @info	:	return list if exist else set to null
    * call	:	fnGetGalleryResult
    * Return	: 	results[]
    */
    fnGetMediaSet: function(){
        var results = {};
        if(this.mediaSetPath.getValue() != null) {
            results = this.fnGetGalleryResult();
        }
        else {
            result = null;
        }
        //this.mediaSetLink.setOptions( results );
        return results;
    },
    
    /**
    * @function	:	fnValidateGallery
    * @info	:	validate the selection from populated list and calls charcater encoding
    * call	:	fnGetMediaSet
    * Return	: 	none
    */
    fnValidateGallery : function(){
        var enteredVal = this.mediaSetLink.getValue();
        enteredVal = encodeURIComponent(enteredVal);
        var results = [];
        results = this.fnGetMediaSet();
        for(var counter=0; counter<=results.length; counter++){
            if(counter<results.length){
                var parts =[];
                parts = (results[counter].value).split("/");
                var dropOptions = parts[parts.length - 1];
                if(enteredVal == dropOptions) {
                    break;
                }
            }
            else{
                this.mediaSetLink.setValue("");
                CQ.Ext.MessageBox.alert("Message", "Please select a Valid Gallery.");
            }
        }
    },
    
    /**
    * @function	:	fnSetOptions
    * @info	:	Populate Selection list and calls for validation of the list
    * call	:	fnGetMediaSet,fnValidateGallery
    * Return	: 	results[]
    */
    fnSetOptions : function(){
        var results = {};
        results = this.fnGetMediaSet();
        
        if(this.mediaSetPath.getValue() == null){
            this.mediaSetLink.setValue("");
        }
        
        /*
        if(this.mediaSetLink.getValue() != ""){
            this.fnValidateGallery();
        }*/
        
        return results;
    },
    
    /**
    * @function	:	fnGetRoot
    * @info	:	gatter method for rootFolder
    * call	:	none
    * Return	: 	rootFolder
    */
    fnGetRoot : function(){
        return this.rootFolder;
    },
    /**
    * @function	:	fnGetTarget
    * @info	:	gatter method for targetFolder
    * call	:	none
    * Return	: 	targetFolder
    */
    fnGetTarget : function(){
        return this.targetFolder;
    },
    /**
    * @function	:	fnGetScene7Path
    * @info	:	gatter method for Scene7Path
    * call	:	none
    * Return	: 	scene7Path
    */
    fnGetScene7Path : function(){
        return this.scene7Path;
    },

    /**
    * @function	:	fnGetGalleryResult
    * @info	:	Get JSON responce from scene7 to get gallery list
    * call	:	fnGetTarget,fnGetRoot
    * Return	: 	results[]
    */
    fnGetGalleryResult : function(){
        var results = {};
        
        // If target, root and configuration is setup properly continue...
        if((this.fnGetTarget() != null) && (this.fnGetRoot() != null) && (this.fnGetScene7Path() != "")){
            
            // Get the path to make the call to (S7 server)
            var path = this.mediaSetPath.getValue().replace(this.fnGetTarget(),this.fnGetRoot());
            var requestURL = this.fnGetScene7Path() + "/jcr:content.search.json?path="+
                               path+"&assetType=MediaSet,ImageSet,VideoSet";
            
            // Sync call can be used when creating new fields. We need the options to be available.
            var galleries = CQ.shared.HTTP.eval(CQ.shared.HTTP.get(requestURL));
            results = this.fnFilterResults(galleries);
            
        } 
        return results;
    },
    
    fnFilterResults : function(galleries) {
        var hits = [];
        
        for (var i = 0; i < galleries.hits.length; i++) { 
            var mediaset = {}; 
            mediaset['name'] = galleries.hits[i].name;
            mediaset['path'] = galleries.hits[i].path;
            hits.push(mediaset);
        }
        return {hits: hits};
    },

    /**
    * @function	:	fnSetTargetAndRoot
    * @info	:	Sets Environment target and root folder path taken from Scene7 config
    * call	:	fnSetScene7Path
    * Return	: 	None
    */
    fnSetTargetAndRoot : function(){
        
        // If S7 configuration exist, get the target and root folder
        if(this.fnGetScene7Path() != null && this.fnGetScene7Path() != ""){
            
            // Get the configuration JSON for the S7
            var configurationJson = CQ.HTTP.eval(CQ.HTTP.get(this.fnGetScene7Path() + "/jcr:content.json"));
            var targetFolder = configurationJson.targetPath;
            var rootFolder = configurationJson.rootPath;
            
            // Remove unnecesary stuff from the root folder.
            rootFolder = rootFolder.substring(0,rootFolder.length-1);
            
            // Asign to global variables.
            this.targetFolder = targetFolder;
            this.rootFolder = rootFolder;
        }
    },

    /**
    * @function	:	fnSetScene7Path
    * @info		:	Sets Environment's scene7 path taken from Siteconfig 
    * Return	: 	None
    */
    fnSetScene7Path : function(){
        var scene7Path = "";
        
        // Get the design
        var designObj = CQ.WCM.getDesign(CQ.WCM.getPagePath());
        
        // Verify design exist
        if (designObj != null && typeof (designObj) !== 'undefined') {
            
            // get the siteconfig json URL
            var url = designObj.getPath() + "/jcr:content/siteconfig"
                    + CQ.Sling.SELECTOR_INFINITY + CQ.HTTP.EXTENSION_JSON;
            
            // Add no caching to the url.
            url = CQ.HTTP.noCaching(url);
            
            // Get the resource as JSON object.
            try {
                var res = CQ.HTTP.eval(CQ.HTTP.get(url));
            } catch (e) {
                CQ.Ext.MessageBox.alert("Error", e.message);
            }
        
        } // end if designPath != null
        
        // Get the configuration path
        
        /* Local variable not used.
        var configPath = CQ.shared.HTTP.getPath(res.imagegallery.scene7Config); */
        
        scene7Path = ((res.imagegallery.scene7Config == null)? scene7Path : res.imagegallery.scene7Config );
        this.scene7Path = scene7Path;
   }
});


CQ.Ext.reg('mediagallerymenumultifield',CQ.Ext.ux.CustomPathFieldWidget);

