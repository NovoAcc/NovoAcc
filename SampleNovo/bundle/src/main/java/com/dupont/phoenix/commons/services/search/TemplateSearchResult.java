package com.dupont.phoenix.commons.services.search;

import java.util.List;

public class TemplateSearchResult {
	
	/** The search results. */
	private List<TemplateSearchItem> searchResults;
	
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

	public List<TemplateSearchItem> getSearchResults() {
		return searchResults;
	}

	public void setSearchResults(List<TemplateSearchItem> searchResults) {
		this.searchResults = searchResults;
	}

	public long getTotalMatches() {
		return totalMatches;
	}

	public void setTotalMatches(long totalMatches) {
		this.totalMatches = totalMatches;
	}

	public long getTotaltime() {
		return totaltime;
	}

	public void setTotaltime(long totaltime) {
		this.totaltime = totaltime;
	}

	public String getTotaltimeval() {
		return totaltimeval;
	}

	public void setTotaltimeval(String totaltimeval) {
		this.totaltimeval = totaltimeval;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

}
