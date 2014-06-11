package com.dupont.phoenix.commons.services.search;

import com.day.cq.search.result.ResultPage;


public class SearchServicePage {
	
	private final boolean currentPage;
	
	private final long index;
	
	private final long start;
	
	/**
	 * Instantiates a new search page.
	 * @param resultPage the result page
	 */
	public SearchServicePage(final ResultPage resultPage) {
		this.start = resultPage.getStart();
		this.index = resultPage.getIndex();
		this.currentPage = resultPage.isCurrentPage();
		
	}
	
	/**
	 * Instantiates a new search page.
	 * @param resultPage the result page
	 */
	public SearchServicePage(boolean currentPage, long index, long start) {
		this.currentPage = currentPage;
		this.index = index;
		this.start = start;
		
	}
	
	/**
	 * Checks if is current page.
	 * @return true, if is current page
	 */
	public boolean isCurrentPage() {
		return currentPage;
	}
	
	/**
	 * Gets the index for pagination.
	 * @return the index
	 */
	public long getIndex() {
		return this.index;
	}
	
	/**
	 * Gets the start.
	 * @return the start
	 */
	public long getStart() {
		return this.start;
	}
	
}
