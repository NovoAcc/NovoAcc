/**
 * 
 */
package com.dupont.phoenix.hlm.viewall;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.hlm.HLMWrapper;
import com.dupont.phoenix.hlm.LastModificationDateComparator;
import com.dupont.phoenix.hlm.StringComparator;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;
import com.dupont.phoenix.mchlm.beans.ViewAllBean;
import com.dupont.phoenix.taglibs.context.JSPContext;

/**
 * @author A.Shashi.Chaurasia
 *
 */
public class ViewAll extends ViewAllHelper {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ViewAll.class);
	private ViewAllBean viewAllBean;
	private String contentTypeName = null;
	private static final String DEFAULT = "default";
	private String key = "";
	
	/**
	 * @return the contentTypeName
	 */
	public String getContentTypeName() {
		return contentTypeName;
	}


	/**
	 * @param contentTypeName the contentTypeName to set
	 */
	public void setContentTypeName(String contentTypeName) {
		this.contentTypeName = contentTypeName;
	}
	/**
	 * @return the viewAllBean
	 */
	public ViewAllBean getViewAllBean() {
		return viewAllBean;
	}
	/**
	 * 
	 * @param jspContext
	 */
	public ViewAll(final JSPContext jspContext){
		super(jspContext);
		LOGGER.debug("ViewAll Constructor");
		long startTime = System.nanoTime();
		initViewAllEnhance();
		setFilterByText(FILTER_BY);
		setMoreText(MORE);
		setOnlyShowMeText(ONLY_SHOW_ME);
		setResultsText(RESULTS);
		setShowAllText(SHOW_ALL);
		setShowMoreText(SHOW_MORE);
		setViewText(VIEW);
		setOfText(OF);
		setSelectYourFilterText(SELECT_YOUR_FILTER);
		setAddFilterText(ADD_FILTER);
		setAllCotentTypesText(ALL_CONTENT_TYPE);
		setShowLessText(SHOW_LESS);
		setNoResultsText(NO_RESULT);
		long endTime = System.nanoTime();
		//Convert Nano seconds to seconds.
		double seconds = (endTime - startTime) / 1000000000;
		LOGGER.info("Execution Time In Seconds :: "+ seconds);
	}
	/**
	 * 
	 */
	private void initViewAllEnhance(){
		LOGGER.debug("initViewAllEnhance method");
		HLMWrapper hlmWrapper = (HLMWrapper)getSlingRequest().getAttribute("hlmWrapper");
		if(hlmWrapper==null) {
	        hlmWrapper = new HLMWrapper(getSlingRequest(),getCurrentPage());
	        getSlingRequest().setAttribute("hlmWrapper", hlmWrapper);
	    }
	    final HListHelper hListHelper = hlmWrapper.getHLMById(Global.getSelectorByIndex(getSlingRequest(),1));
	    if(hListHelper!=null) {
	    	if(hListHelper.getContentTypeName()!= null){
	    		setContentTypeName(Global.getTranslatedText(getCurrentPage(), getSlingRequest(), hListHelper.getContentTypeName()));
	    	}
	    	
			if(hListHelper.getListSize() > 0) {
				//Press Releases - Last Modification Date Descending
	            if(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME.equalsIgnoreCase(hListHelper.getContentType())) {
					hListHelper.addSortingComparator(LastModificationDateComparator.DESCENDING);				
				} else {
					hListHelper.addSortingComparator(StringComparator.ASCENDING_IGNORECASE);
				}
				hListHelper.sortListItems();
			}
			viewAllBean = new ViewAllBean();
			viewAllBean.setResults(hListHelper.getListItems());
			viewAllBean.setTaxonomyFilters(getTaxonomyList(getTagsSet(),getResourceResolver(), getCurrentPage().getLanguage(false), getTagsFromFacetConfigurations()));
			viewAllBean.setSitecatalystValue(key.replace('-', ':'));
	    }
	}
	/**
	 * 
	 * @return
	 */
	private String[] getTagsFromFacetConfigurations() {
		LOGGER.debug("createTaxonomyFacet method call");
        String[] taxonomyFacetsconf = null;
        key = concateTemplateAndHLM();
        String configPagePath = getConfigurationPath("viewallconfiguration");//String configPagePath = "/etc/dupont/phoenix/viewallconfig";
        
        if(!StringUtils.isEmpty(configPagePath)){
        	 Resource configPageRes = getResourceResolver().getResource(configPagePath);
        	 if(configPageRes != null){
             Resource configRes = configPageRes.getChild("jcr:content/openareapar/viewallconfig");
             if (configRes != null) {
                    ValueMap props = configRes.adaptTo(ValueMap.class);
                    if (props != null) {
                          taxonomyFacetsconf = props.containsKey(key) ? props.get(
                         		 key, String[].class) : props.get(DEFAULT, String[].class);
                    }
             }
        	 }
        }
        return taxonomyFacetsconf;
	}
	/**
	 * 
	 * @return
	 */
	public Set<String> getTagsSet(){
		List<ListItem> listOFListItem = viewAllBean.getResults();
		Set<String> uniqueTags = new HashSet<String>();
		if(listOFListItem != null && !listOFListItem.isEmpty()){
			for (ListItem listItem : listOFListItem) {
				String[] allTags = listItem.getAllTags();
				for (String tag : allTags) {
					uniqueTags.add(tag);
				}
			}
		}
		return uniqueTags;
	}
}
