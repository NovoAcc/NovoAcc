package com.dupont.phoenix.commons.services.search;

import java.util.List;

public class SearchParameters {
	
	/** The results per page. */
	private long resultsPerPage = -1L;
	
	/** The page path. */
	private String pagePath;
	
	/** The language. */
	private String language;
	
	/** The keyword. */
	private String keyword;
	
	/** The start. */
	private long start = 0L;
	
	/** The tags. */
	private List<String> tags;
	
	/** The sort order. */
	private List<SortOrder> sortOrder;

	
	/** The parent tag. */
	private String parentTag;
	
	/** The Search parameter. */
	private List<SearchProperty> searchPropertyDtos;
	
	/** The search type. */
	private String searchType;
	
	/** The page paths. */
	private List<String> pagePaths;
	
	/** The parent tags. */
	private List<SearchParentTag> parentTags;
	
	/** The adminSessionRequired - boolean to tell if search service is required or not. */
	private boolean adminSessionRequired;

	/** The specials search. */
	private boolean specialsSearch = Boolean.FALSE;
	
	private String queryString;
	
	/**
	 * Gets the page paths.
	 * @return the page paths
	 */
	public List<String> getPagePaths() {
		return pagePaths;
	}
	
	/**
	 * Sets the page paths.
	 * @param pagePaths the new page paths
	 */
	public void setPagePaths(List<String> pagePaths) {
		this.pagePaths = pagePaths;
	}
	
	/**
	 * Gets the results per page.
	 * @return the results per page
	 */
	public long getResultsPerPage() {
		return resultsPerPage;
	}
	
	/**
	 * Sets the results per page.
	 * @param resultsPerPage the new results per page
	 */
	public void setResultsPerPage(long resultsPerPage) {
		this.resultsPerPage = resultsPerPage;
		
	}
	
	/**
	 * Gets the start.
	 * @return the start
	 */
	public long getStart() {
		return start;
	}
	
	/**
	 * Sets the start.
	 * @param start the new start
	 */
	public void setStart(long start) {
		this.start = start;
	}
	
	
	/**
	 * Gets the keyword.
	 * @return the keyword
	 */
	public String getKeyword() {
		return keyword;
	}
	
	/**
	 * Sets the keyword.
	 * @param keyword the new keyword
	 */
	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	

	/**
	 * Gets the sort order.
	 * @return the sort order
	 */
	public List<SortOrder> getSortOrder() {
		return sortOrder;
	}
	
	/**
	 * Sets the sort order.
	 * @param sortOrder the new sort order
	 */
	public void setSortOrder(List<SortOrder> sortOrder) {
		this.sortOrder = sortOrder;
	}
	
	/**
	 * Gets the language.
	 * @return the language
	 */
	public String getLanguage() {
		return language;
	}
	
	/**
	 * Sets the language.
	 * @param language the new language
	 */
	public void setLanguage(String language) {
		this.language = language;
	}
	
	/**
	 * Gets the page path.
	 * @return the page path
	 */
	public String getPagePath() {
		return pagePath;
	}
	
	/**
	 * Sets the page path.
	 * @param pagePath the new page path
	 */
	public void setPagePath(String pagePath) {
		this.pagePath = pagePath;
	}
	
	/**
	 * Gets the tags.
	 * @return the tags
	 */
	public List<String> getTags() {
		return tags;
	}
	
	/**
	 * Sets the tags.
	 * @param tags the new tags
	 */
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	
	
	/**
	 * Returns Parent tag.
	 * @return parent tag
	 */
	public String getParentTag() {
		return parentTag;
	}
	
	/**
	 * sets the parent tag.
	 * @param parentTag th parent tag
	 */
	public void setParentTag(String parentTag) {
		this.parentTag = parentTag;
	}
	
	/**
	 * Returns Search property.
	 * @return Search property
	 */
	public List<SearchProperty> getSearchPropertyDtos() {
		return searchPropertyDtos;
	}
	
	/**
	 * sets the Search property.
	 * @param searchPropertyDtos the new search property dtos
	 */
	
	public void setSearchPropertyDtos(List<SearchProperty> searchPropertyDtos) {
		this.searchPropertyDtos = searchPropertyDtos;
	}
	
	/**
	 * Return search Type.
	 * @return the searchType
	 */
	public String getSearchType() {
		return searchType;
	}
	
	/**
	 * Sets Search Type.
	 * @param searchType the searchType to set
	 */
	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}
	
	/**
	 * Gets the parent tags.
	 * @return the parent tags
	 */
	public List<SearchParentTag> getParentTags() {
		return parentTags;
	}
	
	/**
	 * Sets the parent tags.
	 * @param parentTags the parent tags
	 */
	public void setParentTags(List<SearchParentTag> parentTags) {
		this.parentTags = parentTags;
	}
	
	/**
	 * Checks if is admin session required.
	 * @return the adminSessionRequired
	 */
	public boolean isAdminSessionRequired() {
		return this.adminSessionRequired;
	}
	
	/**
	 * Sets the admin session required.
	 * @param adminSessionRequired the adminSessionRequired to set
	 */
	public void setAdminSessionRequired(boolean adminSessionRequired) {
		this.adminSessionRequired = adminSessionRequired;
	}
	

	
	/**
	 * Checks if is specials search.
	 * @return the specialsSearch
	 */
	public boolean isSpecialsSearch() {
		return specialsSearch;
	}
	
	/**
	 * Sets the specials search.
	 * @param specialsSearch the specialsSearch to set
	 */
	public void setSpecialsSearch(boolean specialsSearch) {
		this.specialsSearch = specialsSearch;
	}

	public String getQueryString() {
		return queryString;
	}

	public void setQueryString(String queryString) {
		this.queryString = queryString;
	}
	
}
