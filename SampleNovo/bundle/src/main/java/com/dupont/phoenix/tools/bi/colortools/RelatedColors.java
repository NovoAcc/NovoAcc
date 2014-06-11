package com.dupont.phoenix.tools.bi.colortools;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.Global;

/**
 * Created with IntelliJ IDEA.
 * User: felipe.abellan
 * Bi Color Tool Controller. This will provide the Related and Recommended Color Tools the Base Content List.
 */
public class RelatedColors {

    final static Logger logger = LoggerFactory.getLogger(RelatedColors.class);

    /* Basic Controller Variables. */
    private Resource resource;
    private Page currentPage;
    private SlingHttpServletRequest slingRequest;
    private Locale locale;
    private boolean edit;

    /* Base content list */
    private List<ColorPage> relatedColors;
    private List<Tag> filterTags;
    private String colorPageProductTag;
    private String colorParentPage;

    /* Related Colors Translation Support */
    private static final String relatedColorsTitle = "Related Colors";
    private static final String seeRelatedHues = "See Related Hues";
    private static final String next = "Next";
    private static final String prev = "Prev";

    public RelatedColors(Resource resource, Page currentPage, SlingHttpServletRequest slingRequest) {
        this.resource = resource;
        this.currentPage = currentPage;
        this.slingRequest = slingRequest;
        this.locale = slingRequest.getLocale();
        this.edit = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
        init();
    }

    private void init() {
        relatedColors = findRelatedColors();
        colorPageProductTag = findColorPageTag();
        colorParentPage = findColorParentPage();
    }

    /* Find Siblings for Related Colors */
    private List<ColorPage> findRelatedColors() {

        // Find the current filter Tag
        findCurrentFilterTag("hues/");

        List<Page> temp = new ArrayList<Page>();
        List<ColorPage> filteredList = new ArrayList<ColorPage>();


        // Get the parent.
        Page parent = currentPage.getParent();

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

                   // }
                }
            }

            filteredList = filterList(temp, currentPage);

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
            if( t.getLocalTagID().contains("hues/")){
                huesCounter ++;
            }

            // Eval if the tag has the filter we're looking for.
            if (t.getName().equals(hueTag.getName()) && huesCounter < 3){
                return true;
            }
        }
        return false;
    }

    /**
     *  Filters the list to show the prev 6 and next 6 colors depending on current color position
     *  Sometimes I feel compiler ignores my comments.
     */
    private List<ColorPage> filterList(List<Page> list, Page currentPage) {
        List<Page> cutdownList = new ArrayList<Page>();
        List<ColorPage> temp = new ArrayList<ColorPage>();
        int currentPagePos = list.indexOf(currentPage);
        if (currentPagePos != -1) {

            // Best possible scenario. when color has 6 prev and 6 next
            if (currentPagePos - 6 > 0 && currentPagePos + 6 < list.size()) {
                cutdownList = list.subList(currentPagePos - 6, currentPagePos + 7);

            // Less than 6 prev items, but enough items to get from after.
            } else if (currentPagePos - 6 <= 0 && currentPagePos + (6-(currentPagePos-6)) < list.size()) {

                // Get the First items from the dark end.
                for (int i = list.size()+(currentPagePos-6); i < list.size(); i++) {
                   cutdownList.add(list.get(i));
                }

                // Get the rest of the colors from the light side
                for(int i = 0; i <= currentPagePos + 6; i++){
                    cutdownList.add(list.get(i));
                }

            // Less than 6 following items, start taking colors from prev colors.
            } else if (currentPagePos + 6 >= list.size()-1 && currentPagePos - (6 + list.size() - currentPagePos) > 0 ) {

                // get the prev 6 until the end.
                for (int i = currentPagePos - 6 ; i < list.size(); i++){
                    cutdownList.add(list.get(i));
                }

                // get the diff from the light colors.
                for (int i = 0; i <= 6-(list.size() - currentPagePos); i++){
                    cutdownList.add(list.get(i));
                }
            } else { // Default condition. Can be assumed that there are less than 12 colors.
                cutdownList = list;
            }

            // Convert the cutdown list into a ColorPage array excluding current page if found.
            for(Page p : cutdownList) {
                if(!p.equals(currentPage)){
                    ColorPage cp = new ColorPage(p);
                    temp.add(cp);
                }
            }
        }

        return temp;

    }

    /**
     * Finds the current color page Tag to get the name of the product correctly.
     * @return  The string of product for this color page.
     */
    private String findColorPageTag() {
        String colorPageTag = "";
        String tag[] = currentPage.getProperties().get("pageTag",String[].class);
        TagManager tm = resource.getResourceResolver().adaptTo(TagManager.class);
        if (tag != null) {
            Tag pageTag = tm.resolve(tag[0]);
            if (pageTag != null) {
                colorPageTag = pageTag.getParent().getTitle(locale);
            }
        }
        return colorPageTag;
    }

    private String findColorParentPage() {
        Page parent = currentPage.getParent(2);
        String parentPath;
        if (parent != null) {
            parentPath = parent.getPath();
        } else {
            parentPath = "#";
        }
        return  parentPath;
    }

    public List<Tag> getFilterTags() {
        return filterTags;
    }
    public void setFilterTag(List<Tag> filterTags) {
        this.filterTags = filterTags;
    }
    public List<ColorPage> getRelatedColors() {
        return relatedColors;
    }
    public void setRelatedColors(List<ColorPage> relatedColors) {
        this.relatedColors = relatedColors;
    }
    public String getRelatedColorsTitle() { return Global.getTranslatedText(currentPage, slingRequest,relatedColorsTitle); }

    public String getSeeRelatedHues() { return Global.getTranslatedText(currentPage, slingRequest, seeRelatedHues); }

    public String getColorPageProductTag() {
        return colorPageProductTag;
    }
    public void setColorPageProductTag(String colorPageProductTag) {
        this.colorPageProductTag = colorPageProductTag;
    }
    public String getColorParentPage() { return colorParentPage; }
    public void setColorParentPage(String colorParentPage) { this.colorParentPage = colorParentPage; }
    public String getNext() { return Global.getTranslatedText(currentPage, slingRequest, next); }

    public String getPrev() { return Global.getTranslatedText(currentPage, slingRequest, prev); }
    public boolean isEdit() {
        return edit;
    }
}
