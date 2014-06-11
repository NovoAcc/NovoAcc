package com.dupont.phoenix.tools.bi.colortools;

import org.apache.sling.api.resource.ValueMap;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.foundation.Image;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.commons.Scene7Image;

/**
 * Created with IntelliJ IDEA.
 * User: felipe.abellan
 * Color Page is the representation of the Sub-Product page for BI Colors.
 */
public class ColorPage {

    /* Color Page properties */
    private String href;
    private String url;
    private String description;
    private String title;
    private Image colorImage;

    /* Mapped Props */
    ValueMap props;

    public ColorPage(Page page) {

        // Verify the page referenced is not null
        if (page != null) {

            // Get the property value map from the page
            props = page.getProperties();

            /* Get the description from the props.
            if (props != null) {
                this.description = props.get("description","");
            } */

            /* See if this works: */
            this.description = page.getDescription();

            this.url = page.getPath();

            // Find the page title
            this.title =  findPageTitle(page);

            // Get the html code to render the link
            this.href = Global.renderLink(url+".html","cta-arrow-link color-link",title,null,
                    "/etc/designs/dupont/phoenix/responsiveclientlib/source/images/right-arrow-action.png","bi-cta-arrow",false,false);

            // Work the image like so:
            colorImage = new Scene7Image(page.getContentResource(),"thumbnail");
            if(colorImage != null && colorImage.hasContent()){
                colorImage.setSelector(".img");
            }
            // #EsoSeria
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


    public String getHref() {
        return href;
    }

    public void setHref(String url) {
        this.href = url;
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

    public Image getColorImage() {
        return colorImage;
    }

    public void setColorImage(Image colorImage) {
        this.colorImage = colorImage;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

	public ValueMap getProps() {
		return props;
	}

}
