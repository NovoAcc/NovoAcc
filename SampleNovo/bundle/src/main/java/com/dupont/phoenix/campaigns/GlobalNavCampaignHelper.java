package com.dupont.phoenix.campaigns;

import org.slf4j.Logger;

import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.dupont.phoenix.taglibs.context.JSPContext;
import com.dupont.phoenix.taglibs.controllers.AbstractController;
import com.dupont.phoenix.GlobalConstants;

public class GlobalNavCampaignHelper extends AbstractController{
	
	private final Logger logger = LoggerFactory.getLogger(GlobalNavCampaignHelper.class);
	private String homePageURL;
	public GlobalNavCampaignHelper(final JSPContext context) {
		super(context);
		homePageURL = findHomePageURL();
	}
	
	public String getHomePageURL() {
		return homePageURL;
	}
	
	private String findHomePageURL() {
		logger.info("findHomePageURL start");
		// Set a default value for the home page url
		StringBuilder sb = new StringBuilder();
		//String home = "#" + GlobalConstants.HOME_DOT_HTML;
		String home = sb.append("#").append(GlobalConstants.HOME_DOT_HTML).toString();
		// Get the /content/home node.
		Page homePage = getCurrentPage().getAbsoluteParent(2);
		// If node exist, take the path
		if (homePage != null) {
			home = homePage.getPath() + GlobalConstants.DOT_HTML;
		}
		logger.info("home url value - "+home);
		logger.info("findHomePageURL end");
		return home;
	}

}
