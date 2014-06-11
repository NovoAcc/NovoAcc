/*************************************************************************

 * from Adobe Systems Incorporated.
 **************************************************************************/
CQ.scene7 = CQ.scene7 || {};

CQ.scene7.videoViewer = CQ.scene7.videoViewer || {};

CQ.scene7.videoViewer.jsInitialized = false;

CQ.scene7.videoViewer.jsInjectCompleted = false;

CQ.scene7.videoViewer.defaultUniversalVideoConfig = {
    "android":"600",
    "android3":"1200",
    "desktop":"flashas3x,$contentRoot$/Scene7SharedAssets/desktopViewers-AS3/GenericVideo.swf?config=Scene7SharedAssets%2FVideo",
    "type":"UniversalViewer",
    "vt":"VideoVirtual"
};

// the S7 video JS files
CQ.scene7.videoViewer.scene7JS = ["/s7/JavaScript/s7ueUtils.js", "/s7/JavaScript/s7ueViewers.js"];

// S7 embed viewers
CQ.scene7.videoViewer.viewers = CQ.scene7.videoViewer.viewers || {};

// S7 viewers configs
CQ.scene7.videoViewer.configs = CQ.scene7.videoViewer.configs || {};

/**
 * Initializes the S7 video viewer by loading the S7 viewer JS script from the S7 domain
 */
CQ.scene7.videoViewer.initJS = function(scene7Domain) {
    if (!CQ.scene7.videoViewer.jsInitialized) {
        // load the S7 viewer javascript by injecting <script> tags in the head
        for (var i = 0 ; i < CQ.scene7.videoViewer.scene7JS.length ; i++) {
            var s7ScriptUrl = scene7Domain + CQ.scene7.videoViewer.scene7JS[i];
            
            var scriptDOMElm = document.createElement("script");
            scriptDOMElm.setAttribute("type", "text/javascript");    
            scriptDOMElm.setAttribute("language", "javascript");
            scriptDOMElm.setAttribute("src",s7ScriptUrl);
            
            document.getElementsByTagName("head")[0].appendChild(scriptDOMElm);
        }
        
        CQ.scene7.videoViewer.jsInitialized = true;
    }
};

/**
 * Creates the actual video viewer object that was previously configured
 * If the S7 video viewer JS object is not loaded, method will be deferred
 */
CQ.scene7.videoViewer.createViewer = function(viewerId) {
    if (typeof s7uev != "undefined" && s7uev.EmbeddedViewer) {
        // inject JS into S7 viewer code
        CQ.scene7.videoViewer.injectDefaultVideoPresetConfigurationHandler();
        CQ.scene7.videoViewer.viewers[viewerId] =
            new s7uev.EmbeddedViewer(CQ.scene7.videoViewer.configs[viewerId]);
        
    } else {
        setTimeout("CQ.scene7.videoViewer.createViewer(\'"+ viewerId +"\')", 250);
    }
};

/**
 * Initializes and creates a S7 video viewer
 */
CQ.scene7.videoViewer.initializeViewer = function(viewerId, assetPath, preset) {
    if (preset == "") {
        preset = CQ.scene7.videoViewer.getUniversalVideoPreset();
    }
    // create the viewer configuration
    CQ.scene7.videoViewer.configs[viewerId] = {
            assetType: "VIDEO",
            config: preset,
            containerId: viewerId,
            asset: assetPath
        };
    
    // create the viewer for this config
    CQ.scene7.videoViewer.createViewer(viewerId);
};

/**
 * Returns the name of the universal video preset
 */
CQ.scene7.videoViewer.getUniversalVideoPreset = function() {
    var universalVideoPreset = "Universal_Video1";
    if (CQ.scene7.videoPreset.presetResponse) {
        var videoPresetsArray = CQ.scene7.videoPreset.presetResponse;
        for (var i = 0 ; i < videoPresetsArray.length ; i++) {
            var settingsVt = videoPresetsArray[i].settings.vt;
            var presetType = videoPresetsArray[i].type;
            
            if (settingsVt == "VideoVirtual"
                    && presetType == "UniversalViewer") {
                universalVideoPreset = videoPresetsArray[i].name;
                break;
            }
        }
    }
    
    return universalVideoPreset;
};

/**
 * Injects the default configuration handler into the video S7 javascripts
 * Needed for the cases where the default video preset has not been setup on the S7 company
 */
CQ.scene7.videoViewer.injectDefaultVideoPresetConfigurationHandler = function() {

    if (!CQ.scene7.videoViewer.jsInjectCompleted) {
        // change the default s7utils handler do intercept the responsePreset handler
        if (typeof s7ueUtils != "undefined"
                && s7ueUtils.Callback
                && s7ueUtils.Callback.createCall ) {
            var oldCreateCall = s7ueUtils.Callback.createCall;
            
            var newCreateCall = function(url,responseCb,errorCb, scope) {
                
                // check if the handler is the one we're interested in
                var callbackHandlerStr = responseCb.toString();
                if (callbackHandlerStr.indexOf("function responsePreset") >= 0) {
                    var oldResponseCb = responseCb;
                    
                    // overwrite the callback handler
                    responseCb = function(json) {
                        if (typeof json == "undefined"
                                || !json.type) {
                            // if no valid response is found for the current preset, change it with the default one
                            json = CQ.scene7.videoViewer.defaultUniversalVideoConfig;
                        }
                        
                        oldResponseCb.call(this,json);
                    };
                }
                // call the initial method
                oldCreateCall.call(this,url,responseCb,errorCb, scope);
            };
            
            // inject the modified method
            s7ueUtils.Callback.createCall = newCreateCall;
            
            CQ.scene7.videoViewer.jsInjectCompleted = true;
        }
    }
};

CQ.scene7.videoViewer.activateVideoEditDialog = function(panel, dataRecord) {
    
    var universalPresetSelectorArray = panel.find("name", "./universalvideoPreset");
    var cloudNameArray = panel.find("name", "./cloudName");
    var cloudConfigName = "";
    var universalPresetValue = "";
    
    if (typeof cloudNameArray != "undefined"
            && cloudNameArray.length > 0) {
        cloudConfigName = cloudNameArray[0].getValue();
    }
    
    if (dataRecord.data
            && dataRecord.data.universalvideoPreset) {
        universalPresetValue = dataRecord.data.universalvideoPreset;
    }
    
    if (universalPresetSelectorArray.length == 0) {
        // create the universal video preset selector
        var unversalPresetSelector = new CQ.scene7.videoPreset.UniversalVideoPresetSelection({
            "defaultValue": universalPresetValue,
            "fieldLabel": "Universal Video Preset",
            "name": "./universalvideoPreset",
            "type": "select",
            "cloudName": cloudConfigName
        }); 
        
        unversalPresetSelector.setValue(universalPresetValue);
        
        panel.add(unversalPresetSelector);
        
        panel.doLayout();
    }
};