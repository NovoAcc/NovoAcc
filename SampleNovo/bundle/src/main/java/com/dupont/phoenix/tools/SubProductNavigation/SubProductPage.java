package com.dupont.phoenix.tools.SubProductNavigation;

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.api.resource.ValueMap;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.commons.Scene7Image;

/**
 * Created by felipe.abellan on 12/26/13.
 */
public class SubProductPage {

    private String url;
    private String href;
    private String description;
    private String title;
    private String name;
    private Image subProductImage;
    private List<Tag> pageFilterTags;

    /* Mapped Props */
    private ValueMap props;

    private String namespaceFilter;

    public SubProductPage(Page page, List<Tag> filterTags) {

        if (page != null) {

            // Get the property value map from the page
            props = page.getProperties();

            /* See if this works: */
            this.description = page.getDescription();

            this.url = page.getPath();

            // Find the page title
            this.title =  findPageTitle(page);

            this.name = page.getName();

            this.href = Global.renderLink(url + ".html", "cta-arrow-link color-link", title, null, null, "bi-cta-arrow", false, false);

            // Work the image like so:
            subProductImage = new Scene7Image(page.getContentResource(),"thumbnail");
            if(subProductImage != null && subProductImage.hasContent()){
                subProductImage.setSelector(".img");
            }

            pageFilterTags = checkMatchingTags(page, filterTags);

        }

    }

    private String findPageTitle(Page page) {
        String pageTitle = "";
        if (page.getNavigationTitle() != null) {
        	pageTitle = page.getNavigationTitle();
        } else if (page.getTitle() != null) {
        	pageTitle = page.getTitle();
        } else if (page.getPageTitle() != null) {
        	pageTitle = page.getPageTitle();
        } else {
        	pageTitle = page.getName();
        }

        return pageTitle;
    }

    private List<Tag> checkMatchingTags(Page page, List<Tag> filterTags) {
        List<Tag> matchingTags = new ArrayList<Tag>();
        Tag[] pageTags = page.getTags();
        for (Tag t : filterTags) {
            String tagName = t.getName();
            for (Tag pt : pageTags) {
                if (pt.getLocalTagID().contains(tagName)){
                    matchingTags.add(pt);
                }
            }
        }
        return matchingTags;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Image getSubProductImage() {
        return subProductImage;
    }

    public void setSubProductImage(Image subProductImage) {
        this.subProductImage = subProductImage;
    }

    public List<Tag> getPageFilterTags() {
        return pageFilterTags;
    }

    public void setPageFilterTags(List<Tag> pageFilterTags) {
        this.pageFilterTags = pageFilterTags;
    }

    public String getHref() {
        return href;
    }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

	public ValueMap getProps() {
		return props;
	}

	public String getNamespaceFilter() {
		return namespaceFilter;
	}

}
