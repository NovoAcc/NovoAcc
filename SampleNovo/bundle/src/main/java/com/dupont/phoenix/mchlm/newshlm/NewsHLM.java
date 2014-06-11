package com.dupont.phoenix.mchlm.newshlm;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.hlm.HLM;
import com.dupont.phoenix.list.ListItem;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import com.dupont.phoenix.commons.Scene7Image;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.day.cq.wcm.foundation.Image;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.dupont.phoenix.list.HListHelper;

public class NewsHLM extends HListHelper {

	private static final Logger logger = LoggerFactory.getLogger(NewsHLM.class);
	public static final String RESPONSIVE_HLM_RESOURCE_PATH = "dupont/phoenix/components/responsive/mcnewshlm";
	/*public static final String CORPORATE_FOLDER_PATH = "corporateFolderPath";
	public static final String BUSINESS_CONTEXT = "business";
	public static final String CORPORATE_CONTEXT = "corporate";

	private String hlmContext = NewsHLM.BUSINESS_CONTEXT;*/

	public NewsHLM() { }

	public NewsHLM(final SlingHttpServletRequest slingRequest, final Page page, final Resource resource) {
		super(slingRequest, page, resource);
		//if(isCorporate()) this.hlmContext = NewsHLM.CORPORATE_CONTEXT;
        //setContentTabName(String.format("%s%s",getContentType(),hlmContext));
        initList();
	}

/*	public boolean isCorporateMCPage() {
		return StringUtils.equals(page.getPath(),getCorporateFolderPath());		
	}
	
	public boolean isCorporate() {
		final String isCorporate = properties.get("isCorporate", String.class);
		return (StringUtils.isNotBlank(isCorporate) && "true".equals(isCorporate));
	}*/
	
	/*public String getHlmContext() {
		return hlmContext;
	}

	public void setHlmContext(String hlmContext) {
		this.hlmContext = hlmContext;
	}*/
	
	/**
	 * Getting the context of the page
	 */
	/*public String getCorporateFolderPath() {
		Style mcStyle = getMediaCenterConfigStyle();
		String corporateFolderPath = (mcStyle != null) ? mcStyle.get(
				NewsHLM.CORPORATE_FOLDER_PATH, String.class) : "";
		
		return corporateFolderPath;
	}*/

	/**
	 * Initialize list items here.
	 */
	public void initList() {
		if (!this.inited && showHLM()) {
			this.inited = true;
			this.items = processResources(findListItemResources());
			Iterator<ListItem> listIterator = items.iterator();
			String currentURL = page.getPath() + ".html";
			while (listIterator.hasNext()) {
				ListItem currentItem = listIterator.next();
				if (currentItem.getLinkURL().equals(currentURL)) {
					listIterator.remove();
				}
			}
		}
	}

	/**
	 * Builds query options for XPATH query to get list items.
	 * 
	 * @return
	 */
	public Iterator<Resource> findListItemResources() {
		String targetFolderPath = page.getPath();
		List<String> options = new ArrayList<String>();
		ResourceResolver resolver = resource.getResourceResolver();
		Iterator<Resource> resourceIterator = null;
		if (StringUtils.isNotBlank(targetFolderPath)) {
			String contentTypeOption = getQueryContentTypesOption();
			if (contentTypeOption != null) {
				options.add(contentTypeOption);
			}
			resourceIterator = findResourcesByQuery(resolver, targetFolderPath, options, "");
		}
		return resourceIterator;
	}

	/**
	 * Returns query option for the selected contentType.
	 * 
	 * @return
	 */
	public String getQueryContentTypesOption() {
		final String hlmContentType = getContentType();
			final String newsContentTypes = "mcdailynews"
					.equalsIgnoreCase(hlmContentType) ? String
					.format("(@jcr:content/contentType='%s' or @jcr:content/contentType='%s' or @jcr:content/contentType='%s')",
							GlobalConstants.ARTICLE_CONTENT_TYPE_NAME,
							GlobalConstants.CORPORATE_CONTENT_DETAIL_CONTENT_TYPE_NAME,
							GlobalConstants.CORPORATE_CONTENT_VIDEO_DETAIL_CONTENT_TYPE_NAME)
					: "";
			return newsContentTypes;
	}

	public Style getMediaCenterConfigStyle() {
		Style mcSiteConfig = Global.getSiteConfigStyle(resource);
		return (mcSiteConfig != null) ? mcSiteConfig.getSubStyle("tabmc")
				: null;
	}

	/**
	 * Iterate through query results and create List<ListItem>.
	 * 
	 * @param resIt
	 * @return
	 */
	private List<ListItem> processResources(final Iterator<Resource> resIt) {
		// pressreleaseHLM.logger.info("processResources Begin"+resIt.hasNext());
		List<ListItem> resList = new ArrayList<ListItem>();
		if(resIt == null){
			return resList; 
		}
		final String langCountryPathRegEx = String.format("/%s/",Global.getLangCountryCode(page));
		final String langPathRegEx = String.format("/%s/",Global.getLangCode(page));
		while (resIt.hasNext()) {
    		Resource res = resource.getResourceResolver().getResource(resIt.next(), "jcr:content");
			if (StringUtils.containsIgnoreCase(res.getPath(),langCountryPathRegEx)
					|| StringUtils.containsIgnoreCase(res.getPath(),langPathRegEx)) {
				ValueMap resProps = res.adaptTo(ValueMap.class);
				ListItem item = new ListItem();
				item.setContentType(resProps.get("contentType", String.class));
				item.setName(res.getName());
				item.setTitle(resProps.get("jcr:title", String.class));
				item.setPageTitle(resProps.get("pageTitle", String.class));
				// This covers most of the item display
				// Exception: Page Title is displayed only when one item is
				// displayed across whole page
				item.setLinkText(item.getTitle());
				// Use global link rendering utility (for relative path
				// implementation)
				Page resPage = res.getParent().adaptTo(Page.class);
				item.setLinkURL(String.format("%s.html",Global.getNavigationURL(slingRequest, resPage, false)));
				Image image = new Scene7Image(res, "thumbnail");
				image.setSelector(".img");
				item.setThumbnail(image);
				item.setTags(resProps.get("cq:tags", String[].class));
				// displayTags(resProps.get("cq:tags", String[].class));
				item.setShortDesc(resProps.get("jcr:description", String.class));
				item.setRank(resProps.get("rank", String.class));
				item.setLastModified(resProps.get("cq:lastModified", Date.class));
				item.setCreated(resProps.get("jcr:created", Date.class));
				item.setAuthor(getAuthorInfo(resProps));
				//pressreleaseHLM.logger.info(item.toString());
				resList.add(item);
			}
		}
		return resList;
	}

	/**
	 * Returns author info from page properties.
	 * 
	 * @param pageProps
	 * @return
	 */
	public String getAuthorInfo(ValueMap pageProps) {
		String author = pageProps.get("authorInfo", String.class);
		String createdBy = pageProps.get("jcr:createdBy", String.class);
		return (author != null) ? author : createdBy != null ? createdBy : "";
	}

	@Override
	public ListItem getCalloutItem() {
		ListItem item = null;
		String linkText = properties.get("linkText", String.class);
		String linkURL = properties.get("linkURL", String.class);
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
		return item;
	}

	@Override
	public int getMaxDisplayItemsCount() {
    	Style hlmStyle = getHLMSiteConfigStyle();
    	Integer maxItems = isCalloutActive()? WITH_CALLOUT_MAX_ALLOWED_ITEMS : WITHOUT_CALLOUT_MAX_ALLOWED_ITEMS;
    	if(isCalloutActive()) {
    		maxItems = (hlmStyle!=null) ? hlmStyle.get(HLM.WITH_CALLOUT_MAX_ITEMS_PROPERTY_NAME, Integer.class) : maxItems;
    	} else {
        	maxItems = (hlmStyle!=null) ? hlmStyle.get(HLM.WITHOUT_CALLOUT_MAX_ITEMS_PROPERTY_NAME, Integer.class) : maxItems;    		
    	}
    	return getListSize() > maxItems ? maxItems : getListSize();
    }

	@Override
	public Boolean isCalloutActive() {
		Boolean showRowCallout = properties
				.containsKey(NewsHLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME) ? properties
				.get(NewsHLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME,
						Boolean.class) : false;
		return !showRowCallout;
	}
	
	@Override
	public Boolean isCalloutToolSelected() {
		Boolean toolSelected = false;	
		if(properties.containsKey(HLM.ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME)){
			toolSelected = StringUtils.isNotBlank(properties.get(HLM.ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME, String.class));			
		}
    	return toolSelected;
	}

	/**
	 * HLM Title
	 */
    public String getContentTypeName() {
    	String contentType = getContentTabName();
    	Style hlmStyle = getHLMSiteConfigStyle();
    	return hlmStyle!=null? hlmStyle.get(contentType, String.class) :"";
    }
	
	public String getContentType() {
		return "mcdailynews";
	}

	@Override
	public HListHelper createHLM(SlingHttpServletRequest slingRequest, Page page, Resource resource) {
		return new NewsHLM(slingRequest, page, resource);
	}

}