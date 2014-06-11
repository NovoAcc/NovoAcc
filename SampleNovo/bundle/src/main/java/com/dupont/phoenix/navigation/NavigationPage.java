package com.dupont.phoenix.navigation;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.Global;

/**
 * A Page representation to be used for building the Breadcrumb and probably any other navigation list needed.
 * @author felipe.abellan
 *
 */
public class NavigationPage {
	
	/**
	 * Static template types that will be Bold and not clickable
	 */
	private static String BASE = "/apps/dupont/phoenix/templates/base";
	private static String T7_1 = "/apps/dupont/phoenix/templates/corporatecontent";
	
	private static String RESPONSIVEBASE = "/apps/dupont/phoenix/templates/responsive/base";
	private static String RESPONSIVET7_1 = "/apps/dupont/phoenix/templates/responsive/corporatecontent";
	
	//RESPONSIVE
	private static final Logger logger = LoggerFactory.getLogger(NavigationPage.class);
	/**
	 * The Page represented by this BreadcrumbPage.
	 */
	private Page page;
	
	/**
	 * The title to be used for this page
	 */
	private String title;
	
	/**
	 * The link URL this page will link to.
	 */
	private String linkURL;
	
	/**
	 * The sling request.
	 */
	private SlingHttpServletRequest slingRequest;
	
	/**
	 * Boolean to expand down the tree.
	 */
	private boolean shouldExpand;
	
	/**
	 * The Child Pages
	 */
	private List<NavigationPage> childPages;
	
	/**
	 * If the title should be bold.
	 */
	private boolean titleBold;
	
	/**
	 * If the Node is a title in the nav list
	 */
	private boolean titleNode;
	
	/** 
	 * Boolean for Global Nav to identify landing pages
	 */
	private boolean landingPage;
	
	
	private boolean newWindow;
	
	/** 
	 * Featured text on Country Container Mega menu.
	 */
	private String featuredText;
	
	/**
	 * Holds the type of node on the global nav for rendering purposes.
	 */
	private String globalNavNodeName;
		
	public NavigationPage(final Page page, final SlingHttpServletRequest slingRequest) {
    	this();
		this.page = page;

		if(page != null){
	    	title = Global.getNavigationTitle(page);
	    	linkURL = page.getPath();
	    	titleBold = shouldBeBold();
	    	titleNode = shouldBeTitleNode();
	    	newWindow = openInNewWindow();
		}

    	
    	this.slingRequest = slingRequest;
    	
    }
	
	public NavigationPage(final Page page, final SlingHttpServletRequest slingRequest, int depth) {
		this(page,slingRequest);
        if (depth > 0){
            childPages = expandChildren(depth-1);
        }
	}
	
	public NavigationPage(String title, String linkURL) {
		this();
		this.title = title;
		this.linkURL = linkURL;
	}
	
	public NavigationPage() {
		this.childPages = new ArrayList<NavigationPage>();
	}
	
	public void overrideTitle(String title) {
		this.title = title;	
	}
	
	//Added for Country Container Enhancement.
	public void overrideNewWindow(boolean newWindow) {
		this.newWindow = newWindow;	
	}
	
	/** Private Methods **/
	private List<NavigationPage> expandChildren(int depth) {

        logger.info( "*********************** expanding children with depth: " + depth);
		
		// Create the temp list of child nodes.
		List<NavigationPage> templist = new ArrayList<NavigationPage>();
		
		// Iterate thru the children
		Iterator<Page> itr = page.listChildren();
		while (itr.hasNext()) {

			// Get the child page
			Page childPage = itr.next();
			
			// Convert to nave page and get childs

			NavigationPage childNavPage = new NavigationPage(childPage,slingRequest,depth);

			// Add to temp list.s
			templist.add(childNavPage);
			
		}
		
		return templist;
	}
	
	private boolean shouldBeBold(){
		ValueMap pageProps = page.getProperties();
		final String templatePath = pageProps.get("cq:template", "");
		//logger.info("Template: {}",templatePath);
		if(templatePath.equalsIgnoreCase(BASE) || templatePath.equalsIgnoreCase(T7_1) || templatePath.equalsIgnoreCase(RESPONSIVET7_1) || templatePath.equalsIgnoreCase(RESPONSIVEBASE)  ) {
			//logger.info("Template encontrado: ");
			return true;
		}
		return false;
	}
	
	private boolean shouldBeTitleNode() {
		ValueMap pageProps = page.getProperties();
		final String templatePath = pageProps.get("cq:template", "");
		if(templatePath.equalsIgnoreCase(BASE)) {
			return true;
		}
		return false;
	}
	
	private boolean openInNewWindow(){
		ValueMap pageProps = page.getProperties();
		return Boolean.valueOf(pageProps.get("windowflag", "false"));
	}
	
	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getLinkURL() {
		return linkURL;
	}

	public void setLinkURL(String linkURL) {
		this.linkURL = linkURL;
	}

	public SlingHttpServletRequest getSlingRequest() {
		return slingRequest;
	}

	public void setSlingRequest(SlingHttpServletRequest slingRequest) {
		this.slingRequest = slingRequest;
	}

	public List<NavigationPage> getChildPages() {
		return childPages;
	}

	public void setChildPages(List<NavigationPage> childPages) {
		this.childPages = childPages;
	}

	public boolean isTitleBold() {
		return titleBold;
	}

	public void setTitleBold(boolean titleBold) {
		this.titleBold = titleBold;
	}

	public boolean isShouldExpand() {
		return shouldExpand;
	}

	public void setShouldExpand(boolean shouldExpand) {
		this.shouldExpand = shouldExpand;
	}

	public boolean getLandingPage() {
		return landingPage;
	}

	public void setLandingPage(boolean landingPage) {
		this.landingPage = landingPage;
	}

	public boolean getParent() {
		if(childPages.size() >= 1){
			return true;
		}
		else
			return false;
	}

	public boolean isTitleNode() {
		return titleNode;
	}

	public void setTitleNode(boolean titleNode) {
		this.titleNode = titleNode;
	}

	public boolean getNewWindow() {
		return newWindow;
	}

	public String getGlobalNavNodeName() {
		return globalNavNodeName;
	}

	public void setGlobalNavNodeName(String globalNavNodeName) {
		this.globalNavNodeName = globalNavNodeName;
	}
	public String getFeaturedText() {
		return featuredText;
	}

	public void setFeaturedText(String featuredText) {
		this.featuredText = featuredText;
	}
}
