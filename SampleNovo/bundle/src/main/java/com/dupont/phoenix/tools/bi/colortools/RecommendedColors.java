package com.dupont.phoenix.tools.bi.colortools;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.Global;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Created by felipe.abellan on 12/23/13.
 */
public class RecommendedColors {

    final static Logger logger = LoggerFactory.getLogger(RelatedColors.class);


    /* Basic Controller Variables. */
    private Resource resource;
    private Page currentPage;
    private SlingHttpServletRequest slingRequest;
    private ValueMap properties;
    private Locale locale;
    private boolean edit;

    /* Base Content list */
    private List<ColorPage> recommendedColors;
    private String colorPageParent;
    private List<Tag> filterTags;

    /* Product Page information */
    private Page productPage;
    private String productTag;
    private String productPagePath;

    /* Recommended Colors Translation Support */
    private static final String recommendedColorsTitle = "Recommended Colors";
    private static final String seeRelatedCollections = "See Related Collections";
    private static final String next = "Next";
    private static final String prev = "Prev";

    public RecommendedColors(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest) {
        this.resource = resource;
        this.properties = resource.adaptTo(ValueMap.class);
        this.currentPage = currentPage;
        this.slingRequest = slingRequest;
        this.locale = slingRequest.getLocale();
        this.edit = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
        init();
    }

    private void init() {
        colorPageParent = properties.get("colorpageparent",String.class);
        if (colorPageParent != null && !StringUtils.EMPTY.equalsIgnoreCase(colorPageParent)) {

            // Get information from related Product page
            productPage = findProductPage(colorPageParent);
            productTag = findProductTag();
            productPagePath = findProductPagePath();

            // Generate the recommended colors list.
            recommendedColors = findRecommendedColors();
        }

    }

    private Page findProductPage(String subProductPath) {
        PageManager pm = currentPage.getPageManager();
        Page subProductsPage = pm.getPage(subProductPath);
        if (subProductsPage != null) {
            return subProductsPage.getParent();
        }
        return null;

    }

    /**
     * Finds the current color page Tag to get the name of the product correctly.
     * @return  The string of product for this color page.
     */
    private String findProductTag() {
        String pTag = "";
        if (productPage != null) {
            String tags[] = productPage.getProperties().get("pageTag",String[].class);
            TagManager tm = resource.getResourceResolver().adaptTo(TagManager.class);
            if (tags != null) {
                Tag pageTag = tm.resolve(tags[0]);
                if (pageTag != null) {
                	pTag = pageTag.getTitle(locale);
                }
            }
        }
        return pTag;
    }

    private List<ColorPage> findRecommendedColors() {

        // Find the current page filter Tag
        findCurrentFilterTag("collections/");

        List<Page> temp = new ArrayList<Page>();
        List<ColorPage> filteredList = new ArrayList<ColorPage>();

        // Get the subproducts container page.
        Page parent = currentPage.getPageManager().getPage(colorPageParent);

        // Verify parent exist.
        if (parent != null) {

            // Get the children list.
            Iterator<Page> children = parent.listChildren();

            // Iterate, till you can't iterate no more.
            while (children.hasNext()) {
                Page child = children.next();

                // Verify its not hidden in navigation and page has tags to be compared with..
                if (!child.isHideInNav() && !filterTags.isEmpty() && checkMatchingTags(child, filterTags.get(0))) {
                    //Add the page that matches the first hue tag, like one of your French pages.
                   // if (checkMatchingTags(child, filterTags.get(0))) {
                        temp.add(child);

                  //  }
                }
            }
            filteredList = filterList(temp);

        }

        // Return the list
        return filteredList;
    }

    /* Finds the current page's filter tag (/hues or /collection) */
    private void findCurrentFilterTag(String filter) {
        int maxHues = 3;
        int currentHues = 0;
        filterTags = new ArrayList<Tag>();

        // Get current filter tag from the list of tags applied to the page.
        Tag[] currentTags = currentPage.getTags();

        for (Tag t : currentTags) {
            if (currentHues == maxHues) { 
            	return; 
            	}

            // Add tags that have the filter /hues
            if (t.getLocalTagID().contains(filter)) {
                filterTags.add(t);
                currentHues ++;
            }
        }
    }

    private boolean checkMatchingTags(Page child, Tag hueTag) {
        int huesCounter = 0;

        // Get the children's tag
        Tag[] childTags = child.getTags();

        for(Tag t : childTags) {
            // Count the hues tags first.
            if( t.getLocalTagID().contains("collections/")){
                huesCounter ++;
            }

            // Eval if the tag has the filter we're looking for.
            if (t.getName().equals(hueTag.getName()) && huesCounter < 3){
                return true;
            }
        }
        return false;
    }

    private List<ColorPage> filterList(List<Page> list) {
       // List<Page> cutdownList = new ArrayList<Page>();
        List<ColorPage> temp = new ArrayList<ColorPage>();
        if(null!=list){
        // If Related Colors base list is less than 12 return the complete list.
        if (list.size() <= 12) {
            for(Page p : list) {
                ColorPage cp = new ColorPage(p);
                temp.add(cp);
            }
        } else {
           // cutdownList = list;
            Collections.shuffle(list);
            for (int i = 0; i < 12; i ++) {
                ColorPage cp = new ColorPage(list.get(i));
                temp.add(cp);
            }
        }
        }
        return temp;
    }

    private String findProductPagePath() {
       if (productPage != null) {
            return productPage.getPath();
        }
        return "#";
    }

    /** GETTERS AND SETTERS **/
    public String getProductTag() { return productTag; }
    public void setProductTag(String productTag) { this.productTag = productTag; }

    public boolean isEdit() { return edit; }
    public void setEdit(boolean edit) { this.edit = edit; }

    public List<Tag> getFilterTags() { return filterTags; }
    public void setFilterTags(List<Tag> filterTags) { this.filterTags = filterTags; }

    public String getColorPageParent() { return colorPageParent; }
    public void setColorPageParent(String colorPageParent) { this.colorPageParent = colorPageParent; }

    public String getProductPagePath() { return productPagePath; }
    public void setProductPagePath(String productPagePath) { this.productPagePath = productPagePath; }

    public String getRecommendedColorsTitle() { return Global.getTranslatedText(currentPage,slingRequest,recommendedColorsTitle); }
    public String getSeeRelatedCollections() { return Global.getTranslatedText(currentPage,slingRequest,seeRelatedCollections); }

    public List<ColorPage> getRecommendedColors() {
        return recommendedColors;
    }

    public void setRecommendedColors(List<ColorPage> recommendedColors) {
        this.recommendedColors = recommendedColors;
    }

    public String getNext() { return Global.getTranslatedText(currentPage, slingRequest, next); }

    public String getPrev() { return Global.getTranslatedText(currentPage, slingRequest, prev); }

}
