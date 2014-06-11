package com.dupont.phoenix.commons.services.search;

public class SearchResultItem {
	
	/** The item type. */
	private String similarURL;
	
	/** The item type. */
	private String excerptContent;
	
	/** The item type. */
	private ItemType itemType;
	
	/** The item name. */
	private String itemName;
	
	/** The item link. */
	private String itemLink;
	
	/** The item size. */
	private String itemSize;
	
	/** The item id. */
	private String itemId;
	
	/** The item description. */
	private String itemDescription;
	
	private String nodePath;
	
	/**
	 * Parameterized constructor.
	 * @param itemName The name for the line item.
	 * @param itemLink The link for the line item.
	 * @param itemType The type of the line item.
	 * @param itemSubType The sub-type the line item.
	 * @param itemSize The size of the line item.
	 * @param itemDescription The description for the line item.
	 */
	public SearchResultItem(String itemName, String itemLink, ItemType itemType, String itemSize,
			String itemDescription) {
		super();
		this.itemName = itemName;
		this.itemLink = itemLink;
		this.itemType = itemType;
		this.itemSize = itemSize;
		// this.itemId = this.itemId;
		this.itemDescription = itemDescription;
	}
	
	/**
	 * Default constructor.
	 */
	public SearchResultItem() {
		super();
	}
	
	/**
	 * Gets the item name.
	 * @return the itemName
	 */
	public String getItemName() {
		return this.itemName;
	}
	
	/**
	 * Sets the item name.
	 * @param itemName the itemName to set
	 */
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	
	/**
	 * Gets the item link.
	 * @return the itemLink
	 */
	public String getItemLink() {
		return this.itemLink;
	}
	
	/**
	 * Sets the item link.
	 * @param itemLink the itemLink to set
	 */
	public void setItemLink(String itemLink) {
		this.itemLink = itemLink;
	}
	
	/**
	 * Gets the item type.
	 * @return the itemType
	 */
	public ItemType getItemType() {
		return this.itemType;
	}
	
	/**
	 * Sets the item type.
	 * @param itemType the itemType to set
	 */
	public void setItemType(ItemType itemType) {
		this.itemType = itemType;
	}
	
	/**
	 * Gets the item size.
	 * @return the itemSize
	 */
	public String getItemSize() {
		return this.itemSize;
	}
	
	/**
	 * Sets the item size.
	 * @param itemSize the itemSize to set
	 */
	public void setItemSize(String itemSize) {
		this.itemSize = itemSize;
	}
	
	/**
	 * Gets the item id.
	 * @return the item id
	 */
	public String getItemId() {
		return this.itemId;
	}
	
	/**
	 * Sets the item id.
	 * @param itemId the new item id
	 */
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	
	/**
	 * Gets the item description.
	 * @return the itemDescription
	 */
	public String getItemDescription() {
		return this.itemDescription;
	}
	
	/**
	 * Sets the item description.
	 * @param itemDescription the itemDescription to set
	 */
	public void setItemDescription(String itemDescription) {
		this.itemDescription = itemDescription;
	}
	

	/**
	 * The Enum ItemType.
	 * @author SapientNitro
	 */
	public enum ItemType {
		
		/** The page. */
		PAGE("page"),
		
		/** The asset. */
		ASSET("asset");
		
		/** The value. */
		private String value;
		
		/**
		 * Instantiates a new item type.
		 * @param value the value
		 */
		ItemType(String value) {
			this.value = value;
		}
		
		/**
		 * Gets the value.
		 * @return the value
		 */
		public String getValue() {
			return this.value;
		}
	}
	
	public String getExcerptContent() {
		return excerptContent;
	}
	
	public void setExcerptContent(String excerptContent) {
		this.excerptContent = excerptContent;
	}
	
	public String getSimilarURL() {
		return similarURL;
	}
	
	public void setSimilarURL(String similarURL) {
		this.similarURL = similarURL;
	}
	
	public String getNodePath() {
		return nodePath;
	}
	
	public void setNodePath(String nodePath) {
		this.nodePath = nodePath;
	}
	
}
