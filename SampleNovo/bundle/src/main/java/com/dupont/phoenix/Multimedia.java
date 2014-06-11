package com.dupont.phoenix;

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

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.commons.Scene7Image;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;

public class Multimedia extends HListHelper {

	//private static final Logger logger = LoggerFactory
	//		.getLogger(Multimedia.class);
	public static final String RESPONSIVE_MULTIMEDIA_RESOURCE_PATH = "dupont/phoenix/components/responsive/multimedia";
	public String contentType;
	public Integer imgCount =0;
	public Integer vidCount=0;
	
	public static final Integer WITHOUT_CALLOUT_MAX_ALLOWED_ITEMS = 3;
	
	//List without Callout view names
	public static final String LISTITEM_FULLPAGE_VIEW_NAME="listitem-full-page-width";
	public static final String LISTITEM_HALFPAGE_VIEW_NAME="listitem-half-page-width";
	public static final String LISTITEM_ONETHIRDPAGE_VIEW_NAME="listitem-onethird-page-width";

	public Multimedia() {
	}

	public Multimedia(final SlingHttpServletRequest slingRequest,
			final Page page, final Resource resource) {
		super(slingRequest, page, resource);
		initList();
	}

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
		// Page targetFolder = page.getAbsoluteParent(1);
		String targetFolderPath = page.getPath();
		List<String> options = new ArrayList<String>();
		ResourceResolver resolver = resource.getResourceResolver();
		Iterator<Resource> resourceIterator = null;
		if (StringUtils.isNotBlank(targetFolderPath)) {
			String contentTypeOption = getQueryContentTypesOption();
			if (contentTypeOption != null) {
				options.add(contentTypeOption);
			}
			resourceIterator = findResourcesByQuery(resolver, targetFolderPath,
					options, "");
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
		//if (hlmContentType != null) {
			final String multimediaContTypes = "multimedia".equalsIgnoreCase(hlmContentType) ? String.format(
					"(@jcr:content/contentType='%s' or @jcr:content/contentType='%s')",
					GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME,
					GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME) : "";
			return multimediaContTypes;
		//}
		//return null;
	}

	public String getContentType() {
		return "multimedia";
	}

	/**
	 * Iterate through query results and create List<ListItem>.
	 * 
	 * @param resIt
	 * @return
	 */
	protected List<ListItem> processResources(final Iterator<Resource> resIt) {
		List<ListItem> resList = new ArrayList<ListItem>();
		if (resIt == null){
			return resList;
		}
		// final String langCountryPathRegEx =
		// String.format("/%s/",Global.getLangCountryCode(page));
		// final String langPathRegEx =
		// String.format("/%s/",Global.getLangCode(page));
		while (resIt.hasNext()) {
    		Resource res = resource.getResourceResolver().getResource(resIt.next(), "jcr:content");
			// if
			// (StringUtils.containsIgnoreCase(res.getPath(),langCountryPathRegEx)
			// || StringUtils.containsIgnoreCase(res.getPath(),langPathRegEx)) {
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
			item.setLinkURL(String.format("%s.html",
					Global.getNavigationURL(slingRequest, resPage, false)));
			Image image = new Scene7Image(res, "thumbnail");
			image.setSelector(".img");
			item.setThumbnail(image);
			item.setImageContent(image.hasContent());
			item.setThumbnailPath(((Scene7Image)image).getScene7ImageSrc());
			String[] tags = resProps.get("cq:tags", String[].class);
    		item.setTags(tags);
    		item.setAllTags((String[]) ArrayUtils.addAll(tags,resProps.get("pageTag", String[].class)));
    		item.setTagString(Global.tagArrayToString(tags, resProps.get("pageTag", String[].class)));
			item.setShortDesc(resProps.get("jcr:description", String.class));
			item.setRank(resProps.get("rank", String.class));
			// check if author has entered publish date in content detail headline component
			item.setPublished(Global.getCreateDate(res)!=null?Global.getCreateDate(res):resProps.get("cq:lastModified", Date.class));
    		item.setLastModified(resProps.get("cq:lastModified", Date.class));
			resList.add(item);
			// }
		}
		return resList;
	}

	@Override
	public int getMaxDisplayItemsCount() {
		// Style hlmStyle = getHLMSiteConfigStyle();
		return  WITHOUT_CALLOUT_MAX_ALLOWED_ITEMS;
		//return  maxItems;
	}

	@Override
	public ListItem getCalloutItem() {
		return null;
	}

	@Override
	public Boolean isCalloutActive() {
		return false;
	}
	
	@Override
	public Boolean isCalloutToolSelected() {
		return false;
	}
	
	public int getTilesCount(){
		int tilesCount = 0;
		
		if(imgCount>=1 && vidCount>=1){
			tilesCount = 3;
		}else if(imgCount>=1 || vidCount>=1){
			tilesCount = 2;
		}else{			
			tilesCount = 1;
		}
		return tilesCount;	
	} 
		
    public String getListViewType() {    	
    	
    	return getListViewTypeWithoutCallout();
    }
    
    private String getListViewTypeWithoutCallout() {
    	String ret="";
    	switch(getTilesCount()) {    	
	    	case 1:
	    		//only one it so it should be displayed across full page
	    		ret=HListHelper.LISTITEM_FULLPAGE_VIEW_NAME;
	    		break;
	    	case 2:			  
	    		//display one item half the page and second item one third page
	    		ret=HListHelper.LISTITEM_HALFPAGE_VIEW_NAME;
	    		break;
	    	case 3: 
	    		//display all items one third page width space
	    		ret=HListHelper.LISTITEM_ONETHIRDPAGE_VIEW_NAME;
	    		break;
	    	default:
	    		break;
	    	}
    	return ret;
    }

	@Override
	public HListHelper createHLM(SlingHttpServletRequest slingRequest,
			Page page, Resource resource) {
		return new Multimedia(slingRequest, page, resource);
	}


}