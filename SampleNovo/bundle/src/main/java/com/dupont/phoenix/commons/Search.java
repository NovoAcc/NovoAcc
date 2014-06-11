package com.dupont.phoenix.commons;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.xss.XSSAPI;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Design;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;


public class Search {
	
	private final Logger logger = LoggerFactory.getLogger(Search.class);
	private Page currentPage;
	private SlingHttpServletRequest slingRequest;
	private ResourceResolver resolver;
	private Design currentDesing;
    private String searchWatermark;
	//default values...
	private String siteCountry= "default_collection";
	private String searchCountryLangCombo = "en_US";
	private String extSearchURL = "http://dupontsearch.asp.dupont.com/search";
	private String URL;
	private String searchIndex;

	
	public Search(final SlingHttpServletRequest slingRequest, final Page currentPage, final Design currentDesing) {
		try{
			this.slingRequest = slingRequest;
			this.currentPage = currentPage;
			this.currentDesing = currentDesing; 
			this.resolver = slingRequest.getResourceResolver();			 
			}catch (Exception e){
				logger.error("Search Error : ", e);
			}
			finally{
				init();
			}	
	}
	
	
	private void init() {
		
		searchWatermark=Global.getTranslatedText(currentPage, slingRequest,"Search Products,Uses & Applications");
		
		//read properties from siteconfig - override default values
		Style siteConfigGeneral = currentDesing.getStyle("siteconfig/general");
		Style siteConfigSearchPromote = currentDesing.getStyle("siteconfig/searchandpromote");
		XSSAPI xssAPI = resolver.adaptTo(XSSAPI.class);
		if (siteConfigGeneral != null){   
			siteCountry = xssAPI.encodeForHTML(siteConfigGeneral.get("searchCollectionName",siteCountry));
			searchCountryLangCombo = xssAPI.encodeForHTML(siteConfigGeneral.get("searchCountryLangCombo",searchCountryLangCombo));
		}
		if (siteConfigSearchPromote != null){  
			extSearchURL = xssAPI.getValidHref(siteConfigSearchPromote.get("extSearchURL",extSearchURL));
			URL = xssAPI.getValidHref(siteConfigSearchPromote.get("searchURL", ""));
	        searchIndex = siteConfigSearchPromote.get("searchIndex", "");
		}		
	}		
	
	//////////// Getters And Setters ///////////////
	public SlingHttpServletRequest getSlingRequest() {
		return slingRequest;
	}
	public void setSlingRequest(SlingHttpServletRequest slingRequest) {
		this.slingRequest = slingRequest;
	}
	public Page getCurrentPage() {
		return currentPage;
	}
	public void setCurrentPage(Page currentPage) {
		this.currentPage = currentPage;
	}

	public ResourceResolver getResolver() {
		return resolver;
	}

	public void setResolver(ResourceResolver resolver) {
		this.resolver = resolver;
	}

	public String getURL() {
		return URL;
	}

	public void setURL(String uRL) {
		URL = uRL;
	}

	public String getSearchIndex() {
		return searchIndex;
	}

	public void setSearchIndex(String searchIndex) {
		this.searchIndex = searchIndex;
	}

	public Design getCurrentDesing() {
		return currentDesing;
	}

	public void setCurrentDesing(Design currentDesing) {
		this.currentDesing = currentDesing;
	}

	public String getSearchWatermark() {
		return searchWatermark;
	}

	public void setSearchWatermark(String searchWatermark) {
		this.searchWatermark = searchWatermark;
	}

	public String getSiteCountry() {
		return siteCountry;
	}

	public void setSiteCountry(String siteCountry) {
		this.siteCountry = siteCountry;
	}

	public String getSearchCountryLangCombo() {
		return searchCountryLangCombo;
	}

	public void setSearchCountryLangCombo(String searchCountryLangCombo) {
		this.searchCountryLangCombo = searchCountryLangCombo;
	}

	public String getExtSearchURL() {
		return extSearchURL;
	}

	public void setExtSearchURL(String extSearchURL) {
		this.extSearchURL = extSearchURL;
	}

}
