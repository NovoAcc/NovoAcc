 package com.dupont.phoenix.navigation;

import java.util.ArrayList;
import java.util.List;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;

public class Breadcrumb extends AbstractController{

	
	/* Breadcrumb variables */
	private int level;
    private int endLevel; 
    private int currentLevel;
    private String delimStr = "<span class=\"breadcrumb-spacer\"> &gt; </span>";
	
    List<NavigationPage> pagesInBreadcrumb;
	
    public Breadcrumb(JSPContext context){
    	super(context);
    	initialize();
    }
/*	public Breadcrumb(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource) {
		this.slingRequest = slingRequest;
		this.currentPage = currentPage;
		this.resource = resource;
		this.resolver = resource.getResourceResolver();
		init();
	} */
	
	private void initialize() {
		// Set up variables
		level = 1; // content/site/homepage
		endLevel = 0; // currentPage
		currentLevel = getCurrentPage().getDepth();
		setPagesInBreadcrumb(findPages());
	}
	
	private List<NavigationPage> findPages() {
		List<NavigationPage> temp = new ArrayList<NavigationPage>();
		for (int i = level; i < currentLevel; i++){
			Page page = getCurrentPage().getAbsoluteParent(i);
			// If page exist and its not hidden in nav.
			if(page != null && !page.isHideInNav()) {
				// Create a representation of the Page and save into the array.
				NavigationPage bp = new NavigationPage(page, getSlingRequest());
				temp.add(bp);
			}
		}
		return temp;
	}

	
	public int getLevel() {
		return level;
	}

	public int getEndLevel() {
		return endLevel;
	}


	public String getDelimStr() {
		return delimStr;
	}

	public List<NavigationPage> getPagesInBreadcrumb() {
		return pagesInBreadcrumb;
	}

	public void setPagesInBreadcrumb(List<NavigationPage> pagesInBreadcrumb) {
		this.pagesInBreadcrumb = pagesInBreadcrumb;
	}

}
