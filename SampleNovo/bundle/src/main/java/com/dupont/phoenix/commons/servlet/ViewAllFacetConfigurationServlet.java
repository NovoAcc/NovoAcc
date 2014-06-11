package com.dupont.phoenix.commons.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;

import org.apache.commons.lang.StringUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.dupont.phoenix.commons.services.search.Constants;
import com.dupont.phoenix.commons.services.search.ContentType;
import com.dupont.phoenix.commons.services.search.SearchParameters;
import com.dupont.phoenix.commons.services.search.SearchProperty;
import com.dupont.phoenix.commons.services.search.SearchService;
import com.dupont.phoenix.commons.services.search.TemplateSearchItem;
import com.dupont.phoenix.commons.services.search.TemplateSearchResult;


@Component
@SlingServlet(generateComponent = false, paths = "/bin/facet-configuration", methods = {"GET"},  extensions = {"json"}, selectors={"infinity"})
public class ViewAllFacetConfigurationServlet extends SlingAllMethodsServlet{
	
    private static final String CONTENT_TYPE_JSON = "application/json";
	private static final String SEARCH_TYPE_CQ_TEMPLATE = "cq:Template";
	private static final String OPERATION_EXISTS = "exists";
	private static final String PROPERTY_CONTENT_TYPE = "jcr:content/contentType";
	private static final String APPS_DUPONT_PHOENIX_TEMPLATES_RESPONSIVE = "/apps/dupont/phoenix/templates/responsive";
	/**
	 * 
	 */
	private static final long serialVersionUID = 645449966442928084L;
	private final Logger LOGGER = LoggerFactory.getLogger(ViewAllFacetConfigurationServlet.class);
	
	@Reference
	SearchService searchService;
	
	
	@Override
		protected void doGet(SlingHttpServletRequest request,
				SlingHttpServletResponse response) throws ServletException,
				IOException {
		 LOGGER.debug("doGet Start");
	    	response.setContentType(CONTENT_TYPE_JSON);
	    	StringBuilder jsonString = new StringBuilder(StringUtils.EMPTY);
	    	TemplateSearchResult searchResult = getSearchResult(request,response);
	    	jsonString.append("{\"title\": \"View All Configuration \",\"jcr:primaryType\": \"cq:Panel\",\"items\": {\"jcr:primaryType\": \"cq:WidgetCollection\",");
	    	for(TemplateSearchItem item : searchResult.getSearchResults()){
	    		if(!item.getHlmContentType().isEmpty()){
	    			jsonString.append("\"").append(item.getContentKey()).append("\": {\"xtype\": \"dialogfieldset\",\"title\": \"").append(item.getContentType())
	    			.append("\",\"collapsible\": true,\"collapsed\": true,\"jcr:primaryType\": \"cq:Widget\",\"fieldDescription\": \"Content Type name is displayed as Title\",\"items\": {")
	    			.append("\"jcr:primaryType\": \"cq:WidgetCollection\",");
	    			int count =0;
	    			for(ContentType val : item.getHlmContentType()){
	    				count++;
	    				jsonString.append("\"").append(val.getContentKey()).append("\": {\"xtype\": \"tags\",\"fieldLabel\": \"").append(val.getContentValue())
	    				.append("\",\"name\": \"./").append(item.getContentKey()).append("-").append(val.getContentKey()).append("\",\"cls\": \"cq-propsdialog-tags\",\"jcr:primaryType\": \"cq:Widget\",")
	    				.append("\"fieldDescription\": \"Tag used for creating Taxonomy.\",\"namespaces\": {\"jcr:primaryType\": \"cq:WidgetCollection\",\"ns1\": {\"name\": \"DuPont\",\"maximum\": \"100\",\"jcr:primaryType\": \"nt:unstructured\"}}}");
	    				if(count!=item.getHlmContentType().size()){
	    					jsonString.append(",");
	    				}
	    			}
	    			jsonString.append("}},");
	    		}
	    	}
	    	jsonString.append("\"default\": {\"xtype\": \"tags\",\"fieldLabel\": \"DEFAULT\",\"name\": \"./default\",")
            .append("\"cls\": \"cq-propsdialog-tags\",\"jcr:primaryType\": \"cq:Widget\",\"fieldDescription\": \"Tag used for creating Taxonomy.\",\"namespaces\": {\"jcr:primaryType\": \"cq:WidgetCollection\",\"ns1\": {\"name\": \"DuPont\",")
            .append("\"maximum\": \"100\",\"jcr:primaryType\": \"nt:unstructured\"}}}}}");
	    	String content = jsonString.toString();
	    	response.getWriter().write(content);
	    	LOGGER.debug("doGet End");
	    }
		
		/**
		 * method is used for creating the SearchParameters object for the search.
		 * @param searchPaths The paths where search is to be performed.
		 * @return A list of paths where search is to be performed.
		 */
	   public TemplateSearchResult getSearchResult(final SlingHttpServletRequest slingRequest,
				final SlingHttpServletResponse slingResponse) {

			List<String> searchPaths = getSearchPaths(APPS_DUPONT_PHOENIX_TEMPLATES_RESPONSIVE);
			final List<SearchProperty> searchProperties = new ArrayList<SearchProperty>();
			SearchProperty prop = new SearchProperty(PROPERTY_CONTENT_TYPE, StringUtils.EMPTY, OPERATION_EXISTS);
			searchProperties.add(prop);
			SearchParameters searchInputBean = new SearchParameters();
			searchInputBean.setSearchType(SEARCH_TYPE_CQ_TEMPLATE);
			searchInputBean.setKeyword(StringUtils.EMPTY);
			searchInputBean.setResultsPerPage(-1L);
			searchInputBean.setStart(0L);
			searchInputBean.setPagePaths(searchPaths);
			searchInputBean.setSearchPropertyDtos(searchProperties);
			searchInputBean.setSortOrder(Constants.setSortCriteria(Constants.SortType.ALPHABATICAL_A.getValue()));
			searchInputBean.setQueryString(slingRequest.getQueryString());
			return getTemplateSearchServiceResults(slingRequest, searchInputBean);
		}
	   
	   /**
		 * Gets the search service results.
		 * @param slingRequest the sling request
		 * @param searchInputBean the search input bean
		 * @return the search service results
		 */
		public TemplateSearchResult getTemplateSearchServiceResults(final SlingHttpServletRequest slingRequest,
				SearchParameters searchInputBean) {
			return getSearchService().getTemplateSearchResult(searchInputBean);
		}

	public SearchService getSearchService() {
		return searchService;
	}
		
	/**
	 * Fetches the list of paths where the search is to be performed.
	 * @param searchPaths The paths where search is to be performed.
	 * @return A list of paths where search is to be performed.
	 */
	protected List<String> getSearchPaths(String... searchPaths) {
		
		List<String> searchPathList = null;
		if (searchPaths == null || searchPaths.length < 1) {
			return searchPathList;
		} else {
			searchPathList = new ArrayList<String>();
			for (String path : searchPaths) {
				if (StringUtils.isNotEmpty(path)) {
					searchPathList.add(path);
				}
			}
			return searchPathList;
		}
	}
	
}
