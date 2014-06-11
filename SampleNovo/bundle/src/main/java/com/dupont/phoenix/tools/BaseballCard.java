package com.dupont.phoenix.tools;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.commons.Scene7Image;

public abstract class BaseballCard {
	
	/* Required Variables */
	protected String templateType;
	protected String title;
	protected String shortDescription;
	private String[] linksList;
	protected List<Map> links;
	protected Image baseballImage;
	protected Resource resource;
	protected ResourceResolver resolver;
	
	private static final Logger logger = LoggerFactory.getLogger(GenericTool.class);
	protected ValueMap properties;
		
	/* Constructors */	
	public BaseballCard(final Resource resource) {
		this.resource = resource;
		this.resolver = resource.getResourceResolver();
		this.properties = resource.adaptTo(ValueMap.class);
		logger.info("Baseball Card Class constructor.");
		init();
	}
		
	private void init() {
		setTitle(properties.get("baseballCardTitle","No Title Set"));
		setShortDescription(properties.get("baseballCardShortDescription","No Description Set"));
		
		try {
			setLinks(setupLinks());
		} catch (JSONException e) {
			logger.error("JSON Exception :", e);
		}
		
		setTemplateType(properties.get("baseballCardType",String.class));
		baseballImage = new Scene7Image(resource,"image");
		if(baseballImage != null && baseballImage.hasContent()){
			baseballImage.setSelector(".img");
		}
	}
	
	private List<Map> setupLinks() throws JSONException {
		List<Map> tempList = new ArrayList<Map>();
		
		// Get the string array with all the information.
		setLinksList(properties.get("baseballCardLinks",String[].class));
		
	    if(linksList != null) {
	    	
			// Iterate thru string array and parse the information
			for( String linkItem : linksList ) {
				
				// Create a Map that will allow us to save the link text, url and new window value.
		        Map<String,String> linkItemMap = new HashMap<String,String>();
		        
		        // create the JSON object.
		        JSONObject jObject  = new JSONObject(linkItem);
		        String linkURL = jObject.get("linkURL").toString();
		        
		        // Verify if its an external or a non html page.
		        linkURL = checkLink(linkURL);
		        String linkText = jObject.get("linkText").toString();
		        String newWindow = jObject.get("openInNewWindow").toString();
		        
		        linkItemMap.put("linkURL",linkURL);
		        linkItemMap.put("linkText",linkText);
		        linkItemMap.put("newWindow", newWindow);
		        
		        tempList.add(linkItemMap);
			}
		}
	    return tempList;
	}
	
	/**
	 * Protected method to check whether links are external or internal. OTher resources like PDF's and PPT's won't have the .html extension.
	 * @param url: The URL
	 * @return The modified URL.
	 */
	protected String checkLink(String url) {
		if (url.startsWith("/content/") && !url.startsWith("/content/dam/")){
			return url + ".html";
		}
		return url;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public List<Map> getLinks() {
		return links;
	}

	public void setLinks(List<Map> links) {
		this.links = links;
	}

	public String getTemplateType() {
		return templateType;
	}

	public void setTemplateType(String templateType) {
		this.templateType = templateType;
	}

	public Image getBaseballImage() {
		return baseballImage;
	}

	public void setBaseballImage(Image baseballImage) {
		this.baseballImage = baseballImage;
	}

	public String[] getLinksList() {
		return linksList;
	}

	public void setLinksList(String[] linksList) {
		if(null!=linksList){
		this.linksList = linksList.clone();
		}
	}
}
