package com.dupont.phoenix.commons;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.PersistableValueMap;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.scene7.api.Scene7DAMService;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.Global;


/**
 * Provides convenience methods for displaying images.
 */
public class Scene7Image extends Image {

	
	private static final Logger logger = LoggerFactory.getLogger(Scene7Image.class);
	//private SlingScriptHelper sling=null;
	public static final String PROP_SCENE7_URL = "dam:scene7URL";
	
	/**
	 * Use this just to get the scene7 URL.
	 * @param resource
	 */
    public Scene7Image(Resource resource) {
        super(resource);
    }

    public Scene7Image(Resource resource, String imageName) {
        super(resource, imageName);
    }

    /**
     * Use this to create scene7 URL within the target resource.
     * @param resource
     * @param slingRequest
     */
    public Scene7Image(Resource resource, SlingHttpServletRequest slingRequest) {
        super(resource);
        if(Global.isEdit(slingRequest)) {
        	createScene7Prop();
        }
    }

    public Scene7Image(Resource resource, String imageName, SlingHttpServletRequest slingRequest) {
        super(resource, imageName);
        if(Global.isEdit(slingRequest)) {
        	createScene7Prop();
        }
    }
    
    @Override
    protected Map<String, String> getImageTagAttributes()
    {
      Map<String,String> attributes = super.getImageTagAttributes();
      
      String scene7Src = getScene7ImageSrc();      
      if (scene7Src != null) {
        attributes.put("src", scene7Src);
        
        //remove width and height attributes
        attributes.remove("width");
        attributes.remove("height");
      }
      
      //remove some of the attributes that are not needed
      //TODO: find out which attributes are not needed..
      
      return attributes;
    }
    
    @Override
    public boolean hasContent() {
    	if(getScene7ImageSrc()!=null) {
    		return true;
    	}
    	return super.hasContent();
    }
    
    /**
     * Get Scene7 URL for a given Asset
     * @param asset
     * @return
     */
    private String getAssetScene7URL(Asset asset) {
    	String scene7Url = null;
		BundleContext bundleContext = FrameworkUtil.getBundle(Scene7DAMService.class).getBundleContext();
		Scene7DAMService s7ds =(Scene7DAMService) bundleContext.getService(
				bundleContext.getServiceReference(Scene7DAMService.class.getName()));
		if (s7ds != null) {
			scene7Url =  s7ds.getS7FileReference(asset);
		}
		return scene7Url;
    }
    
    public void createScene7Prop() {
    	Resource resource = getResource();
    	if(resource != null) {
    		// Delete property for scene7 everytime the image changes.
    		try {
                PersistableValueMap props = resource.adaptTo(PersistableValueMap.class);
                if(props!=null){
                	props.remove(Scene7Image.PROP_SCENE7_URL);
	        	props.save();
                }
            } catch (Exception e) {
                logger.error("Unable to delete scene7URL prop ", e);
            }
    		
    		//create prop again if new image is in scene7
    		if (isAssetInScene7()) {
    			String scene7AssetURL = getAssetScene7URL(getAsset()); 
	    		if(scene7AssetURL!=null) {
		            try {
		                PersistableValueMap props = resource.adaptTo(PersistableValueMap.class);
		                if(!StringUtils.equals(scene7AssetURL, props.get(Scene7Image.PROP_SCENE7_URL, String.class))) {
			                props.put(Scene7Image.PROP_SCENE7_URL, scene7AssetURL);
			                props.save();
		                }
		            } catch (Exception e) {
		                logger.error("Unable to save scene7URL prop " + scene7AssetURL, e);
		            }
	    		}
    		}
    	}
    }
    
    private boolean isAssetInScene7() {
		if (getResource()!=null && getFileReference().length() > 0) {			
		    Asset asset = getAsset();
		    if(asset != null) {
		        String id = asset.getMetadataValue("dam:scene7ID");
		        String publishStatus = (!("".equals(asset.getMetadataValue("dam:scene7FileStatus"))) ? 
		        		asset.getMetadataValue("dam:scene7FileStatus"):"PublishComplete");	        
		        if ("".equals(id) || !("PublishComplete".equals(publishStatus) || 
		        		"PublishQueued".equals(publishStatus))) {
		            return false;	            
		        } else {
		        	return true;
		        }
		    }
		}
		return false;
    }
    
    private Asset getAsset() {
		Resource imageResource = getResource().getResourceResolver().getResource(getFileReference());
	    return (imageResource!=null ? imageResource.adaptTo(Asset.class) : null);
    }
    
    /**
     * Build Scene7 Image request URL    
     * @return
     */
	public String getScene7ImageSrc() {
		String imageSrc = getS7ImageSrc();
		if(StringUtils.isNotBlank(imageSrc) && StringUtils.isNotBlank(get(Image.PN_HTML_WIDTH)) 
				&& StringUtils.isNotBlank(get(Image.PN_HTML_HEIGHT))){
			imageSrc = String.format("%s?fit=stretch,1&wid=%s&hei=%s",imageSrc,
					get(Image.PN_HTML_WIDTH), get(Image.PN_HTML_HEIGHT));		        		
		}
		return imageSrc;
	} 
	

	public String getS7ImageSrc() {
		String imageSrc=null;
		Resource resource = getResource();
		if(resource!=null) {
			ValueMap props = resource.adaptTo(ValueMap.class);
			if(props!=null && props.containsKey(Scene7Image.PROP_SCENE7_URL)) {
				imageSrc = props.get(Scene7Image.PROP_SCENE7_URL,String.class);
			}
		}
		if (StringUtils.isBlank(imageSrc) && isAssetInScene7()) {
		    imageSrc = getAssetScene7URL(getAsset());
		}
		return imageSrc;
	} 
}
