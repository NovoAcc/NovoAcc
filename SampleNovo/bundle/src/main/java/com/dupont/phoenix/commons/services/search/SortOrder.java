package com.dupont.phoenix.commons.services.search;

public class SortOrder {
	
	/** The filter criteria. */
	private final String sortCriteria;
	
	/** The order. */
	private final String order;
	
	/**
	 * Gets the filter criteria.
	 * @return the filter criteria
	 */
	public String getSortCriteria() {
		return sortCriteria;
	}
	
	/**
	 * Gets the order.
	 * @return the order
	 */
	public String getOrder() {
		return order;
	}
	
	/**
	 * Instantiates a new sort order.
	 * @param sortCriteria the filter criteria
	 * @param order the order
	 */
	public SortOrder(final String sortCriteria, final String order) {
		this.sortCriteria = sortCriteria;
		this.order = order;
	}
	
}
