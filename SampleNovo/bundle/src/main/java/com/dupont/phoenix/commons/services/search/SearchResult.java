package com.dupont.phoenix.commons.services.search;

import java.util.List;

import javax.jcr.RepositoryException;

public class SearchResult {

	
	/** The result pages. */
	private List<Pagination> paginationData;
	
	/** The previous page. */
	private Pagination previousPage;
	
	/** The next page. */
	private Pagination nextPage;
	
	/** The search results. */
	private List<SearchResultItem> searchResults;
	
	/** The total matches. */
	private long totalMatches;
	
	/** The totaltime. */
	private long totaltime;
	
	/** The totaltimeval. */
	private String totaltimeval = "";
	
	/** The success. */
	private boolean success = true;
	
	/** The error code. */
	private String errorCode;
	
	/** The error message. */
	private String errorMessage;
	
	/**
	 * Gets the previous page.Required for pagination.
	 * @return the previous page
	 * @throws RepositoryException the repository exception
	 */
	public Pagination getPreviousPage() throws RepositoryException {
		return this.previousPage;
	}
	
	/**
	 * Gets the previous page.Required for pagination.
	 * @return the previous page
	 * @throws RepositoryException the repository exception
	 */
	public Pagination getNextPage() throws RepositoryException {
		return this.nextPage;
	}
	
	/**
	 * Gets the previous page.Required for pagination.
	 * @param paginationDTO the new previous page
	 * @return the previous page
	 * @throws RepositoryException the repository exception
	 */
	public void setPreviousPage(Pagination paginationDTO) throws RepositoryException {
		this.previousPage = paginationDTO;
	}
	
	/**
	 * Gets the previous page.Required for pagination.
	 * @param paginationDTO the new next page
	 * @return the previous page
	 * @throws RepositoryException the repository exception
	 */
	public void setNextPage(Pagination paginationDTO) throws RepositoryException {
		this.nextPage = paginationDTO;
	}
	
	/**
	 * Gets the pagination dto.
	 * @return the pagination dto
	 */
	public List<Pagination> getPaginationData() {
		return paginationData;
	}
	
	/**
	 * Sets the pagination dto.
	 * @param paginationDTO the new pagination dto
	 */
	public void setPaginationData(List<Pagination> paginationData) {
		this.paginationData = paginationData;
	}
	
	/**
	 * Gets the search results.
	 * @return the searchResults
	 */
	public List<SearchResultItem> getSearchResults() {
		return this.searchResults;
	}
	
	/**
	 * Sets the search results.
	 * @param searchResults the searchResults to set
	 */
	public void setSearchResults(List<SearchResultItem> searchResults) {
		this.searchResults = searchResults;
	}
	
	
	/**
	 * Gets the total matches.
	 * @return the total matches
	 */
	public long getTotalMatches() {
		return totalMatches;
	}
	
	/**
	 * Sets the total matches.
	 * @param totalMatches the new total matches
	 */
	public void setTotalMatches(long totalMatches) {
		this.totalMatches = totalMatches;
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
	 * Checks if is success.
	 * @return true, if is success
	 */
	public boolean isSuccess() {
		return success;
	}
	
	/**
	 * Sets the success.
	 * @param success the new success
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}
	
	/**
	 * Gets the error code.
	 * @return the error code
	 */
	public String getErrorCode() {
		return errorCode;
	}
	
	/**
	 * Sets the error code.
	 * @param errorCode the new error code
	 */
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	
	/**
	 * Gets the error message.
	 * @return the error message
	 */
	public String getErrorMessage() {
		return errorMessage;
	}
	
	/**
	 * Sets the error message.
	 * @param errorMessage the new error message
	 */
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
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
