package com.dupont.phoenix.commons.services.search;

/**
 * The Class Pagination.
 */
public class Pagination {
	
	/** The current page. */
	private boolean currentPage = Boolean.FALSE;
	
	/** The index. */
	private long index = -1;
	
	/** The start. */
	private long start = -1;
	
	/** The url. */
	private String url = "";
	
	/**
	 * Instantiates a new search page.
	 * @param searchServicePage the search service page
	 */
	public Pagination(final SearchServicePage searchServicePage) {
		this.start = searchServicePage.getStart();
		this.index = searchServicePage.getIndex();
		this.currentPage = searchServicePage.isCurrentPage();
		
	}
	
	/**
	 * Checks if is current page.
	 * @return true, if is current page
	 */
	public boolean isCurrentPage() {
		return currentPage;
	}
	
	/**
	 * Sets the current page.
	 * @param currentPage the new current page
	 */
	public void setCurrentPage(boolean currentPage) {
		this.currentPage = currentPage;
	}
	
	/**
	 * Gets the index.
	 * @return the index
	 */
	public long getIndex() {
		return index;
	}
	
	/**
	 * Sets the index.
	 * @param index the new index
	 */
	public void setIndex(long index) {
		this.index = index;
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
	 * Gets the url.
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}
	
	public void setUrl(String url) {
		this.url = url;
	}
	
}
