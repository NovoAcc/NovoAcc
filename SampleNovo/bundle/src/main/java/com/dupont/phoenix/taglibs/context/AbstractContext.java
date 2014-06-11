package com.dupont.phoenix.taglibs.context;

import javax.jcr.Node;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;

/**
 * The Class AbstractContext.
 */
public abstract class AbstractContext implements Context {
	
	/** The request. */
	private final SlingHttpServletRequest request;
	
	/** The response. */
	private final SlingHttpServletResponse response;
	
	/**
	 * Create context.
	 * @param request Request object
	 * @param response Response object
	 */
	public AbstractContext(final SlingHttpServletRequest request, final SlingHttpServletResponse response) {
		
		this.request = request;
		this.response = response;
	}
	
	/**
	 * Create context without request/response.
	 */
	public AbstractContext() {
		
		this.request = null;
		this.response = null;
	}
	
	
	public SlingHttpServletRequest getRequest() {
		
		return request;
	}
	

	public SlingHttpServletResponse getResponse() {
		
		return response;
	}
	
	
	public Resource getResource() {
		
		return request.getResource();
	}
	

	public ResourceResolver getResourceResolver() {
		
		return request.getResourceResolver();
	}
	
	/**
	 * Get current node (if exists).
	 * @return Current node
	 */
	public Node getCurrentNode() {
		
		if (!ResourceUtil.isNonExistingResource(getResource())) { 
			return getResource().adaptTo(Node.class); 
			}
		return null;
	}
	
	/**
	 * Gets the page manager.
	 * @return the page manager
	 */
	public PageManager getPageManager() {
		
		return getResourceResolver().adaptTo(PageManager.class);
	}
	
	/**
	 * Gets the current page.
	 * @return the current page
	 */
	public Page getCurrentPage() {
		
		return getPageManager().getContainingPage(getResource());
	}
	
	/**
	 * Checks if is edits the mode.
	 * @return true, if is edits the mode
	 */
	public boolean isEditMode() {
		
		return WCMMode.fromRequest(request) == WCMMode.EDIT || WCMMode.fromRequest(request) == WCMMode.DESIGN;
	}
	
}
