package com.dupont.phoenix.featured;

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.Global;

public class FeaturedHomePage {
	
	/* Basic Variables */
	private Resource resource;
	private SlingHttpServletRequest slingRequest;
	private ValueMap properties;
	private static final Logger LOGGER = LoggerFactory
			.getLogger(FeaturedHomePage.class);
	
	private boolean author;
	private List<String> links;
	
	
	/* Dialog properties */
	private String[] linkItems;
	
	public FeaturedHomePage(Resource resource, SlingHttpServletRequest slingRequest) {
		this.resource = resource;
		this.slingRequest = slingRequest;
		properties = resource.adaptTo(ValueMap.class);
		init();
	}
	
	private void init() {
		if(WCMMode.fromRequest(slingRequest) != WCMMode.DISABLED){
			author = true;
		}
		else{
			author = false;
		}
		if (properties != null) {
			linkItems = properties.get("links",String[].class);
			try {
				links = createLinks();
			} catch (Exception e) {
				LOGGER.error("Unable to parse Featured Home Page links ", e);
			}
		}
	}
	
	private List<String> createLinks() throws JSONException {
		List<String> list = new ArrayList<String>();
		for(String linkItem : linkItems ) {
			
			JSONObject jObject  = new JSONObject(linkItem);
            String linkURL = jObject.get("linkURL").toString();
            String linkText = jObject.get("linkText").toString();
            Boolean newWindow = (Boolean) jObject.get("openInNewWindow");
            String iconPath = "";
            String iconClass = "";
            
            // Check if its not an external Link
            if(!Global.isExternalLink(linkURL)) {   
                
            	// Convert to valid internal link
            	linkURL  =  Global.getNavigationURL(slingRequest, linkURL, false) + ".html" ;
            }
            
            // If it opens in new window
            if(newWindow) {
                iconPath = "/etc/designs/dupont/phoenix/clientlibs/source/images/external_link.png";
                iconClass = "external-link";
            } else {   
            	iconPath = "/etc/designs/dupont/phoenix/clientlibs/source/images/right-arrow-action.png";
                iconClass = "cta-arrow";
            }
            
            // Generate the link markup
            String link = Global.renderLink( linkURL ,null,linkText ,null,iconPath ,iconClass ,newWindow ,false);
            
            // Add to the link list.
            list.add(link);	
		}
		
		// The list with the render links ready to be used.
		return list;
	}

	public boolean isAuthor() {
		return author;
	}

	public void setAuthor(boolean author) {
		this.author = author;
	}

	public List<String> getLinks() {
		return links;
	}

	public void setLinks(List<String> links) {
		this.links = links;
	}

	public Resource getResource() {
		return resource;
	}

}
