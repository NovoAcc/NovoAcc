package com.dupont.phoenix.tools;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import com.dupont.phoenix.Global;

public final class MegaTrendHelper {
	private static final Logger logger = LoggerFactory.getLogger(MegaTrendHelper.class);
	private static final String ICON_IMAGE_ACTIVE_KEYWORD = "active";
	private static final String ICON_IMAGE_INACTIVE_KEYWORD = "inactive";
	private Page currentPage;
	private Resource resource;
	private SlingHttpServletRequest slingRequest;
	private Style siteConfigProps;
	private ValueMap properties;

	public MegaTrendHelper(final SlingHttpServletRequest slingRequest, final Page currentPage, final Resource resource) {
		this.currentPage = currentPage;
		this.slingRequest = slingRequest;
		this.resource = resource;
		this.siteConfigProps = Global.getSiteConfigStyle(resource).getSubStyle("general");
		this.properties = resource.adaptTo(ValueMap.class);
		logger.info("MegaTrendHelper Constructor");
	}

	private String getSiteConfigPropValue(String propName) {
		String val = StringUtils.EMPTY;
		if (this.siteConfigProps != null){
			val = (String) this.siteConfigProps.get(propName, String.class);
		}
		return val;
	}

	public List<HashMap<String, String>> getMegaTrendLinks() {
		String megatrendFolderPath = getSiteConfigPropValue("megatrendFolderPath");
		List<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();

		Iterator<Page> iter = getChildern(megatrendFolderPath);
		if (iter != null) {
			while (iter.hasNext()) {
				Page child = (Page) iter.next();
				String title = child.getNavigationTitle();
				if (title == null) {
					title = child.getTitle();
				}
				if (title == null) {
					title = child.getName();
				}
				title = StringEscapeUtils.escapeHtml(title);
				HashMap<String, String> map = new HashMap<String, String>();
				Resource res = child.getContentResource("iconimage");
				String imageSrc = StringUtils.EMPTY;
				if (res != null) {
					ValueMap resProps = res.adaptTo(ValueMap.class);
					if (resProps != null) {
						imageSrc = resProps.containsKey("fileReference") ? resProps.get("fileReference").toString() : null;
					}
				}
				final Boolean activeStatus = isActiveMegatrend(child.getPath());

				// Handle active file name. Use naming convention for icon file
				// names

				if ((activeStatus) && (StringUtils.isNotBlank(imageSrc))) {
					// 1. replace inactive with active within the image src
					if (imageSrc.contains("inactive")) {
						imageSrc = imageSrc.replace(MegaTrendHelper.ICON_IMAGE_INACTIVE_KEYWORD, MegaTrendHelper.ICON_IMAGE_ACTIVE_KEYWORD);
					} else {
						// 2. append "active" at the end of the image file name
						int index = imageSrc.lastIndexOf(".");
						if (index != -1) {
							imageSrc = String
									.format("%s-%s%s", imageSrc.substring(0, index), MegaTrendHelper.ICON_IMAGE_ACTIVE_KEYWORD, imageSrc
											.substring(index));
						}
					}
				}
				map.put("linkTitle", title);
				map.put("linkUrl", Global.getNavigationURL(slingRequest, child, false) + ".html");
				map.put("iconimage", imageSrc);
				map.put("isActive", activeStatus.toString());
				if(!child.isHideInNav()){
					list.add(map);
				}
			}
		}
		return list;
	}

	private Boolean isActiveMegatrend(String megatrend) {
		Boolean isActive = false;
		String[] activeMegatrends;

		if (null!=properties && null!=properties.get("selectedMegatrends", null)) {
			activeMegatrends = properties.get("selectedMegatrends", String[].class);
			for (String activeMegatrend : activeMegatrends) {
				if (activeMegatrend.equalsIgnoreCase(megatrend)) {
					isActive = true;
				}
			}
		}

		return isActive;
	}

	private Iterator<Page> getChildern(String nodePath) {
		Resource rootRes = null;
		Page rootPage = null;
		Iterator<Page> iter = null;
		if (StringUtils.isNotEmpty(nodePath)) {
			rootRes = this.resource.getResourceResolver().getResource(nodePath);
			rootPage = rootRes == null ? null : (Page) rootRes.adaptTo(Page.class);
			if (rootPage != null) {
				iter = rootPage.listChildren();
			}
		}
		return iter;
	}

	public Page getCurrentPage() {
		return currentPage;
	}
}