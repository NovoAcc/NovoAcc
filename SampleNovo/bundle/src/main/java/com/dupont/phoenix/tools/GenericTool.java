package com.dupont.phoenix.tools;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;

import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.WCMMode;
import com.dupont.phoenix.tools.bi.BIIndexCard;
import com.dupont.phoenix.tools.dss.DssIndexCard;
import com.dupont.phoenix.tools.innovation.InnovationIndexCard;

public final class GenericTool {

	/* Static variables for templates names */
	public static final String DSS_EXPERT = "/apps/dupont/phoenix/templates/dssexpert";
	public static final String BI_RESIDENTIAL = "/apps/dupont/phoenix/templates/biresidential";
	public static final String INCLUSIVE_INNOVATIONS = "/apps/dupont/phoenix/templates/inclusiveInnovation";
	
	public static final String NO_TEMPLATE = "No template selected";
	
	/* Dialog variables */
	private String toolTitle;
	private String templatePath;
	private String iTemplatePath;
	
	private List<IndexCard> indexCardList;
	private String templateName;
	private boolean validTemplate;
	private boolean active;
	
		
	/* Basic variables */
	private static final Logger logger = LoggerFactory.getLogger(GenericTool.class);
	private Page currentPage;
	private Resource resource;
	private ValueMap properties;
	private ResourceResolver resolver;
	private SlingHttpServletRequest slingRequest;
	private boolean isEdit;
	
	private int indexSlidesCount;
	private String indexDescription;
	private String mainTitle;
	
	/**
	 * Constructor method for Generic Tool Java Class
	 */
	public GenericTool(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource) {
		this.currentPage = currentPage;
		this.resource = resource;
		this.properties = resource.adaptTo(ValueMap.class);
		this.resolver = resource.getResourceResolver();
		this.slingRequest = slingRequest;
		this.isEdit = WCMMode.fromRequest(slingRequest) == WCMMode.EDIT;
		logger.info("GenericTool Constructor");
		init();
	}
	
	/**
	 * Init method to retrieve values from Dialog and other initialization code needed.
	 */
	private void init() {
		// Setup the title.
		setToolTitle(properties.get("tooltitle","No title set"));
		
		// Check for inheritance.
		if(hasInheritance()) {
			templatePath = iTemplatePath;
		} else {
			templatePath = properties.get("templatePath",String.class);
		}
		
		// Check if template is a valid one for the generic tool.
		setTemplateName(getTemplateType());
		if (validTemplate) {
			setIndexCardList(fetchIndexPar(templatePath));
		}
	}
	
	private boolean hasInheritance() {
		InheritanceValueMap iProperties = new HierarchyNodeInheritanceValueMap(resource);
		iTemplatePath = iProperties.getInherited("templatePath", String.class);
		return !(StringUtils.isEmpty(iTemplatePath));
	}
	
	/**
	 * Method to get the template type of the selected page in the path selector
	 */
	private String getTemplateType() {	
		if(StringUtils.isEmpty(templatePath)) {
			return NO_TEMPLATE;
		} else {
			
			// Get the page using resource resolver
			Resource r =  resolver.getResource(templatePath);
			
			// Publish system failsafe.
			if (r != null) {
			
				// Get the props for that resource. (Template page)
				Page sourceTemplatePage = r.adaptTo(Page.class);
				ValueMap pageProps = sourceTemplatePage.getProperties();
				final String templateTypePath = pageProps.get("cq:template", "");
				
				// Use the static variables to check if its correct template.
				if(templateTypePath.equalsIgnoreCase(DSS_EXPERT)) {
					setValidTemplate(true);
				} else if(templateTypePath.equalsIgnoreCase(BI_RESIDENTIAL)) {
					setValidTemplate(true);
				} else	 if(templateTypePath.equalsIgnoreCase(INCLUSIVE_INNOVATIONS)) {
					setValidTemplate(true);
				} else {
					setValidTemplate(false);
				}
				
				// Check if template is activated. For Publish, if code is here, then its active.
                /*
				if (pageProps.containsKey("cq:lastReplicationAction") && WCMMode.fromRequest(slingRequest) == WCMMode.DISABLED) {
					setActive(true);
				} else if(pageProps.containsKey("cq:lastReplicationAction") && "Activate".equalsIgnoreCase(pageProps.get("cq:lastReplicationAction",String.class))){
					setActive(true);
				} else{
					setActive(false);
				}
				*/
				return templateTypePath;
			}
			else {
				setValidTemplate(false);
				setActive(false);
				return "Invalid Template";
			}
		}
	}
	
	/**
	 * Method to get the index and baseballcards
	 */
	private List<IndexCard> fetchIndexPar(String sourcepath) {
		// Create a new temporary list
		List<IndexCard> indexCardListVal = new ArrayList<IndexCard>();
		
		// Get the first Column for the DSS
		if(templateName.equalsIgnoreCase(DSS_EXPERT) || templateName.equalsIgnoreCase(INCLUSIVE_INNOVATIONS)) {
			String p = sourcepath + "/" + "jcr:content/indexDescription";
			if(resolver.getResource(p) != null){
				setIndexDescription(resolver.getResource(p).adaptTo(ValueMap.class).get("text","No description set"));
			}
			else{
				setIndexDescription("No description set");
			}
		}
		
		/* Not needed. but too scared to delete.
		if(templateName.equalsIgnoreCase(BI_RESIDENTIAL)) {
			String p = sourcepath + "/" + "jcr:content/biResidentialTitle";
			if(resolver.getResource(p) != null){
				setMainTitle((resolver.getResource(p).adaptTo(ValueMap.class).get("text","")));
			}
			else
				setMainTitle("");
		}*/
		
		
		// We are only creating one index.
		String path = sourcepath + "/" + "jcr:content/indexPar";
		
		// Get the index resource node
		Resource rootRes = resolver.getResource(path);
		
		// Not null? Great.
		if(rootRes != null) {
			
			// Adapt it to Node so we can pull out the stuff.
			Node pageNode = rootRes.adaptTo(Node.class);
			try {
				if (pageNode != null && pageNode.hasNodes()) {
					NodeIterator itr = pageNode.getNodes();
					if (itr != null) {
						while (itr.hasNext()) {
							Node indexdNode = itr.nextNode();
							Resource indexdNodeResource = resolver.getResource(indexdNode.getPath());
							IndexCard index = null;
							if(templateName.equalsIgnoreCase(DSS_EXPERT)) {
								index = new DssIndexCard(indexdNodeResource);
							}
							else if(templateName.equalsIgnoreCase(BI_RESIDENTIAL)){
								index = new BIIndexCard(indexdNodeResource);
							}
							else if(templateName.equalsIgnoreCase(INCLUSIVE_INNOVATIONS)){
								index = new InnovationIndexCard(indexdNodeResource);
							}
							indexCardListVal.add(index);
						}
					}
				}
			} 
			catch (RepositoryException repositoryException) {
				logger.error("Repository Exception -", repositoryException);
			}
		}
		return indexCardListVal;
	}
	
/*	private int calculateIndexesNeeded(){
		if (indexCardList.size() % 4 == 0)
			return indexCardList.size() / 4;
		else
			return (indexCardList.size() / 4) + 1;
	}
*/	
	
	/************ SETTERS & GETTERS ************/
	public boolean getValidTemplate() {
		return validTemplate;
	}

	public void setValidTemplate(boolean validTemplate) {
		this.validTemplate = validTemplate;
	}

	public String getTemplateName() {
		return templateName;
	}

	public void setTemplateName(String templateName) {
		this.templateName = templateName;
	}

	public List<IndexCard> getIndexCardList() {
		return indexCardList;
	}

	public void setIndexCardList(List<IndexCard> indexCardList) {
		this.indexCardList = indexCardList;
	}

	public boolean getIsEdit() {
		return isEdit;
	}

	public void setIsEdit(boolean isEdit) {
		this.isEdit = isEdit;
	}

	public int getIndexSlidesCount() {
		return indexSlidesCount;
	}

	public void setIndexSlidesCount(int indexSlidesCount) {
		this.indexSlidesCount = indexSlidesCount;
	}

	public String getIndexDescription() {
		return indexDescription;
	}

	public void setIndexDescription(String indexDescription) {
		this.indexDescription = indexDescription;
	}		
	public String getMainTitle() {
		return mainTitle;
	}

	public void setMainTitle(String mainTitle) {
		this.mainTitle = mainTitle;
	}

	public String getToolTitle() {
		return toolTitle;
	}

	public void setToolTitle(String toolTitle) {
		this.toolTitle = toolTitle;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Page getCurrentPage() {
		return currentPage;
	}
} 