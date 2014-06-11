package com.dupont.phoenix.hero;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.Global;

public class HomePageHeroCallout {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(HomePageHeroCallout.class);
	/* Private variables */
	private String heroHeadline;
	private String heroURL;
	private String heroColor;
	
	/* Render variables */
	private String linkHTML;
	private String shortDescription;
	private String imageFileReference;
	private String altText;
	
	
	/* Page Context Variables */
	private ValueMap properties;
	private boolean author;
	
	private Resource resource;
	private Page currentPage;
	
	/* Constants */
	private static final String WHITE_ARROW_RIGHT_IMAGE = "/etc/designs/dupont/phoenix/clientlibs/source/images/white_arrow_right.png";
	
	public HomePageHeroCallout(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest) {
		this.resource = resource;
		this.currentPage = currentPage;
		properties = resource.adaptTo(ValueMap.class);
		author = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
		init();
	}
	
	private void init() {
		if (properties != null) {
			heroHeadline = cropString(setupHeroHeadline());
			/*
			 * If linkURL is not provided then it should take nothing.
			 */
			heroURL = properties.get("linkURL","");
			/*
			 * Change for Rel-2.8
			 * Get Site Configuration and get style from globalnav. 
			 */
		    
		    	if(!StringUtils.isEmpty(heroURL) && !"#".equals(heroURL)){
		    		linkHTML = Global.renderLink(heroURL+".html", null, heroHeadline, null, 
							WHITE_ARROW_RIGHT_IMAGE, null, false, false);
				}else{
					/**
					 * If no heroURL provided then need to send null.
					 */
					LOGGER.debug("No Link Provided :: ");
					linkHTML = Global.renderLink(heroURL, null, heroHeadline, null, 
							null, null, false, false);
				}
		    	
			heroColor = currentPage.getProperties().get("heroColor","");
			shortDescription = currentPage.getProperties().get("jcr:description",String.class);
			imageFileReference = properties.get("fileReference","");
			altText = properties.get("alt","");
		}
	}
	
	/**
	 * Gets the hero headline from the dialog. Title if no data is entered.
	 * @return The string for the hero headline.
	 */
	private String setupHeroHeadline() {
		String headline = properties.get("heroAltHeadline",String.class);
		if (headline == null) {
			headline = currentPage.getTitle();
		}
		return headline;
	}
	
	/**
	 * Crops the string at 96 characters.
	 * @param s: The String to be cropped.
	 * @return cropped: The String cropped.
	 */
	private String cropString(String s){
		String cropped = "";
		// If String is not null and its larger than96 characters. Crop that.
		if (s != null && s.length() > 96){
			cropped = s.substring(0, 96);
		}else{ // If not, then its all cool!
			cropped = s;
		}
		// Return it
		return cropped;
	}
	
	/** Getters And Setters **/
	public String getLinkHTML() {
		return linkHTML;
	}

	public void setLinkHTML(String linkHTML) {
		this.linkHTML = linkHTML;
	}

	public String getHeroColor() {
		return heroColor;
	}

	public void setHeroColor(String heroColor) {
		this.heroColor = heroColor;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getImageFileReference() {
		return imageFileReference;
	}

	public void setImageFileReference(String imageFileReference) {
		this.imageFileReference = imageFileReference;
	}

	public String getAltText() {
		return altText;
	}

	public void setAltText(String altText) {
		this.altText = altText;
	}

	public boolean getAuthor() {
		return author;
	}

	public void setAuthor(boolean author) {
		this.author = author;
	}

	public Resource getResource() {
		return resource;
	}
	

}
