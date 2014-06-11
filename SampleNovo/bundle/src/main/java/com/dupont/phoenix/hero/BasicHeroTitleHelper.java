/**
 * To provide page title for basic hero title
 */

package com.dupont.phoenix.hero;

import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.WCMMode;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ValueMap;


public class BasicHeroTitleHelper {	
	
	public static String getPageTitle(ValueMap properties, InheritanceValueMap pageProperties, SlingHttpServletRequest request) {
	
		Boolean isEdit = (WCMMode.fromRequest(request) == WCMMode.EDIT);    
		String pageTitle = StringUtils.EMPTY;

		if(!StringUtils.isEmpty(properties.get("pageTitle",String.class)))
		{
		    pageTitle = properties.get("pageTitle").toString();
		}
		else if(!StringUtils.isEmpty(pageProperties.get("jcr:title",String.class)))
		{
		    pageTitle = pageProperties.get("jcr:title").toString();
		}

		if(isEdit && StringUtils.isEmpty(pageTitle ))
		{
		    pageTitle = "Enter Page Title";
		}
		
		return pageTitle;
	}



}
