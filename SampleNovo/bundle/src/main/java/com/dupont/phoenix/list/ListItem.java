package com.dupont.phoenix.list;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.foundation.Image;

public  class ListItem { 
	     
	private static final Logger LOGGER = LoggerFactory.getLogger(ListItem.class);
	private String linkText;
    private String linkURL;
    private String shortDesc;
    private String longDesc;
    private String rank;
    private Image thumbnail;
    private Image mediumThumbnail;
    private String title;
    private String pageTitle;
    private String[] tags;
    private Date lastModified;
    private Date created;
    private Integer relevancyScore;
    private String author;
    private String contentType;
    private String name;
    private String tagString;
    private String thumbnailPath;
    private Date published;
    
    public Date getPublished() {
		return published;
	}
	public void setPublished(Date published) {
		this.published = published;
	}
	/**
     * check for image hasContent()
     */
    private boolean imageContent;
  
	
	/*
     * All tags = Self Tag + Related Tags
     */
    private String[] allTags;
	
	public String[] getAllTags() {
		return allTags;
	}
	public void setAllTags(String[] allTags) {
		if(null!=allTags){
		this.allTags = allTags.clone();
		}
	}
	/**
	 * @return the thumbNailPath
	 */
	public String getThumbnailPath() {
		return thumbnailPath;
	}
	/**
	 * @param thumbNailPath the thumbNailPath to set
	 */
	public void setThumbnailPath(String thumbNailPath) {
		this.thumbnailPath = thumbNailPath;
	}
	/**
	 * @return the tagString
	 */
	public String getTagString() {
		return tagString;
	}
	/**
	 * @param tagString the tagString to set
	 */
	public void setTagString(String tagString) {
		this.tagString = tagString;
	}
	public String getName() {
		return name!=null?name:"";
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLinkText() {
		return linkText!=null?linkText:"";
	}
	public void setLinkText(String linkText) {
		this.linkText = linkText;
	}
	public String getLinkURL() {
		return linkURL;
	}
	public void setLinkURL(String linkURL) {
		this.linkURL = linkURL;
	}
	public String getShortDesc() {
		return (shortDesc!=null) ? shortDesc : "";
	}
	public void setShortDesc(String shortDesc) {
		this.shortDesc = shortDesc;
	}
	public String getLongDesc() {
		return (longDesc != null) ? longDesc : "";
	}
	public void setLongDesc(String longDesc) {
		this.longDesc = longDesc;
	}
	public String getRank() {
		return rank;
	}
	public void setRank(String rank) {
		this.rank = rank;
	}
	public Image getThumbnail() {
		return thumbnail;
	}
	public void setThumbnail(Image thumbnail) {
		this.thumbnail = thumbnail;
	}
	public Image getMediumThumbnail() {
		return mediumThumbnail;
	}
	public void setMediumThumbnail(Image mediumThumbnail) {
		this.mediumThumbnail = mediumThumbnail;
	}
	public String getTitle() {
		return title!=null?title:getName();
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getPageTitle() {
		return pageTitle!=null?pageTitle:getTitle();
	}
	public void setPageTitle(String pageTitle) {
		this.pageTitle = pageTitle;
	}
	public String[] getTags() {
		return (String[])tags.clone();
	}
	public void setTags(String[] tags) {
		if(null!=tags){
		this.tags = tags.clone();
		}
	}
	public Date getLastModified() {
		return (Date)lastModified.clone();
	}
	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}

	public Date getCreated() {
		return (Date)this.created.clone();
	}

	public void setCreated(Date created) {
		this.created = created;
	}
      
    public String toString() {
    	LOGGER.debug("toString method...");
    	StringBuilder result = new StringBuilder();
    	result.append("linkText:");
    	result.append(linkText);
    	result.append("\nlinkURL:");
    	result.append(linkURL);
    	result.append("\nshortDesc:");
    	result.append(shortDesc);
    	result.append("\nlongDesc:");
    	result.append(longDesc);
    	result.append("\nrank:");
    	result.append(rank);
    	result.append("\ntitle:");
    	result.append(title);
    	result.append("\ntags:");
    	result.append((tags!=null)?tags:"");
    	result.append("\nlastModified:");
    	result.append(lastModified);
    	result.append("\ncreated:");
    	result.append(created);
    	result.append("\nlinkTextWithoutLastWord:");
    	result.append(getLinkTextWithoutLastWord());
    	result.append("\nlinkTextLastWord:");
    	result.append(getLinkTextLastWord());
        //private Image thumbnail;
        //private Image mediumThumbnail;
    	return result.toString();
    }
    public String getLinkTextWithoutLastWord() {
    	return (linkText!=null && linkText.lastIndexOf(' ')!=-1)? linkText.substring(0,linkText.lastIndexOf(' ')):linkText;
    }
    public String getLinkTextLastWord() {
    	return (linkText!=null)? linkText.substring(linkText.lastIndexOf(' ')+1):"";
    }    
    public String getTextWithoutLastWord(String text) {
    	return (text!=null && text.lastIndexOf(' ')!=-1)?text.substring(0,text.lastIndexOf(' ')):"";
    }
    public String getTextLastWord(String text) {
    	return (text!=null)? text.substring(text.lastIndexOf(' ')+1):"";
    }
	public Integer getRelevancyScore() {
		return relevancyScore;
	}
	public void setRelevancyScore(Integer relevancyScore) {
		this.relevancyScore = relevancyScore;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getContentType() {
		return contentType;
	}
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	
	public void setImageWidth(String width) {
		if(thumbnail!=null) {
			thumbnail.set(Image.PN_HTML_WIDTH, width);
		}
	}
	public void setImageHeight(String height) {
		if(thumbnail!=null) {
			thumbnail.set(Image.PN_HTML_HEIGHT, height);
		}		
	}
	public boolean isImageContent() {
		return imageContent;
	}
	public void setImageContent(boolean imageContent) {
		this.imageContent = imageContent;
	}

}
