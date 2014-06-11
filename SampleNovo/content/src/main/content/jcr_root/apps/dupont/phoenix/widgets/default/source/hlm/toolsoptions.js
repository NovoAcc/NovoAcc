//------------------------------------------------------------------------------
//  All Dupont Tools (Callouts) as list options
//------------------------------------------------------------------------------
Dupont.hlm.allToolsOptions = function(path, record) {
    // do something with the path or record
    //alert("test");
    //alert(record);
     var allTools = CQ.utils.WCM.getPagePath() + "/_jcr_content.hlmallToolsOptions.json";
     var options = CQ.HTTP.eval(CQ.HTTP.get(allTools));
     if (options) {
        return options;
     }
};

Dupont.hlm.allowedToolsOptions = function(path, record) {
    var pagePath = CQ.utils.WCM.getPagePath()
            + "/_jcr_content.toolsoptions.json";
    try {
        var options = CQ.HTTP.eval(CQ.HTTP.get(pagePath));
        if (options)
            return options;
    } catch (e) {
        CQ.Log.error("Dupont.hlm.allowedToolsOptions failed: " + e.message);
    }
    return [];
};

Dupont.tools.allMegaTrendOptions = function(path, record) {

	try {
        var pagePath = CQ.utils.WCM.getPagePath() + "/_jcr_content.megatrends.json";
        var options = CQ.HTTP.eval(CQ.HTTP.get(pagePath));
        if (options) {
            return options;
        }
    } catch(e) {
         CQ.Log.error("Dupont.megatrends failed: " + e.message);
    }
    return [];
};

Dupont.imageGalleryOptions = function(path, record) {
    try {
        var pagePath = CQ.utils.WCM.getPagePath() + "/_jcr_content.imagegallerysets.json";
        var options = CQ.HTTP.eval(CQ.HTTP.get(pagePath));
        if (options) {
            return options;
        }
    } catch(e) {
         CQ.Log.error("Dupont.imageGalleryOptions failed: " + e.message);
    }
    return [];
};
