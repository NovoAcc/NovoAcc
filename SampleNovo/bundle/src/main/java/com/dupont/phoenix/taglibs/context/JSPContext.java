package com.dupont.phoenix.taglibs.context;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_COMPONENT_CONTEXT_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_COMPONENT_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_CURRENT_DESIGN_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_CURRENT_PAGE_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_CURRENT_STYLE_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_DESIGNER_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_EDIT_CONTEXT_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_PAGE_PROPERTIES_NAME;
import static com.day.cq.wcm.tags.DefineObjectsTag.DEFAULT_PROPERTIES_NAME;
import static org.apache.sling.scripting.jsp.taglib.DefineObjectsTag.DEFAULT_SLING_NAME;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import javax.servlet.jsp.PageContext;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.scripting.jsp.util.TagUtil;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.components.Component;
import com.day.cq.wcm.api.components.ComponentContext;
import com.day.cq.wcm.api.components.EditContext;
import com.day.cq.wcm.api.designer.Design;
import com.day.cq.wcm.api.designer.Designer;
import com.day.cq.wcm.api.designer.Style;
import com.day.cq.wcm.tags.DefineObjectsTag;


/**
 * The Class JSPContext.
 */
public class JSPContext extends AbstractContext {
	
	/** The page context. */
	private final PageContext pageContext;
	
	/** The sling request. */
	private SlingHttpServletRequest slingRequest;
	
	/** The current page path. */
	private String currentPagePath;
	
	/** The selectors. */
	private List<String> selectors;
	
	/** The suffix. */
	private String suffix;
	
	
	/**
	 * Creates the JSP context using the provided PageContext.
	 * @param pageContext Page context
	 */
	public JSPContext(PageContext pageContext) {
		
		super(TagUtil.getRequest(pageContext), TagUtil.getResponse(pageContext));
		this.pageContext = pageContext;
		this.slingRequest = TagUtil.getRequest(pageContext);
		init();
	}
	
	/**
	 * Initialize objects (cached).
	 */
	private void init() {
		
		// get objects from pageContext if exists
		if (pageContext != null) {
			Page currentPage = (Page) pageContext.getAttribute(DefineObjectsTag.DEFAULT_CURRENT_PAGE_NAME);
			// current page path
			if (currentPage != null) {
				currentPagePath = currentPage.getPath();
			}
		}
		// all selectors
		selectors = new ArrayList<String>(Arrays.asList(slingRequest.getRequestPathInfo().getSelectors()));
		// suffix
		suffix = slingRequest.getRequestPathInfo().getSuffix();
	}
	
	/**
	 * Gets the component.
	 * @return the component
	 */
	public Component getComponent() {
		return (Component) pageContext.getAttribute(DEFAULT_COMPONENT_NAME);
	}
	
	/**
	 * Gets the component context.
	 * @return the component context
	 */
	public ComponentContext getComponentContext() {
		
		return (ComponentContext) pageContext.getAttribute(DEFAULT_COMPONENT_CONTEXT_NAME);
	}
	
	/**
	 * Gets the current design.
	 * @return the current design
	 */
	public Design getCurrentDesign() {
		
		return (Design) pageContext.getAttribute(DEFAULT_CURRENT_DESIGN_NAME);
	}
	
	/*
	 * (non-Javadoc)
	 * @see
	 */
	@Override
	public Page getCurrentPage() {
		
		return (Page) pageContext.getAttribute(DEFAULT_CURRENT_PAGE_NAME);
	}
	
	/**
	 * Gets the current page path.
	 * @return the current page path
	 */
	public String getCurrentPagePath() {
		
		return currentPagePath;
	}
	
	/**
	 * Gets the current style.
	 * @return the current style
	 */
	public Style getCurrentStyle() {
		
		return (Style) pageContext.getAttribute(DEFAULT_CURRENT_STYLE_NAME);
	}
	
	/**
	 * Gets the designer.
	 * @return the designer
	 */
	public Designer getDesigner() {
		
		return (Designer) pageContext.getAttribute(DEFAULT_DESIGNER_NAME);
	}
	

	/**
	 * Gets the edits the context.
	 * @return the edits the context
	 */
	public EditContext getEditContext() {
		
		return (EditContext) pageContext.getAttribute(DEFAULT_EDIT_CONTEXT_NAME);
	}
	
	/**
	 * Gets the page context.
	 * @return the page context
	 */
	public PageContext getPageContext() {
		
		return pageContext;
	}
	
	/**
	 * Gets the page properties.
	 * @return the page properties
	 */
	public ValueMap getPageProperties() {
		
		return (ValueMap) pageContext.getAttribute(DEFAULT_PAGE_PROPERTIES_NAME);
	}
	
	/**
	 * Gets the properties.
	 * @return the properties
	 */
	public ValueMap getProperties() {
		
		return (ValueMap) pageContext.getAttribute(DEFAULT_PROPERTIES_NAME);
	}
	
	
	/**
	 * Gets the selectors.
	 * @return the selectors
	 */
	public List<String> getSelectors() {
		
		return selectors;
	}
	
	
	/**
	 * Gets the sling.
	 * @return the sling
	 */
	public SlingScriptHelper getSling() {
		
		return (SlingScriptHelper) pageContext.getAttribute(DEFAULT_SLING_NAME);
	}
	
	/**
	 * Gets the suffix.
	 * @return the suffix
	 */
	public String getSuffix() {
		
		return suffix;
	}
	
	/**
	 * Gets the locale.
	 * @return the locale
	 */
	public Locale getLocale() {
		return slingRequest.getLocale();
	}
}
