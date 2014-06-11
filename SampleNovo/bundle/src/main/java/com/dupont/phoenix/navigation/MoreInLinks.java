package com.dupont.phoenix.navigation;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.Global;

public class MoreInLinks {
	
	/* Basic Variables */
	private SlingHttpServletRequest slingRequest;
	private Page currentPage;
	private Resource resource;
	
	
	private List<NavigationPage> moreInPages;
	private String heroHeadline;
	
	public MoreInLinks(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource) {
		this.slingRequest = slingRequest;
		this.currentPage = currentPage;
		this.resource = resource;
		init();
	}
	
	private void init() {
		
		if(currentPage!= null && currentPage.getParent()!=null) {
			Page parent = currentPage.getParent();
	        	if(parent.isHideInNav() != false && parent.getParent()!= null) {
	        		parent = parent.getParent();
	        	}
	        	if (null != Global.getHeroHeadline(parent)) {
	        		heroHeadline = Global.getHeroHeadline(parent);
	        	}		
		}
		
		
		moreInPages = new ArrayList<NavigationPage>();
		
		// Get siblings of current page.
		Iterator<Page> itr = currentPage.getParent() != null ? currentPage.getParent().listChildren() : null;
		if (itr != null && itr.hasNext()) {
			while (itr.hasNext()) {
				Page child = itr.next();
				// Not same page and not hidden in nav
				if (!child.isHideInNav() && StringUtils.isNotBlank(child.getName()) && !child.getName().equalsIgnoreCase(currentPage.getName())) {
					NavigationPage page = new NavigationPage(child, slingRequest);
					moreInPages.add(page);
				}
			}
		}
	}

	public SlingHttpServletRequest getSlingRequest() {
		return slingRequest;
	}

	public void setSlingRequest(SlingHttpServletRequest slingRequest) {
		this.slingRequest = slingRequest;
	}

	public Page getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(Page currentPage) {
		this.currentPage = currentPage;
	}

	public Resource getResource() {
		return resource;
	}

	public void setResource(Resource resource) {
		this.resource = resource;
	}

	public List<NavigationPage> getMoreInPages() {
		return moreInPages;
	}

	public void setMoreInPages(List<NavigationPage> moreInPages) {
		this.moreInPages = moreInPages;
	}

	public String getHeroHeadline() {
		return heroHeadline;
	}

	public void setHeroHeadline(String heroHeadline) {
		this.heroHeadline = heroHeadline;
	}
	
	
	public boolean exitisMoreLinks(){
		return (!this.moreInPages.isEmpty());
			
	}

}
