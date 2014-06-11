package com.dupont.phoenix.featured;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

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
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;

public class FeaturedModuleB extends HListHelper {
	private static final Logger logger = LoggerFactory.getLogger(FeaturedModuleB.class);
	
	private ValueMap properties;
	private Page currentPage;
	private Resource resource;
	private SlingHttpServletRequest slingRequest;
	public FeaturedModuleB(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource) {
		this.currentPage = currentPage;
		this.slingRequest = slingRequest;
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		initList();
	}

	public void initList() {
		items = getItems();
	}

	@Override
	public ListItem getCalloutItem() {
		ListItem item = null;
    	String linkText = properties.get("linkText",String.class);
    	String linkURL = properties.get("linkURL",String.class);
    	if(StringUtils.isNotBlank(linkText)) {
        	item = new ListItem();
    		item.setLinkText(linkText);
    		item.setLinkURL(String.format("%s.html", linkURL));
    		Image image = new Image(resource, "thumbnail");
    		image.setSelector(".img");
    		item.setThumbnail(image);
    		item.setImageWidth("300");
    		item.setImageHeight("150");
    	}
		return item;
	}

	@Override
	public Boolean isCalloutActive() {
		Boolean showRowCallout = Boolean.TRUE;
		if (properties != null) {
		showRowCallout = properties.containsKey(HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME) ? properties.get(
				HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME, Boolean.class) : Boolean.FALSE;
		showRowCallout = getListSize() > 2 ? Boolean.TRUE : showRowCallout;
		}
		return !showRowCallout;
	}
	
	@Override
	public Boolean isCalloutToolSelected() {
		Boolean toolSelected = false;	
		if(properties.containsKey(HLM.ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME)){
			toolSelected = StringUtils.isNotEmpty(properties.get(HLM.ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME, String.class));			
		}
    	return toolSelected;
	}

	@Override
	public int getMaxDisplayItemsCount() {
		int maxItems = 4;
		return getListSize() > maxItems ? maxItems : getListSize();
	}

	public List<ListItem> getItems() {
		items = null;
		logger.info("Get featured items for:" + resource.getPath());
		String[] pagePaths = null;
		if (null!=properties && null!=properties.get("selectetPagePaths", null)) {
			pagePaths = properties.get("selectetPagePaths", String[].class);
		}

		if (pagePaths != null && pagePaths.length > 0) {
			ResourceResolver resolver = resource.getResourceResolver();
			items = new ArrayList<ListItem>();
			for (String pagePath : pagePaths) {
				Resource res = resolver.getResource(pagePath + "/jcr:content");
				if(res!=null) {
					ValueMap resProps = res.adaptTo(ValueMap.class);
					//logger.info("res " + resolver.getResource(pagePath) + "  resProps" + resProps.keySet().toString());
					ListItem item = new ListItem();
					item.setTitle(resProps.get("jcr:title", String.class));
					item.setPageTitle(resProps.get("pageTitle", String.class));
					item.setLinkText(item.getTitle());
					item.setLinkURL(String.format("%s.html", Global.getNavigationURL(slingRequest, pagePath, false)));
					Image image = new Scene7Image(res, "thumbnail");
		    		image.setSelector(".img");
		    		item.setThumbnail(image);
		    		// item.setMediumThumbnail();
					item.setTags(resProps.get("cq:tags", String[].class));
					item.setShortDesc(resProps.get("jcr:description", String.class));
					item.setRank(resProps.get("rank", String.class));
					item.setLastModified(resProps.get("cq:lastModified", Date.class));
					item.setAuthor(getAuthorInfo(resProps));
					//logger.info(item.toString());
					items.add(item);
				}
			}
		}
		return items;
	}

	public int getListSize() {
		int maxItems = 4;
		int listSize = 0;
		if (this.items != null) {
			listSize = this.items.size() > maxItems ? maxItems : this.items.size();
		}
		return listSize;
	}
	public String getAuthorInfo(ValueMap pageProps) {
		String author = pageProps.get("authorInfo", String.class);
		String createdBy = pageProps.get("jcr:createdBy", String.class);
		// logger.info("Author Info:"+author + " createdBy:"+createdBy);
		return (author != null) ? author : createdBy != null ? createdBy : "";
	}

	@Override
	public HListHelper createHLM(SlingHttpServletRequest slingRequest,
			Page page, Resource resource) {
		return null;
	}

	public Page getCurrentPage() {
		return currentPage;
	}
}
