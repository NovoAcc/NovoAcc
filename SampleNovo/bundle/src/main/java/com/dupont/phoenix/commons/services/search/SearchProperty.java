package com.dupont.phoenix.commons.services.search;

public class SearchProperty {
	
	/** The property. */
	private String property;
	
	/** The value. */
	private String value;
	
	/** The operation. */
	private String operation;
	
	/**
	 * Gets the property.
	 * @return the property
	 */
	public String getProperty() {
		return property;
	}
	
	/**
	 * Sets the property.
	 * @param property the new property
	 */
	public void setProperty(String property) {
		this.property = property;
	}
	
	/**
	 * Gets the value.
	 * @return the value
	 */
	public String getValue() {
		return value;
	}
	
	/**
	 * Sets the value.
	 * @param value the new value
	 */
	public void setValue(String value) {
		this.value = value;
	}
	
	/**
	 * Gets the operation.
	 * @return the operation
	 */
	public String getOperation() {
		return operation;
	}
	
	/**
	 * Sets the operation.
	 * @param operation the new operation
	 */
	public void setOperation(String operation) {
		this.operation = operation;
	}
	
	/**
	 * Instantiates a new propertyDto .
	 * @param property the property
	 * @param value of the property
	 */
	public SearchProperty(final String property, final String value) {
		this.property = property;
		this.value = value;
	}
	
	/**
	 * Instantiates a new propertyDto .
	 * @param property property of the search
	 * @param value of the given property
	 * @param operation operation to be performed
	 */
	public SearchProperty(final String property, final String value, final String operation) {
		this.property = property;
		this.value = value;
		this.operation = operation;
	}
	
}
