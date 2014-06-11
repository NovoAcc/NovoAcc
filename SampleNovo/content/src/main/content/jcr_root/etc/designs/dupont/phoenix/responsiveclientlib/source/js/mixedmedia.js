if (window.addEventListener){
	  window.addEventListener('load', initS7SDK, false);
}else if (window.attachEvent){
	  window.attachEvent('onload', initS7SDK);
}

function initS7SDK() {
    var mixedMediaViewer = new s7viewers.MixedMediaViewer();
    mixedMediaViewer.setContainerId("s7mixedmedia");
    mixedMediaViewer.setParam("serverurl", s7domain+"/is/image");
    mixedMediaViewer.setAsset(defaultAsset);
    mixedMediaViewer.init();

    /* Mark the first gallery as selected by default.
    $(document).ready(function () {
        $(".mixedmedia li").click(function () {
            $(".mixedmedia li").removeClass("active");
            $(this).addClass("active");

        });
    });*/
}

/*
function fnGalleryMenu(assetName, pagePath) {
    //s7sdk.Util.init();
    // create ParameterManager instance that will handle modifiers
    s7params = new s7sdk.ParameterManager(null, null, {
        "asset": "MediaSet.asset"
    });
    clearBox('s7container');
    container = new s7sdk.Container("container", s7params, "s7container");
    s7swatches = new s7sdk.Swatches("s7container", s7params, "mixedMediaSwatch");
    //s7swatches.addEventListener(s7sdk.AssetEvent.SWATCH_SELECTED_EVENT, swatchSelected, false);
    //s7zoomview = null;
    //s7spinview = null;
    //s7videoplayer = null;
    //videoPreview = null;
    assets = assetName;
    path = pagePath;
    //s7params.init();
    s7params.addEventListener(s7sdk.Event.SDK_READY, initViewer, false);
    s7params.init();

}
*/