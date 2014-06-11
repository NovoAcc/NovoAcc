package com.dupont.phoenix.navigation;

import java.util.ArrayList;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.designer.Design;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.GlobalConstants;


public class GlobalNav {
	
	/* CONSTANTS */
	private static final String INDUSTRIES = "industries";
	private static final String PRODSERVICES = "prodservices";
	private static final String SCIENCEANDSOC = "scienceandsoc";
	
	/* Constants for Country Container */
	private static final String DUPONTLINKS = "dupontlinks";
	private static final String DUPONT_LINKS = "dupontLinks";
	private static final String PRODUCTS_AND_SERVICES_CC = "productsandservicescc";
	private static final String COUNTRY_CONTAINER = "countryContainer";
	private static final String VIEW_MORE_LINK = "viewMoreLink";
	private static final String COUNTRY = "country";
	private static final String FIRST_COL_TITLE = "column1Title";
	private static final String SECOND_COL_TITLE = "column2Title";
	private static final String THIRD_COL_TITLE = "column3Title";
	private static final String FIRST_COL_MAIN_NODE = "column1MainLink";
	private static final String SECOND_COL_MAIN_NODE = "column2MainLink";
	private static final String THIRD_COL_MAIN_NODE = "column3MainLink";
	private static final String FIRST_COL_FEAT_NODE = "column1FeaturedLinks";
	private static final String SECOND_COL_FEAT_NODE = "column2FeaturedLinks";
	private static final String THIRD_COL_FEAT_NODE = "column3FeaturedLinks";
		
		
	/* Basic variables */
	private static final Logger logger = LoggerFactory.getLogger(GlobalNav.class);
	private Page currentPage;
	private Design currentDesing;
	private Resource resource;
	private SlingHttpServletRequest slingRequest;
	private ValueMap properties;
	private ResourceResolver resolver;
	private boolean isEdit;
	
	/* Global Nav Variables */
	private String homePageURL;
	private String allIndustriesLandingPath;
	private String allProdServLandingPath;
	private String industriesPath;
	private String prodandservPath;
	private List<NavigationPage> mainnodes;
	
	/* Country Container Variables */
	private String countryContainer;
	private String viewMoreLink;
	private String country;
	
	
	

	/** Constructor **/
	public GlobalNav(final Page currentPage, final SlingHttpServletRequest slingRequest, final Resource resource, final Design currentDesing) {
		this.currentPage = currentPage;
		this.currentDesing = currentDesing;
		this.slingRequest = slingRequest;
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		this.resolver = resource.getResourceResolver();
		this.isEdit = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
		//logger.info("Global Navigation Constructor");
		init();
	}
	
	/** Initialize this class **/
	private void init() {
		// Get the homepage URL
		setHomePageURL(findHomePageURL());
		
		// Get the information from the properties (design)
		Style siteConfigProp = currentDesing.getStyle(GlobalConstants.SITE_CONFIG_PATH);
		
		//Updated for Country Container Enhancement.
		String countryContainer = siteConfigProp.get(COUNTRY_CONTAINER,String.class);
		this.countryContainer = countryContainer;
		
		//Check if Country Container Configuration checkbox is cheked.
		if(countryContainer != null && GlobalConstants.TRUE.equalsIgnoreCase(countryContainer)){
			setViewMoreLink(siteConfigProp.get(VIEW_MORE_LINK,String.class));
			setCountry(siteConfigProp.get(COUNTRY,String.class));
			setupCountryContainterMainNodes();
			
		}else{
		
		// Get the paths for the dynamically loaded data.
		setAllIndustriesLandingPath(siteConfigProp.get("allindustrieslandingnode",String.class));
		setAllProdServLandingPath(siteConfigProp.get("prodserviceslandingnode",String.class));
		
		// Get the paths for the landing pages.
		setIndustriesPath(siteConfigProp.get("industrynode",String.class));
		setProdandservPath(siteConfigProp.get("prodservicesnode",String.class));
		
		// TODO: Get the path for the Science and Sustainability Node.
		
		// Fill out the 3 main nodes.
		setupMainNodes();
		}
	}
	
	
	private String findHomePageURL() {
		// Set a default value for the home page url
		String home = "#" + "/home.html";
		
		// Get the /content/home node.
		Page homePage = currentPage.getAbsoluteParent(2);
		
		// If node exist, take the path
		if (homePage != null) {
			home = homePage.getPath() + ".html";
		}
		return home;
	}
	
	private void setupMainNodes() {
		// Init the array
		mainnodes = new ArrayList<NavigationPage>();
		
		/* Get the navigation pages and its children */
		NavigationPage industryNode = fetchNavigationNodesChildren(industriesPath,INDUSTRIES,1);
		NavigationPage prodservicesNode = fetchNavigationNodesChildren(prodandservPath,PRODSERVICES,2);
		NavigationPage sciencesocietyNode = fetchScienceAndSocietyNode();
		
		/* Add the nav pages to the array */
		mainnodes.add(industryNode);
		mainnodes.add(prodservicesNode);
		mainnodes.add(sciencesocietyNode);
		
		
	}
	
	private NavigationPage fetchNavigationNodesChildren(String path, String nodeType, int depth){
		// Path is valid and has data.
		if(path != null && !StringUtils.EMPTY.equalsIgnoreCase(path)) {
			
			// Get the page using the path from the param
			Page navNode = currentPage.getPageManager().getPage(path);
			
			// Get the childs of the page
			if (navNode != null) {
				
				// Convert the page into a Navigation Page 
				NavigationPage navPage = new NavigationPage(navNode, slingRequest, depth);
				navPage.setGlobalNavNodeName(nodeType);
				
				/* 
				 * Depending on node type, we look for the landing page and add it last on the child array.
				 * This code is repeated and its the only way to make it work. Leave it as is or die trying
				 * to make it work in some other way.
				 * Please log here the wasted hours spent trying to optimize this chunk of code: 6h
				 */
				if(INDUSTRIES.equalsIgnoreCase(nodeType) && allIndustriesLandingPath != null && !StringUtils.EMPTY.equalsIgnoreCase(allIndustriesLandingPath)) {
					
					// Add a title to it.
					Page landingNode = currentPage.getPageManager().getPage(allIndustriesLandingPath);
					NavigationPage landingPage = new NavigationPage(landingNode, slingRequest);
					landingPage.setLandingPage(true);
					navPage.getChildPages().add(landingPage);
					navPage.setTitle(Global.getTranslatedText(currentPage, slingRequest, "industries"));
					//logger.info(" In Global Nav - Industries" +navPage.getTitle());
				} else if (PRODSERVICES.equalsIgnoreCase(nodeType) && allProdServLandingPath != null && !StringUtils.EMPTY.equalsIgnoreCase(allProdServLandingPath)) {
					
					// Add a title to it.
					Page landingNode = currentPage.getPageManager().getPage(allProdServLandingPath);
					NavigationPage landingPage = new NavigationPage(landingNode, slingRequest);
					landingPage.setLandingPage(true);
					navPage.getChildPages().add(landingPage);
					navPage.setTitle(Global.getTranslatedText(currentPage, slingRequest, "products-and-services-menu"));
					//logger.info(" In Global Nav - P & S" +navPage.getTitle());
				}
				
				return navPage;
			}
		}
		return null;
	}
	
	/**
	 * Manual method to load the science and society node in global nav only.
	 * @return The navigation page representing this node.
	 */
	private NavigationPage fetchScienceAndSocietyNode() {
		// Create the main node.
		NavigationPage ourApproach = new NavigationPage();
		
		// Add a title to it.
		ourApproach.setTitle(Global.getTranslatedText(currentPage, slingRequest, "our-approach"));
		ourApproach.setGlobalNavNodeName(SCIENCEANDSOC);
		
		// It has children so, create a new List.
		List<NavigationPage> children = new ArrayList<NavigationPage>();
		
		// Manually create the Navigation children using the Link list provided by author.
		
		// First comes the inclusive innovations
		NavigationPage inclusiveInnovations = manuallyCreateApproachNode("inclusive-innovation", "leftcolumn");
		
		// Add the first node to the list
		children.add(inclusiveInnovations);
		
		// Add the rest of the nav pages.
		try {
			children.addAll(createChildListFromLinks("rightcolumn"));
			
		} catch (JSONException e) {
			logger.error("JSON Exception :", e);
		}
		
		// set the list to the main node.
		ourApproach.setChildPages(children);
		
		return ourApproach;
	}
	
	private NavigationPage manuallyCreateApproachNode(String name, String prop){
		NavigationPage np = new NavigationPage();
		np.setTitle(Global.getTranslatedText(currentPage, slingRequest, name));
		np.setTitleNode(true);
		try {
			np.setChildPages(createChildListFromLinks(prop));
		} catch (JSONException e) {
			logger.error("JSON Exception :", e);
		}
		return np;
	}
	
	private List<NavigationPage> createChildListFromLinks(String prop) throws JSONException{
		List<NavigationPage> temp = new ArrayList<NavigationPage>();
		Style siteConfigProp = currentDesing.getStyle("siteconfig/globalnav/scienceandsociety");
		String[] linksList = siteConfigProp.get(prop,String[].class);
		if(linksList != null) {
	    	// Iterate thru string array and parse the information
			for( String linkItem : linksList ) {
				// create the JSON object to get the info
		        JSONObject jObject  = new JSONObject(linkItem);
		        
		        // Get the link URL and check it in case a wrong type of URL squeezed in.
		        String linkURL = jObject.get("linkURL").toString();
		        linkURL = checkLink(linkURL);
		        
		        // Get the link text.
		        String linkText = jObject.get("linkText").toString();
		        
		        // Validate the page exist and is activated (Publish validation)
		        Page referencePage = currentPage.getPageManager().getPage(linkURL);
		        
		        if (referencePage != null) {
			        NavigationPage childPage = new NavigationPage(currentPage.getPageManager().getPage(linkURL),slingRequest);
			        childPage.overrideTitle(linkText);
			        temp.add(childPage); 
		        }
		        // Else skip the page to avoid NPE.
			}
	    }
	    return temp;
	}
	
	private String checkLink(String url) {
		if (url.startsWith("/content/") && !url.startsWith("/content/dam/")){
			return url;
		}
		return currentPage.getPath();
	}
	
   // Below methods are added for Country Container Enhancement Sprint 2.8.
	
	
	private void setupCountryContainterMainNodes() {
		// Init the array
		mainnodes = new ArrayList<NavigationPage>();
		
		/* Get the navigation pages and its children */
		NavigationPage dupontNode = fetchCCMainLinkNode(DUPONTLINKS, DUPONTLINKS);
		NavigationPage prodserviceNode = fetchCCMainLinkNode(PRODUCTS_AND_SERVICES_CC,PRODSERVICES);
		
		/* Add the nav pages to the array */
		mainnodes.add(prodserviceNode);
		mainnodes.add(dupontNode);
		
		
		
	}
		
	/**
	 * Manual method to load the Product & Services node in global nav only for Country Container.
	 * @return The navigation page representing this node.
	 */
	private NavigationPage fetchCCMainLinkNode(String title, String nodeType) {
		// Create the main node.
		NavigationPage mainNode = new NavigationPage();
		
		// Add a title to it.
		mainNode.setTitle(Global.getTranslatedText(currentPage, slingRequest, title));
		mainNode.setGlobalNavNodeName(nodeType);
		
		// It has children so, create a new List.
		List<NavigationPage> mainChildren = new ArrayList<NavigationPage>();
		
	
		if(DUPONTLINKS.equalsIgnoreCase(nodeType)){
			
			// Manually create the Navigation children using the Link list provided by author.
			
			try {
				Style siteConfigProp = currentDesing.getStyle(GlobalConstants.SITE_CONFIG_PATH);
				String[] dupontLinksList = siteConfigProp.get(DUPONT_LINKS,String[].class);
				mainChildren.addAll(createChildLinkList(dupontLinksList,DUPONTLINKS));
				
			} catch (JSONException e) {
				logger.error("JSON Exception :", e);
			}
		 }else if(PRODSERVICES.equalsIgnoreCase(nodeType)){
			
			// Get the link for First Coloumn.
			Style siteConfigProp = currentDesing.getStyle(GlobalConstants.SITE_CONFIG_PATH);
			String firstColMainLink = siteConfigProp.get(FIRST_COL_MAIN_NODE,String.class);
			String firstColMainTitle = siteConfigProp.get(FIRST_COL_TITLE,String.class);
			String[] firstColLinksList = siteConfigProp.get(FIRST_COL_FEAT_NODE,String[].class);
			
			// Get the link for Second Coloumn.
			String secondColMainLink = siteConfigProp.get(SECOND_COL_MAIN_NODE,String.class);
			String secondColMainTitle = siteConfigProp.get(SECOND_COL_TITLE,String.class);
			String[] secondColLinksList = siteConfigProp.get(SECOND_COL_FEAT_NODE,String[].class);
			
			// Get the link for Third Coloumn.
			String thirdColMainLink = siteConfigProp.get(THIRD_COL_MAIN_NODE,String.class);
			String thirdColMainTitle = siteConfigProp.get(THIRD_COL_TITLE,String.class);
			String[] thirdColLinksList = siteConfigProp.get(THIRD_COL_FEAT_NODE,String[].class);
			
					
			try {
				// Manually create the Navigation children using the Link list provided by author.
				// Add all of the nav pages.
				
				/*
				 * If only first main link is present and second and third main link is not present.
				 */	
				NavigationPage firstChild = createNavigationLinks(firstColMainLink, firstColMainTitle, firstColLinksList);
				
				
				if((firstColMainLink != null && secondColMainLink == null && thirdColMainLink == null)){
					firstChild.getChildPages().addAll(createChildLinkList(secondColLinksList,PRODUCTS_AND_SERVICES_CC));
					firstChild.getChildPages().addAll(createChildLinkList(thirdColLinksList,PRODUCTS_AND_SERVICES_CC));
					mainChildren.add(firstChild);
												
				/*
				 * If first two main links are present and third link is not present.
				 */	
				} else if(firstColMainLink != null && secondColMainLink != null  && thirdColMainLink == null){
				
					mainChildren.add(firstChild);	
					
					NavigationPage secondChild = createNavigationLinks(secondColMainLink, secondColMainTitle, secondColLinksList);
					mainChildren.add(secondChild);
				
				
					/*
					 * If all three main links are present.
					 */
				} else if(firstColMainLink != null && secondColMainLink != null  && thirdColMainLink != null){
					
					mainChildren.add(firstChild);
					
					NavigationPage secondChild = createNavigationLinks(secondColMainLink, secondColMainTitle, secondColLinksList);
					mainChildren.add(secondChild);
					
					NavigationPage thirdChild = createNavigationLinks(thirdColMainLink, thirdColMainTitle, thirdColLinksList);
					mainChildren.add(thirdChild);
					
				}
						
				
			  } catch (JSONException e) {
				logger.error("JSON Exception :", e);
			}
		}
		
		//View More in DuPont Link
		
		if(viewMoreLink != null && !StringUtils.EMPTY.equalsIgnoreCase(viewMoreLink)) {
		
			addViewMoreLink(mainChildren);
		}
		
		// set the list to the main node.
		mainNode.setChildPages(mainChildren);
		
		return mainNode;
	}
	
	/**
	 * 
	 * @param linksList,linkType
	 * @return List<NavigationPage>
	 * @throws JSONException
	 */
	private List<NavigationPage> createChildLinkList(String[] linksList,String linkType) throws JSONException{
		List<NavigationPage> temp = new ArrayList<NavigationPage>();
		
		if(linksList != null) {
	    	// Iterate thru string array and parse the information
			for( String linkItem : linksList ) {
				// create the JSON object to get the info
		        JSONObject jObject  = new JSONObject(linkItem);
		        
		        // Get the link URL and check it in case a wrong type of URL squeezed in.
		        String linkURL = jObject.get(GlobalConstants.LINK_URL).toString();
		        //linkURL = checkLink(linkURL);
		        
		        // Get the link text.
		        String linkText = jObject.get(GlobalConstants.LINK_TEXT).toString();
		        
		        // Get the openInNewWindow text.
		        String openInNewWindow = GlobalConstants.FALSE;
		        if(DUPONTLINKS.equalsIgnoreCase(linkType)){
		       
		            openInNewWindow = jObject.get(GlobalConstants.OPEN_IN_NEW_WINDOW).toString();
				}
		        
		        // Validate the page exist and is activated (Publish validation)
		        Page referencePage = currentPage.getPageManager().getPage(linkURL);
		 		
		        NavigationPage childPage = new NavigationPage();
		    	childPage.overrideTitle(linkText);
		    	//Check the URL is interal or external.
		        if (referencePage != null) {
		        	 StringBuilder sb = new StringBuilder();
		        	 linkURL = sb.append(linkURL).append(GlobalConstants.DOT_HTML).toString();
			         childPage.setLinkURL(linkURL);
			       
		        }else{
		            childPage.setLinkURL(linkURL);
		 		    			
		    	}
		       
		        // Check for New Window Check for only Dupont Links
		        if(DUPONTLINKS.equalsIgnoreCase(linkType) && GlobalConstants.TRUE.equalsIgnoreCase(openInNewWindow)){
		            childPage.overrideNewWindow(true);
		        }
		        temp.add(childPage); 
		        	
		        }
		       
			}
	    		
	    return temp;
	}
	
	/**
	 * 
	 * @param mainChildren
	 * @return void
	 * @throws 
	 */
	private void addViewMoreLink(List<NavigationPage> mainChildren){
		Page viewMoreNode = currentPage.getPageManager().getPage(viewMoreLink);
		NavigationPage viewMorePage = new NavigationPage(viewMoreNode, slingRequest);
		viewMorePage.setLandingPage(true);
		StringBuilder sb = new StringBuilder();
		String viewMoreInDupontLink = sb.append(Global.getTranslatedText(currentPage, slingRequest,GlobalConstants.VIEW_MORE_LINK)).append(" ").append(country).toString();
		viewMorePage.setTitle(viewMoreInDupontLink);
		mainChildren.add(viewMorePage);
			
			
	}
	
	/**
	 * 
	 * @param mainLink, title, featuredLinks
	 * @return navigationPage
	 * @throws JSONException
	 */
	private NavigationPage createNavigationLinks(String mainLink, String title, String[] featuredLinks) throws JSONException{
		NavigationPage navigationPage = new NavigationPage();
		if(mainLink != null){
			navigationPage.setTitle(title);
			navigationPage.setLinkURL(mainLink);
			navigationPage.setFeaturedText(Global.getTranslatedText(currentPage, slingRequest, GlobalConstants.FEATURED));
		}
		navigationPage.setChildPages(createChildLinkList(featuredLinks,PRODUCTS_AND_SERVICES_CC));
		return navigationPage;
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

	public SlingHttpServletRequest getSlingRequest() {
		return slingRequest;
	}

	public void setSlingRequest(SlingHttpServletRequest slingRequest) {
		this.slingRequest = slingRequest;
	}

	public ValueMap getProperties() {
		return properties;
	}

	public void setProperties(ValueMap properties) {
		this.properties = properties;
	}

	public ResourceResolver getResolver() {
		return resolver;
	}

	public void setResolver(ResourceResolver resolver) {
		this.resolver = resolver;
	}

	public boolean getIsEdit() {
		return isEdit;
	}

	public void setIsEdit(boolean isEdit) {
		this.isEdit = isEdit;
	}

	public String getHomePageURL() {
		return homePageURL;
	}

	public void setHomePageURL(String homePageURL) {
		this.homePageURL = homePageURL;
	}

	public List<NavigationPage> getMainnodes() {
		return mainnodes;
	}

	public void setMainnodes(List<NavigationPage> mainnodes) {
		this.mainnodes = mainnodes;
	}

	public String getIndustriesPath() {
		return industriesPath;
	}

	public void setIndustriesPath(String industriesPath) {
		this.industriesPath = industriesPath;
	}

	public String getProdandservPath() {
		return prodandservPath;
	}

	public void setProdandservPath(String prodandservPath) {
		this.prodandservPath = prodandservPath;
	}

	public String getAllIndustriesLandingPath() {
		return allIndustriesLandingPath;
	}

	public void setAllIndustriesLandingPath(String allIndustriesLandingPath) {
		this.allIndustriesLandingPath = allIndustriesLandingPath;
	}

	public String getAllProdServLandingPath() {
		return allProdServLandingPath;
	}

	public void setAllProdServLandingPath(String allProdServLandingPath) {
		this.allProdServLandingPath = allProdServLandingPath;
	}
	
	public String getCountryContainer() {
		return countryContainer;
	}

	public void setCountryContainer(String countryContainer) {
		this.countryContainer = countryContainer;
	}
	
	public String getViewMoreLink() {
		return viewMoreLink;
	}

	public void setViewMoreLink(String viewMoreLink) {
		this.viewMoreLink = viewMoreLink;
	}
	
	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}
	
	
}