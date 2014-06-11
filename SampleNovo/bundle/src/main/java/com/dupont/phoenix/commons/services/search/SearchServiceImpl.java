package com.dupont.phoenix.commons.services.search;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.jcr.api.SlingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.search.Predicate;
import com.day.cq.search.QueryBuilder;


/**
 * The Class SearchServiceImpl.
 */
@Component(label = "Common Search Service", immediate = true, metatype = true)
@Service(SearchService.class)
public class SearchServiceImpl implements SearchService {
	
	private final Logger LOGGER = LoggerFactory.getLogger(SearchServiceImpl.class);
	
	
	@Reference
	private QueryBuilder queryBuilder;
	
	@Reference
	ResourceResolverFactory resolverFactory;
	
	@Reference
	SlingRepository slingRepository;

	public SearchServiceResult getResult(final SearchParameters searchParameters, Session session) {
		//Put flag for event search in the search functionality
		SearchServiceResult result = null;
		SearchServiceHelper searchServiceHelper = new SearchServiceHelper();
		// Add search criteria's in a predicate list
		final List<Predicate> customPredicates = searchServiceHelper.createPredicate(searchParameters);
		/*
		 * Search is done only if there is any critera for search Checks if session, querybuilder, page path object is
		 * null and if there is no search criteria result returned will be null
		 */
		if ((session != null)
				&& (getQueryBuilder() != null)
				&& (StringUtils.isNotBlank(searchParameters.getPagePath()) || !searchParameters.getPagePaths()
						.isEmpty())) {
			result = new SearchServiceResult(searchServiceHelper.getSearchResult(searchParameters, customPredicates,
					session, getQueryBuilder()), searchParameters);
		}
		return result;
		
	}
	
	/**
	 * Gets the pag queryfor search page.
	 * @param paginationDTO the pagination dto
	 * @param queryString the query string
	 * @param resultPerPage the result per page
	 * @return the pag queryfor search page
	 */
	public String getPagQueryforSearchPage(Pagination paginationData, String queryString, long resultPerPage) {
		int newIndex = 0;
		StringBuffer sb = new StringBuffer();

		if (null != queryString && StringUtils.isNotEmpty(queryString)
				&& queryString.contains(Constants.REQUEST_PARAM_START_INDEX)) {
			newIndex = (int) (paginationData.getIndex() * (resultPerPage));
			queryString = queryString.replaceAll(Constants.REQUEST_PARAM_START_INDEX + "=[^&]+",
					Constants.REQUEST_PARAM_START_INDEX + "=" + newIndex);
			sb.append(queryString);
			
		} else {
			newIndex = (int) (paginationData.getIndex() * resultPerPage);
			if (StringUtils.isEmpty(queryString)) {
				queryString = Constants.REQUEST_PARAM_START_INDEX + "=" + newIndex;
				sb.append(queryString);
			} else {
				sb.append(queryString);
				sb.append("&");
				sb.append(Constants.REQUEST_PARAM_START_INDEX);
				sb.append("=");
				sb.append(newIndex);
			}
		}
		return sb.toString();
	}
	
	
	public TemplateSearchResult getTemplateSearchResult(final SearchParameters searchInputBean) {
		SearchServiceResult result;
		TemplateSearchResult searchResults = null;
		ResourceResolver resourceResolver = null;
		Session session = null;
		try {
			session = getSlingRepository().loginAdministrative(null);
			resourceResolver = getResolverFactory().getAdministrativeResourceResolver(null);
			result = getResult(searchInputBean, session);
			searchResults = parseTemplateSearchResult(result, resourceResolver);
			return searchResults;
		} catch (Exception e) {
			LOGGER.error("Search Exception-", e);
			searchResults = new TemplateSearchResult();
			searchResults.setSuccess(false);
			searchResults.setErrorCode(e.toString());
			searchResults.setErrorMessage(e.getMessage());
			
		} finally {
			
			if (null != resourceResolver && resourceResolver.isLive()) {
				resourceResolver.close();
			}
			if (session != null) {
				session.logout();
			}
		}
		
		return searchResults;
	}
	
	private TemplateSearchResult parseTemplateSearchResult(final SearchServiceResult searchServiceResult, ResourceResolver resourceResolver)
			throws JSONException {
		TemplateSearchResult searchResult = new TemplateSearchResult();
		searchResult.setSuccess(Boolean.TRUE);
		searchResult.setTotaltime(searchServiceResult.getTotaltime());
		searchResult.setTotaltimeval(searchServiceResult.getTotaltimeval());
		searchResult.setSearchResults(getTemplateSearchItems(searchServiceResult, resourceResolver));
		searchResult.setTotalMatches(searchServiceResult.getTotalMatches());
		return searchResult;
	}
	
	/**
	 * Parses the search results rendered from the search service and retrieves the front-end equivalent of that.
	 * @param searchServiceResult the search service result
	 * @return the search result items
	 * @throws JSONException the jSON exception
	 */
	private List<TemplateSearchItem> getTemplateSearchItems(final SearchServiceResult searchServiceResult,
			ResourceResolver resourceResolver) throws JSONException {
		
		List<TemplateSearchItem> searchResults =null;
		TemplateSearchItem searchResult;
		if (searchServiceResult.getTotalMatches() > 0) {
			searchResults = new ArrayList<TemplateSearchItem>();
			for (SearchServiceHit hit : searchServiceResult.getHits()) {
				searchResult = this.populateTemplateResultItem(hit, resourceResolver);
				if (searchResult != null) {
					searchResults.add(searchResult);
				}
			}
		
		} 

		return searchResults;
	}
	
	/**
	 * Populates an individual line item from the search results and adds a corresponding front-end equivalent.
	 * @param hit the hit
	 * @return the search result item
	 * @throws JSONException the jSON exception
	 */
	private TemplateSearchItem populateTemplateResultItem(final SearchServiceHit hit, ResourceResolver resourceResolver)
			throws JSONException {
		TemplateSearchItem templateSearchItem = new TemplateSearchItem();
		ValueMap siteConfig = getSiteMapConfigDetails("/etc/designs/dupont-custom/country-sites/en-us-design/jcr:content/siteconfig/hlm", resourceResolver);
		try {
			String templateName = null;
			if(null!=hit.getHit() && null!=hit.getHit().getNode()){
				Node templateNode = hit.getHit().getNode();
				if(null!=templateNode){
					List<ContentType> contentTypes = new ArrayList<ContentType>();
					Node jcrNode =templateNode.getNode("jcr:content");
					if(null!=jcrNode){
						templateName = jcrNode.getProperty("contentType").getValue().getString();
						if(null!=templateName){
							templateSearchItem.setContentKey(templateName);
							templateSearchItem.setContentType(siteConfig.get(templateName,""));
						}
						NodeIterator  nodeIter=jcrNode.getNodes();
						while(nodeIter.hasNext()){
							Node hlmNodes = (Node)nodeIter.next();
							if(StringUtils.startsWith(hlmNodes.getName(), "hlm-")){
								String contentName = hlmNodes.getProperty("contentType").getValue().getString();
										if(null!=contentName){
											ContentType content = new ContentType();
											content.setContentKey(contentName);
											content.setContentValue(siteConfig.get(contentName,""));
											contentTypes.add(content);
										}
							}
						}
					}
					templateSearchItem.setHlmContentType(contentTypes);
					
				}
			}

		} catch (RepositoryException e) {
			LOGGER.error("Exception in accessing the Repository : ", e);
		}
		
		return templateSearchItem;
	}
	
	public ValueMap getSiteMapConfigDetails(String path, ResourceResolver resourceResolver){
		Resource enSiteConfig = resourceResolver.getResource(path);
		return enSiteConfig.adaptTo(ValueMap.class);
	}

	public QueryBuilder getQueryBuilder() {
		return queryBuilder;
	}

	public ResourceResolverFactory getResolverFactory() {
		return resolverFactory;
	}

	public SlingRepository getSlingRepository() {
		return slingRepository;
	}
	
	
}
