<%--  Scene7 Video Components    --%>
 <%@page session="false"
    import="java.net.URLEncoder,java.util.Locale,
            java.util.ResourceBundle,com.day.cq.dam.api.Asset,
					com.day.cq.i18n.I18n,
					com.day.cq.wcm.api.WCMMode,
					com.day.cq.wcm.api.components.DropTarget,
                    com.day.cq.wcm.webservicesupport.Configuration,
                    com.day.cq.wcm.webservicesupport.ConfigurationManager,
                    org.apache.sling.api.SlingHttpServletRequest,
                    org.apache.sling.api.resource.Resource,
                    org.apache.sling.api.resource.ResourceResolver,
                    org.apache.sling.api.resource.ValueMap,
                    org.apache.sling.commons.json.JSONArray, 
                    com.day.cq.dam.scene7.api.S7Config,
                    com.day.cq.dam.scene7.api.S7ConfigResolver,
                    org.apache.sling.api.resource.PersistableValueMap"
        %>
<%@ page import="org.apache.commons.io.FilenameUtils" %>
<%@ include file="/apps/dupont/phoenix/components/common/global.jsp"%> 
<cq:include script="s7damutils.jsp"/>
<%@include file="s7PageCloudConfig.jsp"%>
<cq:includeClientLib js="cq.scene7.viewer.video"/>
<%
    S7ConfigResolver s7ConfigResolver = sling.getService(S7ConfigResolver.class);

    String configPath = "";
    String cloudName = "";
    String width ="630";
    String height ="315";



    // first try to get the config from the asset
    S7Config s7Config = null;
    if (s7ConfigResolver != null) {
        s7Config = s7ConfigResolver.getS7ConfigForResource(resource);
    } 

    if (s7Config != null) {
        // found asset's config
        configPath = s7Config.getCloudConfigPath();
    } else if( !"".equals(scene7PageCloudConfigPath) ){
        // try to use the config set on the page properties
        configPath = scene7PageCloudConfigPath;
    }

    String[] configPathParts = configPath.split("/");
    cloudName = configPathParts[configPathParts.length - 1]; //grab only the last part for cloud config name

    //Scene7 Video asset has fileReference and contains /e2/ in reference path
    String fileReference = properties.get("fileReference", properties.get("asset", String.class));
    String assetDamRef = properties.get("assetDamRef","" ); 


    //Check the path for Scene7 video. The path should contains /e2/ or /is/image/ to be qualified as Scene7 Video
    boolean s7content = (fileReference != null &&
            (fileReference.indexOf("/e2/") != -1 ||  fileReference.indexOf("/is/image/") != -1));

    if( s7content ){
        int idx = fileReference.indexOf("?");
        if (idx != -1) {
            //Strip all modifiers for only video path
            fileReference = fileReference.substring(0,idx);
        }

        //Strip off extension if any as this breaks the universal viewer
        fileReference = FilenameUtils.removeExtension(fileReference);

       //Scene7 Video Component
        // long origWidth = (long)Double.parseDouble(properties.get("imageWidth","500"));
        // long origHeight = (long)Double.parseDouble(properties.get("imageHeight","500"));
        //  if (origWidth == 0 || origHeight == 0) {
        // origWidth = 500;
        // origHeight = 500;
        // }

        // String width = properties.get("width",properties.get("imageWidth","-1"));
        // String height = properties.get("height",properties.get("imageHeight","-1"));
        // int widthInt = Integer.parseInt(width);
        // int heightInt = Integer.parseInt(height);
        // if(widthInt < 0 && heightInt < 0) {
        // width = "630";
        // height = "315";
        // }
        //else if(widthInt < 0) {
        // width = Long.toString(heightInt * origWidth / origHeight);
        // width = Long.toString(heightInt * origWidth / origHeight);
        // }
        // else if(heightInt < 0) {
        // height = Long.toString(widthInt * origHeight / origWidth);
        //  height = Long.toString(widthInt * origHeight / origWidth);
        //  }

        int domainIndex = fileReference.indexOf("e2/"); //single video contains e2
        int assetIndex = 0;
        if( domainIndex < 0 ){
            domainIndex = fileReference.indexOf("is/image/");//Adaptive video set
            assetIndex = domainIndex + 9;
        }
        else{
            assetIndex = domainIndex + 3;
        }

        String domain = fileReference.substring(0, domainIndex);
        String ref = fileReference.substring(assetIndex);

        String assetPath = ref;
        String company = ref.split("/")[0];

        if (WCMMode.fromRequest(request) == WCMMode.EDIT) {
            // cloudName is onlt a temp for initializing the video preset drop down, needed only in edit mode
            try {
                PersistableValueMap props = resource.adaptTo(PersistableValueMap.class);
                props.put("cloudName", cloudName);
                props.save();
            } catch (Exception e) {
                log.error("Unable to save cloudName " + cloudName, e);
            }
        }

        //Universal Video Preset
        String universalPreset = properties.get("universalVideoPreset", "");
%>
<%@ include file="renderVideo.jsp" %>
<%
} else {
%>
<div class="<%= DropTarget.CSS_CLASS_PREFIX + "video" + (WCMMode.fromRequest(request) == WCMMode.EDIT ? " cq-video-placeholder" : "") %>"></div>
<%
    }
%>

