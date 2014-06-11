package com.dupont.phoenix.tools.SubProductNavigation;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.Global;

/**
 * Created by felipe.abellan on 12/26/13.
 */
public class SubProductNavigation {

    /* Basic Model Variables */
    private Resource resource;
    private Page currentPage;
    private SlingHttpServletRequest slingRequest;
    private ValueMap properties;
    private PageManager pageManager;
    private boolean edit;


    /* Module variables */
    private List<SubProductPage> subProductPageList;
    private Tag productTag;
    private String subProductsPath;
    private Filter primaryFilter;
    private Filter subfilter1;
    private Filter subfilter2;
    private List<Tag> filterTags;

    /* Sub Product Navigation Translation & Author Support */
    private static final String showMe = "Show Me";
    private static final String of = "of";
    private static final String all = "All";
    private static final String alphabetic = "Alphabetic";

    public SubProductNavigation(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest) {
        this.resource = resource;
        this.currentPage = currentPage;
        this.pageManager = currentPage.getPageManager();
        this.slingRequest = slingRequest;
        this.properties = resource.adaptTo(ValueMap.class);
        this.edit = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
        init();
    }

    private void init() {
        // Get the sub products path
        subProductsPath = properties.get("subproductspath",String.class);
        productTag = findProductTag();
        filterTags = findFiltersTags();

        // First get the list of subproduct pages
        subProductPageList = findSubProductPages(subProductsPath);
    }

    private Tag findProductTag() {
        if (subProductsPath != null && !StringUtils.EMPTY.equalsIgnoreCase(subProductsPath)) {
            Page productPage = currentPage.getPageManager().getPage(subProductsPath);
            TagManager tm = resource.getResourceResolver().adaptTo(TagManager.class);
            if (productPage != null) {
                String[] tags = productPage.getProperties().get("pageTag",String[].class);
                if (tags != null && tags.length > 0) { 
                    return tm.resolve(tags[0]);
                }
            }
        }
        return null;
    }

    private List<SubProductPage> findSubProductPages(String subProductsPath) {
        List<SubProductPage> temp = new ArrayList<SubProductPage>();

        // String path exist
        if (subProductsPath != null && !StringUtils.EMPTY.equalsIgnoreCase(subProductsPath) && productTag != null){
            Page subProductsParent = pageManager.getPage(subProductsPath);

            // Check page exist
            if (subProductsParent != null) {

                if (subProductsParent.hasChild("sub-products")) {
                    subProductsParent = subProductsParent.getPageManager().getPage(subProductsPath+"/sub-products");
                }
                // Get all the subpages.
                Iterator<Page> children = subProductsParent.listChildren();

                while (children.hasNext()) {
                    Page child = children.next();
                    if (hasTagsFromProduct(child, productTag) && hasMatchingTags(child) && !child.isHideInNav()) {
                        SubProductPage spp = new SubProductPage(child, filterTags);
                        temp.add(spp);
                    }
                }
            }
        }

        return temp;
    }

    private boolean hasTagsFromProduct(Page page, Tag productTag) {
        Tag[] pageTags = page.getTags();
        for( Tag t : pageTags) {
            String localID = t.getLocalTagID();
            if (localID.contains(productTag.getName())){
                return true;
            }
        }
        return false;
    }

    private boolean hasMatchingTags(Page page) {
        Tag[] pageTags = page.getTags();
        for (Tag t : pageTags) {
            String s = t.getLocalTagID();

            // Do it like so because a page can be only tagged for a subfilter.
            if (primaryFilter != null && s.contains(primaryFilter.getName())) {
                return true;
            } else if (subfilter1 != null && s.contains(subfilter1.getName())) {
                return true;
            }  else if (subfilter2 != null &&  s.contains(subfilter2.getName())) {
                return true;
            }
        }

        // if none of the conditions are met, return the default: false
        return false;
    }

    private List<Tag> findFiltersTags() {
        List<Tag> temp = new ArrayList<Tag>();

        // Summon the tag manager: Tag Manager, Tag Manager, TAG MANAGER!
        TagManager tm = resource.getResourceResolver().adaptTo(TagManager.class);

        // Get the tags. First tag is taken as primary filter and 2 and 3 as secondary filters 1 and 2.
        String[] filtersTags = properties.get("filters",String[].class);

        // Verify we are not working with null values and that we actually have some tags in there.
        if (filtersTags != null && filtersTags.length > 0) {

            // Feed worms to the Tag manager.
            for (String s : filtersTags) {
                Tag t = tm.resolve(s);
                if (t != null) {
                    temp.add(t);
                }
            }

            // Setup filter objects now that we have the tag manager
            primaryFilter = new Filter(tm.resolve(filtersTags[0]),slingRequest, null, true);

            // Need to verify we do have a subfilter.
            if (filtersTags.length >= 2) {
                subfilter1 = new Filter(tm.resolve(filtersTags[1]),slingRequest, properties, true);

                // Only get the subfilter 2 if the subfilter 1 exist. otherwise is pointless.
                if (filtersTags.length >= 3) {
                    subfilter2 = new Filter(tm.resolve(filtersTags[2]),slingRequest, properties, true);
                }
            }
        }

        return temp;
    }


    public List<SubProductPage> getSubProductPageList() {
        return subProductPageList;
    }

    public void setSubProductPageList(List<SubProductPage> subProductPageList) {
        this.subProductPageList = subProductPageList;
    }

    public Filter getPrimaryFilter() {
        return primaryFilter;
    }

    public void setPrimaryFilter(Filter primaryFilter) {
        this.primaryFilter = primaryFilter;
    }

    public Filter getSubfilter1() {
        return subfilter1;
    }

    public void setSubfilter1(Filter subfilter1) {
        this.subfilter1 = subfilter1;
    }

    public Filter getSubfilter2() {
        return subfilter2;
    }

    public void setSubfilter2(Filter subfilter2) {
        this.subfilter2 = subfilter2;
    }

    public boolean isEdit() {
        return edit;
    }

    public void setEdit(boolean edit) {
        this.edit = edit;
    }

    public ValueMap getProperties() {
        return properties;
    }

    public String getShowMe() { return Global.getTranslatedText(currentPage, slingRequest, showMe); }

    public String getOf() { return Global.getTranslatedText(currentPage, slingRequest, of); }

    public String getAll() { return Global.getTranslatedText(currentPage, slingRequest, all); }

    public String getAlphabetic() { return Global.getTranslatedText(currentPage, slingRequest, alphabetic); }
}
