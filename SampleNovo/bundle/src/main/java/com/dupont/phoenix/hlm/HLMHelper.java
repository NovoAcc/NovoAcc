package com.dupont.phoenix.hlm;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.ListItem;

import javax.jcr.query.Query;
import org.apache.commons.collections.comparators.ComparatorChain;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.ArrayUtils;
import org.apache.jackrabbit.util.ISO9075;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import com.day.cq.wcm.foundation.Image;
import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @deprecated  Replaced by com.dupont.phoenix.hlm.HLM
 */
public final class HLMHelper { 
		  
    private static final Logger logger = LoggerFactory.getLogger(HLMHelper.class);
    public static final String HLM_RESOURCE_PATH = "dupont/phoenix/components/hlm";
    
    private Page page;
    private Resource resource;
    private List<ListItem> items;
	private ValueMap properties;

    public HLMHelper(final Page page, final Resource resource) {
    	this.page = page;
    	this.resource = resource;
    	this.properties = resource.adaptTo(ValueMap.class);
    }
		
    /**
     * Returns a list of matching content pages based on ContentType and siteRootNode
     * List is sorted and content pages are filtered out as per relevance logic 
     */
    public List<ListItem> getItems() {
    	//logger.info("get content items for:"+resource.getPath());
    	Iterator<Resource> resIt = findResources();
    	this.items = processResources(resIt);
    	calculateRelevancyScore();
    	sortListItems();
    	return items;
    }
	
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
    
    /**
     * Returns the repository folder path to look for content items.
     */    		
    public String getQueryPath() {
    	//TODO: site node and country language node
    	//TODO: whats the node structure for sites?
    	//String targetFolderPath = "/content/dupont";
    	Page targetFolder = page.getAbsoluteParent(2);
    	//do not use language info from the locale
    	//Locale locael = page.getLanguage(true);
    	String targetFolderPath = targetFolder.getPath();
    	//logger.info("target folder path:"+targetFolderPath);
    	return 	targetFolderPath;
    }
    
    public String cleanPath(final String path) {
    	final StringBuilder result = new StringBuilder().append(path);
    	if (!path.startsWith("/")) {
    		result.insert(0,'/');
    	}
    	if (path.endsWith("/")) {
    		result.deleteCharAt(result.length() - 1 );
    	}
    	return ISO9075.encodePath( result.toString() );
    }

    public Iterator<Resource> findResources() {
    	//logger.info("find resources....");
    	ResourceResolver resolver = resource.getResourceResolver();
    	Iterator<Resource> resourceIterator = null;
    	String effectiveTag = getEffectivePageTag();
    	final String cleanedPath = cleanPath(this.getQueryPath());
    	//logger.info("Cleaned target path:"+cleanedPath);
    	String hlmContentType = properties.get("contentType", String.class);
    	//logger.info("HLM Content Type:"+hlmContentType);
    	if (StringUtils.isNotBlank(cleanedPath)) {
    		final StringBuilder queryString = new StringBuilder( )
    		.append("/jcr:root")
    		.append(cleanedPath)
    		.append("//element(*,cq:PageContent)")
    		.append("[(@contentType='")
    		.append(hlmContentType)
    		.append("') and ")
    		.append("(@cq:tags='")
    		.append((effectiveTag!=null)?effectiveTag:"")
    		.append("')]");
    		logger.info(queryString.toString());
    		resourceIterator = resolver.findResources(StringUtils.trim(queryString.toString()),Query.XPATH);
    	}
    	return resourceIterator;		  
    }
    
    private void calculateRelevancyScore() {
    	//logger.info("calculate relevancy..");
    	String[] pageTags = page.getProperties().get("cq:tags", String[].class);
    	for(ListItem item: items) {
    		//TODO: is there a method to compare arrays for similar elements??
    		//logger.info("score for the item:"+item.getLinkURL() + " score:"+getMatchingTagsCount(item.getTags(), pageTags));
    		item.setRelevancyScore(getMatchingTagsCount(item.getTags(), pageTags));
    	}
    }
	
    public int getMatchingTagsCount(String[] aTags, String[] pageTags) {
    	//logger.info("match tags...:"+aTags.toString());
    	int ret = 0;
    	for(String tag : aTags) {
    		Boolean isMatch = ArrayUtils.contains(pageTags, tag);
    		//logger.info("contains:"+isMatch);
    		if(isMatch)
    		{
    			ret = ret+1;
    		}
    		//logger.info("ret:"+ret + " aTag:"+tag + "bTags:"+pageTags.toString());
    	}
    	return ret;
    }
    
    /**
     * Page Content (Content rendered through components) is based on
     * page data source tag.
     */
    public String getEffectivePageTagByContentType() {
    	//logger.info("get effective pgae tag......");
    	String pageContentType = page.getProperties().get("contentType", String.class);
    	String[] pageTags = page.getProperties().get("cq:tags", String[].class);
    	int pageTagsCount = (pageTags!=null)? pageTags.length : 0;
    	String tagExpr = String.format("%s:%s",GlobalConstants.ROOT_TAG_NAMESPACE,pageContentType);
    	for(int i=0; i < pageTagsCount; i++) {
    		String aTag = pageTags[i];
    		//String tagIdWithNameSpace = String.format("%s:%s",aTag.getLocalTagID(), aTag.getTagID());
    		//logger.info("tagIdWithNameSpace:"+tagIdWithNameSpace);
    		if(StringUtils.startsWith(aTag,tagExpr)){
    			return aTag;
    		}
    	}
    	return null;
    }
    
    /**
     * Page Content (Content rendered through components) is based on
     * page data source tag.
     */
    public String getEffectivePageTag() {
    	//logger.info("get effective pgae tag......");
    	String[] pageTags = page.getProperties().get("pageTag", String[].class);
    	return pageTags!=null? pageTags[0]: null;
    }

    public int getMaxItemsToDisplay() {
    	Style siteConfig = Global.getSiteConfigStyle(resource);
    	Style hlmStyle = (siteConfig!=null) ? siteConfig.getSubStyle("hlm") : null;
    	Integer maxItems = 0;//GlobalConstants.HLM_WITHOUT_CALLOUT_MAX_ALLOWED_ITEMS;
    	maxItems = (hlmStyle!=null) ? hlmStyle.containsKey("maxItems")? hlmStyle.get("maxItems", Integer.class) : maxItems : maxItems;
    	return getListSize() > maxItems ? maxItems : getListSize();
    }
    
    private List<ListItem> processResources(final Iterator<Resource> resIt) {
    	//logger.info("process resources..create list items");
    	List<ListItem> resList = new ArrayList<ListItem>();
    	while(resIt.hasNext()) {
    		Resource res = resIt.next();
    		ValueMap resProps = res.adaptTo(ValueMap.class);
    		ListItem item = new ListItem();
    		//logger.info("resource title:"+ resProps.get("jcr:title", String.class) +" path:"+res.getPath());
    		item.setContentType(resProps.get("contentType", String.class));
    		item.setName(res.getName());
    		item.setTitle(resProps.get("jcr:title", String.class));
    		item.setPageTitle(resProps.get("pageTitle", String.class));
    		//This covers most of the item display
    		//Exception: Page Title is displayed only when one item is display across whole page
    		item.setLinkText(item.getTitle());
    		item.setLinkURL(String.format("%s.html",res.getParent().getPath()));
    		Image image = new Image(res, "thumbnail");
    		image.setSelector(".img");
    		item.setThumbnail(image);
    		//TODO: need to create renditions
    		//item.setMediumThumbnail();
    		//Page resPage = res.adaptTo(Page.class);
    		item.setTags(resProps.get("cq:tags", String[].class));
    		//displayTags(resProps.get("cq:tags", String[].class));
    		item.setShortDesc(resProps.get("jcr:description", String.class));
    		item.setRank(resProps.get("rank", String.class));
    		item.setLastModified(resProps.get("cq:lastModified", Date.class));
    		item.setAuthor(getAuthorInfo(resProps));
    		//logger.info(item.toString());
    		resList.add(item);
    	}
    	return resList;
    }
    
    /*private void displayTags(String[] tags) {
    	//logger.info("display tags:"+(tags!=null?tags.length:0));
    	for(int i=0; i < tags.length; i++) {
    		//logger.info("list item tag:"+tags[i]);
    	}
    }*/
	 
    public String getAuthorInfo(ValueMap pageProps) {
    	String author = pageProps.get("authorInfo",String.class);
    	String createdBy = pageProps.get("jcr:createdBy",String.class);
    	//logger.info("Author Info:"+author + " createdBy:"+createdBy);
    	return (author!=null) ? author : createdBy!=null? createdBy : "";
    }
    
    public Boolean showRowCallout() {
    	Boolean showRowCallout = properties.containsKey("showHideRowCallout")? properties.get("showHideRowCallout", Boolean.class): false;
    	//logger.info("showHideRowCallout:"+showRowCallout +" TEST:" + properties.get("showHideRowCallout", Boolean.class));
    	return !showRowCallout;
    }
    
    public Boolean showViewAll() {
    	Integer maxLimit = 0;
    	if(showRowCallout()) {
    		//maxLimit = (properties.containsKey("maxitemsviewallwithcallout")? properties.get("maxitemsviewallwithcallout", Integer.class): GlobalConstants.HLM_VIEWALL_WITHCALLOUT_MAX_ITEMS);
    	} else {
    		//maxLimit = (properties.containsKey("maxitemsviewallwithcallout")? properties.get("maxitemsviewallwithcallout", Integer.class): GlobalConstants.HLM_VIEWALL_WITHOUTCALLOUT_MAX_ITEMS);
    	}
		return getListSize() > maxLimit;
    }

    public int getListSize () {
    	return (this.items!=null) ? this.items.size() :  0;
    }
    
    public String getJQueryColViewClass() {
    	String ret = null;
    	int listSize = getListSize();
    	int maxItems = getMaxItemsToDisplay();
    	int nrOfItemsToDisplay = (listSize > maxItems) ? maxItems : listSize; 
    	if(showRowCallout()) {
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
    	return (ret!=null) ? String.format("horizontal_list_module_%s_col", ret) : "";
    }
    
    private void sortListItems() {
    	//logger.info("sorting...");
    	ComparatorChain chain = new ComparatorChain();
        chain.addComparator(RelevancyScoreComparator.DESCENDING);
        chain.addComparator(RankComparator.ASCENDING);
        chain.addComparator(LastModificationDateComparator.DESCENDING);
    	Collections.sort(items, chain);
    	//logger.info("sorting done...");
    }
	  
	  public String getListType(int listSize) {
		  String ret="";
		  switch(listSize) {
		  	case 1:
		  		//only one it so it should be displayed across full page
		  		ret="listitem-full-page-width";
		  		break;
		  	case 2:			  
		  		//display one item half the page and second item one third page
		  		ret="listitem-half-page-width";
		  		break;
		  	case 3: case 5: case 6: case 7: case 8:
		  	case 9:
		  		//display all items one third page width space
		  		ret="listitem-onethird-page-width";
		  		break;
		  	case 4: case 10: case 11:
		  	case 12:
		  	default:
			  	//display all items one third page width space
			  	ret="listitem-onefourth-page-width";
			  	break;
		  }
		  return ret;
	  }
	  
	  public String getListTypeWithCallout(int listSize) {
		  String ret="";
		  switch(listSize) {
		  	case 1:
		  		//display this item across two third page width space
		  		ret="listitem-twothird-page-width";
		  		break;
		  	case 2:			  
		  	default:
			  	//display every item within one third page width space
		  		ret="listitem-onethird-page-width-with-callout";
		  		break;
		  }
		  return ret;
	  }
}