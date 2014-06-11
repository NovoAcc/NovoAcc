/**
 * 
 */
package com.dupont.phoenix.commons.helpers;

import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;

/**
 * @author A.Shashi.Chaurasia
 * This Helper class is used to render the disclaimer component.
 * 
 */
public class DisclaimerHelper extends AbstractController{

	private final Logger LOGGER = LoggerFactory.getLogger(DisclaimerHelper.class);
	private final static String DISCLAIMER_TEXT = "text";
	private final static String ADD_STYLE_TEXT = "francestyle";

	private String disclaimer;
	private boolean isEdit;
	private String addStyle;

	/**
	 * @return the addStyle
	 */
	public String getAddStyle() {
		return addStyle;
	}

	public void setAddStyle(String addStyle) {
		this.addStyle = addStyle;
	}
	
	/**
	 * @return the isEdit
	 */
	public boolean isEdit() {
		return isEdit;
	}

	/**
	 * @param isEdit the isEdit to set
	 */
	public void setEdit(boolean isEdit) {
		this.isEdit = isEdit;
	}

	/**
	 * @return the disclaimerText
	 */
	public String getDisclaimer() {
		return disclaimer;
	}

	/**
	 * @param disclaimerText
	 *            the disclaimerText to set
	 */
	public void setDisclaimer(String disclaimer) {
		this.disclaimer = disclaimer;
	}

	/**
	 * Constructor to initialize the Sling request and Resource.
	 * 
	 * @param slingRequest
	 * @param resource
	 */
	public DisclaimerHelper(JSPContext jspContext){
		super(jspContext);
		LOGGER.debug("DisclaimerHelper Started");
		initialize();
		LOGGER.debug("DisclaimerHelper Ended");
	}
	/**
	 * init() method to intialize the disclaimer text and edit mode.
	 */
	private void initialize() {
		LOGGER.debug("Call Init method..");
		this.setDisclaimer(getDisclaimerText(getResource()));
		this.setEdit(Global.isEdit(getSlingRequest()));
		this.setAddStyle(this.getAddStyleText(getResource()));
	}
	/**
	 * Get Disclaimer from resource.
	 * @param resource
	 * @return
	 */
	private String getDisclaimerText(Resource resource) {
		LOGGER.debug("Call GetDisclaimer method...");
		InheritanceValueMap iProperties = new HierarchyNodeInheritanceValueMap(
				resource);
		return iProperties.getInherited(DISCLAIMER_TEXT.trim(), String.class);
	}
	
	private String getAddStyleText(Resource resource) {
		InheritanceValueMap iProperties = new HierarchyNodeInheritanceValueMap(
				resource);
		String data = iProperties.getInherited(ADD_STYLE_TEXT.trim(), String.class);
		if(data==null)
			return "";
		else
			if(data.equals("true"))
				return "franceStyle";
			else
				return "";
	}
}
