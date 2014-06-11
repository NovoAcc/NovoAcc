//------------------------------------------------------------------------------
//  All Dupont Featured Call Out (Callouts) as list options
//------------------------------------------------------------------------------
Dupont.featured.allToolsOptions = function(path, record) {
     var allTools = CQ.utils.WCM.getPagePath() + "/_jcr_content.featuredallToolsOptions.json";
     var options = CQ.HTTP.eval(CQ.HTTP.get(allTools));
     if (options) {
        return options;
     }
};

Dupont.featured.allowedToolsOptions = function(path, record) {
    var pagePath = CQ.utils.WCM.getPagePath()
            + "/_jcr_content.calloutoptions.json";
    try {
        var options = CQ.HTTP.eval(CQ.HTTP.get(pagePath));
        if (options)
            return options;
    } catch (e) {
        CQ.Log.error("Dupont.featured.allowedToolsOptions failed: " + e.message);
    }
    return [];
};