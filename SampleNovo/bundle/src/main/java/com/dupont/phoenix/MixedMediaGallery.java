package com.dupont.phoenix;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;

public class MixedMediaGallery {
	 private static final Logger logger = LoggerFactory.getLogger(MixedMediaGallery.class);
	
    /* <Attributes> */
	
	private ValueMap properties;
	private Resource resource;
	private Page currentPage;
	private String[] mixedMediaItems;
	private String defaultAsset;
	private List<Map<String,String>> mediaList;
	//private String path;
    private String itemTranslatedText;
    private SlingHttpServletRequest slingRequest;
    private ResourceResolver resourceResolver;

    
    private boolean editMode;
    private boolean disabled;
    private boolean itemsAvailable;
   // private boolean singleItem;

    /* </Attributes> */
    
    /* <Constructors> */

	public MixedMediaGallery(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest){
    	
    	this.editMode = (WCMMode.fromRequest(slingRequest) == WCMMode.EDIT);
    	this.disabled = (WCMMode.fromRequest(slingRequest) == WCMMode.DISABLED);
    	this.resource = resource;
    	this.properties = resource.adaptTo(ValueMap.class);
    	this.currentPage = currentPage;
    	this.mediaList = new ArrayList<Map<String,String>>();
    	this.slingRequest = slingRequest;
    	this.resourceResolver = resource.getResourceResolver();


    	if(properties!=null && StringUtils.isNotBlank(properties.get("mixmedia",StringUtils.EMPTY))) {
			this.mixedMediaItems = properties.get("mixmedia",String[].class);
	    }
    	
    	try {
			this.mediaItems();
		} catch (Exception e) {
			logger.error("Exception error :", e);
		}

        this.itemTranslatedText = Global.getTranslatedText(currentPage,slingRequest,"items");
    }
	
	/* </Constructors> */
	
	/* <Methods> */
    
	private void  mediaItems() throws JSONException {
		if(null!=this.mixedMediaItems){
			for( String mediaItem : this.mixedMediaItems )
	        {
	            Map<String,String> mediaItemMap = new HashMap<String,String>();
	            JSONObject jObject = new JSONObject(mediaItem);
	            String mediaSetLink = jObject.get("mediaSetLink").toString();
	            String[] parts = mediaSetLink.split("/");
	            String lastWord = parts[parts.length - 1];
	            mediaSetLink="eidupont/"+lastWord;    // company name from scene7 config = eidupont
	            String mediaSetTitle = jObject.get("mediaSetTitle").toString();
	            mediaItemMap.put("mediaSetLink", mediaSetLink);
	            mediaItemMap.put("mediaSetTitle",mediaSetTitle);
	            this.mediaList.add(mediaItemMap);
	        }
		}
	}
	
	/* </Methods> */
    
	/* <Getters and Setters> */

	public String getDefaultAsset() {
		if(this.defaultAsset == null){
			Map<String,String> asset = mediaList.get(0);
			this.defaultAsset = asset.get("mediaSetLink");
		}
		return this.defaultAsset;
	}
	
	public String getPath(){
		return this.currentPage.getPath();
	}
	
	//public void  setPath(String ppath){
	//	this.path = ppath;
	//}

    public boolean isSingleItem() {
		return this.mediaList.size() == 1;
	}

	//public void setSingleItem(boolean singleItem) {
	//	this.singleItem = singleItem;
	//}

	public void setDefaultAsset(String defaultAsset) {
		this.defaultAsset = defaultAsset;
	}

	public List<Map<String,String>> getMediaList() {
		return mediaList;
	}

	public void setMediaList(List<Map<String,String>> mediaList) {
		this.mediaList = mediaList;
	}

	public boolean isEditMode() {
		return editMode;
	}

	public void setEditMode(boolean editMode) {
		this.editMode = editMode;
	}

	public boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(boolean disabled) {
		this.disabled = disabled;
	}

	public boolean isItemsAvailable() {
		this.itemsAvailable = (this.mixedMediaItems != null && this.mixedMediaItems.length>0);
		return itemsAvailable;
	}

	public void setItemsAvailable(boolean itemsAvailable) {
		this.itemsAvailable = itemsAvailable;
	}

    public String getItemTranslatedText() {
        return itemTranslatedText;
    }

    public void setItemTranslatedText(String itemTranslatedText) {
        this.itemTranslatedText = itemTranslatedText;
    }

	public Resource getResource() {
		return resource;
	}

	/* </Getters and Setters> */

}

