package com.dupont.phoenix.tools.SubProductNavigation;

import com.day.cq.tagging.Tag;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

public class Filter {

    private SlingHttpServletRequest slingRequest;
    private String title;
    private String name;
    private String description;
    private String namespace;
    private List<Filter> children;
    private Locale locale;



    private ValueMap props;

	public Filter(Tag tag, SlingHttpServletRequest slingRequest, ValueMap props, boolean findChildren){
        this.slingRequest = slingRequest;
        if (props != null) {
            this.props = props;
        }
        this.locale = slingRequest.getLocale();
        this.title = tag.getTitle(locale);
        if (findChildren) {
            children = findFilterOptions(tag);
        }
        this.name = tag.getName();
        this.namespace = tag.getNamespace().getName();
        this.description = tag.getDescription();
	}

    private List<Filter> findFilterOptions(Tag tag) {
        // Create a new List for Strings
        List<Filter> temp = new ArrayList<Filter>();

        // Get the tag direct children.
        Iterator<Tag> tagChildren = tag.listChildren();

        // Retrieve the localized title and add it to array.
        while (tagChildren.hasNext()) {
            Tag childTag = tagChildren.next();
            temp.add(new Filter(childTag, slingRequest, null, false));
        }

        return temp;
    }

    public List<Filter> getChildren() {
        return children;
    }

    public void setChildren(List<Filter> children) {
        this.children = children;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ValueMap getProps() {
        return props;
    }

    public String getNamespace() {
        return namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }
}
