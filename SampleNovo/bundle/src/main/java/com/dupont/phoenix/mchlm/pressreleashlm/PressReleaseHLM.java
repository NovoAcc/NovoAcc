package com.dupont.phoenix.mchlm.pressreleashlm;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.hlm.HLM;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;
import com.day.cq.wcm.foundation.Image;

public class PressReleaseHLM extends HListHelper {

	private static final Logger LOGGER = LoggerFactory.getLogger(PressReleaseHLM.class);
	public static final String RESPONSIVE_HLM_RESOURCE_PATH = "dupont/phoenix/components/responsive/mcpressreleasehlm";
	public static final String CORPORATE_FOLDER_PATH = "corporateFolderPath";
	public static final String BUSINESS_CONTEXT = "business";
	public static final String CORPORATE_CONTEXT = "corporate";
	private static final String S_HTML = "%s.html";

	private String hlmContext = PressReleaseHLM.BUSINESS_CONTEXT;

	public PressReleaseHLM()
	{ 
		
	}

	public PressReleaseHLM(final SlingHttpServletRequest slingRequest, final Page page, final Resource resource) {
		super(slingRequest, page, resource);
		LOGGER.debug("PressReleaseHLM initialize");
		if(isCorporate())
		{
			this.hlmContext = PressReleaseHLM.CORPORATE_CONTEXT;
		}
        setContentTabName(String.format("%s%s",getContentType(),hlmContext));
        initList();
	}

	public boolean isCorporateMCPage() {
		return StringUtils.equals(page.getPath(),getCorporateFolderPath());		
	}
	
	public boolean isCorporate() {
		final String isCorporate = properties.get("isCorporate", String.class);
		return StringUtils.isNotBlank(isCorporate) && "true".equals(isCorporate);
	}
	
	public String getHlmContext() {
		return hlmContext;
	}

	public void setHlmContext(String hlmContext) {
		this.hlmContext = hlmContext;
	}
	
	/**
	 * Getting the context of the page
	 */
	public String getCorporateFolderPath() {
		Style mcStyle = getMediaCenterConfigStyle();
		String corporateFolderPath = (mcStyle != null) ? mcStyle.get(
				PressReleaseHLM.CORPORATE_FOLDER_PATH, String.class) : "";
		return corporateFolderPath;
	}

	/**
	 * Initialize list items here.
	 */
	public void initList() {
		LOGGER.debug("Call initList method");
		if (!this.inited && showHLM()) {
			this.inited = true;
			this.items = processResources(findListItemResources());
			if (hlmContext.equalsIgnoreCase(PressReleaseHLM.BUSINESS_CONTEXT)) {
				List<ListItem> businessItem = new ArrayList<ListItem>();
				Iterator<ListItem> allItemIterator = items.iterator();
				while (allItemIterator.hasNext()) {
					ListItem currItem = allItemIterator.next();					
					if (!StringUtils.contains(currItem.getLinkURL(), getCorporateFolderPath())) {
						businessItem.add(currItem);
					}
				}
				this.items = businessItem;
			}
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
		LOGGER.debug("Call findListItemResources method");
		String targetFolderPath = "";
		if (hlmContext.equalsIgnoreCase(PressReleaseHLM.BUSINESS_CONTEXT)) {
			Page targetFolder = page.getAbsoluteParent(1);
			targetFolderPath = targetFolder.getPath();
		} else {
			targetFolderPath = getCorporateFolderPath();
		}

		List<String> options = new ArrayList<String>();
		ResourceResolver resolver = resource.getResourceResolver();
		Iterator<Resource> resourceIterator = null;
		if (StringUtils.isNotBlank(targetFolderPath)) {
			String contentTypeOption = getQueryContentTypesOption();
			if (contentTypeOption != null) {
				options.add(contentTypeOption);
			}
			if("pressrelease".equals(getContentType())){
				options.add(String.format("(@jcr:content/cq:tags='%s')",getPageTag()));
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
			final String corporateCntDetail = hlmContentType
					.equals(GlobalConstants.ARTICLE_CONTENT_TYPE_NAME) ? String
					.format(" or @jcr:content/contentType='%s'",
							GlobalConstants.CORPORATE_CONTENT_DETAIL_CONTENT_TYPE_NAME)
					: "";
			return String.format("(@jcr:content/contentType='%s'%s)", hlmContentType,
					corporateCntDetail);
	}

	
	public Style getMediaCenterConfigStyle() {
		
		Style mcSiteConfig = Global.getSiteConfigStyle(resource);
		return (mcSiteConfig != null) ? 
				mcSiteConfig.getSubStyle("tabmc")
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
		if(resIt == null)
			{
			return resList; 
			}
		final String langCountryPathReg = String.format("/%s/",Global.getLangCountryCode(page));
		final String languagePathRegEx = String.format("/%s/",Global.getLangCode(page));
		while (resIt.hasNext()) {
    		Resource res = resource.getResourceResolver().getResource(resIt.next(), "jcr:content");
			if (StringUtils.containsIgnoreCase(res.getPath(),langCountryPathReg)
					|| StringUtils.containsIgnoreCase(res.getPath(),languagePathRegEx)) {
				ValueMap respovsiveProps = res.adaptTo(ValueMap.class);
				ListItem item = new ListItem();
				item.setContentType(respovsiveProps.get("contentType", String.class));
				item.setName(res.getName());
				item.setTitle(respovsiveProps.get("jcr:title", String.class));
				item.setPageTitle(respovsiveProps.get("pageTitle", String.class));
				// This covers most of the item display
				// Exception: Page Title is displayed only when one item is
				// displayed across whole page
				item.setLinkText(item.getTitle());
				// Use global link rendering utility (for relative path
				// implementation)
				Page resPage = res.getParent().adaptTo(Page.class);
				item.setLinkURL(String.format(S_HTML,Global.getNavigationURL(slingRequest, resPage, false)));
				Image image = new Scene7Image(res, "thumbnail");
				image.setSelector(".img");
				item.setThumbnail(image);
				item.setImageContent(image.hasContent());
				item.setThumbnailPath(((Scene7Image)image).getScene7ImageSrc());
				String[] tags = respovsiveProps.get("cq:tags", String[].class);
	    		item.setTags(tags);
	    		item.setAllTags((String[]) ArrayUtils.addAll(tags,respovsiveProps.get("pageTag", String[].class)));
	    		item.setTagString(Global.tagArrayToString(tags, respovsiveProps.get("pageTag", String[].class)));
	    		item.setShortDesc(respovsiveProps.get("jcr:description", String.class));
				item.setRank(respovsiveProps.get("rank", String.class));
				// check if author has entered publish date in content detail headline component
				item.setPublished(Global.getCreateDate(res)!=null?Global.getCreateDate(res):respovsiveProps.get("cq:lastModified", Date.class));
	    		item.setLastModified(respovsiveProps.get("cq:lastModified", Date.class));
				item.setAuthor(getAuthorInfo(respovsiveProps));
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
			item.setLinkURL(String.format(S_HTML, linkURL));
			Image imageObj = new Image(resource, "thumbnail");
			imageObj.setSelector(".img");
			item.setThumbnail(imageObj);
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
				.containsKey(PressReleaseHLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME) ? properties
				.get(PressReleaseHLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME,
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
		return "pressrelease";
	}

	@Override
	public HListHelper createHLM(SlingHttpServletRequest slingRequest, Page page, Resource resource) {
		return new PressReleaseHLM(slingRequest, page, resource);
	}
}