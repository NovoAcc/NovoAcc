package com.dupont.phoenix.mchlm;

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
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.hlm.HLM;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;

public class MCHLM extends HListHelper {

	private static final Logger logger = LoggerFactory.getLogger(MCHLM.class);
	public static final String RESPONSIVE_HLM_RESOURCE_PATH = "dupont/phoenix/components/responsive/mchlm";

	public MCHLM() { }

	public MCHLM(final SlingHttpServletRequest slingRequest, final Page page, final Resource resource) {
		super(slingRequest, page, resource);
		initList();
	}

	@Override
	protected void initList() {
		if(!this.inited && showHLM()) {
    		this.inited = true;
    		items = processResources(findListItemResources());
    	}
	}

	/**
	 * Builds query options for XPATH query to get list items.
	 * @return
	 */
	public Iterator<Resource> findListItemResources() {
		logger.info("MCHLM findListItemResources Start.");
    	String targetFolderPath = page.getPath();
        List<String> options = new ArrayList<String>();    	
    	ResourceResolver resolver = resource.getResourceResolver();
    	Iterator<Resource> resourceIterator = null;
    	if (StringUtils.isNotBlank(targetFolderPath)) {
    		String contentTypeOption = getQueryContentTypesOption();
    		if(contentTypeOption!=null) {
    			options.add(contentTypeOption);
    		}
    		
    		resourceIterator = findResourcesByQuery(resolver, targetFolderPath, options,"");
    	}
    	logger.info("MCHLM findListItemResources End.");
    	return resourceIterator;
    }
	
	/**
	 * Returns query option for the selected contentType.
	 * @return
	 */
	public String getQueryContentTypesOption() {
    	final String hlmContentType = getContentType();
    	if (hlmContentType != null) {
			final String newsContentTypes = "mcdailynews"
					.equalsIgnoreCase(hlmContentType) ? String
					.format("(@jcr:content/contentType='%s' or @jcr:content/contentType='%s' or @jcr:content/contentType='%s')",
							GlobalConstants.ARTICLE_CONTENT_TYPE_NAME,
							GlobalConstants.CORPORATE_CONTENT_DETAIL_CONTENT_TYPE_NAME,
							GlobalConstants.CORPORATE_CONTENT_VIDEO_DETAIL_CONTENT_TYPE_NAME)
					: String.format("(@jcr:content/contentType='%s')", hlmContentType);
			return newsContentTypes;
		}
		return null;
	}
	
	 public String getContentType () {
	    	return properties.get("contentType",String.class);    	
	 }
	/**
     * Iterate through query results and create List<ListItem>.
     * @param resIt
     * @return
     */
    protected List<ListItem> processResources(final Iterator<Resource> resourceIt) {
    	List<ListItem> resList = new ArrayList<ListItem>();
		if(resourceIt == null){
			return resList; 
		}
		final String languageCountryPathRegEx = String.format("/%s/",Global.getLangCountryCode(page));
		final String languagePathRegEx = String.format("/%s/",Global.getLangCode(page));
    	while(resourceIt.hasNext()) {
    		Resource res = resource.getResourceResolver().getResource(resourceIt.next(), "jcr:content");
			if (StringUtils.containsIgnoreCase(res.getPath(),languageCountryPathRegEx)
					|| StringUtils.containsIgnoreCase(res.getPath(),languagePathRegEx)) {
	    		ValueMap resourceProps = res.adaptTo(ValueMap.class);
	    		ListItem item = new ListItem();
	    		item.setContentType(resourceProps.get("contentType", String.class));
	    		item.setName(res.getName());
	    		item.setTitle(resourceProps.get("jcr:title", String.class));
	    		item.setPageTitle(resourceProps.get("pageTitle", String.class));
	    		//This covers most of the item display
	    		//Exception: Page Title is displayed only when one item is displayed across whole page
	    		item.setLinkText(item.getTitle());
	    		//Use global link rendering utility (for relative path implementation)
	    		Page resPage = res.getParent().adaptTo(Page.class);
	    		item.setLinkURL(String.format("%s.html",Global.getNavigationURL(slingRequest, resPage, false)));
	    		Image s7Image = new Scene7Image(res, "thumbnail");
	    		s7Image.setSelector(".img");
	    		item.setThumbnail(s7Image);
	    		item.setImageContent(s7Image.hasContent());
	    		item.setThumbnailPath(((Scene7Image)s7Image).getScene7ImageSrc());
	    		String[] tags = resourceProps.get("cq:tags", String[].class);
	    		item.setTags(tags);
	    		item.setAllTags((String[]) ArrayUtils.addAll(tags,resourceProps.get("pageTag", String[].class)));
	    		item.setTagString(Global.tagArrayToString(tags, resourceProps.get("pageTag", String[].class)));
	    		//displayTags(resProps.get("cq:tags", String[].class));
	    		item.setShortDesc(resourceProps.get("jcr:description", String.class));
	    		item.setRank(resourceProps.get("rank", String.class));
	    		// check if author has entered publish date in content detail headline component
	    		item.setPublished(Global.getCreateDate(res)!=null?Global.getCreateDate(res):resourceProps.get("cq:lastModified", Date.class));
	    		item.setLastModified(resourceProps.get("cq:lastModified", Date.class));
	    		item.setCreated(resourceProps.get("jcr:created", Date.class));
	    		//logger.info(item.toString());
	    		resList.add(item);
			}
    	}
    	return resList;
    }
	@Override
	public HListHelper createHLM(SlingHttpServletRequest slingRequest, Page page, Resource resource) {
		logger.info("MCHLM createHLM");
		return new MCHLM(slingRequest, page, resource);
	}

	@Override
    public ListItem getCalloutItem() {
    	ListItem item = null;
    	String calloutLinkText = properties.get("linkText",String.class);
    	String calloutLinkURL = properties.get("linkURL",String.class);
    	if(StringUtils.isNotBlank(calloutLinkText)) {
        	item = new ListItem();
    		item.setLinkText(calloutLinkText);
    		item.setLinkURL(String.format("%s.html", calloutLinkURL));
    		Image resimage = new Image(resource, "thumbnail");
    		resimage.setSelector(".img");
    		item.setThumbnail(resimage);
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
		Boolean showRowCallout = properties.containsKey(HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME)?
				properties.get(HLM.ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME, Boolean.class): false;
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

}