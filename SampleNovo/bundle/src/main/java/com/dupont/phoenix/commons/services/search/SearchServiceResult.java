package com.dupont.phoenix.commons.services.search;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.jcr.RepositoryException;

import com.day.cq.search.facets.Facet;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.ResultPage;
import com.day.cq.search.result.SearchResult;

public class SearchServiceResult {
	
	/** The result. */
	private final SearchResult result;
	
	/** The hits. */
	private List<SearchServiceHit> hits;
	
	/** The result pages. */
	private List<SearchServicePage> resultPages;
	
	/** the search parameters. */
	@SuppressWarnings("unused")
	private final SearchParameters searchParameters;
	
	/** The total matches. */
	private long totalMatches;
	
	/** The totaltime. */
	private long totaltime;
	
	/** The totaltimeval. */
	private String totaltimeval;
	
	/**
	 * Instantiates a new search service result and calls the SearchHit class constructor.
	 * @param result the result
	 * @param searchParameters the search parameters
	 */
	public SearchServiceResult(final SearchResult result, final SearchParameters searchParameters) {
		this.result = result;
		this.hits = new ArrayList<SearchServiceHit>();
		this.searchParameters = searchParameters;
		for (Hit hit : result.getHits()) {
			this.hits.add(createSearchServiceHit(searchParameters, hit));
		}
		totalMatches = this.result.getTotalMatches();
		totaltime = this.result.getExecutionTimeMillis();
		totaltimeval = this.result.getExecutionTime();
	}
	
	/**
	 * Creates the search service hit.
	 * @param searchParameters the search parameters
	 * @param hit the hit
	 * @return the search service hit
	 */
	private SearchServiceHit createSearchServiceHit(final SearchParameters searchParameters, Hit hit) {
		return new SearchServiceHit(hit, searchParameters.getKeyword());
	}
	
	/**
	 * Gets the result pages for pagination(previous and next pages).
	 * @return the result pages
	 * @throws RepositoryException the repository exception
	 */
	public List<SearchServicePage> getResultPages() throws RepositoryException {
		if (this.resultPages == null) {
			resultPages = new ArrayList<SearchServicePage>();
			for (ResultPage resultPage : this.result.getResultPages()) {
				resultPages.add(createSearchServicePage(resultPage));
			}
		}
		return this.resultPages;
	}
	
	/**
	 * Creates the search service page.
	 * @param resultPage the result page
	 * @return the search service page
	 */
	private SearchServicePage createSearchServicePage(ResultPage resultPage) {
		return new SearchServicePage(resultPage);
	}
	
	/**
	 * Gets the previous page.Required for pagination.
	 * @return the previous page
	 * @throws RepositoryException the repository exception
	 */
	public SearchServicePage getPreviousPage() throws RepositoryException {
		final ResultPage previous = this.result.getPreviousPage();
		if (previous != null) { 
			return createSearchServicePage(previous); 
			}
		return null;
	}
	
	/**
	 * Gets the next page.Required for pagination.
	 * @return the next page
	 * @throws RepositoryException the repository exception
	 */
	public SearchServicePage getNextPage() throws RepositoryException {
		final ResultPage next = this.result.getNextPage();
		if (next != null) { 
			return createSearchServicePage(next); 
			}
		return null;
	}
	
	/**
	 * Gets the start index for displaying next and previous pages in case of pagination.
	 * @return the start index
	 */
	public long getStartIndex() {
		return this.result.getStartIndex();
	}
	
	/**
	 * Gets the total matches i.e. total search results.
	 * @return the total matches
	 */
	public long getTotalMatches() {
		return totalMatches;
	}
	
	/**
	 * Gets the facets. Can be used to retrieve the tags.
	 * @return the facets
	 * @throws RepositoryException the repository exception
	 */
	public Map<String, Facet> getFacets() throws RepositoryException {
		return this.result.getFacets();
	}
	
	/**
	 * Gets the result hits. Populate title, node path and description that needs to be displayed on the result page.
	 * @return the hits
	 */
	public List<SearchServiceHit> getHits() {
		return this.hits;
	}
	
	// ?
	/**
	 * Sets the hits.
	 * @param hits the hits
	 * @param overrideTotalMatches the override total matches
	 */
	public void setHits(List<SearchServiceHit> hits, boolean overrideTotalMatches) {
		this.hits = hits;
		
		if (overrideTotalMatches) {
			totalMatches = hits.size();
		}
	}
	
	/**
	 * Gets the totaltime.
	 * @return the totaltime
	 */
	public long getTotaltime() {
		return totaltime;
	}
	
	/**
	 * Sets the totaltime.
	 * @param totaltime the new totaltime
	 */
	public void setTotaltime(long totaltime) {
		this.totaltime = totaltime;
	}
	
	/**
	 * Gets the totaltimeval.
	 * @return the totaltimeval
	 */
	public String getTotaltimeval() {
		return totaltimeval;
	}
	
	/**
	 * Sets the totaltimeval.
	 * @param totaltimeval the new totaltimeval
	 */
	public void setTotaltimeval(String totaltimeval) {
		this.totaltimeval = totaltimeval;
	}
}
