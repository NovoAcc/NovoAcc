package com.dupont.phoenix.commons.services.search;

import javax.jcr.Session;


public interface SearchService {
	
	/**
	 * Gets the search result on basis of search parameters.
	 * @param searchParameters the search parameters
	 * @param session the session
	 * @return the result
	 */
	SearchServiceResult getResult(final SearchParameters searchParameters, Session session);
	
	/**
	 * Gets the Template search result on basis of search parameters.
	 * @param searchParameters the search parameters
	 * @return the TemplateSearchResult result
	 */
	TemplateSearchResult getTemplateSearchResult(final SearchParameters searchInputBean);
	
}
