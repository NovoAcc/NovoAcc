package com.dupont.phoenix.mchlm.viewall;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;
import com.dupont.phoenix.commons.TaxonomyFacet;
import com.dupont.phoenix.commons.services.search.ContentType;
import com.dupont.phoenix.hlm.HLMFactory;
import com.dupont.phoenix.hlm.HLMWrapper;
import com.dupont.phoenix.hlm.LastModificationDateComparator;
import com.dupont.phoenix.hlm.PublishDateComparator;
import com.dupont.phoenix.hlm.viewall.ViewAllHelper;
import com.dupont.phoenix.list.HListHelper;
import com.dupont.phoenix.list.ListItem;
import com.dupont.phoenix.mchlm.beans.ViewAllBean;
import com.dupont.phoenix.mchlm.pressreleashlm.PressReleaseHLM;
import com.dupont.phoenix.taglibs.context.JSPContext;

public class MCViewAllHelper extends ViewAllHelper {
	/**
	 * Basic variables declaration
	 */
	private ViewAllBean mcViewAllBean;

	private Map<String, Set<String>> facetsMappings;

	private Map<String, Set<String>> taxonomyTextfacetsMappings;
	
	private Map<String, List<ListItem>> results;
	private static final Logger logger = LoggerFactory
			.getLogger(MCViewAllHelper.class);

	/**
	 * Constructor
	 */
	public MCViewAllHelper(final JSPContext context) {
		super(context);
	}

	/**
	 * Initialization of bean for populating results
	 */
	private void initialize() {
		logger.debug("MCViewAllHelper Constructor");
		long startTime = System.nanoTime();
		mcViewAllBean = new ViewAllBean();
		addSortingComparator(PublishDateComparator.DESCENDING);
		addSortingComparator(LastModificationDateComparator.DESCENDING);
		mcViewAllBean.setCorporateMCLP(isMclpCorporate(getCurrentPagePath()));
		mcViewAllBean.setResults(sortListItems(((getAllResults(getAllHLMs())))));
		mcViewAllBean.setPreFilterContentTypes(getPreFilterContentTypeFacets());
		// null check for gettaxonomyfacentconf is missing
		mcViewAllBean.setTaxonomyFilters(taxonomyFiltersGeneration());
		setFilterByText(FILTER_BY);
		setShowMoreText(SHOW_MORE);
		setOnlyShowMeText(ONLY_SHOW_ME);
		setMoreText(MORE);
		setShowAllText(SHOW_ALL);
		setResultsText(RESULTS);
		setOfText(OF);
		setViewText(VIEW);
		setSelectYourFilterText(SELECT_YOUR_FILTER);
		setAddFilterText(ADD_FILTER);
		setAllCotentTypesText(ALL_CONTENT_TYPE);
		setShowLessText(SHOW_LESS);
		setNoResultsText(NO_RESULT);
		long endTime = System.nanoTime();
		//Convert Nano seconds to seconds.
		double seconds = (endTime - startTime) / 1000000000;
		logger.info("Execution Time In Seconds :: "+ seconds);
	}

	/**
	 *  generating taxonomy filters 
	 * @return
	 */
	private List<TaxonomyFacet> taxonomyFiltersGeneration() {
		List<TaxonomyFacet> taxonomyFacets = getTaxonomyList(
				getAllPageTags(facetsMappings), getResourceResolver(),
				getCurrentPage().getLanguage(false), getTaxonomyFacetConfigurations());
		if(taxonomyFacets!=null)
		{
		Iterator<TaxonomyFacet> facetIterator = taxonomyFacets.iterator();
		while (facetIterator.hasNext()) {
			TaxonomyFacet taxonomyFacet = facetIterator.next();
			List<TaxonomyFacet> childTaxonomyFacets = taxonomyFacet
					.getChildTags();
			String contentType = getContentTypes(taxonomyFacet);
			taxonomyFacet.setContentType(contentType);
			if (childTaxonomyFacets != null && !childTaxonomyFacets.isEmpty()) {
				Iterator<TaxonomyFacet> childFacetIterator = childTaxonomyFacets
						.iterator();
				while (childFacetIterator.hasNext()) {
					TaxonomyFacet childTaxonomyFacet = childFacetIterator
							.next();
					contentType = getContentTypes(childTaxonomyFacet);
					childTaxonomyFacet.setContentType(contentType);
					List<TaxonomyFacet> subChildTaxonomyFacets = childTaxonomyFacet
							.getChildTags();
					if (subChildTaxonomyFacets != null
							&& !subChildTaxonomyFacets.isEmpty()) {
						Iterator<TaxonomyFacet> subChildFacetIterator = subChildTaxonomyFacets
								.iterator();
						while (subChildFacetIterator.hasNext()) {
							TaxonomyFacet subChildTaxonomyFacet = subChildFacetIterator
									.next();
							contentType = getContentTypes(subChildTaxonomyFacet);
							subChildTaxonomyFacet.setContentType(contentType);
						}
					}
				}
			}
		}
		}
		return taxonomyFacets;
	}
/**
 *  return contenttype for taxonomyfacet
 * @param taxonomyFacet 
 * @return
 */
	private String getContentTypes(TaxonomyFacet taxonomyFacet) {
		Set<String> keys = taxonomyTextfacetsMappings.keySet();
		Iterator<String> itr = keys.iterator();
		Set<String> contentType = new HashSet<String>();
		while (itr.hasNext()) {
			String key = itr.next();
			Set<String> tags = taxonomyTextfacetsMappings.get(key);
			if (tags.contains(taxonomyFacet.getTaxonomyText())) {
				contentType.add(key);
			}
		}
		String contenttype = StringUtils.substring(contentType.toString(), 1,contentType.toString().length()-1);
		return StringUtils.remove(contenttype, ',');
	}

	/*
	 * private JSONArray getFacetMappingsJson() { JSONArray mappingsJsonarray =
	 * new JSONArray(); Set<String> keys = taxonomyTextfacetsMappings.keySet();
	 * Iterator<String> itr = keys.iterator(); JSONObject json= null;
	 * while(itr.hasNext()) { String key = itr.next(); Set<String> tags =
	 * taxonomyTextfacetsMappings.get(key); json = new JSONObject(); try {
	 * json.put(key, tags.toString()); mappingsJsonarray.put(json); } catch
	 * (JSONException e) { logger.error(e.getMessage()); } } return
	 * mappingsJsonarray; }
	 */
	/**
	 * combining all the items of all hlms 
	 * @param map
	 * @return
	 */
	private List<ListItem> getAllResults(Map<String, List<ListItem>> map) {
		List<ListItem> allResults = null;
		if (map != null) {
			allResults = new ArrayList<ListItem>();
			Set<String> keys = map.keySet();
			Iterator<String> itr = keys.iterator();
			while (itr.hasNext()) {
				allResults.addAll(map.get(itr.next()));
			}
			
		}
		return allResults;
	}

	/**
	 * return prefilter content types 
	 * @return
	 */
	private String getPreFilterContentTypeFacets() {
		String preFilterContentType = StringUtils.substringAfter(
				Global.getSelectorByIndex(getSlingRequest(), 1), "hlm-");
		
		String template =  getPageProperties().get("cq:template", "");
		String templateName = template.lastIndexOf("/")> 0 ? template.substring(template.lastIndexOf("/")+1, template.length()):StringUtils.EMPTY;
		mcViewAllBean.setSitecatalystValue( templateName+":"+preFilterContentType);
		StringBuffer preFilterContentTypes = new StringBuffer();
		preFilterContentTypes.append("[");
		if (preFilterContentType
				.equals(GlobalConstants.MULTIMEDIA_CONTENT_TYPE_NAME)) {
			boolean videos = getSlingRequest().getParameter("viewall_vid") != null ? true
					: false;
			boolean images = getSlingRequest().getParameter("viewall_img") != null ? true
					: false;
			if (!videos && !images) {
				preFilterContentTypes.append("['").append(GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME).append("',null],");
				preFilterContentTypes.append("['").append(GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME).append("',null]");
			} else {
				if (videos) {
					preFilterContentTypes.append("['").append(GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME).append("',null]");
				} else if (images) {
					preFilterContentTypes.append("['").append(GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME).append("',null]");
				}
			}
		} else {
			preFilterContentTypes.append("['").append(preFilterContentType).append("',null]");
		}
		preFilterContentTypes.append("]");
		return preFilterContentTypes.toString();
	}

	/**
	 * Create a list of taxonomy facets for filtering depend on mclp type
	 */
	String[] getTaxonomyFacetConfigurations() {
		String mclpType = StringUtils.EMPTY;
		String[] taxonomyFacetsconf = null;
		if (isMclpCorporate(getCurrentPagePath())) {
			mclpType = "corporate";
		} else {
			mclpType = "business";
		}
		String configPagePath = getConfigurationPath("mcviewallconfiguration");
		if (StringUtils.isNotEmpty(configPagePath)) {
			Resource configPageRes = getResourceResolver().getResource(
					configPagePath);
			Resource configRes = configPageRes != null ? configPageRes
					.getChild("jcr:content/openareapar/mcviewallconfig") : null;
			if (configRes != null) {
				ValueMap props = configRes.adaptTo(ValueMap.class);
				if (props != null) {
					taxonomyFacetsconf = props.containsKey(mclpType) ? props
							.get(mclpType, String[].class) : null;
				}
			}
		}
		return taxonomyFacetsconf;
	}

	/**
	 * Create a list of all HLMs present on the current mclp
	 */
	private Map<String, List<ListItem>> getAllHLMs() {
		HLMWrapper hlmWrapper = (HLMWrapper) getSlingRequest().getAttribute(
				"hlmWrapper");
		results = new HashMap<String, List<ListItem>>();
		if (hlmWrapper == null) {
			hlmWrapper = new HLMWrapper(getSlingRequest(), getCurrentPage());
			getSlingRequest().setAttribute("hlmWrapper", hlmWrapper);
		}
		
		
		facetsMappings = new HashMap<String, Set<String>>();
		taxonomyTextfacetsMappings = new HashMap<String, Set<String>>();

		// List<String> contentTypes = new ArrayList<String>();
		List<Resource> hlmResources = getAllHLMContentTypes();
		Iterator<Resource> hlmContentTypeItr = hlmResources.iterator();
		while (hlmContentTypeItr.hasNext()) {
			Resource hlmContentTypeRes = hlmContentTypeItr.next();
			Node hlmContentTypeNode = hlmContentTypeRes.adaptTo(Node.class);
			String hlmContentType;
			try {
				hlmContentType = hlmContentTypeNode.hasProperty("contentType") ? hlmContentTypeNode.getProperty("contentType").getValue().getString()
						: StringUtils.EMPTY;
			if (hlmContentType
					.equals(GlobalConstants.MULTIMEDIA_CONTENT_TYPE_NAME)) {
				processMultimediaContents(hlmWrapper,hlmContentType);
			} 
			else {
				HListHelper hListHelper = hlmWrapper.getHLMById(HListHelper.getId(hlmContentTypeRes));
				if(hListHelper==null) {
					hListHelper = HLMFactory.getInstance().createHLM(hlmContentTypeRes.getResourceType(), getSlingRequest(), getCurrentPage(), hlmContentTypeRes);
				}
				List<ListItem> items = hListHelper.getListItems();
				if (hListHelper.showHLM() && items != null && !items.isEmpty()) {
					Set<String> taxonomyList = new HashSet<String>();
					Set<String> taxonomyTextList = new HashSet<String>();
					Iterator<ListItem> itr = items.iterator();
					while (itr.hasNext()) {
						ListItem item = itr.next();
						String tags[] = item.getAllTags();
						if (tags != null && tags.length > 0) {
							for (int i = 0; i < tags.length; i++) {
								taxonomyList.add(tags[i]);
								taxonomyTextList.add(Global
										.removeNameSpace(tags[i]));
							}
						}
						if ("mcdailynews".equals(hlmContentType)) {
							item.setContentType("mcdailynews");
						}
					}
					if(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME.equals(hlmContentType))
					{
						ValueMap props = hlmContentTypeRes.adaptTo(ValueMap.class);
						String isCorporate=  props.get("isCorporate",String.class);
						boolean corporate = StringUtils.isNotBlank(isCorporate) && "true".equals(isCorporate);
						if(corporate)
						{
							hlmContentType = hlmContentType + ":" + corporate;
						}
					}
					results.put(hlmContentType, items);
					facetsMappings.put(hlmContentType, taxonomyList);
					taxonomyTextfacetsMappings.put(hlmContentType,
							taxonomyTextList);
				}
				
			}
			} catch (ValueFormatException e) {
				logger.error(e.getMessage(),e);
			} catch (IllegalStateException e) {
				logger.error(e.getMessage(),e);
			} catch (PathNotFoundException e) {
				logger.error(e.getMessage(),e);
			} catch (RepositoryException e) {
				logger.error(e.getMessage(),e);
			}
		}
		processUniqueKeys();
		List<ContentType> contentTypesFacets = generateContentTypeFacetsList(results
				.keySet());
		mcViewAllBean.setContentTypesFacets(contentTypesFacets);
		mcViewAllBean.setFacetsMappings(facetsMappings);
		// mcViewAllBean.setFacetMappingsJson(getFacetMappingsJson().toString());
		// generateFacetsMapping(results);
		return results;
	}
	/**
	 * method for combining both corporate as well as business pressrelease.
	 */
	private void processUniqueKeys() {
		if(results.containsKey(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true"))
		{
			List<ListItem> list1 = results.get(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true");
			if(results.containsKey(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME))
			{
				List<ListItem> list2 = results.get(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME);
				list2.addAll(list1);
				results.put(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME, list2);
			}
			else
			{
				results.put(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME, list1);
			}
			results.remove(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true");
		}
		if(facetsMappings.containsKey(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true"))
		{
			Set<String> list1 = facetsMappings.get(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true");
			Set<String> textList1 = taxonomyTextfacetsMappings.get(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true");
			if(facetsMappings.containsKey(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME))
			{
				Set<String> list2 = facetsMappings.get(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME);
				Set<String> textList2 = taxonomyTextfacetsMappings.get(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME);
				list2.addAll(list1);
				textList2.addAll(textList1);
				facetsMappings.put(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME, list2);
				taxonomyTextfacetsMappings.put(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME, textList2);
			}
			else
			{
				facetsMappings.put(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME, list1);
				taxonomyTextfacetsMappings.put(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME, textList1);
			}
			facetsMappings.remove(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true");
			taxonomyTextfacetsMappings.remove(GlobalConstants.PRESS_RELEASE_CONTENT_TYPE_NAME+":true");
		}
		
	}

	/**
	 * processing multimedia contens - images and videos
	 * @param hlmWrapper
	 * @param hlmContentType
	 */
	private void processMultimediaContents(HLMWrapper hlmWrapper, String hlmContentType) {
		List<ListItem> imageItems = new ArrayList<ListItem>();
		List<ListItem> videoItems = new ArrayList<ListItem>();
		Set<String> imageTaxonomyList = new HashSet<String>();
		Set<String> videoTaxonomyList = new HashSet<String>();
		Set<String> imageTaxonomyTextList = new HashSet<String>();
		Set<String> videoTaxonomyTexList = new HashSet<String>();
		HListHelper hListHelper = hlmWrapper.getHLMById("hlm-"
				+ hlmContentType);
		List<ListItem> items = hListHelper.getListItems();
		for (int count = 0; count < items.size(); count++) {
			ListItem item = items.get(count);

			if (item.getContentType().equals(
					GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME)) {
				imageItems.add(item);
				String tags[] = item.getAllTags();
				if (tags != null && tags.length > 0) {
					for (int i = 0; i < tags.length; i++) {
						imageTaxonomyList.add(tags[i]);
						imageTaxonomyTextList.add(Global
								.removeNameSpace(tags[i]));
					}
				}
			} else if (item.getContentType().equals(
					GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME)) {
				videoItems.add(item);
				String tags[] = item.getAllTags();
				if (tags != null && tags.length > 0) {
					for (int i = 0; i < tags.length; i++) {
						videoTaxonomyList.add(tags[i]);
						videoTaxonomyTexList.add(Global
								.removeNameSpace(tags[i]));
					}
				}
			}
		}
		if (!imageItems.isEmpty()) {
			results.put(
					GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME,
					imageItems);
			facetsMappings.put(
					GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME,
					imageTaxonomyList);
			taxonomyTextfacetsMappings.put(
					GlobalConstants.MC_IMAGE_DETAIL_CONTENT_TYPE_NAME,
					imageTaxonomyTextList);
		}
		if (!videoItems.isEmpty()) {
			results.put(
					GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME,
					videoItems);
			facetsMappings.put(
					GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME,
					videoTaxonomyList);
			taxonomyTextfacetsMappings.put(
					GlobalConstants.MC_VIDEO_DETAIL_CONTENT_TYPE_NAME,
					videoTaxonomyTexList);
		}
		
	}

	/**
	 * 
	 * @param keySet
	 * @return key value pair for content type facets
	 */
	private List<ContentType> generateContentTypeFacetsList(
			Set<String> contentTypesFacetKeys) {
		List<ContentType> contentTypeFacets = new ArrayList<ContentType>();
		Iterator<String> itr = contentTypesFacetKeys.iterator();
		while (itr.hasNext()) {
			ContentType contentType = new ContentType();
			String key = itr.next();
			contentType.setContentKey(key);
			contentType.setContentValue(Global.getContentTypeValue(key,
					getResource()));
			contentTypeFacets.add(contentType);
		}
		return contentTypeFacets;
	}

	/**
	 * Fetch all the available hlms in mclp
	 */
	private List<Resource> getAllHLMContentTypes() {

		Resource res = getResourceResolver().getResource(
				getCurrentPage().getPath() + "/jcr:content");
		Node node = res.adaptTo(Node.class);
		List<Resource> hlmsContentTypes = new ArrayList<Resource>();
		try {
			NodeIterator itr = node.getNodes();
			while (itr.hasNext()) {
				Node childNode = (Node) itr.next();
				String contentType = childNode.hasProperty("contentType") ? childNode
						.getProperty("contentType").getValue().getString()
						: StringUtils.EMPTY;
				if (StringUtils.isNotEmpty(contentType)) {
					Resource childRes = getResourceResolver().getResource(childNode.getPath());
					hlmsContentTypes.add(childRes);
				}
			}
		} catch (RepositoryException rpe) {
			logger.error(rpe.getMessage(), rpe);
		}
		return hlmsContentTypes;
	}

	/**
	 * Checking if MCLP is corporate or business
	 */
	boolean isMclpCorporate(String path) {
		return StringUtils.equals(path, getCorporateFolderPath());
	}

	/**
	 * 
	 * @return media center siteconfig
	 */
	public Style getMediaCenterConfigStyle() {
		Style mcSiteConfig = Global.getSiteConfigStyle(getResource());
		return (mcSiteConfig != null) ? mcSiteConfig.getSubStyle("tabmc")
				: null;
	}

	/**
	 * Get corporate mclp path from site config
	 */
	public String getCorporateFolderPath() {
		Style mcStyle = getMediaCenterConfigStyle();
		String corporateFolderPath = (mcStyle != null) ? mcStyle.get(
				PressReleaseHLM.CORPORATE_FOLDER_PATH, String.class) : "";
		return corporateFolderPath;
	}

	/**
	 * initalize and return bean with all the results
	 * 
	 * @return
	 */
	public ViewAllBean getMcViewAllBean() {
		initialize();
		return mcViewAllBean;
	}

	/**
	 * 
	 * @param mcViewAllBean
	 */
	public void setMcViewAllBean(ViewAllBean mcViewAllBean) {
		this.mcViewAllBean = mcViewAllBean;
	}
	
}
