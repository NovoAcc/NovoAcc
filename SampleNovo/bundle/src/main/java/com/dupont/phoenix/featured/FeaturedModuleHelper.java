package com.dupont.phoenix.featured;

import java.sql.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.hlm.HLM;
import com.dupont.phoenix.list.ListItem;

public class FeaturedModuleHelper {

	private static final Logger logger = LoggerFactory.getLogger(FeaturedModuleHelper.class);
	private Page currentPage;
	private Resource resource;
	private SlingHttpServletRequest slingRequest;
	private ValueMap properties;

	public FeaturedModuleHelper(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource) {
		this.currentPage = currentPage;
		this.slingRequest = slingRequest;
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
	}

	public ListItem getItem() {
		ListItem item = null;
		String pagePath = StringUtils.EMPTY;
		if (null!=properties && null!=properties.get("selectedContent", null)) {
			pagePath = properties.get("selectedContent", String.class);
		}
		if (StringUtils.isNotBlank(pagePath)) {
			
			ResourceResolver resolver = resource.getResourceResolver();
			Resource res = resolver !=null ? resolver.getResource(pagePath + "/jcr:content") : null;
			ValueMap resProps = res !=null ? res.adaptTo(ValueMap.class) : null;
			if(resProps!=null)
			{
	//		logger.info("res " + resolver.getResource(pagePath) + "  resProps" + resProps.keySet().toString());
			item = new ListItem();
			item.setTitle(resProps.get("jcr:title", String.class));
			item.setPageTitle(resProps.get("pageTitle", String.class));
			item.setLinkText(item.getTitle());
			item.setLinkURL(String.format("%s.html", Global.getNavigationURL(slingRequest, pagePath, false)));
			Image image = new Scene7Image(res, "thumbnail");
			image.setSelector(".img");
			item.setThumbnail(image);
			item.setTags(resProps.get("cq:tags", String[].class));
			item.setShortDesc(resProps.get("jcr:description", String.class));
			item.setRank(resProps.get("rank", String.class));
			item.setLastModified(resProps.get("cq:lastModified", Date.class));
			item.setAuthor(getAuthorInfo(resProps));
			logger.info(item.toString());
			}
		}
		return item;
	}

	public String getFeaturedCallout() {
		String featuredCallout = (properties != null && properties.containsKey("selectedTool") ? properties.get(
				"selectedTool", String.class) : null);
		return featuredCallout;
	}

	public ListItem getCalloutItem() {
		ListItem item = null;
		if (properties != null ) {
			String linkText = properties.containsKey("linkText") ? properties.get("linkText", String.class) : null;
			String linkURL = properties.containsKey("linkURL") ? properties.get("linkURL", String.class) : null;
			if (StringUtils.isNotBlank(linkText)) {
				item = new ListItem();
				item.setLinkText(linkText);
				item.setLinkURL(String.format("%s.html", linkURL));
				Image image = new Image(resource, "thumbnail");
				image.setSelector(".img");
				item.setThumbnail(image);
				item.setImageWidth("300");
				item.setImageHeight("150");
			}
		}
		return item;
	}
	
	public ListItem getPdfItem() {
		ListItem item = null;
		if (properties != null) {

			String pagePath = properties.get("selectedContent", String.class);
			String pdftitle = properties.containsKey("pdftitle") ? properties
					.get("pdftitle", String.class) : null;
			String pdfdesc = properties.containsKey("pdfdesc") ? properties
					.get("pdfdesc", String.class) : null;
 
			if (StringUtils.isNotBlank(pdftitle)) { 
				item = new ListItem();
				item.setLinkURL(pagePath);
				item.setLinkText(pdftitle);
				item.setShortDesc(pdfdesc);
			}
		}
		return item;
	}

	public String getUrlSuffix(String contentPath) {

		String urlSuffix = contentPath.substring(
				contentPath.lastIndexOf('.') + 1, contentPath.length());
		return urlSuffix;
	}
	
		public Boolean isCalloutActive() {
		Boolean showRowCallout = true;
		if (properties != null) {
		showRowCallout = properties.containsKey(HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME) ? properties.get(
				HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME, Boolean.class) : false;
		
		}
		return !showRowCallout;
	}
	public String getAuthorInfo(ValueMap pageProps) {
		String author = pageProps.get("authorInfo", String.class);
		String createdBy = pageProps.get("jcr:createdBy", String.class);
		// logger.info("Author Info:"+author + " createdBy:"+createdBy);
		return (author != null) ? author : createdBy != null ? createdBy : "";
	}

	public Page getCurrentPage() {
		return currentPage;
	}

}
