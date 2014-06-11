package com.dupont.phoenix.list;

import java.util.Collections;
import java.util.Comparator;

import org.apache.commons.collections.comparators.ComparatorChain;
import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.hlm.HLM;

public abstract class HListHelper extends ListHelper { 

//	private static final Logger logger = LoggerFactory.getLogger(HListHelper.class);
    public static final String WITHOUT_CALLOUT_MAX_ITEMS_PROPERTY_NAME="maxDisplayItemsWithoutCallout";
    public static final String WITH_CALLOUT_MAX_ITEMS_PROPERTY_NAME="maxDisplayItemsWithCallout";
    public static final String WITH_CALLOUT_VIEWALL_MAXITEMS_PROPERTY_NAME="maxItemsViewAllWithCallout";
    public static final String WITHOUT_CALLOUT_VIEWALL_MAXITEMS_PROPERTY_NAME="maxItemsViewAllWithoutCallout";
    public static final String ROW_CALLOUT_SHOW_HIDE_PROPERTY_NAME="showHideRowCallout";
    public static final String JQUERY_COLVIEW_CLASS="horizontal_list_module_%s_col";
    public static final String ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME="selectedTool";
    
	public static final Integer WITH_CALLOUT_VIEWALL_MAX_ITEMS = 2;
	public static final Integer WITHOUT_CALLOUT_VIEWALL_MAX_ITEMS = 4;
	public static final Integer WITHOUT_CALLOUT_MAX_ALLOWED_ITEMS = 12;
	public static final Integer WITH_CALLOUT_MAX_ALLOWED_ITEMS = 6;
	
	//List without Callout view names
	public static final String LISTITEM_FULLPAGE_VIEW_NAME="listitem-full-page-width";
	public static final String LISTITEM_HALFPAGE_VIEW_NAME="listitem-half-page-width";
	public static final String LISTITEM_ONETHIRDPAGE_VIEW_NAME="listitem-onethird-page-width";
	public static final String LISTITEM_ONEFOURTHPAGE_VIEW_NAME="listitem-onefourth-page-width";

	//List With Callout view names
	public static final String LISTITEM_TWOTHIRDPAGE_VIEW_NAME="listitem-twothird-page-width";
	public static final String CALLOUT_LISTITEM_ONETHIRDPAGE_VIEW_NAME="listitem-onethird-page-width-with-callout";

	public abstract ListItem getCalloutItem();
    public abstract Boolean isCalloutActive();
    public abstract Boolean isCalloutToolSelected();
    public abstract int getMaxDisplayItemsCount();
	protected abstract void initList();
    
    protected Page page;
    protected ValueMap pageProperties;
    protected Resource resource;
    protected ValueMap properties;
    protected Boolean inited = false;
    protected String id;
    protected SlingHttpServletRequest slingRequest;
	ComparatorChain chain = null;
	private String contentTabName;
	
    public HListHelper() {
    	
    }
	
    public HListHelper(final SlingHttpServletRequest slingRequest, final Page page,
    		final Resource resource) {
    	this.slingRequest = slingRequest;
    	this.page = page;
    	this.resource = resource;
    	this.properties = resource.adaptTo(ValueMap.class);
    	this.pageProperties = page.getProperties();
        setContentTabName(getContentType());
        setId(generateId(this.getContentTabName()));
    }
		
    public String getListViewType() {    	
    	return isCalloutActive() ? getListViewTypeWithCallout() : getListViewTypeWithoutCallout();
    }
    
    private String getListViewTypeWithoutCallout() {
    	String ret="";
    	switch(getListSize()) {    	
	    	case 1:
	    		//only one it so it should be displayed across full page
	    		ret=HListHelper.LISTITEM_FULLPAGE_VIEW_NAME;
	    		break;
	    	case 2:			  
	    		//display one item half the page and second item one third page
	    		ret=HListHelper.LISTITEM_HALFPAGE_VIEW_NAME;
	    		break;
	    	case 3: case 5: case 6: case 7: case 8:
	    	case 9:
	    		//display all items one third page width space
	    		ret=HListHelper.LISTITEM_ONETHIRDPAGE_VIEW_NAME;
	    		break;
	    	case 4: case 10: case 11:
	    	case 12:
	    	default:
	    		//display all items one third page width space
	    		ret=HListHelper.LISTITEM_ONEFOURTHPAGE_VIEW_NAME;
	    		break;
	    	}
    	return ret;
    }
	  
    private String getListViewTypeWithCallout() {
    	String ret="";
    	switch(getListSize()) {
    		case 1:
    			//display this item across two third page width space
    			ret=HListHelper.LISTITEM_TWOTHIRDPAGE_VIEW_NAME;
		  		break;
    		case 2:			  
    		default:
    			//display every item within one third page width space
		  		ret=HListHelper.CALLOUT_LISTITEM_ONETHIRDPAGE_VIEW_NAME;
		  		break;
    	}
    	return ret;
    }
    
    /**
     * Show/Hide HLM Flag
     * @return
     */
    public Boolean showHLM() {
    	return !(properties.containsKey("showHide") ? properties.get("showHide", Boolean.class) : false);    	
    }

    public String getContentTypeName() {
    	String contentType = getContentType();
    	Style hlmStyle = this.getHLMSiteConfigStyle();
    	return (hlmStyle!=null? hlmStyle.get(contentType, String.class) :"");
    }
    
    public String getContentType () {
    	return properties.get("contentType",String.class);    	
    }

    public static String getId(final Resource res) {
    	return generateId(res);
    }

    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

    public void addSortingComparator(Comparator<ListItem> comparator) {
    	if(chain==null) {
            chain = new ComparatorChain();    		
    	}
    	chain.addComparator(comparator);
    }
   /* 
	public Boolean isCalloutToolSelected() {
		Boolean toolSelected = false;	
		if(properties.containsKey(HLM.ROW_CALLOUT_SELECTED_TOOL_PROPERTY_NAME)){
			toolSelected = (properties.get("selectedTool", String.class)!= null);			
		}
    	return toolSelected;
	}*/

	/*
	 * Calculate relevancy score for all items within the list.
	 */
    public void calculateRelevancyScore() {
    	String[] pageTags = page.getProperties().get("cq:tags", String[].class);
    	if(pageTags!=null && pageTags.length>0) {
	    	for(ListItem item: items) {
	    		item.setRelevancyScore(getMatchingTagsCount(item.getTags(), pageTags));
	    	}
    	}
    	
    }
	
    /**
     * Return count for matching tags for an item.
     * @param aTags
     * @param pageTags
     * @return
     */
    public int getMatchingTagsCount(String[] aTags, String[] pageTags) {
    	int ret = 0;
    	if(aTags!=null && aTags.length>0) {
			for(String tag : aTags) {
				Boolean isMatch = ArrayUtils.contains(pageTags, tag);
				if(isMatch) {
					ret = ret+1;
				}
			}
    	}
    	return ret;
    }
        
    /**
     * Generate HLM ID, which is path within the repository.
     * @param res
     * @return
     */
    protected static String generateId(final Resource res) {
        String path = res.getPath();
        final String rootMarker = "jcr:content/";
        final int root = path.indexOf(rootMarker);
        if (root >= 0) {
            path = path.substring(root + rootMarker.length());
        }
        return path.replace('/', '_');
    }
    
    /**
	 * Generate HLM ID, which is path within the repository.
	 * 
	 * @param res
	 * @return
	 */
	protected static String generateId(final String res) {
		return "hlm-"+res;
	}
    
    /**
     * Used to check if view all buttons should be displayed or not. 
     * @return
     */
    public Boolean showViewAll() {
    	Integer maxLimit = null;
    	Style hlmStyle = getHLMSiteConfigStyle();
    	if(isCalloutActive()) {
    		maxLimit = hlmStyle != null ? hlmStyle.get(HLM.WITH_CALLOUT_VIEWALL_MAXITEMS_PROPERTY_NAME, Integer.class) : HLM.WITH_CALLOUT_VIEWALL_MAX_ITEMS;
    	} else {
    		maxLimit = hlmStyle != null ? hlmStyle.get(HLM.WITHOUT_CALLOUT_VIEWALL_MAXITEMS_PROPERTY_NAME, Integer.class) : HLM.WITHOUT_CALLOUT_VIEWALL_MAX_ITEMS;
    	}
    	//logger.info("max limit for view all:"+maxLimit);
		return (getListSize() > maxLimit);
    }

    /**
     * Returns CSS Class name for JQuery Carousel Navigation
     * @return
     */
    public String getJQueryColViewClass() {
    	String ret = null;
    	int listSize = getListSize();
    	int maxItems = getMaxDisplayItemsCount();
    	int nrOfItemsToDisplay = (listSize > maxItems) ? maxItems : listSize; 
    	if(isCalloutActive()) {
    		ret = (nrOfItemsToDisplay > 2) ?	"2-3" : null;
    	} else {
  		  switch(nrOfItemsToDisplay) {
		  	case 5: case 6: case 7: case 8:
		  	case 9:
		  		ret="3";
		  		break;
		  	case 10: case 11:
		  	case 12:
			  	ret="4";
			  	break;
		  	default:
			  	ret=null;
			  	break;
		  }    		
    	}    	
    	return (ret!=null) ? String.format(HLM.JQUERY_COLVIEW_CLASS, ret) : "static-hlm";
    }

	/**
	 * For example, on a brand page, show related brands within BRAND HLM
	 * @return
	 */
	public Boolean showRelatedContent() {
		//Check the contentType of the page, and contentType of HLM
		//if both match, show related content
		final Boolean contentTypeMatch = StringUtils.equals(getContentType(), Global.getStringPropValue(pageProperties,"contentType"));
    	//return  Global.getBooleanPropValue(properties, "showRelatedContent") ? contentTypeMatch : false;
		return contentTypeMatch;
	}
	
    
    /**
     * Apply HLM Sorting for all list itmes
     */
    public void sortListItems() {
    	Collections.sort(items, chain);
    }

    /**
     * Returns pageTag from the currentPage.
     * @return
     */
    public String getPageTag() {
    	String[] pageTags = page.getProperties().get("pageTag", String[].class);
    	return pageTags!=null && pageTags.length > 0? pageTags[pageTags.length-1]: "";
    }

    /**
     * Return HLM SiteConfig Style.
     * @return
     */
    public Style getHLMSiteConfigStyle() {
    	Style siteConfig = Global.getSiteConfigStyle(resource);
    	return (siteConfig!=null) ? siteConfig.getSubStyle("hlm") : null;    	
    }
            
	public abstract HListHelper createHLM(final SlingHttpServletRequest slingRequest, final Page page, final Resource resource);
	
	public String getContentTabName() {
        //logger.info("Content Tab Text:"+contentTabName);
		return contentTabName;
	}
	public void setContentTabName(String contentTabName) {
		this.contentTabName = contentTabName;
	}		
            
}