package com.dupont.phoenix;

public  class SocialMediaChannel { 
	     
    private String name;
    private String shareURL;
    private String normalImg;
    private String normalHoverImg;
    private String grayImg;
    private String grayHoverImg;
    private String pageURL="";
    private int order;
        
	public String getName() {
		return name!=null?name:"";
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getShareURL() {
		return shareURL!=null?shareURL:"";
	}
	public void setShareURL(String shareURL) {
		this.shareURL = shareURL;
	}
	public String getNormalImg() {
		return normalImg!=null?normalImg:"";
	}
	public void setNormalImg(String normalImg) {
		this.normalImg = normalImg;
	}
	public String getNormalHoverImg() {
		return normalHoverImg!=null?normalHoverImg:"";
	}
	public void setNormalHoverImg(String normalHoverImg) {
		this.normalHoverImg = normalHoverImg;
	}
	
	public String getGrayImg() {
		return grayImg!=null?grayImg:"";
	}
	public void setGrayImg(String grayImg) {
		this.grayImg = grayImg;
	}
	public String getGrayHoverImg() {
		return grayHoverImg!=null?grayHoverImg:"";
	}
	public void setGrayHoverImg(String grayHoverImg) {
		this.grayHoverImg = grayHoverImg;
	}
	public String getPageURL() {
		return pageURL!=null?pageURL:"";
	}
	public void setPageURL(String pageURL) {
		this.pageURL = pageURL;
	}
	public Integer getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
    public String toString() {
    	StringBuilder result = new StringBuilder();
    	result.append("name:");
    	result.append(name);
    	result.append("\nshareURL:");
    	result.append(shareURL);
    	result.append("\nnormalImg:");
    	result.append(normalImg);
    	result.append("\nnormalHoverImg:");
    	result.append(normalHoverImg);
    	result.append("\ngrayImg:");
    	result.append(grayImg);
    	result.append("\ngrayHoverImg:");
    	result.append(grayHoverImg);
    	result.append("\npageURL:");
    	result.append(pageURL);
    	result.append("\norder:");
    	result.append(order);
    	return result.toString();
    }
  
}
