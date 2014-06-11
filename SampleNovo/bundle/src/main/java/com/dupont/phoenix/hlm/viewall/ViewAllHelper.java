package com.dupont.phoenix.hlm.viewall;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.comparators.ComparatorChain;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.commons.TaxonomyFacet;
import com.dupont.phoenix.list.ListItem;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;

public class ViewAllHelper extends AbstractController {

	private static final Logger LOGGER = LoggerFactory.getLogger(ViewAllHelper.class);
	private boolean isMCLP = false;
	private List<ListItem> listItem = new ArrayList<ListItem>();
	private String contentTypeName = null;
	private int listSize = 0;
	private String resultsText;
	private String onlyShowMeText;
	private String viewText;
	private String showAllText;
	private String showMoreText;
	private String moreText;
	private String filterByText;
	private String ofText;
	private String showLess;
	private String selectYourFilterText;
	private String addFilterText;
	private String allCotentTypesText;
	private String showLessText;
	private String noResultsText;
	
	private ComparatorChain chain = null;
	//Constants
	public static final String FILTER_BY = "filter-by";
	public static final String MORE = "more";
	public static final String ONLY_SHOW_ME = "only-show-me";
	public static final String RESULTS = "results";
	public static final String SHOW_ALL = "Show All";
	public static final String SHOW_MORE = "show-more";
	public static final String VIEW = "view";
	public static final String OF = "of";
	public static final String SELECT_YOUR_FILTER = "select-your-filter";
	public static final String ADD_FILTER = "add-filter";
	public static final String ALL_CONTENT_TYPE = "all-content-type";
	public static final String SHOW_LESS = "Show Less";
	public static final String NO_RESULT = "No-Result";
	protected static final String CONTENT_TYPE = "contentType";
	
	

	/**
	 * @return the listSize
	 */
	public int getListSize() {
		return listSize;
	}

	/**
	 * @param listSize
	 *            the listSize to set
	 */
	public void setListSize(int listSize) {
		this.listSize = listSize;
	}

	/**
	 * @return the listItem
	 */
	public List<ListItem> getListItem() {
		return listItem;
	}

	/**
	 * @param listItem
	 *            the listItem to set
	 */
	public void setListItem(List<ListItem> listItem) {
		this.listItem = listItem;
	}

	private static final Logger logger = LoggerFactory
			.getLogger(ViewAllHelper.class);

	public ViewAllHelper(final JSPContext context) {
		super(context);
		logger.debug("ViewAllHelper Constructor");
	}

	/**
	 * @return the contentTypeName
	 */
	public String getContentTypeName() {
		return contentTypeName;
	}

	/**
	 * @param contentTypeName
	 *            the contentTypeName to set
	 */
	public void setContentTypeName(String contentTypeName) {
		this.contentTypeName = contentTypeName;
	}

	private void viewAllType() {
		String template = getCurrentPage().getContentResource()
				.getResourceType();
		if (template.equals(GlobalConstants.MC_LANDING_PAGE)) {
			setMCLP(true);
		}
	}

	private void initialize() {
		viewAllType();
	}

	public boolean isMCLP() {
		initialize();
		return isMCLP;
	}

	public void setMCLP(boolean isMCLP) {
		this.isMCLP = isMCLP;
	}
	/**
	 * @return the resultsText
	 */
	public String getResultsText() {
		return resultsText;
	}

	/**
	 * @param resultsText the resultsText to set
	 */
	public void setResultsText(String resultsText) {
		this.resultsText = getTranslatedText(resultsText);
	}

	/**
	 * @return the onlyShowMeText
	 */
	public String getOnlyShowMeText() {
		return onlyShowMeText;
	}

	/**
	 * @param onlyShowMeText the onlyShowMeText to set
	 */
	public void setOnlyShowMeText(String onlyShowMeText) {
		this.onlyShowMeText = getTranslatedText(onlyShowMeText);
	}

	/**
	 * @return the viewText
	 */
	public String getViewText() {
		return viewText;
	}

	/**
	 * @param viewText the viewText to set
	 */
	public void setViewText(String viewText) {
		this.viewText = getTranslatedText(viewText);
	}

	/**
	 * @return the showAllText
	 */
	public String getShowAllText() {
		return showAllText;
	}

	/**
	 * @param showAllText the showAllText to set
	 */
	public void setShowAllText(String showAllText) {
		this.showAllText = getTranslatedText(showAllText);
	}

	/**
	 * @return the showMoreText
	 */
	public String getShowMoreText() {
		return showMoreText;
	}

	/**
	 * @param showMoreText the showMoreText to set
	 */
	public void setShowMoreText(String showMoreText) {
		this.showMoreText = getTranslatedText(showMoreText);
	}

	/**
	 * @return the moreText
	 */
	public String getMoreText() {
		return moreText;
	}

	/**
	 * @param moreText the moreText to set
	 */
	public void setMoreText(String moreText) {
		this.moreText = getTranslatedText(moreText);
	}

	/**
	 * @return the filterByText
	 */
	public String getFilterByText() {
		return filterByText;
	}

	/**
	 * @param filterByText the filterByText to set
	 */
	public void setFilterByText(String filterByText) {
		this.filterByText = getTranslatedText(filterByText);
	}

	/**
	 * @return the ofText
	 */
	public String getOfText() {
		return ofText;
	}

	/**
	 * @param ofText the ofText to set
	 */
	public void setOfText(String ofText) {
		this.ofText = getTranslatedText(ofText);
	}

	/**
	 * @return the showLess
	 */
	public String getShowLess() {
		return showLess;
	}

	/**
	 * @param showLess the showLess to set
	 */
	public void setShowLess(String showLess) {
		this.showLess = showLess;
	}


	/**
	 * 
	 * @return view all siteconfig
	 */
	public Style getViewAllSiteConfigStyle() {
		Style viewallSiteConfig = Global.getSiteConfigStyle(getResource());
		return (viewallSiteConfig != null) ? viewallSiteConfig
				.getSubStyle("viewallconfiguration") : null;
	}

	/**
	 * Get configuration path from site config
	 */
	public String getConfigurationPath(String viewalltype) {
		Style viewallstyle = getViewAllSiteConfigStyle();
		String configurationPath = (viewallstyle != null) ? viewallstyle.get(
				viewalltype, String.class) : "";
		return configurationPath;
	}

	/**
	 * Gets the tag list.
	 * 
	 * @param tag
	 *            the tag
	 * @return the tag list
	 */
	public List<TaxonomyFacet> getTaxonomyList(Set<String> alltags,
			ResourceResolver resourceResolver, Locale locale, String... tag) {
		List<TaxonomyFacet> tagList = null;
		Set<String> allsettags = getAllPageTags(alltags);
		if (tag == null || tag.length < 1) {
			return tagList;
		} else {
			tagList = new ArrayList<TaxonomyFacet>();
			TagManager tagManager = resourceResolver.adaptTo(TagManager.class);
			for (String tagParam : tag) {
				if (StringUtils.isNotEmpty(tagParam)
						&& allsettags.contains(tagParam)) {
					TaxonomyFacet taxomomytag = new TaxonomyFacet(
							tagManager.resolve(tagParam), locale, allsettags);
					tagList.add(taxomomytag);
				}
			}

			return tagList;
		}
	}

	public Set<String> getAllPageTags(Set<String> tags) {
		Set<String> allMixedTags = new HashSet<String>();
		for (String tag : tags) {
			String[] subTags = StringUtils.split(tag, "/");
			if (subTags.length == 3) {
				allMixedTags.add(subTags[0]);
				allMixedTags.add(subTags[0] + "/" + subTags[1]);
				allMixedTags.add(tag);
			} else if (subTags.length == 2) {
				allMixedTags.add(subTags[0]);
				allMixedTags.add(tag);
			} else if (subTags.length == 1) {
				allMixedTags.add(tag);
			}
		}
		return allMixedTags;
	}

	public Set<String> getAllPageTags(Map<String, Set<String>> tags) {

		Set<String> allTagList = new HashSet<String>();

		for (Map.Entry<String, Set<String>> map : tags.entrySet()) {

			List<String> setList = new ArrayList<String>(map.getValue());

			allTagList.addAll(setList);

		}

		return allTagList;

	}
	/**
	 * Fetch contentType from page.
	 * @return
	 */
	public String fetchTemplateContentType() {
		ValueMap valueMap = getCurrentPage().getProperties(); 
		return (String) valueMap.get(CONTENT_TYPE);
	}
	public String concateTemplateAndHLM(){
		String contentTypeValue = fetchTemplateContentType();
        LOGGER.info("tamplateName :: "+contentTypeValue);
        String selector = Global.getSelectorByIndex(getSlingRequest(),1);
        String key = "";
        if(selector.contains("hlm-")){
        	String hlmType = selector.substring(selector.indexOf('-') + 1, selector.length());
        	key = contentTypeValue +"-"+hlmType;
        }
		return key;
	}
	private String getTranslatedText(String text){
		return Global.getTranslatedText(getCurrentPage(), getSlingRequest(), text);
	}

	/**
	 * @return the selectYourFilterText
	 */
	public String getSelectYourFilterText() {
		return selectYourFilterText;
	}

	/**
	 * @param selectYourFilterText the selectYourFilterText to set
	 */
	public void setSelectYourFilterText(String selectYourFilterText) {
		this.selectYourFilterText = getTranslatedText(selectYourFilterText);
	}

	/**
	 * @return the addFilterText
	 */
	public String getAddFilterText() {
		return addFilterText;
	}

	/**
	 * @param addFilterText the addFilterText to set
	 */
	public void setAddFilterText(String addFilterText) {
		this.addFilterText = getTranslatedText(addFilterText);
	}

	/**
	 * @return the allCotentTypesText
	 */
	public String getAllCotentTypesText() {
		return allCotentTypesText;
	}

	/**
	 * @param allCotentTypesText the allCotentTypesText to set
	 */
	public void setAllCotentTypesText(String allCotentTypesText) {
		this.allCotentTypesText = getTranslatedText(allCotentTypesText);
	}
	/**
     * Apply HLM Sorting for all list itmes
     */
    @SuppressWarnings("unchecked")
	public List<ListItem> sortListItems(List<ListItem> items) {
    	Collections.sort(items, chain);
		return items;
    }
    public void addSortingComparator(Comparator<ListItem> comparator) {
    	if(chain==null) {
            chain = new ComparatorChain();    		
    	}
    	chain.addComparator(comparator);
    }

	/**
	 * @return the showLessText
	 */
	public String getShowLessText() {
		return showLessText;
	}

	/**
	 * @param showLessText the showLessText to set
	 */
	public void setShowLessText(String showLessText) {
		this.showLessText = getTranslatedText(showLessText);
	}
	/**
	 * @return the noResultsText
	 */
	public String getNoResultsText() {
		return noResultsText;
	}

	/**
	 * @param noResultsText the noResultsText to set
	 */
	public void setNoResultsText(String noResultsText) {
		this.noResultsText = getTranslatedText(noResultsText);
	}
}
