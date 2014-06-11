package com.dupont.phoenix.commons;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.query.Query;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.scene7.api.S7Config;
import com.day.cq.dam.scene7.api.S7ConfigResolver;
import com.dupont.phoenix.Global;

public  class AssetProperties {

    private static final String JCR_ROOT = "/jcr:root";

    private static final String DC_DESCRIPTION = "dc:description";

    private static final String DC_TITLE = "dc:title";

    private static final String SCENE7_FILE_PROP = "dam:scene7File";

    private static final String FILE_REFERENCE = "fileReference";

    private static final String IMAGESET_NODE = "imageset";

    static final String DESC = "desc";
    static final String TITLE = "title";


    private static final Logger logger = LoggerFactory.getLogger(AssetProperties.class);

    private String assetsTargetPath;
    private Resource resource;
    private String imageGalleryPath = null;

    public AssetProperties(Resource resource,S7ConfigResolver s7ConfigResolver,String imageGalleryPath)
    {
        this.resource =resource;
        String s7Path = Global.getDefaultScene7ConfigPath(resource);
        logger.info("Asset Properties Constructor:" +s7Path);
        S7Config s7config =s7ConfigResolver!=null? s7ConfigResolver.getS7Config(s7Path):null;
        if(s7config!=null && s7Path!=null && !("").equals(s7Path))
        {
            assetsTargetPath = s7config.getTargetPath();
            // Remove / from end
            if (assetsTargetPath.charAt(assetsTargetPath.length() - 1)=='/'){
                assetsTargetPath = assetsTargetPath.substring(0,assetsTargetPath.length()-1);
            }
        }
        this.imageGalleryPath = imageGalleryPath;
    }

    /**
     *
     * @param assetName
     * @param galleryName
     * @return map of image metadata(title, description)
     */
    public Map<String,String> processImageMetadata(String assetName,String galleryName)
    {
        ResourceResolver resolver = resource.getResourceResolver();
        Iterator<Resource> resourceIterator = null;
        Map<String, String> map = null;
//		Style imageGalleryStyle = Global.getSiteConfigStyle(resource).getSubStyle("imagegallery");
//		String imageGalleryPath = imageGalleryStyle!=null ?imageGalleryStyle.get("imageGalleryFolderPath", String.class) : null;

        logger.info("Full ImageGalleryPath: " + imageGalleryPath);
        // Split the full path to get root path of site. For e.g. /content/abc
        if(null!=imageGalleryPath && !("").equals(imageGalleryPath))
        {
            String paths[]= imageGalleryPath.split("/");
            if(paths.length>=3)
            {
                imageGalleryPath = "/" + paths[1] + "/" + paths[2];
            }
        }
        logger.info("Image Gallery Path: " + imageGalleryPath);
        if(null!=imageGalleryPath && !("").equals(imageGalleryPath))
        {
            final StringBuilder queryString = new StringBuilder( )
                    .append(JCR_ROOT)
                    .append(imageGalleryPath)
                    .append("//element(*,cq:PageContent)");
            String options = "[@sling:alias='" + galleryName + "']";

            queryString.append(options);
            logger.info("Image Gallery Query : " + queryString.toString());
            resourceIterator =  resolver.findResources(StringUtils.trim(queryString.toString()),Query.XPATH);
            if(resourceIterator!=null && resourceIterator.hasNext())
            {
                Resource res = resourceIterator.next();
                logger.info("Image Gallery found.." + res);
                String galleryPath = res.getPath();
                // Iterating images in Image gallery to match current image
                if(galleryPath!=null)
                {
                    //String path = galleryPath + "/" + "jcr:content";
                    Resource rootRes = this.resource.getResourceResolver().getResource(galleryPath);
                    if(rootRes != null)
                    {
                        Node pageNode = rootRes.adaptTo(Node.class);
                        try {
                            if (pageNode != null && pageNode.hasNode(IMAGESET_NODE)) {
                                Node node = pageNode.getNode(IMAGESET_NODE);
                                NodeIterator itr = node != null && node.hasNodes() ? node.getNodes() : null;
                                if (itr != null) {
                                    while (itr.hasNext()) {
                                        Node imageNode = itr.nextNode();
                                        Resource imageResource = resolver.getResource(imageNode.getPath());
                                        if(imageResource!=null) {
                                            ValueMap properties = imageResource.adaptTo(ValueMap.class);
                                            if(properties!=null && properties.containsKey(FILE_REFERENCE) && properties.get(FILE_REFERENCE,String.class)!=null) {
                                                String assetDamRef = properties.get(FILE_REFERENCE,String.class);
                                                logger.info("assetDamRef : " + assetDamRef);
                                                Resource assetResource = resolver.getResource(assetDamRef);
                                                if (assetResource != null) {
                                                    logger.info("assetName : " + assetName);
                                                    Asset asset = assetResource.adaptTo(Asset.class);
                                                    if (asset != null) {
                                                        String s7file = asset.getMetadataValue(SCENE7_FILE_PROP);
                                                        logger.info("s7file : " + s7file);
                                                        if(s7file!=null && assetName.equals(s7file))
                                                        {
                                                            map = new HashMap<String, String>();
                                                            String imageDescription ="";
                                                            String imageTitle = "";
                                                            try {
                                                                // it might happen that the adobe xmp lib creates an array
                                                                Object titleObj = asset.getMetadata(DC_TITLE);
                                                                Object descObj = asset.getMetadata(DC_DESCRIPTION);

                                                                if (titleObj instanceof Object[]) {
                                                                    Object[] titleArray = (Object[]) titleObj;
                                                                    imageTitle = (titleArray.length > 0) ? titleArray[0].toString() : "";
                                                                } else {
                                                                    imageTitle = titleObj.toString();
                                                                }

                                                                if (descObj instanceof Object[]) {
                                                                    Object[] descArray = (Object[]) descObj;
                                                                    imageDescription = (descArray.length > 0) ? descArray[0].toString() : "";
                                                                } else {
                                                                    imageDescription = descObj.toString();
                                                                }
                                                            }

                                                            catch (Exception e) {
                                                                logger.error("Exception :",e);
                                                                imageTitle = asset.getMetadataValue(DC_TITLE);
                                                                imageDescription = asset.getMetadataValue(DC_DESCRIPTION);
                                                            }

                                                            map.put(TITLE, StringEscapeUtils.escapeHtml(imageTitle));
                                                            map.put(DESC, StringEscapeUtils.escapeHtml(imageDescription));
                                                            logger.info("Asset Found!" + imageDescription +imageTitle );
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (RepositoryException repository) {
                            logger.error("Exception :",repository);
                        }
                    }
                }
            }
        }
        return map;
    }
    /**
     *
     * @param assetPath
     * @return map of video metadata (title, description)
     */
    public Map<String,String> processVideoMetadata(String assetPath)
    {
        String assetName = assetPath.substring(assetPath.lastIndexOf('/')+1);
        // For e.g. Safety-GFX-Protecting-What-Matters-Most-BRP-h264.mp4
        if(assetName.lastIndexOf('.')>0)
        {
            assetName = assetName.substring(0,assetName.lastIndexOf('.'));
        }
        ResourceResolver resolver = resource.getResourceResolver();
        Iterator<Resource> resourceIterator = null;
        Map<String, String> map = null;
        logger.info("Asset Target Path : " +assetsTargetPath);
        // Query to search video in cq5 dam
        if(null!=assetsTargetPath && !("").equals(assetsTargetPath))
        {
        	 final StringBuilder queryString = new StringBuilder( )
             .append(JCR_ROOT)
             .append(assetsTargetPath)
             .append("//element(*,nt:unstructured)");
        	 String options = "[(@dam:scene7Name='" + assetName + "') or (@dam:scene7Name='" + assetName+"-AVS')]";
        	 queryString.append(options);

            
            logger.info("Asset Metadata Query : " + queryString.toString());
            resourceIterator =  resolver.findResources(StringUtils.trim(queryString.toString()),Query.XPATH);
            if(resourceIterator!=null && resourceIterator.hasNext())
            {
            	while(resourceIterator.hasNext()){
            		Resource res = resourceIterator.next();
                    logger.info("Asset found.." + res);
                    String assetDamRef = res.getPath();
                    if(assetDamRef!=null)
                    {
                        Resource assetResource = resolver.getResource(assetDamRef);
                        if (assetResource != null) {
                            Asset asset = assetResource.getParent().getParent().adaptTo(Asset.class);
                            if (asset != null) {
                                map = new HashMap<String, String>();

                                String videoTitle = "";
                                String videoDescription = "";

                                try {
                                    Object assetTitle = asset.getMetadata(DC_TITLE);
                                    // it might happen that the adobe xmp lib creates an array
                                    if (assetTitle instanceof Object[]) {
                                        Object[] titleArray = (Object[]) assetTitle;
                                        videoTitle = (titleArray.length > 0) ? titleArray[0].toString() : "";
                                    } else {
                                        videoTitle = assetTitle.toString();
                                    }

                                } catch (Exception e) {
                                    logger.error("Exception :",e);
                                    videoTitle = asset.getMetadataValue(DC_TITLE);
                                }

                                try {
                                    Object assetDescription = asset.getMetadata(DC_DESCRIPTION);
                                    if (assetDescription instanceof Object[]) {
                                        Object[] descriptionArray = (Object[]) assetDescription;
                                        videoDescription = (descriptionArray.length > 0) ? descriptionArray[0].toString() : "";
                                    } else {
                                        videoDescription = assetDescription.toString();
                                    }
                                }
                                catch (Exception e) {
                                    logger.error("Exception :",e);
                                    videoDescription = asset.getMetadataValue(DC_DESCRIPTION);
                                }

                                map.put(TITLE, StringEscapeUtils.escapeHtml(videoTitle));
                                map.put(DESC, StringEscapeUtils.escapeHtml(videoDescription));
                            }
                        }
                    }
            	}
            	
                
            }
        }
        return map;
    }
}
