package com.dupont.phoenix.commons.services.search;

import java.util.List;

public class TemplateSearchItem {


	String contentType;
	
	String contentKey;
	
	List<ContentType> hlmContentType;
	
	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}


	public List<ContentType> getHlmContentType() {
		return hlmContentType;
	}

	public void setHlmContentType(List<ContentType> hlmContentType) {
		this.hlmContentType = hlmContentType;
	}

	public String getContentKey() {
		return contentKey;
	}

	public void setContentKey(String contentKey) {
		this.contentKey = contentKey;
	}
	

}
