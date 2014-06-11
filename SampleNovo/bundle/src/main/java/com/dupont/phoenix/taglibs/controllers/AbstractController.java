package com.dupont.phoenix.taglibs.controllers;

import java.util.List;

import java.util.Locale;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.taghandler.ControllerTag;
import com.dupont.phoenix.GlobalConstants;


/**
 * The Class AbstractController.
 */
public abstract class AbstractController implements Controller {
	
	
	/** The jsp context. */
	private final JSPContext jspContext;
	
	private final Logger COMMON_LOGGER = LoggerFactory.getLogger(ControllerTag.class);
	
	/**
	 * Controller constructor.
	 * @param context the context
	 */
	public AbstractController(JSPContext context) {
		
		this.jspContext = context;
		
	}
	
	/**
	 * Instantiates a new abstract controller.
	 */
	public AbstractController() {
		
		this.jspContext = null;
		
	}
	
	
	public void init() {
	
	}
	
	/**
	 * Gets the context.
	 * @return the context
	 */
	protected JSPContext getContext() {
		
		return this.jspContext;
	}
	
	/**
	 * Gets the properties.
	 * @return the properties
	 */
	public ValueMap getProperties() {
		
		return this.jspContext.getProperties();
	}
	
	/**
	 * Gets the page manager.
	 * @return the page manager
	 */
	public PageManager getPageManager() {
		
		return this.jspContext.getPageManager();
	}
	
	/**
	 * Gets the page properties.
	 * @return the page properties
	 */
	public ValueMap getPageProperties() {
		
		return this.jspContext.getPageProperties();
	}
	
	/**
	 * Gets the resource.
	 * @return the resource
	 */
	public Resource getResource() {
		
		return this.jspContext.getResource();
	}
	
	/**
	 * Gets the resource resolver.
	 * @return the resource resolver
	 */
	public ResourceResolver getResourceResolver() {
		
		return this.jspContext.getResourceResolver();
	}
	
	
	/**
	 * Gets the selectors.
	 * @return the selectors
	 */
	public List<String> getSelectors() {
		
		return this.jspContext.getSelectors();
	}
	
	/**
	 * Gets the selectors.
	 * @return the selectors
	 */
	public String getSelectorString() {
		
		return this.jspContext.getRequest().getRequestPathInfo().getSelectorString();
	}
	
	/**
	 * Gets the selectors.
	 * @return the selectors
	 */
	public Boolean hasSelector() {
		
		return !this.getSelectors().isEmpty();
	}
	
	/**
	 * Gets the sling.
	 * @return the sling
	 */
	public SlingScriptHelper getSling() {
		
		return this.jspContext.getSling();
	}
	
	/**
	 * Gets the suffix.
	 * @return the suffix
	 */
	public String getSuffix() {
		
		return this.jspContext.getSuffix();
	}
	
	/**
	 * Gets the sling request.
	 * @return the sling request
	 */
	public SlingHttpServletRequest getSlingRequest() {
		
		return this.jspContext.getRequest();
	}
	
	/**
	 * Gets the sling response.
	 * @return the sling response
	 */
	public SlingHttpServletResponse getSlingResponse() {
		
		return this.jspContext.getResponse();
	}
	
	/**
	 * Checks if is edit mode.
	 * @return the boolean
	 */
	public boolean isEditMode() {
		
		return this.jspContext.isEditMode();
	}
	
	/**
	 * Gets the current node.
	 * @return the current node
	 */
	public Node getCurrentNode() {
		
		return this.jspContext.getCurrentNode();
	}
	
	/**
	 * Gets the node name.
	 * @return the node name
	 */
	public String getNodeName() {
		return this.jspContext.getResource().getName();
	}
	
	/**
	 * Gets the current page path.
	 * @return the current page path
	 */
	public String getCurrentPagePath() {
		
		return this.jspContext.getCurrentPagePath();
	}
	
	/**
	 * Gets the current style.
	 * @return the current style
	 */
	public Style getCurrentStyle() {
		
		return this.jspContext.getCurrentStyle();
	}
	
	/**
	 * Gets the current page.
	 * @return the current page
	 */
	public Page getCurrentPage() {
		
		return this.jspContext.getCurrentPage();
	}
	
	/**
	 * Gets the share class.
	 * @return the share class
	 */
	public String getShareClass() {
		
		return (String) this.getSlingRequest().getAttribute(GlobalConstants.SHARE_CLASS);
	}
	
	/**
	 * Gets the unique id.
	 * @return the unique id.
	 */
	public String getId() {
		String id = GlobalConstants.ONE;
		try {
			if (this.getCurrentNode() != null) {
				id = String.valueOf(this.getCurrentNode().getIdentifier().hashCode());
			}
			
		} catch (RepositoryException repositoryException) {
			COMMON_LOGGER.error("RepositoryException Exception ", repositoryException);
		}
		return id;
	}
	
	/**
	 * Gets the locale.
	 * @return the locale
	 */
	public Locale getLocale() {
		return jspContext.getLocale();
	}
	
	
	
}
