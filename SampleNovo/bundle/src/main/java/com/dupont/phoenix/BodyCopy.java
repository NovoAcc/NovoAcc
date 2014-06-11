package com.dupont.phoenix;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.day.cq.wcm.api.WCMMode;

public class BodyCopy {
	
	/* Basic Variables*/
	private ValueMap properties;
	private Resource resource;
	private SlingHttpServletRequest slingRequest;
	
	/* Component Variables */
	private String text;
	private String firstParagraph;
	private String imageCaption;
	
	private boolean showByline;
	private boolean hideCopyImage;
	private boolean imageDataExist;
	private boolean author;

	
	public BodyCopy(Resource resource, SlingHttpServletRequest slingRequest) {
		this.resource = resource;
		this.slingRequest = slingRequest;
		this.properties = resource.adaptTo(ValueMap.class);

		if(this.properties!=null) {
			init();
		}
	}
	
	private void init() {
		setAuthor(WCMMode.fromRequest(slingRequest) == WCMMode.EDIT);
		setText(properties.get("bodyCopyText",String.class));
		setFirstParagraph(properties.get("firstParagraph",String.class));
		setImageCaption(properties.get("./image/imageCaption",String.class));
		setShowByline(properties.get("showByline",true));
		setHideCopyImage(properties.get("hideCopyImage",false));
		imageDataExist = getImageData();
	}
	
	private boolean getImageData() {
		return StringUtils.isNotBlank(properties.get("./heroimage/fileReference",String.class));
	}

	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getFirstParagraph() {
		return firstParagraph;
	}

	public void setFirstParagraph(String firstParagraph) {
		this.firstParagraph = firstParagraph;
	}

	public String getImageCaption() {
		return imageCaption;
	}

	public void setImageCaption(String imageCaption) {
		this.imageCaption = imageCaption;
	}

	public boolean isShowByline() {
		return showByline;
	}

	public void setShowByline(boolean showByline) {
		this.showByline = showByline;
	}

	public boolean isHideCopyImage() {
		return hideCopyImage;
	}

	public void setHideCopyImage(boolean hideCopyImage) {
		this.hideCopyImage = hideCopyImage;
	}

	public boolean isImageDataExist() {
		return imageDataExist;
	}

	public void setImageDataExist(boolean imageDataExist) {
		this.imageDataExist = imageDataExist;
	}

	public boolean isAuthor() {
		return author;
	}

	public void setAuthor(boolean author) {
		this.author = author;
	}

	public Resource getResource() {
		return resource;
	}
	

}
