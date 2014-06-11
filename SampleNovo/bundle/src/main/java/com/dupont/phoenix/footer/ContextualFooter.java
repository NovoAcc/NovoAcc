package com.dupont.phoenix.footer;

import java.util.List;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;

public class ContextualFooter extends FooterHelper {
	
	public ContextualFooter(final JSPContext context) {
		super(context);
		initialize();
	}
	
	/* Static Variables */
	private static String CORPORATE_CONTENT = "/apps/dupont/phoenix/templates/corporatecontent";
	private static String RESPONSIVE_CORPORATE_CONTENT = "/apps/dupont/phoenix/templates/responsive/corporatecontent";
	private static final Logger logger = LoggerFactory.getLogger(ContextualFooter.class);
	
	
	/* Component Variables */
	private List<String> moreInItems;
	private boolean moreInEnabled;
	private String heroHeadline;
	
	
	private void initialize() {
		setMoreInItems(findMoreInItems());
		setMoreInEnabled(shouldHaveMoreInLinks());
		setHeroHeadline(findHeroHeadline());	
	}
	
	private List<String> findMoreInItems() {
		// Create temp list
		List<String> list = null;
		// If current Page exists
		if(null!=getCurrentPage() && null!=getCurrentPage().getParent()) {
			String parentPagePath = getCurrentPage().getParent().getPath();
			list = Global.getNavigationChildList(parentPagePath, getResource(), getSlingRequest(),Boolean.FALSE);
		}
		if(null!=list){
		logger.info("List size at the end: " + list.size());
		}
		return list;
	}
	
	private boolean shouldHaveMoreInLinks() {
		if (getCurrentPage() != null) {
			String title = getCurrentPage().getProperties().get("cq:template","");
			if(CORPORATE_CONTENT.equalsIgnoreCase(title)) {
		       	return isMoreInEnabled(getResource(), Global.isEdit(getSlingRequest()), false);
		    } else if (RESPONSIVE_CORPORATE_CONTENT.equalsIgnoreCase(title)) {
		    	return isMoreInEnabled(getResource(), Global.isEdit(getSlingRequest()), true);
		    }
		}
		return true;
	}
	
	private boolean isMoreInEnabled(Resource resource, boolean isEdit, boolean isResponsive) {
		// If it is, get the properties as value map
		ValueMap vm = resource.adaptTo(ValueMap.class);
		if (vm != null) {
		// Get the value of the property we are looking for
	   		String value = vm.get("moreLinksEnabled",String.class);
	   		// Property found!
	   		if(value != null) {
	   			return "true".equalsIgnoreCase(value);
	   		} else { // Property not found? Create new node.
	   			//do this only on author
	   			try {
	   	   			if(isEdit) {
	   	   				writeToContextualFooter(resource,"false");
	   	   			}
	   			} catch (RepositoryException e) {
	   				logger.info("****************Unable to create node for contextual footer in T.7.1",e);
	   				// Hiding footer anyway.
	   			}
	   			return false;
	   		}
		} else {
			// Get the parent node of the resource
			Node parentNode = resource.getParent().adaptTo(Node.class);
			// If not null, proceed
			return saveContextualfooterNode(isResponsive, parentNode);
			
		}
			
	}

	private Boolean saveContextualfooterNode(boolean isResponsive, Node parentNode) {
		if (parentNode != null) {
			try {
				Node contextualFooter = parentNode.addNode("contextualfooter");
				contextualFooter.setProperty("moreLinksEnabled", "false");
				if (isResponsive) {
					contextualFooter.setProperty("sling:resourceType", "dupont/phoenix/components/responsive/footers/contextualfooter");
				} else {
					contextualFooter.setProperty("sling:resourceType", "dupont/phoenix/components/footers/contextualfooter");
				}
				parentNode.getSession().save();
			} catch (RepositoryException e) {
				logger.info("****************Unable to create node for contextual footer in T.7.1",e);
			}
			return true;
		} else{
			// If null then return false anyway
			return false;
		}
	}

	private void writeToContextualFooter(Resource resource, String value) throws RepositoryException {
		Node parent = resource.adaptTo(Node.class);
		parent.setProperty("moreLinksEnabled",value);
		parent.getSession().save();
	}
	
	private String findHeroHeadline() {
		String headline = "";
		if(getCurrentPage() != null && getCurrentPage().getParent()!=null) {
			Page parent = getCurrentPage().getParent();
	        if(parent.isHideInNav() && parent.getParent()!= null) {
	            parent = parent.getParent();
	        }
	        if (null != Global.getHeroHeadline(parent)) {
	            headline = Global.getHeroHeadline(parent);
	        }
	    }
		return headline;	
	}


	public List<String> getMoreInItems() {
		return moreInItems;
	}

	public void setMoreInItems(List<String> moreInItems) {
		this.moreInItems = moreInItems;
	}

	public boolean getMoreInEnabled() {
		return moreInEnabled;
	}

	public void setMoreInEnabled(boolean moreInEnabled) {
		this.moreInEnabled = moreInEnabled;
	}

	public String getHeroHeadline() {
		return heroHeadline;
	}

	public void setHeroHeadline(String heroHeadline) {
		this.heroHeadline = heroHeadline;
	}

	public String getMoreInTranslatedText(){
		return Global.getTranslatedText(getCurrentPage(), getSlingRequest(),"More in");
	}
	

}
