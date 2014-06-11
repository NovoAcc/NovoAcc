package com.dupont.phoenix.hlm;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.list.ListItem;

import org.apache.commons.lang.ArrayUtils;
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

public class HLM extends HListHelper { 
		  
    private static final Logger logger = LoggerFactory.getLogger(HLM.class);
    public static final String HLM_RESOURCE_PATH = "dupont/phoenix/components/hlm";
    public static final String RESPONSIVE_HLM_RESOURCE_PATH = "dupont/phoenix/components/responsive/hlm";

    public HLM() {}

    public HLM(final SlingHttpServletRequest slingRequest, final Page page, final Resource resource) {
    	super(slingRequest, page, resource);
        initList();    	
    }
	
	/**
     * Initialize list items here.
     */
    public void initList() {
    	if(!this.inited && showHLM()) {
    		this.inited = true;
    		items = processResources(findListItemResources());
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
	 * @return
	 */
	public Iterator<Resource> findListItemResources() {
    	Page targetFolder = page.getAbsoluteParent(1);
    	String targetFolderPath = targetFolder.getPath();
        List<String> options = new ArrayList<String>();    	
    	ResourceResolver resolver = resource.getResourceResolver();
    	Iterator<Resource> resourceIterator = null;
    	if (StringUtils.isNotBlank(targetFolderPath)) {
    		String contentTypeOption = getQueryContentTypesOption();
    		if(contentTypeOption!=null) {
    			options.add(contentTypeOption);
    		}
    		if(showRelatedContent()) {
    			options.add(getRelatedContentQueryOption());    			
    		} else {
    			options.add(String.format("(@jcr:content/cq:tags='%s')",getPageTag()));
    		}
    		resourceIterator = findResourcesByQuery(resolver, targetFolderPath, options,"");
    	}
    	return resourceIterator;
    }
    
	/**
	 * Different Tag attribute for related content.
	 * @return
	 */
	private String getRelatedContentQueryOption() {
		final String pageTag = getPageTag();
		StringBuilder queryOptions = new StringBuilder("(");
		if(StringUtils.isNotBlank(pageTag)) {
			final String relatedTagPrefix = StringUtils.substringBeforeLast(pageTag, "/");
			String[] pageTags = pageProperties.get("cq:tags", String[].class);
			if(pageTags!=null && pageTags.length>0) {
		    	for(String tag : pageTags) {
		    		Boolean isRelatedTag = StringUtils.startsWith(tag, relatedTagPrefix);
		    		if(isRelatedTag) {
		    			queryOptions.append(String.format(" or @jcr:content/pageTag='%s'", tag));
		    		}
		    	}
			}
		}
		if(StringUtils.equals(queryOptions.toString(),"(")) {
			queryOptions.append("@jcr:content/pageTag=''");
		}
		queryOptions.append(")");
    	return queryOptions.toString().replaceFirst(" or ", "");
	}

	/**
	 * Returns query option for the selected contentType.
	 * @return
	 */
	public String getQueryContentTypesOption() {
    	final String hlmContentType = getContentType();
		if(hlmContentType!=null) {
	    	final String corporateCntDetail = hlmContentType.equals(GlobalConstants.ARTICLE_CONTENT_TYPE_NAME) ?
	    			String.format(" or @jcr:content/contentType='%s'",GlobalConstants.CORPORATE_CONTENT_DETAIL_CONTENT_TYPE_NAME):""; 
			return String.format("(@jcr:content/contentType='%s'%s)", hlmContentType, corporateCntDetail);
		}
		return null;
	}
	
    /**
     * Iterate through query results and create List<ListItem>.
     * @param resIt
     * @return
     */
    protected List<ListItem> processResources(final Iterator<Resource> resIt) {
    	List<ListItem> resList = new ArrayList<ListItem>();
		if(resIt == null){
			return resList; 
		}
		final String langCountryPathRegEx = String.format("/%s/",Global.getLangCountryCode(page));
		final String langPathRegEx = String.format("/%s/",Global.getLangCode(page));
    	while(resIt.hasNext()) {
    		Resource res = resource.getResourceResolver().getResource(resIt.next(), "jcr:content");
			if (StringUtils.containsIgnoreCase(res.getPath(),langCountryPathRegEx)
					|| StringUtils.containsIgnoreCase(res.getPath(),langPathRegEx)) {
	    		ValueMap resProps = res.adaptTo(ValueMap.class);
	    		ListItem item = new ListItem();
	    		item.setContentType(resProps.get("contentType", String.class));
	    		item.setName(res.getName());
	    		item.setTitle(resProps.get("jcr:title", String.class));
	    		item.setPageTitle(resProps.get("pageTitle", String.class));
	    		//This covers most of the item display
	    		//Exception: Page Title is displayed only when one item is displayed across whole page
	    		item.setLinkText(item.getTitle());
	    		//Use global link rendering utility (for relative path implementation)
	    		Page resPage = res.getParent().adaptTo(Page.class);
	    		item.setLinkURL(String.format("%s.html",Global.getNavigationURL(slingRequest, resPage, false)));
	    		Image image = new Scene7Image(res, "thumbnail");
	    		image.setSelector(".img");
	    		item.setThumbnail(image);
	    		//item.setImageHeight("120");
	    		item.setImageWidth("240");
	    		item.setImageContent(image.hasContent());
	    		item.setThumbnailPath(((Scene7Image)image).getScene7ImageSrc());
	    		String[] tags = resProps.get("cq:tags", String[].class);
	    		item.setTags(tags);
	    		item.setAllTags((String[]) ArrayUtils.addAll(tags,resProps.get("pageTag", String[].class)));
	    		item.setTagString(Global.tagArrayToString(tags, resProps.get("pageTag", String[].class)));
	    		//Global.removeNamespace(resProps.get("cq:tags", String[].class), resProps.get("pageTag", String[].class))
	    		//displayTags(resProps.get("cq:tags", String[].class));
	    		item.setShortDesc(resProps.get("jcr:description", String.class));
	    		item.setRank(resProps.get("rank", String.class));
	    		item.setLastModified(resProps.get("cq:lastModified", Date.class));
	    		item.setAuthor(getAuthorInfo(resProps));
	    		item.getTextLastWord(item.getLinkText());
	    		resList.add(item);
			}
    	}
    	return resList;
    }
    
    /**
     * Returns author info from page properties.
     * @param pageProps
     * @return
     */
    public String getAuthorInfo(ValueMap pageProps) {
    	String author = pageProps.get("authorInfo",String.class);
    	String createdBy = pageProps.get("jcr:createdBy",String.class);
    	//logger.info("Author Info:"+author + " createdBy:"+createdBy);
    	return (author!=null) ? author : createdBy!=null? createdBy : "";
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
			toolSelected = StringUtils.isNotEmpty(properties.get(HLM.ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME, String.class));			
		}
    	return toolSelected;
	}
	
	@Override
	public HListHelper createHLM(final SlingHttpServletRequest slingRequest, final Page page, final Resource resource) {
		return new HLM(slingRequest, page, resource);
	}	
}