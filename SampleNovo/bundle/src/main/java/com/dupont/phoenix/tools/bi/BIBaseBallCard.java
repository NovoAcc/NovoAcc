package com.dupont.phoenix.tools.bi;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dupont.phoenix.tools.BaseballCard;

public class BIBaseBallCard extends BaseballCard {
	
	private static final Logger logger = LoggerFactory.getLogger(BIBaseBallCard.class);
	private String overImageText;
	private List<Map> imageLinks;
	private String[] imageLinksList;

	public BIBaseBallCard(Resource resource) {
		super(resource);
		init();
	}
	private void init(){
		setOverImageText(properties.get("baseballCardImageText","Value not set"));
		try {
			setImageLinks(setupLinks());
		} catch (JSONException e) {
			logger.error("Error JSONException :", e);
		}
	}

	private List<Map> setupLinks() throws JSONException {
		List<Map> tempList = new ArrayList<Map>();
		
		// Get the string array with all the information.
		setImageLinksList(properties.get("baseballCardImagelinks",String[].class));
		
	    if(imageLinksList != null) {
	    	
			// Iterate thru string array and parse the information
			for( String linkItem : imageLinksList ) {
				
				// Create a Map that will allow us to save the link text, url and new window value.
		        Map<String,String> linkItemMap = new HashMap<String,String>();
		        
		        // create the JSON object.
		        JSONObject jObject  = new JSONObject(linkItem);
		        String linkURL = jObject.get("linkURL").toString();
		        linkURL = checkLink(linkURL);
		        String linkText = jObject.get("linkText").toString();
		        String newWindow = jObject.get("openInNewWindow").toString();
		        
		        //out.println(isExternalLink);
		        linkItemMap.put("linkURL",linkURL);
		        linkItemMap.put("linkText",linkText);
		        linkItemMap.put("newWindow", newWindow);
		        
		        tempList.add(linkItemMap);
			}
		}
	    return tempList;
	}

	/* Setters and Getters */
	public List<Map> getImageLinks() {
		return imageLinks;
	}

	public void setImageLinks(List<Map> imageLinks) {
		this.imageLinks = imageLinks;
	}

	public String[] getImageLinksList() {
		return imageLinksList;
	}

	public void setImageLinksList(String[] imageLinksList) {
		if(null!=imageLinksList){
		this.imageLinksList = imageLinksList.clone();
		}
	}
	public String getOverImageText() {
		return overImageText;
	}
	public void setOverImageText(String overImageText) {
		this.overImageText = overImageText;
	}
}
