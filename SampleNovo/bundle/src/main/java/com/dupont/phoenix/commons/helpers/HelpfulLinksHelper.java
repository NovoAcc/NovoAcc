package com.dupont.phoenix.commons.helpers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.xss.XSSAPI;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.dupont.phoenix.Global;
import com.dupont.phoenix.commons.helpers.beans.HelpfulLinkBean;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;

public class HelpfulLinksHelper extends AbstractController{

	private static final String IS_EXTERNAL_LINK = "isExternalLink";
	private static final String LINK_TEXT = "linkText";
	private static final String LINK_URL = "linkURL";
	private static final String HELPFULLINKS = "helpfullinks";
	// Base Variable setup
	private String heroColor = "9d3e04";
	private String helpfulLinkTitle;
	private List<Map<String,String>> list;
	private HelpfulLinkBean helpfulLinkBean;
	private String []linkItems={};

	private static final Logger logger = LoggerFactory
			.getLogger(HelpfulLinksHelper.class);

	public HelpfulLinksHelper(final JSPContext context) {
		super(context);
	}

	private void initialize() {
		logger.debug("In HelpfulLinksHelper Init");
		helpfulLinkBean = new HelpfulLinkBean();
		// Read helpful link title
		helpfulLinkTitle = Global.getTranslatedText(getCurrentPage(), getSlingRequest(),"Helpful Links:");
		helpfulLinkBean.setHelpfulLinkTitle(helpfulLinkTitle);
		// Read the heroColor
		if (null != getPageProperties().get("heroColor",String.class)) {
			heroColor = getPageProperties().get("heroColor",String.class);
		}
		helpfulLinkBean.setHeroColor(heroColor);
		// IsEdit Mode check
		helpfulLinkBean.setIsEdit(Global.isEdit(getSlingRequest()));
		processLinks();
	}

	private void processLinks() {
		if (getProperties().get(HelpfulLinksHelper.HELPFULLINKS, null)==null) {
			// Get the links from the parent node
			InheritanceValueMap ilinkItems = new HierarchyNodeInheritanceValueMap(
					getResource());
			linkItems = ilinkItems.getInherited(
					HelpfulLinksHelper.HELPFULLINKS, String[].class);
		} else {
			linkItems = getProperties().get(HelpfulLinksHelper.HELPFULLINKS,
					String[].class);
		}
		helpfulLinkBean.setLinkItems(linkItems);
		if (linkItems != null) {
			try {
				list = new ArrayList<Map<String,String>>();
				for (String linkItem : linkItems) {
					Map<String, String> linkItemMap = new HashMap<String, String>();
					JSONObject jObject;
					jObject = new JSONObject(linkItem);
					String linkURL = jObject.get(HelpfulLinksHelper.LINK_URL).toString();
					String linkText = jObject.get(HelpfulLinksHelper.LINK_TEXT).toString();
					String isExternalLink = Global.isExternalLink(linkURL)
							.toString();
					XSSAPI xssAPI = getResourceResolver().adaptTo(XSSAPI.class);
					linkURL = xssAPI.getValidHref(linkURL);
					if ("false".equals(isExternalLink)) {
						String linkURLNew = Global.getNavigationURL(
								getSlingRequest(), linkURL, false);
						linkURL = linkURLNew;
					}
					linkItemMap.put(HelpfulLinksHelper.LINK_URL, linkURL);
					linkItemMap.put(HelpfulLinksHelper.LINK_TEXT, linkText);
					linkItemMap.put(HelpfulLinksHelper.IS_EXTERNAL_LINK, isExternalLink);
					list.add(linkItemMap);
				}
				helpfulLinkBean.setList(list);
				helpfulLinkBean.setListSize(list.size());
			} catch (JSONException e) {
				logger.error("Exception in Helpful Links: " , e);
			}
		}
	}
	public HelpfulLinkBean getHelpfulLinkBean() {
		initialize();
		return helpfulLinkBean;
	}
}
