package com.dupont.phoenix.workflow.impl.process;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.PersistableValueMap;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.scene7.api.Scene7DAMService;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMException;
import com.day.cq.workflow.WorkflowSession;
import com.day.cq.workflow.metadata.MetaDataMap;
import com.dupont.phoenix.Global;

public class MediaMigrationUtils {
        private static final Logger log = LoggerFactory.getLogger(MediaMigrationUtils.class);
        private static final String PROP_BC_VIDEO_ID="xmpRights:UsageTerms";
        
        /*
         * private constructor.
         */
        private MediaMigrationUtils(){
        	
        }

        //is video player upgrade required within this page
        public static boolean isVideoPlayerMigrationRequired(Page page, Node node) throws RepositoryException {
                boolean validNode = false;
                Resource resource = page.getContentResource();
                //b. check for video player component
                validNode = MigrationUtils.isNodeContainsResType(resource, "dupont/phoenix/components/videoplayer");
                if(validNode) {
                        log.info("Video Player found:"+node.getPath());
                }
                return validNode;
        }
        
        //is image video gallery upgrade required within this page
        public static boolean isVideoGalleryMigrationRequired(Page page, Node node) throws RepositoryException {
                boolean validNode = false;
                Resource resource = page.getContentResource();
                //b. check for video player component
                validNode = MigrationUtils.isNodeContainsResType(resource, "dupont/phoenix/components/videomediagallery");
                if(validNode) {
                        log.info("Video Media Gallery found:"+node.getPath());
                }
                return validNode;
        }

        //is image media gallery upgrade required within this page
        public static boolean isImageGalleryMigrationRequired(Page page, Node node) throws RepositoryException {
                boolean validNode = false;
                Resource resource = page.getContentResource();
                //b. check for video player component
                validNode = MigrationUtils.isNodeContainsResType(resource, "dupont/phoenix/components/imagemediagallery") || 
                                MigrationUtils.isNodeContainsResType(resource, "dupont/phoenix/components/responsive/imagemediagallery");
                
                return validNode;
        }
        
        public static void upgradeMediaComponents(Page page, Node node, WorkflowSession session, MetaDataMap args) 
                        throws RepositoryException, PersistenceException, WCMException {
                if(MediaMigrationUtils.isVideoPlayerMigrationRequired(page, node)) {
                        MediaMigrationUtils.upgradeVideoPlayer(page, node, session);
                }
                if(MediaMigrationUtils.isVideoGalleryMigrationRequired(page, node) || 
                                MediaMigrationUtils.isImageGalleryMigrationRequired(page, node)) {                
                        MediaMigrationUtils.upgradeMediaGallery(page, node, session, args);
                }
        }
        
    public static String getAssetScene7URL(Asset asset) {
            String scene7Url = null;

        // Get the bundle context to get the Service.
        BundleContext bundleContext = FrameworkUtil.getBundle(Scene7DAMService.class).getBundleContext();

        // Get the service using the bundle context.
        Scene7DAMService s7ds =(Scene7DAMService) bundleContext.getService(
                                bundleContext.getServiceReference(Scene7DAMService.class.getName()));
                if (s7ds != null) {
            // Get the scene7 url for the asset.
                        scene7Url =  s7ds.getS7FileReference(asset);
                }
                return scene7Url;
    }
        
        //create required properties for S7 video player
        public static void upgradeVideoPlayer(Page page, Node node, WorkflowSession session) throws RepositoryException, PersistenceException {
                Resource resource = page.getContentResource();
                Resource videoPlayerRes = resource.getResourceResolver().getResource(resource, "videoplayer");
                if(videoPlayerRes!=null) {
                        ValueMap props = videoPlayerRes.adaptTo(ValueMap.class);
                        final String videoPlayerId = props.get("videoPlayer", String.class);
                        //get the video asset from CQ DAM and create fileReference and dam:scene7File property
                        Iterator<Resource> videos = resource.getResourceResolver().findResources(
                                        String.format("/jcr:root/content/dam/assets//*[@jcr:content/metadata/%s='%s']",
                                                        MediaMigrationUtils.PROP_BC_VIDEO_ID,videoPlayerId),"xpath");
                        Resource video = videos!=null? videos.next() : null;
                        if(video!=null) {
                                Resource assetResource = resource.getResourceResolver().getResource(video.getPath());
                                if (assetResource != null) {
                                        Asset asset = assetResource.adaptTo(Asset.class);
                                        if (asset != null) {
                                                String scene7FileStatus = asset.getMetadataValue("dam:scene7FileStatus");
                                                if("PublishComplete".equals(scene7FileStatus)){
                                                        final PageManager pm = resource.getResourceResolver().adaptTo(PageManager.class);
                                                        try {
                                                                pm.createRevision(page);
                                                        } catch (WCMException e) {
                                                                log.error("Error WCMException :", e);
                                                        }
                                                        //String scene7FileNameObj = asset.getMetadataValue("dam:scene7File");
                                                        //replace video player with new S7 based video player
                                        PersistableValueMap pRes = videoPlayerRes.adaptTo(PersistableValueMap.class);
                                        pRes.put(ResponsiveUpgradeConstants.RES_TYPE_PROPS[0], "dupont/phoenix/components/ps7videoplayer");
                                        pRes.put("fileReference", video.getPath());
                                        pRes.put("dam:scene7File", MediaMigrationUtils.getAssetScene7URL(asset));
                                                        pRes.save();
                                                        pRes = resource.adaptTo(PersistableValueMap.class);
                                                        pRes.put("videoPlayerUpgraded", true);
                                                        pRes.save();
                                                }
                                        }
                                }
                        }
                }
        }
        
        //create required properties for image media gallery
        public static void upgradeMediaGallery(Page page, Node node, WorkflowSession session, MetaDataMap args) 
                        throws RepositoryException, PersistenceException, WCMException {
                String galleryType = MigrationUtils.getStringArgByName("galleryType", args);
                //upgrade both galleries in the page
                if(galleryType==null || "not set".equals(galleryType))
                { 
                	galleryType = "videoimage"; 
                }
                log.info("galleryType:"+galleryType);
                Resource resource = page.getContentResource();
                Node contentNode = node.getNode("jcr:content");
                final PageManager pm = resource.getResourceResolver().adaptTo(PageManager.class);
                pm.createRevision(page);
                if(!contentNode.hasNode("mediagallery")) {
                        Node mediaGalleryNode = contentNode.addNode("mediagallery");
                        mediaGalleryNode.setProperty(ResponsiveUpgradeConstants.RES_TYPE_PROPS[0],
                                        "dupont/phoenix/components/responsive/mediagallery");
                        session.getSession().save();
                }
                Resource mediaGalleryRes = resource.getResourceResolver().getResource(resource, "mediagallery");
                PersistableValueMap pRes = mediaGalleryRes.adaptTo(PersistableValueMap.class);
                List<String> sets = MediaMigrationUtils.getMediaGallerySets(page, node, galleryType);
                int setsLen = sets!=null?sets.size():0;
                log.info("sets:"+setsLen);
                if(setsLen > 0) {
                        String[] entries = new String[sets.size()];
                        int i = 0;
                        for(String set : sets) {
                                entries[i] = set;
                                i++;
                        }
                pRes.put("mixmedia", entries);
                        pRes.save();
                }
                pRes = resource.adaptTo(PersistableValueMap.class);
                if(MediaMigrationUtils.isVideoGalleryMigrationRequired(page, node) 
                                && ("video".equals(galleryType) || "videoimage".equals(galleryType))) {
                        pRes.put("videoMediaGalleryUpgraded", true);
                }
                if(MediaMigrationUtils.isImageGalleryMigrationRequired(page, node) 
                                && ("image".equals(galleryType) || "videoimage".equals(galleryType))) {
                        pRes.put("imageMediaGalleryUpgraded", true);
                }                
                pRes.save();
        }
        
        public static List<String> getVideoGallerySets(Page page, Node node, String galleryType) throws RepositoryException {
            List<String> retList = new ArrayList<String>();
            Resource resource = page.getContentResource();
            ValueMap pageProps = page.getProperties();
            Boolean isVideoGalleryUpgraded = Global.getBooleanPropValue(pageProps, "videoMediaGalleryUpgraded"); 
            if(isVideoGalleryUpgraded || (MediaMigrationUtils.isVideoGalleryMigrationRequired(page, node)
                            && ("video".equals(galleryType) || "videoimage".equals(galleryType)))) {
                Resource videoPlayListRes = resource.getResourceResolver().getResource(resource, "videomediagallery");
                if(videoPlayListRes!=null) {
                    ValueMap props = videoPlayListRes.adaptTo(ValueMap.class);
                    final String[] videoPlayLists = props.get("videoPlaylistID", String[].class);
                    for(String videoPlayListID: videoPlayLists) {
                        String playListPath = String.format("/etc/dupont/phoenix/videoplaylists/%s",videoPlayListID);
                        Resource videoPlayList = resource.getResourceResolver().getResource(playListPath);
                        if(videoPlayList!=null) {
                            Resource mediaGalleryRes = resource.getResourceResolver().getResource(resource, "mediagallery");
                            Resource playListCntRes = resource.getResourceResolver().getResource(videoPlayList,"jcr:content");
                            if(mediaGalleryRes != null && playListCntRes != null) {
                            	retList.add(MediaMigrationUtils.getSetItem(page, playListCntRes, "videos"));
                            }
                        }
                    }
                }
            }
            return retList;
        }

        public static List<String> getImageGallerySets(Page page, Node node, String galleryType) throws RepositoryException {
            List<String> retList = new ArrayList<String>();
            Resource resource = page.getContentResource();
            ValueMap pageProps = page.getProperties();
            Boolean isImageGalleryUpgraded = Global.getBooleanPropValue(pageProps, "imageMediaGalleryUpgraded"); 
            if(isImageGalleryUpgraded || (MediaMigrationUtils.isImageGalleryMigrationRequired(page, node)
                            && ("image".equals(galleryType) || "videoimage".equals(galleryType)))) {
                    Resource imageGalleryRes = resource.getResourceResolver().getResource(resource, "imagemediagallery");
                    if(imageGalleryRes!=null) {
                            ValueMap props = imageGalleryRes.adaptTo(ValueMap.class);
                        final String[] selectedGalleries = props.get("selectedGallery", String[].class);
                        for(String selectedGallery:selectedGalleries) {
                                final Resource selectedGalleryRes = resource.getResourceResolver().getResource(
                                                String.format("/%s/%s",selectedGallery,"jcr:content"));
                                if(selectedGalleryRes!=null) {
                    retList.add(MediaMigrationUtils.getSetItem(page, selectedGalleryRes,"images"));
                                }
                        }
                    }
            }
            return retList;
    }
        
        public static List<String> getMediaGallerySets(Page page, Node node, String galleryType) throws RepositoryException {
            List<String> retList = new ArrayList<String>();
            String firstGallery = Global.getFirstGallery(page);
            if(firstGallery!=null && "videomediagallery".equals(firstGallery)) {
            	retList.addAll(MediaMigrationUtils.getVideoGallerySets(page, node, galleryType));
            	retList.addAll(MediaMigrationUtils.getImageGallerySets(page, node, galleryType));
            } else {
            	retList.addAll(MediaMigrationUtils.getImageGallerySets(page, node, galleryType));                	
            	retList.addAll(MediaMigrationUtils.getVideoGallerySets(page, node, galleryType));
            }
            return retList;
        }
        
        public static String getSetItem (Page page, Resource galleryRes, String folder) { 
                final ValueMap galleryProps = galleryRes.adaptTo(ValueMap.class);
                final String setName = galleryProps.get("sling:alias", String.class);
                final String title = galleryProps.get("jcr:title", String.class);
                final String path = galleryProps.get("redirectTarget", String.class);
                final JSONObject setObj = new JSONObject();
                try {
                        log.info("Inside getSetItem");
                        setObj.put("mediaSetPath", path == null ?  MediaMigrationUtils.getMediaSetPath(page, folder) : path);
            setObj.put("mediaSetTitle", title == null ? "" : title);
            setObj.put("mediaSetLink", MediaMigrationUtils.getS7SetName(title, setName));
                } catch (JSONException e) {
                	 log.error("Error JSONException :", e);
                }
                return setObj.toString();                
        }
        
        public static String getS7SetName(final String title, final String name) {
                return name == null ? String.format("%s", title == null ? "" : title)
                                : name.replaceFirst("eidupont/", "");
        }
        
        public static String getMediaSetPath(Page page, String folder) {
                Page sitePage = page.getAbsoluteParent(1);
                String path = sitePage!=null? StringUtils.replace(page.getPath(), sitePage.getPath(), "") : page.getPath();
                path = StringUtils.replace(path, String.format("/%s",StringUtils.lowerCase(Global.getLangCountryCode(page))), "");
                path = StringUtils.replace(path, "/home","");
                path = StringUtils.replace(path, StringUtils.substringAfterLast(path, "/"), "");
                int index = nthOccurrence(path,'/', 2);
                path = path.substring(0, index) + "/";
                if(StringUtils.isEmpty(path)){
                	path = "/content/dam/assets";
                }else{
                	path = String.format("/content/dam/assets%s%s", path , folder);
                }
                //return path==null ? "/content/dam/assets" : String.format("/content/dam/assets%s%s", path , folder);
                return path;
        }
        
        public static int nthOccurrence(String str, char c, int count) {
            int pos = str.indexOf(c, 0);
            while (count-- > 0 && pos != -1)
            {
                pos = str.indexOf(c, pos+1);
            }
            return pos;
        }
}
