package com.dupont.phoenix.callout.tools;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.Global;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

public class ProductFinder {

    private ValueMap properties;
    private Page currentPage;
    private Resource resource;
    private SlingHttpServletRequest slingRequest;

    private String header = ""; 
    private String headerLast = "";
    private String link = "";
    private String linkTitle = ""; 
    private String linkText = ""; 
    private String linkTextLast = ""; 

    public ProductFinder (final Resource resource, final Page currentPage, final SlingHttpServletRequest slingRequest) {
        this.currentPage = currentPage;
        this.slingRequest = slingRequest;
        this.resource = resource;
        this.properties = resource.adaptTo(ValueMap.class);
        this.setValues();
    }

    private void setValues () {
        String title = Global.getTranslatedText(this.currentPage, this.slingRequest, "ViewProducts");
        
        this.header = Global.getTextWithoutLastWord(title);
        this.headerLast = Global.getTextLastWord(title);
	
        this.link = this.properties.get("linkURL", "");
        this.linkTitle = this.properties.get("title", "");
        this.linkText = Global.getTextWithoutLastWord(linkTitle);
        this.linkTextLast = Global.getTextLastWord(linkTitle);
    }
        
    public boolean validLink () {
        return (!StringUtils.isEmpty(this.link) && !StringUtils.isEmpty(this.linkTitle));
    }
    
    public boolean validLinkText() {
        return (!StringUtils.isEmpty(this.linkTextLast));
    }
    
    public String getLowerCasePage () {
        return StringUtils.lowerCase(Global.getCountryCode(this.currentPage));
    }

    public String getHeaderText () {
        return this.header;
    }

    public String getHeaderLast () {
        return this.headerLast;
    }
    
    public String getLink () {
        return Global.isExternalLink(this.link) ? this.link : Global.getNavigationURL(this.slingRequest, this.link, false) +".html" ;
    }

    public String getLinkText () {
        return this.linkText;
    }

    public String getLinkTextLast () {
        return this.linkTextLast;
    }

}
